<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ElectricityCalculatorRetentionTest extends TestCase
{
    use RefreshDatabase;

    public function test_lesco_and_other_disco_pages_render_electricity_component_with_props(): void
    {
        $discos = ['lesco', 'mepco', 'iesco', 'gepco'];

        foreach ($discos as $disco) {
            $response = $this->get("/electricity-bill-calculator-{$disco}");

            $response->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page
                    ->component('SEO/Electricity')
                    ->where('pageKey', $disco)
                    ->has('dataPoints')
                    ->has('helperContent')
                );
        }
    }

    public function test_electricity_bill_estimator_page_loads_and_contains_estimator_markup(): void
    {
        $response = $this->get(route('public.tools.electricity-bill-estimator'));

        $response->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Public/Tools/ElectricityBillEstimator')
                ->has('defaults')
                ->has('categories')
            );
    }
}
