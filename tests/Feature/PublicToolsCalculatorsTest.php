<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PublicToolsCalculatorsTest extends TestCase
{
    use RefreshDatabase;

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
}
