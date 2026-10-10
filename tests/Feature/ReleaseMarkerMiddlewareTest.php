<?php

namespace Tests\Feature;

use App\Models\User;
use App\Support\AppRelease;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReleaseMarkerMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_include_x_app_release_header_and_html_comment(): void
    {
        AppRelease::set('test-sha-20261010T120000Z');

        $response = $this->get('/');

        $response->assertOk();
        $response->assertHeader('X-App-Release', 'test-sha-20261010T120000Z');
        $this->assertStringContainsString('<!-- release: test-sha-20261010T120000Z -->', $response->getContent());
    }

    public function test_about_page_includes_release_header(): void
    {
        AppRelease::set('test-sha-20261010T120000Z');

        $response = $this->get('/about');

        $response->assertOk();
        $response->assertHeader('X-App-Release', 'test-sha-20261010T120000Z');
    }

    public function test_authenticated_route_includes_release_header_without_disrupting_auth(): void
    {
        AppRelease::set('test-sha-20261010T120000Z');
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertOk();
        $response->assertHeader('X-App-Release', 'test-sha-20261010T120000Z');
    }
}
