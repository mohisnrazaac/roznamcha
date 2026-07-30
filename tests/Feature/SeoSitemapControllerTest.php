<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SeoSitemapControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_sitemap_includes_only_approved_core_surfaces_and_archive_visible_blog_posts(): void
    {
        $visiblePost = BlogPost::factory()->published()->create([
            'slug' => 'approved-visible-post',
        ]);

        BlogPost::factory()->published()->create([
            'slug' => 'roznamcha-with-ai',
        ]);

        BlogPost::factory()->draft()->create([
            'slug' => 'e-challan-bill-management-guide-pakistan-2026',
        ]);

        BlogPost::factory()->draft()->create([
            'slug' => 'gold-price-prediction-2026-daily-gold-rate-pakistan',
        ]);

        BlogPost::factory()->draft()->create([
            'slug' => 'current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan',
        ]);

        BlogPost::factory()->draft()->create([
            'slug' => 'cost-of-living-pakistan-2026-monthly-budget-with-ai',
        ]);

        BlogPost::factory()->draft()->create([
            'slug' => 'petrol-prices-today-pakistan-2026-monthly-budget-impact',
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();

        foreach ($this->requiredUrls() as $url) {
            $response->assertSee($url, false);
        }

        $response->assertSee(route('public.blog.show', ['slug' => $visiblePost->slug], true), false);

        foreach ($this->excludedUrlFragments() as $fragment) {
            $response->assertDontSee($fragment, false);
        }
    }

    public function test_sitemap_excludes_known_noindex_surfaces(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertOk();

        $noindexPaths = [
            '/templates/student-budget',
            '/templates/100k-family-budget',
            '/templates/joint-family-budget',
            '/templates/50k-salary-survival-guide',
            '/petrol-price-karachi-today',
            '/electricity-bill-calculator-lesco',
            '/ration-cost-for-4-people-pakistan',
        ];

        foreach ($noindexPaths as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('meta name="robots" content="noindex,follow"', false);

            $response->assertDontSee($this->publicUrl($path), false);
        }
    }

    public function test_template_sitemap_is_discovery_safe_and_lists_only_template_index(): void
    {
        $response = $this->get('/templates-sitemap.xml');

        $response->assertOk();
        $response->assertSee($this->publicUrl('/templates'), false);
        $this->assertSame(1, substr_count($response->getContent(), '<url>'));

        foreach ($this->excludedTemplatePaths() as $path) {
            $response->assertDontSee($this->publicUrl($path), false);
        }
    }

    private function requiredUrls(): array
    {
        return [
            $this->publicUrl('/'),
            $this->publicUrl('/features'),
            $this->publicUrl('/features/monthly-expense-tracker-pakistan'),
            $this->publicUrl('/kharcha-map'),
            $this->publicUrl('/ration-brain'),
            $this->publicUrl('/survival-report'),
            $this->publicUrl('/tools/ration-cost-estimator'),
            $this->publicUrl('/tools/school-fees-planner'),
            $this->publicUrl('/tools/electricity-bill-estimator'),
            $this->publicUrl('/templates'),
            $this->publicUrl('/blog'),
            $this->publicUrl('/about'),
            $this->publicUrl('/contact'),
            $this->publicUrl('/privacy-policy'),
            $this->publicUrl('/terms'),
        ];
    }

    private function excludedTemplatePaths(): array
    {
        return [
            '/templates/student-budget',
            '/templates/100k-family-budget',
            '/templates/joint-family-budget',
            '/templates/50k-salary-survival-guide',
        ];
    }

    private function excludedUrlFragments(): array
    {
        return [
            ...$this->excludedTemplatePaths(),
            '/blog/roznamcha-with-ai',
            '/blog/e-challan-bill-management-guide-pakistan-2026',
            '/blog/gold-price-prediction-2026-daily-gold-rate-pakistan',
            '/blog/current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan',
            '/blog/cost-of-living-pakistan-2026-monthly-budget-with-ai',
            '/blog/petrol-prices-today-pakistan-2026-monthly-budget-impact',
            '/login',
            '/register',
            '/dashboard',
            '/panel',
            '/admin',
            '/onboarding',
            '/profile',
            '/petrol-price-karachi-today',
            '/electricity-bill-calculator-lesco',
            '/ration-cost-for-4-people-pakistan',
            '/blog/category/',
        ];
    }

    private function publicUrl(string $path): string
    {
        return rtrim((string) config('roznamcha_seo.base_url'), '/').($path === '/' ? '/' : $path);
    }
}
