<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SsrVerificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test terms page renders successfully.
     */
    public function testTermsPageRendersSuccessfully(): void
    {
        $response = $this->get(route('public.terms'));

        $response->assertOk()
            ->assertInertia(fn (\Inertia\Testing\AssertableInertia $inertia) => $inertia
                ->component('Public/Terms')
            );
    }

    public function testDisclaimerPageRendersSuccessfully(): void
    {
        $response = $this->get(route('public.disclaimer'));

        $response->assertOk()
            ->assertInertia(fn (\Inertia\Testing\AssertableInertia $inertia) => $inertia
                ->component('Public/Disclaimer')
                ->where('pagePolicies.isPublicPage', true)
                ->where('pagePolicies.adsAllowed', false)
                ->where('contactEmail', 'support@roznamcha.pk')
            );
    }

    /**
     * Test privacy policy page renders successfully.
     */
    public function testPrivacyPolicyPageRendersSuccessfully(): void
    {
        $response = $this->get(route('public.privacy'));

        $response->assertOk()
            ->assertInertia(fn (\Inertia\Testing\AssertableInertia $inertia) => $inertia
                ->component('Public/PrivacyPolicy')
                ->where('pagePolicies.isPublicPage', true)
                ->where('pagePolicies.consentModeEnabled', true)
                ->where('pagePolicies.adsAllowed', false)
                ->where('contactEmail', 'support@roznamcha.pk')
            );
    }

    /**
     * Test calculator routes load successfully and contain meta.
     */
    public function testCalculatorRoutesLoadSuccessfully(): void
    {
        $response = $this->get(route('public.tools.electricity-bill-estimator'));
        $response->assertOk();
        $response->assertSee('Electricity Bill Estimator');
        $response->assertHeader('Cache-Control', 'max-age=3600, public, s-maxage=3600');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');

        $response = $this->get(route('public.tools.ration-cost-estimator'));
        $response->assertOk();
        $response->assertSee('Ration Cost Estimator');
    }

    public function testSitemapsHavePublicEdgeCacheHeaders(): void
    {
        $response1 = $this->get(route('public.sitemap'));
        $response1->assertOk()
            ->assertHeader('Cache-Control', 'max-age=3600, public, s-maxage=3600');
        $this->assertArrayNotHasKey('set-cookie', $response1->headers->all());

        $response2 = $this->get(route('public.templates-sitemap'));
        $response2->assertOk()
            ->assertHeader('Cache-Control', 'max-age=3600, public, s-maxage=3600');
        $this->assertArrayNotHasKey('set-cookie', $response2->headers->all());

        $response3 = $this->get(route('public.blog.rss'));
        $response3->assertOk();
        $this->assertArrayNotHasKey('set-cookie', $response3->headers->all());
    }

    /**
     * Test robots.txt contains required AdSense allow directives.
     */
    public function testRobotsTxtDirectives(): void
    {
        $this->assertFileExists(public_path('robots.txt'));
        $content = file_get_contents(public_path('robots.txt'));

        $this->assertStringContainsString('User-agent: Mediapartners-Google', $content);
        $this->assertStringContainsString('Allow: /', $content);
        $this->assertStringContainsString('Disallow: /templates/', $content);
        $this->assertStringContainsString('Sitemap: https://roznamcha.pk/sitemap.xml', $content);
        $this->assertStringContainsString('Sitemap: https://roznamcha.pk/templates-sitemap.xml', $content);
    }

    public function test_public_pages_do_not_expose_localhost_or_admin_route_data(): void
    {
        $response = $this->get(route('public.blog.index'));

        $response->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Public/Blog/Index')
                ->where('pagePolicies.isPublicPage', true)
                ->missing('ziggy.routes.admin.users.index')
                ->missing('ziggy.routes.panel.kharcha.index')
                ->missing('ziggy.routes.maintenance.apply-adsense-article-rewrites')
            );

        $this->assertStringNotContainsString('127.0.0.1:8002', file_get_contents(resource_path('js/ziggy.js')));
    }

    public function test_noindex_blog_pages_do_not_allow_ads_or_optional_analytics(): void
    {
        $post = BlogPost::factory()->published()->create([
            'slug' => 'pakistan-petrol-price-april-2026-rs458-budget-guide',
            'content' => 'Historical petrol article body',
            'content_format' => 'markdown',
        ]);

        $this->get(route('public.blog.show', ['slug' => $post->slug]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Public/Blog/Show')
                ->where('pagePolicies.adsAllowed', false)
                ->where('pagePolicies.analyticsAllowed', false)
            );
    }
}
