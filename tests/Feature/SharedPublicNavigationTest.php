<?php

namespace Tests\Feature;

use Tests\TestCase;

class SharedPublicNavigationTest extends TestCase
{
    public function test_shared_public_tools_menu_does_not_promote_weak_programmatic_groups(): void
    {
        $layout = file_get_contents(resource_path('js/Layouts/PublicLayout.jsx'));

        $this->assertIsString($layout);
        $this->assertStringNotContainsString('Petrol Price Pages', $layout);
        $this->assertStringNotContainsString('DISCO Bill Pages', $layout);
        $this->assertStringNotContainsString('Ration Cost Pages', $layout);
        $this->assertStringNotContainsString('seoPageHref(', $layout);

        $this->assertStringContainsString("label: 'Ration Cost Estimator'", $layout);
        $this->assertStringContainsString("label: 'School Fees Planner'", $layout);
        $this->assertStringContainsString("label: 'Electricity Bill Estimator'", $layout);
        $this->assertStringContainsString("label: 'Survival Report'", $layout);
        $this->assertStringContainsString("label: 'Kharcha Map'", $layout);
        $this->assertStringContainsString("label: '50k Salary Guide'", $layout);
    }
}
