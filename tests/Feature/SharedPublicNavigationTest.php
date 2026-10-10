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

    public function test_public_header_contains_direct_legal_links_without_redirects(): void
    {
        $header = file_get_contents(resource_path('js/Components/Nav/PublicHeader.jsx'));

        $this->assertIsString($header);
        $this->assertStringContainsString("href: '/privacy-policy'", $header);
        $this->assertStringContainsString("href: '/terms'", $header);
        $this->assertStringNotContainsString("href: '/terms-of-service'", $header);

        $this->get('/privacy-policy')->assertOk();
        $this->get('/terms')->assertOk();
    }
}
