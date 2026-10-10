<?php

namespace Tests\Feature;

use App\Mail\ContactMessageMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class CsrfCacheProtectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_cookieless_requests_to_about_do_not_contain_or_share_csrf_token(): void
    {
        $response1 = $this->get('/about');
        $response2 = $this->get('/about');

        $response1->assertOk();
        $response2->assertOk();

        preg_match('/<meta name="csrf-token" content="([^"]+)"/', $response1->getContent(), $match1);
        preg_match('/<meta name="csrf-token" content="([^"]+)"/', $response2->getContent(), $match2);

        $token1 = $match1[1] ?? null;
        $token2 = $match2[1] ?? null;

        // Neither cookieless response should contain a baked-in token, or if present, they must never be identical
        if ($token1 === null && $token2 === null) {
            $this->assertNull($token1);
            $this->assertNull($token2);
        } else {
            $this->assertNotEquals($token1, $token2);
        }

        // Also assert raw string acceptance command match
        preg_match('/csrf-token" content="[^"]+"/', $response1->getContent(), $rawMatch1);
        preg_match('/csrf-token" content="[^"]+"/', $response2->getContent(), $rawMatch2);
        $this->assertEmpty($rawMatch1);
        $this->assertEmpty($rawMatch2);
    }

    public function test_cookieless_requests_to_electricity_bill_estimator_do_not_contain_or_share_csrf_token(): void
    {
        $response1 = $this->get('/tools/electricity-bill-estimator');
        $response2 = $this->get('/tools/electricity-bill-estimator');

        $response1->assertOk();
        $response2->assertOk();

        preg_match('/<meta name="csrf-token" content="([^"]+)"/', $response1->getContent(), $match1);
        preg_match('/<meta name="csrf-token" content="([^"]+)"/', $response2->getContent(), $match2);

        $token1 = $match1[1] ?? null;
        $token2 = $match2[1] ?? null;

        if ($token1 === null && $token2 === null) {
            $this->assertNull($token1);
            $this->assertNull($token2);
        } else {
            $this->assertNotEquals($token1, $token2);
        }

        preg_match('/csrf-token" content="[^"]+"/', $response1->getContent(), $rawMatch1);
        preg_match('/csrf-token" content="[^"]+"/', $response2->getContent(), $rawMatch2);
        $this->assertEmpty($rawMatch1);
        $this->assertEmpty($rawMatch2);
    }

    public function test_csrf_token_endpoint_returns_token_with_no_store_headers(): void
    {
        $response = $this->get('/csrf-token');

        $response->assertOk();
        $response->assertJsonStructure(['csrf_token']);

        $token = $response->json('csrf_token');
        $this->assertIsString($token);
        $this->assertNotEmpty($token);

        $cacheControl = (string) $response->headers->get('Cache-Control');
        $this->assertStringContainsString('no-store', $cacheControl);
        $this->assertStringContainsString('private', $cacheControl);
    }

    public function test_contact_submission_succeeds_with_token_from_csrf_endpoint(): void
    {
        Mail::fake();

        // 1. Fetch CSRF token and start session via /csrf-token
        $csrfResponse = $this->get('/csrf-token');
        $csrfResponse->assertOk();
        $token = $csrfResponse->json('csrf_token');
        $this->assertNotEmpty($token);

        // 2. Submit contact form using the token obtained from /csrf-token
        $contactResponse = $this->post('/contact', [
            '_token' => $token,
            'name' => 'Fatima Zahra',
            'email' => 'fatima@example.com',
            'subject' => 'Budgeting app feedback',
            'message' => 'This is a detailed feedback message that easily satisfies minimum length requirements.',
            'timestamp' => now()->subSeconds(10)->timestamp,
            'website' => '',
        ], [
            'X-CSRF-TOKEN' => $token,
        ]);

        $contactResponse->assertRedirect(route('public.contact'));
        $contactResponse->assertSessionHas('status', __('Thank you! Your message has been sent.'));

        Mail::assertSent(ContactMessageMail::class, function ($mail) {
            return $mail->name === 'Fatima Zahra' && $mail->email === 'fatima@example.com';
        });
    }

    public function test_public_cached_responses_do_not_set_session_cookies_and_include_vary_cookie(): void
    {
        $response = $this->get('/tools/electricity-bill-estimator');

        $response->assertOk();

        $cacheControl = (string) $response->headers->get('Cache-Control');
        $this->assertStringContainsString('public', $cacheControl);

        $vary = (string) $response->headers->get('Vary');
        $this->assertStringContainsString('Cookie', $vary);

        // Assert no Set-Cookie headers are emitted on public cached responses
        $cookies = $response->headers->getCookies();
        $this->assertCount(0, $cookies, 'Public cached responses must never set cookies.');
    }

    public function test_authenticated_requests_are_never_cached_publicly(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/tools/electricity-bill-estimator');

        $response->assertOk();

        $cacheControl = (string) $response->headers->get('Cache-Control');
        $this->assertStringNotContainsString('public', $cacheControl);
        $this->assertStringContainsString('private', $cacheControl);
    }
}
