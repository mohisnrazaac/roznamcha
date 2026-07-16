<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PublicToolsCalculatorsTest extends TestCase
{
    use RefreshDatabase;

    public function test_school_fees_planner_renders_a_single_faq_page_schema_aligned_with_visible_faqs(): void
    {
        $response = $this->get('/tools/school-fees-planner');

        $response->assertOk();

        $html = $response->getContent();

        $faqPageOccurrences = substr_count($html, '"@type":"FAQPage"');
        $faqPageScripts = preg_match_all('/<script[^>]*type="application\\/ld\\+json"[^>]*>.*?"@type":"FAQPage".*?<\\/script>/s', $html);

        $this->assertLessThanOrEqual(1, $faqPageOccurrences);
        $this->assertLessThanOrEqual(1, $faqPageScripts);
        $this->assertStringNotContainsString('itemType="https://schema.org/FAQPage"', $html);

        if ($faqPageOccurrences > 0) {
            $this->assertStringContainsString('Why does the real monthly school cost look higher than tuition?', $html);
            $this->assertStringContainsString('Does this planner store my school fee data?', $html);
            $this->assertStringContainsString('What is the planning margin used for?', $html);
        }
    }

    public function test_school_fees_planner_page_loads_for_guests(): void
    {
        $this->get('/tools/school-fees-planner')->assertOk();
    }

    public function test_school_fees_planner_calculates_server_side_output(): void
    {
        $response = $this->postJson('/tools/school-fees-planner/calculate', [
            'children_count' => 2,
            'monthly_tuition_per_child' => 10000,
            'annual_charges' => 24000,
            'exam_fee' => 3000,
            'exam_frequency' => 2,
            'inflation_buffer_percentage' => 10,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'monthly_outflow' => 20000.0,
                'amortized_monthly' => 2500.0,
                'real_monthly_cost' => 22500.0,
                'projected_next_year' => 24750.0,
            ]);
    }

    public function test_electricity_bill_estimator_page_loads_for_guests(): void
    {
        $this->get('/tools/electricity-bill-estimator')->assertOk();
    }

    public function test_electricity_bill_estimator_renders_a_single_faq_page_schema_aligned_with_visible_faqs(): void
    {
        $response = $this->get('/tools/electricity-bill-estimator');

        $response->assertOk();

        $html = $response->getContent();

        $faqPageOccurrences = substr_count($html, '"@type":"FAQPage"');
        $faqPageScripts = preg_match_all('/<script[^>]*type="application\\/ld\\+json"[^>]*>.*?"@type":"FAQPage".*?<\\/script>/s', $html);

        $this->assertLessThanOrEqual(1, $faqPageOccurrences);
        $this->assertLessThanOrEqual(1, $faqPageScripts);
        $this->assertStringNotContainsString('itemType="https://schema.org/FAQPage"', $html);

        if ($faqPageOccurrences > 0) {
            $this->assertStringContainsString('Does this estimator use fixed slab values in code?', $html);
            $this->assertStringContainsString('Why is this an estimate and not my exact bill?', $html);
            $this->assertStringContainsString('Can I use this without creating an account?', $html);
        }
    }

    public function test_electricity_bill_estimator_returns_expected_structure(): void
    {
        DB::table('slab_rates')->where('category', 'protected')->delete();

        DB::table('slab_rates')->insert([
            [
                'min_units' => 1,
                'max_units' => 100,
                'rate_per_unit' => 10,
                'category' => 'protected',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'min_units' => 101,
                'max_units' => 200,
                'rate_per_unit' => 20,
                'category' => 'protected',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $response = $this->postJson('/tools/electricity-bill-estimator/calculate', [
            'units_used' => 150,
            'user_category' => 'protected',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'slab_cost',
                'total_bill',
                'last_year_estimate',
                'difference',
            ]);

        $json = $response->json();
        $this->assertSame(2000.0, (float) $json['slab_cost']);
        $this->assertGreaterThan((float) $json['slab_cost'], (float) $json['total_bill']);
    }

    public function test_monthly_household_budget_calculator_page_loads_for_guests(): void
    {
        $this->get('/tools/monthly-household-budget-calculator')->assertOk();
    }

    public function test_monthly_household_budget_calculator_renders_a_single_faq_page_schema_aligned_with_visible_faqs(): void
    {
        $response = $this->get('/tools/monthly-household-budget-calculator');

        $response->assertOk();

        $html = $response->getContent();

        $faqPageOccurrences = substr_count($html, '"@type":"FAQPage"');
        $faqPageScripts = preg_match_all('/<script[^>]*type="application\\/ld\\+json"[^>]*>.*?"@type":"FAQPage".*?<\\/script>/s', $html);

        $this->assertLessThanOrEqual(1, $faqPageOccurrences);
        $this->assertLessThanOrEqual(1, $faqPageScripts);

        if ($faqPageOccurrences > 0) {
            $this->assertStringContainsString('What is a normal savings rate for a Pakistani household?', $html);
            $this->assertStringContainsString('How can I reduce variable household expenses in Pakistan?', $html);
            $this->assertStringContainsString('Can I use this budget planner without signing up?', $html);
        }
    }

    public function test_monthly_household_budget_calculator_calculates_server_side_output(): void
    {
        $response = $this->postJson('/tools/monthly-household-budget-calculator/calculate', [
            'monthly_income' => 100000,
            'rent' => 25000,
            'ration' => 30000,
            'utilities' => 15000,
            'education' => 10000,
            'transport' => 5000,
            'misc' => 5000,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'total_expenses' => 90000.0,
                'surplus_deficit' => 10000.0,
                'savings_rate' => 10.0,
                'shares' => [
                    'rent' => 27.78,
                    'ration' => 33.33,
                    'utilities' => 16.67,
                    'education' => 11.11,
                    'transport' => 5.56,
                    'misc' => 5.56,
                ]
            ]);
    }
}
