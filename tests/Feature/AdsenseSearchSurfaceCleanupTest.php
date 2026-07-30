<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AdsenseSearchSurfaceCleanupTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_sitemap_excludes_temporary_noindex_template_and_programmatic_urls(): void
    {
        BlogPost::factory()->published()->create([
            'slug' => 'published-approval-check',
            'content' => 'Published sitemap body',
            'content_format' => 'markdown',
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();

        foreach ($this->excludedUrls() as $url) {
            $response->assertDontSee($url, false);
        }

        foreach ($this->coreUrls() as $url) {
            $response->assertSee($url, false);
        }

        $response->assertSee($this->publicUrl('/blog/published-approval-check'), false);
        $this->assertSame(17, substr_count($response->getContent(), '<url>'));
    }

    public function test_template_sitemap_keeps_index_page_but_excludes_template_details(): void
    {
        $response = $this->get('/templates-sitemap.xml');

        $response->assertOk();
        $response->assertSee($this->publicUrl('/templates'), false);

        foreach ($this->excludedTemplateUrls() as $url) {
            $response->assertDontSee($url, false);
        }

        $this->assertSame(1, substr_count($response->getContent(), '<url>'));
    }

    public function test_excluded_pages_render_noindex_without_breaking_direct_access(): void
    {
        $excludedPages = [
            '/templates/student-budget',
            '/templates/50k-salary-survival-guide',
            '/templates/100k-family-budget',
            '/templates/joint-family-budget',
            '/petrol-price-karachi-today',
            '/electricity-bill-calculator-lesco',
            '/ration-cost-for-4-people-pakistan',
        ];

        foreach ($excludedPages as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('meta name="robots" content="noindex,follow"', false);
        }
    }

    public function test_core_pages_do_not_render_noindex(): void
    {
        $corePaths = [
            '/',
            '/features',
            '/features/monthly-expense-tracker-pakistan',
            '/kharcha-map',
            '/ration-brain',
            '/survival-report',
            '/tools/ration-cost-estimator',
            '/tools/monthly-household-budget-calculator',
            '/tools/school-fees-planner',
            '/tools/electricity-bill-estimator',
            '/templates',
            '/blog',
            '/about',
            '/contact',
            '/privacy-policy',
            '/terms',
        ];

        foreach ($corePaths as $path) {
            $this->get($path)
                ->assertOk()
                ->assertDontSee('meta name="robots" content="noindex,follow"', false);
        }
    }

    private function excludedUrls(): array
    {
        return [
            ...$this->excludedTemplateUrls(),
            $this->publicUrl('/petrol-price-karachi-today'),
            $this->publicUrl('/electricity-bill-calculator-lesco'),
            $this->publicUrl('/ration-cost-for-4-people-pakistan'),
        ];
    }

    private function excludedTemplateUrls(): array
    {
        return [
            $this->publicUrl('/templates/student-budget'),
            $this->publicUrl('/templates/50k-salary-survival-guide'),
            $this->publicUrl('/templates/100k-family-budget'),
            $this->publicUrl('/templates/joint-family-budget'),
        ];
    }

    private function coreUrls(): array
    {
        return [
            $this->publicUrl('/'),
            $this->publicUrl('/features'),
            $this->publicUrl('/features/monthly-expense-tracker-pakistan'),
            $this->publicUrl('/kharcha-map'),
            $this->publicUrl('/ration-brain'),
            $this->publicUrl('/survival-report'),
            $this->publicUrl('/tools/ration-cost-estimator'),
            $this->publicUrl('/tools/monthly-household-budget-calculator'),
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

    private function publicUrl(string $path): string
    {
        return rtrim((string) config('roznamcha_seo.base_url'), '/').($path === '/' ? '/' : $path);
    }
}
