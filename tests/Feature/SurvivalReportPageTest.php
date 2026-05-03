<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SurvivalReportPageTest extends TestCase
{
    public function test_survival_report_page_uses_honest_flagship_framing(): void
    {
        $response = $this->get(route('public.survival-report'));
        $component = file_get_contents(resource_path('js/Pages/Public/SurvivalReport.jsx'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Public/SurvivalReport')
        );

        $this->assertIsString($component);
        $this->assertStringContainsString('Survival Report shows how the month actually went, not how the household hoped it went.', $component);
        $this->assertStringContainsString('What The Report Actually Shows', $component);
        $this->assertStringContainsString('Methodology And Limits', $component);
        $this->assertStringContainsString('Your own report is generated inside the logged-in workspace because it depends on your recorded monthly expenses and selected month.', $component);
        $this->assertStringContainsString('Previous-month baseline', $component);
        $this->assertStringContainsString('It works best as a month-end review and comparison tool, not as a forward forecast.', $component);
        $this->assertStringContainsString('Start with Kharcha Map', $component);
        $this->assertStringContainsString('Ration Cost Estimator', $component);
        $this->assertStringContainsString('School Fees Planner', $component);

        $this->assertStringNotContainsString('future bills, emergency funds, and fuel hikes', $component);
        $this->assertStringNotContainsString('Current-month projection', $component);
        $this->assertStringNotContainsString('The projection is based on the current daily average for the same month, so it is useful as a warning signal rather than a final truth.', $component);
        $this->assertStringNotContainsString('plus a simple current-month projection based on the daily average.', $component);
        $this->assertStringNotContainsString('Advanced analytics may be offered as premium add-ons later.', $component);
        $this->assertStringNotContainsString('Download a PDF or share it digitally with spouses, parents, or accountants without exposing your login.', $component);
    }
}
