<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;
use Throwable;

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

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'appLocale' => $locale,
            'availableLocales' => config('roznamcha.available_locales', []),
            'isRtl' => $locale === 'ur',
            'translations' => trans('roznamcha'),
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
}
