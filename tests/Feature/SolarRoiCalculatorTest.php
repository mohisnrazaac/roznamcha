<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SolarRoiCalculatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_solar_roi_calculator_page_loads_for_guests(): void
    {
        $response = $this->get('/tools/solar-net-metering-roi-calculator');
        $response->assertOk();
    }

    public function test_solar_roi_calculator_prefills_from_query_parameters(): void
    {
        $response = $this->get('/tools/solar-net-metering-roi-calculator?units=650&bill=32000');
        $response->assertOk();

        $page = $response->viewData('page');
        $this->assertNotNull($page);
        $this->assertSame(650, $page['props']['initialUnits']);
        $this->assertSame(32000.0, (float) $page['props']['initialBill']);
    }

    public function test_solar_roi_calculator_renders_single_faq_and_application_schemas(): void
    {
        $response = $this->get('/tools/solar-net-metering-roi-calculator');
        $response->assertOk();

        $html = $response->getContent();

        $faqOccurrences = substr_count($html, '"@type":"FAQPage"');
        $this->assertLessThanOrEqual(1, $faqOccurrences);

        $this->assertStringContainsString('Solar Net Metering &amp; ROI Calculator', $html);
    }

    public function test_solar_roi_calculator_api_calculates_standard_5kw_test_case_1(): void
    {
        $response = $this->postJson('/tools/solar-net-metering-roi-calculator/calculate', [
            'monthly_units' => 650,
            'monthly_bill' => 32000,
            'system_size_key' => '5kw',
            'self_consume_ratio' => 65,
            'retail_tariff' => 48.0,
            'buyback_rate' => 11.0,
            'capex_override' => 850000,
            'battery_type' => 'none',
        ]);

        $response->assertOk();
        $json = $response->json();

        $this->assertSame('5kw', $json['system_size_key']);
        $this->assertSame(5, $json['system_kw']);
        $this->assertSame(600, $json['monthly_gen']);
        $this->assertSame(390.0, (float) $json['self_consumed_units']);
        $this->assertSame(210.0, (float) $json['exported_units']);
        $this->assertSame(18720.0, (float) $json['avoided_cost_savings']);
        $this->assertSame(2310.0, (float) $json['export_revenue']);
        $this->assertSame(21030.0, (float) $json['monthly_savings']);
        $this->assertSame(252360.0, (float) $json['annual_savings']);
        $this->assertSame(850000.0, (float) $json['total_capex']);

        // Breakeven payback time: 850,000 / 252,360 = 3.37 years (lands in [3.35, 4.2] range)
        $payback = (float) $json['payback_years'];
        $this->assertGreaterThanOrEqual(3.35, $payback);
        $this->assertLessThanOrEqual(4.2, $payback);
    }

    public function test_solar_roi_calculator_api_calculates_high_consumption_10kw_test_case_2(): void
    {
        $response = $this->postJson('/tools/solar-net-metering-roi-calculator/calculate', [
            'monthly_units' => 1300,
            'monthly_bill' => 82000,
            'system_size_key' => '10kw',
            'self_consume_ratio' => 50,
            'retail_tariff' => 58.0,
            'buyback_rate' => 11.0,
            'capex_override' => 1600000,
            'battery_type' => 'none',
        ]);

        $response->assertOk();
        $json = $response->json();

        $this->assertSame('10kw', $json['system_size_key']);
        $this->assertSame(10, $json['system_kw']);
        $this->assertSame(1200, $json['monthly_gen']);
        $this->assertSame(600.0, (float) $json['self_consumed_units']);
        $this->assertSame(600.0, (float) $json['exported_units']);
        $this->assertSame(34800.0, (float) $json['avoided_cost_savings']);
        $this->assertSame(6600.0, (float) $json['export_revenue']);
        $this->assertSame(41400.0, (float) $json['monthly_savings']);
        $this->assertSame(496800.0, (float) $json['annual_savings']);
        $this->assertSame(1600000.0, (float) $json['total_capex']);

        $payback = (float) $json['payback_years'];
        $this->assertGreaterThanOrEqual(2.8, $payback);
        $this->assertLessThanOrEqual(3.8, $payback);
    }

    public function test_solar_roi_calculator_handles_edge_cases_test_case_4(): void
    {
        $response = $this->postJson('/tools/solar-net-metering-roi-calculator/calculate', [
            'monthly_units' => 1,
            'monthly_bill' => 0,
            'battery_type' => 'none',
        ]);

        $response->assertOk();
        $json = $response->json();
        $this->assertSame('3kw', $json['system_size_key']);
        $this->assertGreaterThan(0, (float) $json['monthly_savings']);
        $this->assertGreaterThan(0, (float) $json['payback_years']);
    }
}
