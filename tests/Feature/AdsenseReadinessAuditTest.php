<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdsenseReadinessAuditTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Requirement 1: app.blade.php does not contain the old 35 KB noscript duplicate dump.
     */
    public function test_app_blade_does_not_contain_heavy_noscript_duplicate_dump(): void
    {
        $bladeContent = file_get_contents(resource_path('views/app.blade.php'));
        $this->assertIsString($bladeContent);

        // Must not contain the old duplicate noscript article dump
        $this->assertStringNotContainsString('<noscript><article', $bladeContent);
        $this->assertStringNotContainsString('Methodology &amp; Calculation Mechanics</article></noscript>', $bladeContent);
        $this->assertStringNotContainsString('All Tools &amp; Guides Quick Index', $bladeContent);

        // Must contain the clean lightweight accessibility notice
        $this->assertStringContainsString('Interactive calculators work best with JavaScript enabled', $bladeContent);

        // Verify total noscript length is small (< 500 characters)
        preg_match('/<noscript>(.*?)<\/noscript>/is', $bladeContent, $matches);
        $this->assertNotEmpty($matches);
        $this->assertLessThan(500, strlen($matches[0]));
    }

    /**
     * Requirement 2: Head tag renders AdSense script tag only when adsAllowed is true.
     */
    public function test_head_script_renders_only_when_ads_allowed_is_true(): void
    {
        // 1. Route with adsAllowed = true (e.g. ration cost estimator tool)
        $responseWithAds = $this->get(route('public.tools.ration-cost-estimator'));
        $responseWithAds->assertOk();
        $this->assertStringContainsString(
            '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=',
            $responseWithAds->getContent(),
            'AdSense script tag must be rendered in head when adsAllowed is true.'
        );

        // 2. Route with adsAllowed = false (e.g. privacy policy)
        $responseNoAds = $this->get(route('public.privacy'));
        $responseNoAds->assertOk();
        $this->assertStringNotContainsString(
            '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=',
            $responseNoAds->getContent(),
            'AdSense script tag must not be rendered when adsAllowed is false.'
        );

        // 3. Login page with adsAllowed = false
        $responseLogin = $this->get('/login');
        $responseLogin->assertOk();
        $this->assertStringNotContainsString(
            '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=',
            $responseLogin->getContent(),
            'AdSense script tag must not be rendered on auth pages.'
        );
    }

    /**
     * Requirement 3: AdContainer.jsx validates slot with /^\d{8,12}$/ and returns null for non-numeric slots.
     */
    public function test_ad_container_validates_slot_and_returns_null_for_non_numeric(): void
    {
        $component = file_get_contents(resource_path('js/Components/Ads/AdContainer.jsx'));
        $this->assertIsString($component);

        // Asserts regex validation on slot
        $this->assertMatchesRegularExpression('/\/\^\\\\d\{8,12\}\$\//', $component);
        $this->assertStringContainsString('return null', $component);
    }

    /**
     * Requirement 4: robots.txt contains unified rules and SecurityHeaders emits X-Robots-Tag: noindex, nofollow on auth and offline routes.
     */
    public function test_robots_txt_has_unified_rules_and_security_headers_emits_noindex(): void
    {
        $robotsContent = file_get_contents(public_path('robots.txt'));
        $this->assertIsString($robotsContent);

        // No separate Googlebot override
        $this->assertStringNotContainsString("User-agent: Googlebot\nAllow: /", $robotsContent);

        // Unified rules allowing auth crawling with noindex
        $this->assertStringContainsString('Allow: /login', $robotsContent);
        $this->assertStringContainsString('Allow: /register', $robotsContent);
        $this->assertStringContainsString('Allow: /forgot-password', $robotsContent);
        $this->assertStringContainsString('Disallow: /panel/', $robotsContent);

        // Check HTTP headers on auth & offline routes
        foreach (['/login', '/register', '/forgot-password', '/offline'] as $uri) {
            $response = $this->get($uri);
            $response->assertHeader('X-Robots-Tag', 'noindex, nofollow');
        }
    }

    /**
     * Requirement 5: None of the public tools or blog posts render SarkariTayariPromoCard or link to sarkaritayari.pk.
     */
    public function test_public_tools_and_blog_do_not_render_sarkaritayari_or_promo_card(): void
    {
        // 1. SarkariTayariPromoCard.jsx must be deleted
        $this->assertFileDoesNotExist(resource_path('js/Components/SarkariTayariPromoCard.jsx'));

        // 2. Check public tools components for any leftover imports or usages
        $toolFiles = [
            resource_path('js/Pages/Public/Tools/RationCostEstimator.jsx'),
            resource_path('js/Pages/Public/Tools/ElectricityBillEstimator.jsx'),
            resource_path('js/Pages/Public/Tools/MonthlyHouseholdBudgetCalculator.jsx'),
            resource_path('js/Pages/Public/Tools/SchoolFeesPlanner.jsx'),
            resource_path('js/Pages/Public/Tools/SolarRoiCalculator.jsx'),
            resource_path('js/Components/SEO/SeoLandingPage.jsx'),
        ];

        foreach ($toolFiles as $file) {
            $this->assertFileExists($file);
            $content = file_get_contents($file);
            $this->assertStringNotContainsString('SarkariTayari', $content, "File {$file} still contains SarkariTayari references.");
            $this->assertStringNotContainsString('sarkaritayari.pk', $content, "File {$file} still links to sarkaritayari.pk.");
        }

        // 3. Blog post output strips any injected sarkaritayari paragraphs
        $post = BlogPost::factory()->published()->create([
            'slug' => 'test-sarkari-link-strip',
            'content' => '<p>Budgeting advice.</p><p>Check openings on <a href="https://sarkaritayari.pk">sarkaritayari.pk</a>.</p><p>Conclusion.</p>',
            'content_format' => 'html',
        ]);

        $response = $this->get(route('public.blog.show', ['slug' => $post->slug]));
        $response->assertOk();
        $this->assertStringNotContainsString('sarkaritayari.pk', $response->getContent());
    }

    /**
     * Requirement 6: All remaining indexed blog posts exceed 1,200 words and do not make false claims about Utility Stores subsidies.
     */
    public function test_indexed_blog_posts_meet_word_count_and_accuracy_standards(): void
    {
        $expansionFile = database_path('seeders/ExpansionSeeder.php');
        $this->assertFileExists($expansionFile);

        $content = file_get_contents($expansionFile);
        $this->assertIsString($content);

        preg_match_all('/[\'\"]([a-z0-9\-]+)[\'\"]\s*=>\s*\[\s*[\'\"]title[\'\"]\s*=>\s*[\'\"]([^\'\"]+)[\'\"].*?[\'\"]content[\'\"]\s*=>\s*<<<[\'\"]?HTML[\'\"]?\s*(.*?)\s*HTML/s', $content, $matches, PREG_SET_ORDER);
        $this->assertNotEmpty($matches);

        $excludedSlugs = BlogPost::archiveExcludedPublicSlugs();

        foreach ($matches as $match) {
            $slug = $match[1];
            $body = $match[3];

            // If the post is indexed (not excluded from archive)
            if (!in_array($slug, $excludedSlugs, true)) {
                $wordCount = str_word_count(strip_tags($body));

                $this->assertGreaterThanOrEqual(
                    1200,
                    $wordCount,
                    "Indexed post '{$slug}' fails word count threshold ({$wordCount} words, minimum 1200 required)."
                );

                // Must contain concrete HTML comparison table
                $this->assertStringContainsString(
                    '<table',
                    $body,
                    "Indexed post '{$slug}' is missing an HTML comparison table."
                );

                // Must cite Pakistani regulatory/institutional frameworks
                $hasCitation = str_contains($body, 'NEPRA') || str_contains($body, 'PBS') || str_contains($body, 'SBP') || str_contains($body, 'FBR') || str_contains($body, 'SECP');
                $this->assertTrue($hasCitation, "Indexed post '{$slug}' is missing primary Pakistani regulatory citations.");

                // Must contain FAQs
                $this->assertStringContainsString('Frequently Asked Questions', $body, "Indexed post '{$slug}' is missing FAQs.");

                // Must not make false claims about active Utility Stores subsidies
                $this->assertStringNotContainsString('subsidized rates on a 20kg bag of Atta', $body);
                $this->assertStringNotContainsString('buying a 20kg bag from a subsidized utility store', $body);
            }
        }
    }
}
