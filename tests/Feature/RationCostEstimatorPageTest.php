<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class RationCostEstimatorPageTest extends TestCase
{
    public function test_ration_cost_estimator_uses_flagship_page_payload(): void
    {
        $response = $this->get(route('public.tools.ration-cost-estimator'));

        $response->assertOk();
        $response->assertSee('<title inertia>Ration Cost Estimator Pakistan – Monthly grocery budget calculator | Roznamcha</title>', false);
        $response->assertSee('link rel="canonical" href="'.$this->publicRouteUrl('public.tools.ration-cost-estimator').'" inertia="canonical"', false);
        $response->assertDontSee('"@type":"FAQPage"', false);
        $response->assertDontSee('Use the buffered number when you want a safer month-end target for volatile price periods.', false);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Public/Tools/RationCostEstimator')
            ->missing('planningBufferPercent')
            ->missing('comparisonPlaceholderPercent')
            ->has('items', 5)
            ->where('relatedLinks.relatedBlogs.0.title', 'Ghar Ka Monthly Budget: A Practical Household Budget Guide for Pakistan')
            ->where('relatedLinks.relatedBlogs.1.title', 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity')
            ->where('relatedLinks.relatedBlogs.2.title', 'How to Use Digital Roznamcha for Business and Personal Finance')
        );
    }

    private function publicRouteUrl(string $routeName, array|string $parameters = []): string
    {
        return rtrim((string) config('roznamcha_seo.base_url'), '/').route($routeName, $parameters, false);
    }
}
