<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_new_users_can_register_with_return_to_url(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User 2',
            'email' => 'test2@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'return_to' => '/templates/50k-salary-survival-guide',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/templates/50k-salary-survival-guide');
    }

    public function test_authenticated_users_are_redirected_to_return_to_url_when_visiting_register(): void
    {
        $user = \App\Models\User::factory()->create();

        $response = $this->actingAs($user)->get('/register?return_to=%2Ftemplates%2F50k-salary-survival-guide');

        $response->assertRedirect('/templates/50k-salary-survival-guide');
    }
}
