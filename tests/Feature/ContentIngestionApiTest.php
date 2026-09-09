<?php

namespace Tests\Feature;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class ContentIngestionApiTest extends TestCase
{
    use RefreshDatabase;

    protected string $secretKey = 'test-ingestion-secret-token-12345678901234567890';

    protected function setUp(): void
    {
        parent::setUp();
        Config::set('services.agent.secret_key', $this->secretKey);
    }

    public function test_rejects_request_without_ingestion_key(): void
    {
        $response = $this->postJson('/api/internal/publish-post', [
            'title' => 'Sample Post',
            'content' => 'Sample content for the blog post',
        ]);

        $response->assertStatus(401);
        $response->assertJson(['error' => 'Unauthorized: Invalid ingestion token']);
    }

    public function test_rejects_request_with_invalid_ingestion_key(): void
    {
        $response = $this->withHeader('X-Ingestion-Key', 'wrong-secret-key')
            ->postJson('/api/internal/publish-post', [
                'title' => 'Sample Post',
                'content' => 'Sample content for the blog post',
            ]);

        $response->assertStatus(401);
        $response->assertJson(['error' => 'Unauthorized: Invalid ingestion token']);
    }

    public function test_aborts_with_500_if_secret_key_not_configured(): void
    {
        Config::set('services.agent.secret_key', null);

        $response = $this->withHeader('X-Ingestion-Key', 'any-key')
            ->postJson('/api/internal/publish-post', [
                'title' => 'Sample Post',
                'content' => 'Sample content for the blog post',
            ]);

        $response->assertStatus(500);
    }

    public function test_validates_required_fields(): void
    {
        $response = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title', 'content']);
    }

    public function test_successfully_publishes_post_with_admin_fallback_and_categories(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $category = BlogCategory::create([
            'name' => 'Budgeting Tips',
            'slug' => 'budgeting-tips',
        ]);

        $payload = [
            'title' => 'Managing Monthly Kitchen Budget in Pakistan',
            'content' => 'Full detailed guide on controlling kitchen grocery expenses...',
            'excerpt' => 'A guide to groceries in Pakistan.',
            'categories' => [$category->id],
            'seo_title' => 'Kitchen Budget Guide',
            'seo_description' => 'Learn how to budget groceries in Pakistan.',
            'seo_keywords' => 'budget, kitchen, pakistan',
        ];

        $response = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'id',
            'slug',
        ]);
        $response->assertJson([
            'success' => true,
        ]);

        $postId = $response->json('id');
        $this->assertDatabaseHas('blog_posts', [
            'id' => $postId,
            'title' => 'Managing Monthly Kitchen Budget in Pakistan',
            'status' => 'draft',
            'created_by' => $admin->id,
            'content_format' => 'markdown',
            'language' => 'ur',
        ]);

        $post = BlogPost::with('categories')->find($postId);
        $this->assertNull($post->published_at);
        $this->assertFalse($post->isPubliclyVisible());
        $this->assertEquals('managing-monthly-kitchen-budget-in-pakistan', $post->slug);
        $this->assertTrue($post->categories->contains('id', $category->id));
    }

    public function test_accepts_body_as_content_alias(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $payload = [
            'title' => 'Alias Test Post',
            'body' => 'This body should map to content.',
        ];

        $response = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('blog_posts', [
            'id' => $response->json('id'),
            'content' => 'This body should map to content.',
        ]);
    }

    public function test_rejects_duplicate_post_by_title_or_slug(): void
    {
        User::factory()->create(['role' => 'admin']);

        $payload = [
            'title' => 'Unique Topic Post Title 2026',
            'content' => 'Comprehensive detailed guide for households in Pakistan...',
        ];

        // First creation succeeds
        $firstResponse = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', $payload);

        $firstResponse->assertStatus(201);
        $firstId = $firstResponse->json('id');

        // Second creation with same title fails with 409 Conflict
        $duplicateResponse = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', $payload);

        $duplicateResponse->assertStatus(409);
        $duplicateResponse->assertJson([
            'success' => false,
            'error' => 'duplicate_post',
            'existing_id' => $firstId,
        ]);

        // Attempt creation with different casing/spacing of the same title (derives same slug candidate) fails with 409
        $sameSlugPayload = [
            'title' => '  Unique Topic Post Title 2026  ',
            'content' => 'Another article content...',
        ];
        $slugResponse = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', $sameSlugPayload);

        $slugResponse->assertStatus(409);
        $slugResponse->assertJson([
            'success' => false,
            'error' => 'duplicate_post',
        ]);
    }

    public function test_check_post_endpoint(): void
    {
        User::factory()->create(['role' => 'admin']);

        $payload = [
            'title' => 'Checking Article Existence in Database',
            'content' => 'Content here...',
        ];

        $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', $payload);

        // Check matching title
        $response = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->getJson('/api/internal/check-post?title=Checking%20Article%20Existence%20in%20Database');

        $response->assertStatus(200);
        $response->assertJson([
            'exists' => true,
            'count' => 1,
        ]);

        // Check non-existent title
        $nonExistentResponse = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->getJson('/api/internal/check-post?title=Completely%20Unrelated%20Non%20Existent%20Post');

        $nonExistentResponse->assertStatus(200);
        $nonExistentResponse->assertJson([
            'exists' => false,
            'count' => 0,
        ]);
    }

    public function test_existing_posts_endpoint(): void
    {
        User::factory()->create(['role' => 'admin']);

        $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', [
                'title' => 'Post Number One',
                'content' => 'Content 1',
            ]);

        $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->postJson('/api/internal/publish-post', [
                'title' => 'Post Number Two',
                'content' => 'Content 2',
            ]);

        $response = $this->withHeader('X-Ingestion-Key', $this->secretKey)
            ->getJson('/api/internal/existing-posts?limit=10');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'count',
            'posts' => [
                '*' => ['id', 'title', 'slug', 'status'],
            ],
        ]);
        $this->assertGreaterThanOrEqual(2, $response->json('count'));
    }
}
