<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Throwable;
use App\Models\BlogPost;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $routeName = $request->route()?->getName();
        $isPublicPage = $this->isPublicPage($routeName);
        $currentUrl = $request->fullUrl();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => $this->ziggyConfig($request, $routeName),
            'appLocale' => $locale,
            'availableLocales' => config('roznamcha.available_locales', []),
            'isRtl' => $locale === 'ur',
            'translations' => trans('roznamcha'),
            'pagePolicies' => [
                'isPublicPage' => $isPublicPage,
                'consentModeEnabled' => $isPublicPage,
                'adsAllowed' => $this->adsAllowed($request, $routeName),
                'analyticsAllowed' => $this->analyticsAllowed($request, $routeName),
                'consentCookieName' => 'roznamcha_cookie_consent',
                'currentUrl' => $currentUrl,
            ],
            'flash' => [
                'status' => $request->session()->get('status'),
                // ROZNAMCHA-ACTIVATION: transient guest Ask Roza response for inline Inertia render.
                'askRozaTip' => $request->session()->get('askRozaTip'),
            ],
            'internalLinks' => [
                'tools' => $this->resolveLinks(config('internal_links.tools', [])),
                'blogs' => $this->resolveLinks(config('internal_links.blogs', [])),
                'mappings' => config('internal_links.mappings', []),
            ],
        ];
    }

    protected function resolveLinks(array $links): array
    {
        return collect($links)
            ->map(function ($link) {
                if (! is_array($link) || empty($link['title'])) {
                    return null;
                }

                $href = $this->resolveHref($link);
                if (! $href) {
                    return null;
                }

                return [
                    'title' => $link['title'],
                    'href' => $href,
                    'description' => $link['description'] ?? null,
                ];
            })
            ->filter()
            ->all();
    }

    protected function resolveHref(array $link): ?string
    {
        if (! empty($link['route_name']) && Route::has($link['route_name'])) {
            try {
                return route($link['route_name'], $link['route_params'] ?? [], false);
            } catch (Throwable) {
                return null;
            }
        }

        if (! empty($link['href']) && is_string($link['href'])) {
            return $link['href'];
        }

        return null;
    }

    protected function ziggyConfig(Request $request, ?string $routeName): array
    {
        $ziggy = new Ziggy(null, $request->url());

        if ($this->isPublicPage($routeName)) {
            $ziggy->filter($this->publicRouteNames($request));
        }

        return array_merge($ziggy->toArray(), [
            'location' => $request->fullUrl(),
        ]);
    }

    protected function isPublicPage(?string $routeName): bool
    {
        if (! is_string($routeName) || $routeName === '') {
            return false;
        }

        return str_starts_with($routeName, 'public.')
            || str_starts_with($routeName, 'templates.')
            || str_starts_with($routeName, 'seo.')
            || in_array($routeName, [
                'offline',
                'login',
                'register',
                'password.request',
                'password.email',
            ], true);
    }

    protected function adsAllowed(Request $request, ?string $routeName): bool
    {
        if (! is_string($routeName) || $routeName === '') {
            return false;
        }

        if ($routeName === 'public.blog.show') {
            $slug = (string) $request->route('slug', '');

            return $slug !== '' && ! BlogPost::shouldNoindexPublicSlug($slug);
        }

        return in_array($routeName, [
            'public.home',
            'public.features',
            'public.features.expense-tracker-pakistan',
            'public.blog.index',
        ], true);
    }

    protected function analyticsAllowed(Request $request, ?string $routeName): bool
    {
        if (! $this->isPublicPage($routeName)) {
            return false;
        }

        if ($routeName === 'public.blog.show') {
            $slug = (string) $request->route('slug', '');

            return $slug === '' || ! BlogPost::shouldNoindexPublicSlug($slug);
        }

        return true;
    }

    protected function publicRouteNames(Request $request): array
    {
        $routeNames = [
            'public.ads-txt',
            'public.home',
            'public.features',
            'public.features.expense-tracker-pakistan',
            'public.kharcha-map',
            'public.ration-brain',
            'public.survival-report',
            'public.about',
            'public.contact',
            'public.contact.send',
            'public.privacy',
            'public.terms',
            'offline',
            'public.tools.ration-cost-estimator',
            'public.tools.monthly-household-budget-calculator',
            'public.tools.monthly-household-budget-calculator.calculate',
            'public.tools.school-fees-planner',
            'public.tools.school-fees-planner.calculate',
            'public.tools.electricity-bill-estimator',
            'public.tools.electricity-bill-estimator.calculate',
            'seo.petrol',
            'seo.electricity',
            'seo.ration',
            'templates.index',
            'templates.download',
            'templates.show',
            'public.blog.index',
            'public.blog.category',
            'public.blog.rss',
            'public.blog.show',
            'public.sitemap',
            'public.templates-sitemap',
        ];

        if ($request->user()) {
            $routeNames[] = 'dashboard';
            $routeNames[] = 'logout';
        }

        return $routeNames;
    }
}
