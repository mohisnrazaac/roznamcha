<?php
// Purpose: Publish the hardened public sitemap for approved public search surfaces only. Date: 2026-03-29. Author: Mohsin.

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Seo\SeoPageUrlGenerator;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SeoSitemapController extends Controller
{
    public function __construct(
        private readonly SeoPageUrlGenerator $urlGenerator,
    ) {
    }

    public function index(): Response
    {
        $xml = Cache::remember(
            BlogPost::publicSitemapCacheKey(),
            now()->addHours((int) config('roznamcha_seo.cache.sitemap_ttl_hours', 24)),
            fn () => view('sitemap.xml', ['urls' => $this->buildUrls()])->render()
        );

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    protected function buildUrls(): array
    {
        return array_merge(
            $this->staticUrls(),
            $this->blogUrls(),
        );
    }

    protected function staticUrls(): array
    {
        $staticLastmod = now()->startOfDay()->toAtomString();

        return [
            [
                'loc' => $this->urlGenerator->homeUrl(),
                'priority' => '1.0',
                'changefreq' => 'weekly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.features'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.kharcha-map'),
                'priority' => '0.9',
                'changefreq' => 'monthly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.ration-brain'),
                'priority' => '0.9',
                'changefreq' => 'monthly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.survival-report'),
                'priority' => '0.9',
                'changefreq' => 'monthly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.ration-cost-estimator'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.monthly-household-budget-calculator'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.school-fees-planner'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.electricity-bill-estimator'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('templates.index'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.blog.index'),
                'priority' => '0.8',
                'changefreq' => 'daily',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.about'),
                'priority' => '0.7',
                'changefreq' => 'yearly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.contact'),
                'priority' => '0.7',
                'changefreq' => 'yearly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.privacy'),
                'priority' => '0.5',
                'changefreq' => 'yearly',
                'lastmod' => $staticLastmod,
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.terms'),
                'priority' => '0.5',
                'changefreq' => 'yearly',
                'lastmod' => $staticLastmod,
            ],
        ];
    }

    protected function blogUrls(): array
    {
        return BlogPost::query()
            ->publicArchiveVisible()
            ->orderByDesc('published_at')
            ->get(['slug', 'published_at', 'updated_at'])
            ->map(fn (BlogPost $post) => [
                'loc' => $this->urlGenerator->routeUrl('public.blog.show', ['slug' => $post->slug]),
                'priority' => '0.7',
                'changefreq' => 'weekly',
                'lastmod' => optional($post->published_at ?? $post->updated_at)->toAtomString(),
            ])
            ->all();
    }
}
