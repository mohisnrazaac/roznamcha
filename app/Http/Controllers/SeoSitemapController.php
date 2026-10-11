<?php

// Purpose: Publish the hardened public sitemap for approved public search surfaces only. Date: 2026-03-29. Author: Mohsin.

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BudgetTemplate;
use App\Seo\SearchSurfacePolicy;
use App\Seo\SeoPageUrlGenerator;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class SeoSitemapController extends Controller
{
    public function __construct(
        private readonly SeoPageUrlGenerator $urlGenerator,
        private readonly SearchSurfacePolicy $searchSurfacePolicy,
    ) {}

    public function index(): Response
    {
        $xml = Cache::remember(
            BlogPost::publicSitemapCacheKey(),
            now()->addHours((int) config('roznamcha_seo.cache.sitemap_ttl_hours', 24)),
            fn () => view('sitemap.xml', ['urls' => $this->buildUrls()])->render()
        );

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600, s-maxage=3600',
            'X-Robots-Tag' => 'noindex, follow', // Prevents Google from indexing the sitemap as a search result
        ]);
    }

    protected function buildUrls(): array
    {
        return array_merge(
            $this->staticUrls(),
            $this->programmaticUrls(),
            $this->templateUrls(),
            $this->categoryUrls(),
            $this->blogUrls(),
        );
    }

    protected function programmaticUrls(): array
    {
        $lastmod = now()->startOfDay()->toAtomString();
        $urls = [];

        if (! $this->searchSurfacePolicy->isProgrammaticPageTypeNoindexed('petrol')) {
            foreach (config('roznamcha_seo.cities', []) as $city) {
                $urls[] = [
                    'loc' => $this->urlGenerator->url('petrol', $city),
                    'priority' => '0.8',
                    'changefreq' => 'daily',
                    'lastmod' => $lastmod,
                ];
            }
        }

        if (! $this->searchSurfacePolicy->isProgrammaticPageTypeNoindexed('electricity')) {
            foreach (config('roznamcha_seo.discos', []) as $disco) {
                $urls[] = [
                    'loc' => $this->urlGenerator->url('electricity', $disco),
                    'priority' => '0.8',
                    'changefreq' => 'weekly',
                    'lastmod' => $lastmod,
                ];
            }
        }

        if (! $this->searchSurfacePolicy->isProgrammaticPageTypeNoindexed('ration')) {
            foreach (config('roznamcha_seo.family_sizes', []) as $size) {
                $urls[] = [
                    'loc' => $this->urlGenerator->url('ration', $size),
                    'priority' => '0.8',
                    'changefreq' => 'weekly',
                    'lastmod' => $lastmod,
                ];
            }
        }

        return $urls;
    }

    protected function templateUrls(): array
    {
        $lastmod = now()->startOfDay()->toAtomString();

        return BudgetTemplate::query()
            ->get(['slug', 'updated_at'])
            ->reject(fn (BudgetTemplate $template) => $this->searchSurfacePolicy->isTemplateNoindexed($template->slug))
            ->map(fn (BudgetTemplate $template) => [
                'loc' => $this->urlGenerator->routeUrl('templates.show', ['slug' => $template->slug]),
                'priority' => '0.8',
                'changefreq' => 'monthly',
                'lastmod' => optional($template->updated_at)->toAtomString() ?: $lastmod,
            ])
            ->values()
            ->all();
    }

    protected function categoryUrls(): array
    {
        $lastmod = now()->startOfDay()->toAtomString();

        return BlogCategory::query()
            ->has('posts')
            ->get(['slug', 'updated_at'])
            ->reject(fn (BlogCategory $category) => $this->searchSurfacePolicy->isCategoryNoindexed($category->slug))
            ->map(fn (BlogCategory $category) => [
                'loc' => $this->urlGenerator->routeUrl('public.blog.category', ['slug' => $category->slug]),
                'priority' => '0.7',
                'changefreq' => 'weekly',
                'lastmod' => optional($category->updated_at)->toAtomString() ?: $lastmod,
            ])
            ->values()
            ->all();
    }

    protected function staticUrls(): array
    {
        return [
            [
                'loc' => $this->urlGenerator->homeUrl(),
                'priority' => '1.0',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Home.jsx', '2026-10-10T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.features'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Features.jsx', '2026-09-07T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.features.expense-tracker-pakistan'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/ExpenseTrackerPakistan.jsx', '2026-09-07T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.kharcha-map'),
                'priority' => '0.9',
                'changefreq' => 'monthly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/KharchaMap.jsx', '2026-08-15T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.ration-brain'),
                'priority' => '0.9',
                'changefreq' => 'monthly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/RationBrain.jsx', '2026-08-15T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.survival-report'),
                'priority' => '0.9',
                'changefreq' => 'monthly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/SurvivalReport.jsx', '2026-08-15T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.ration-cost-estimator'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Tools/RationCostEstimator.jsx', '2026-09-12T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.monthly-household-budget-calculator'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Tools/MonthlyHouseholdBudgetCalculator.jsx', '2026-09-15T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.school-fees-planner'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Tools/SchoolFeesPlanner.jsx', '2026-09-18T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.electricity-bill-estimator'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Tools/ElectricityBillEstimator.jsx', '2026-10-10T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.tools.solar-net-metering-roi-calculator'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Tools/SolarRoiCalculator.jsx', '2026-10-08T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('templates.index'),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Templates/Index.jsx', '2026-09-25T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.blog.index'),
                'priority' => '0.8',
                'changefreq' => 'daily',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Blog/Index.jsx', '2026-10-10T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.about'),
                'priority' => '0.7',
                'changefreq' => 'yearly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/About.jsx', '2026-09-20T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.contact'),
                'priority' => '0.7',
                'changefreq' => 'yearly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Contact.jsx', '2026-09-20T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.privacy'),
                'priority' => '0.5',
                'changefreq' => 'yearly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/PrivacyPolicy.jsx', '2026-10-11T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.terms'),
                'priority' => '0.5',
                'changefreq' => 'yearly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Terms.jsx', '2026-08-18T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.disclaimer'),
                'priority' => '0.5',
                'changefreq' => 'yearly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/Disclaimer.jsx', '2026-08-22T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.editorial-policy'),
                'priority' => '0.7',
                'changefreq' => 'monthly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/EditorialPolicy.jsx', '2026-09-20T00:00:00+00:00'),
            ],
            [
                'loc' => $this->urlGenerator->routeUrl('public.methodology'),
                'priority' => '0.7',
                'changefreq' => 'monthly',
                'lastmod' => $this->fileLastmod('resources/js/Pages/Public/MethodologySources.jsx', '2026-09-20T00:00:00+00:00'),
            ],
        ];
    }

    protected function fileLastmod(string $relativePath, string $fallback): string
    {
        $fullPath = base_path($relativePath);
        if (file_exists($fullPath)) {
            return Carbon::createFromTimestamp(filemtime($fullPath))->toAtomString();
        }

        return $fallback;
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
