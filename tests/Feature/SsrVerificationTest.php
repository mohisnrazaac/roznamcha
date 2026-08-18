<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
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

    /**
     * Test privacy policy page renders successfully.
     */
    public function testPrivacyPolicyPageRendersSuccessfully(): void
    {
        $response = $this->get(route('public.privacy'));

        $response->assertOk()
            ->assertInertia(fn (\Inertia\Testing\AssertableInertia $inertia) => $inertia
                ->component('Public/PrivacyPolicy')
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
        $this->get(route('public.sitemap'))
            ->assertOk()
            ->assertHeader('Cache-Control', 'max-age=3600, public, s-maxage=3600');

        $this->get(route('public.templates-sitemap'))
            ->assertOk()
            ->assertHeader('Cache-Control', 'max-age=3600, public, s-maxage=3600');
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
}
