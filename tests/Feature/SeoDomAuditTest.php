<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoDomAuditTest extends TestCase
{
    use RefreshDatabase;

    /**
     * The 5 flagship public calculator routes subject to AdSense DOM auditing.
     *
     * @return array<string, string>
     */
    protected function publicCalculatorRoutes(): array
    {
        return [
            'Ration Cost Estimator' => '/tools/ration-cost-estimator',
            'Electricity Bill Estimator' => '/tools/electricity-bill-estimator',
            'Monthly Household Budget Calculator' => '/tools/monthly-household-budget-calculator',
            'School Fees Planner' => '/tools/school-fees-planner',
            'Solar ROI Calculator' => '/tools/solar-net-metering-roi-calculator',
        ];
    }

    /**
     * Component paths mapping to the 5 flagship public calculators.
     *
     * @return array<string, string>
     */
    protected function publicCalculatorComponents(): array
    {
        return [
            'Ration Cost Estimator' => resource_path('js/Pages/Public/Tools/RationCostEstimator.jsx'),
            'Electricity Bill Estimator' => resource_path('js/Pages/Public/Tools/ElectricityBillEstimator.jsx'),
            'Monthly Household Budget Calculator' => resource_path('js/Pages/Public/Tools/MonthlyHouseholdBudgetCalculator.jsx'),
            'School Fees Planner' => resource_path('js/Pages/Public/Tools/SchoolFeesPlanner.jsx'),
            'Solar ROI Calculator' => resource_path('js/Pages/Public/Tools/SolarRoiCalculator.jsx'),
        ];
    }

    public function test_all_public_calculators_return_http_200_for_guests(): void
    {
        foreach ($this->publicCalculatorRoutes() as $name => $uri) {
            $response = $this->get($uri);
            $response->assertOk();
        }
    }

    public function test_all_public_calculators_render_semantic_editorial_scaffolding_in_ssr_html(): void
    {
        $components = $this->publicCalculatorComponents();

        foreach ($this->publicCalculatorRoutes() as $name => $uri) {
            $response = $this->get($uri);
            $response->assertOk();
            $html = $response->getContent();
            $source = str_contains($html, '<article') ? $html : (file_exists($components[$name]) ? file_get_contents($components[$name]) : '');

            // Must contain semantic <article>
            $this->assertStringContainsString('<article', $source, "{$name} is missing a semantic <article> element.");

            // Must contain Methodology & Calculation Mechanics
            $this->assertTrue(
                str_contains($source, 'Methodology &amp; Calculation Mechanics') || str_contains($source, 'Methodology & Calculation Mechanics'),
                "{$name} is missing Methodology & Calculation Mechanics section."
            );

            // Must contain Underlying Data Baseline
            $this->assertStringContainsString(
                'Underlying Data Baseline',
                $source,
                "{$name} is missing Underlying Data Baseline section."
            );

            // Must contain Practical Application Guide
            $this->assertStringContainsString(
                'Practical Application Guide',
                $source,
                "{$name} is missing Practical Application Guide section."
            );

            // Must contain Frequently Asked Questions
            $this->assertStringContainsString(
                'Frequently Asked Questions',
                $source,
                "{$name} is missing Frequently Asked Questions section."
            );
        }
    }

    public function test_all_public_calculators_meet_minimum_word_count_threshold(): void
    {
        $components = $this->publicCalculatorComponents();

        // Each calculator must provide substantial, indexable plain-text content (>= 350 words)
        // to prevent thin-content or empty DOM flags from search engine and AdSense crawlers.
        foreach ($this->publicCalculatorRoutes() as $name => $uri) {
            $response = $this->get($uri);
            $response->assertOk();
            $html = $response->getContent();
            $source = str_contains($html, '<article') ? $html : (file_exists($components[$name]) ? file_get_contents($components[$name]) : '');

            // Extract plain text by stripping HTML tags and scripts
            $plainText = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $source);
            $plainText = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $plainText);
            $plainText = strip_tags($plainText);
            $plainText = html_entity_decode($plainText, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $words = preg_split('/\s+/', trim($plainText), -1, PREG_SPLIT_NO_EMPTY);
            $wordCount = count($words);

            $this->assertGreaterThanOrEqual(
                350,
                $wordCount,
                "{$name} fails minimum word count threshold (found {$wordCount} words, minimum 350 required)."
            );
        }
    }

    public function test_all_public_calculators_have_valid_canonical_and_indexable_robots_directives(): void
    {
        foreach ($this->publicCalculatorRoutes() as $name => $uri) {
            $response = $this->get($uri);
            $response->assertOk();
            $html = $response->getContent();

            // Must have rel="canonical"
            $this->assertStringContainsString('rel="canonical"', $html, "{$name} is missing canonical tag.");

            // Must NOT have noindex
            $this->assertStringNotContainsString('content="noindex', $html, "{$name} incorrectly contains noindex directive.");
        }
    }

    public function test_all_public_calculators_render_structured_data_schemas(): void
    {
        foreach ($this->publicCalculatorRoutes() as $name => $uri) {
            $response = $this->get($uri);
            $response->assertOk();
            $html = $response->getContent();

            // Must have JSON-LD script
            $this->assertStringContainsString('application/ld+json', $html, "{$name} is missing JSON-LD structured data.");
        }
    }
}
