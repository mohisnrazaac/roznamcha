<?php

namespace Tests\Feature;

use App\Actions\Blog\ApplyAdsenseArticleRewrites;
use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApplyAdsenseArticleRewritesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_rewrites_all_five_existing_posts_idempotently(): void
    {
        foreach (array_keys(config('adsense_article_rewrites.posts')) as $slug) {
            BlogPost::factory()->published()->create([
                'slug' => $slug,
                'title' => 'Old title',
                'content' => '<p>Old unsupported copy.</p>',
            ]);
        }

        $result = app(ApplyAdsenseArticleRewrites::class)->run();

        $this->assertCount(5, $result['updates']);
        $this->assertSame(5, BlogPost::query()->where('status', 'published')->count());

        foreach (config('adsense_article_rewrites.posts') as $slug => $rewrite) {
            $post = BlogPost::query()->where('slug', $slug)->firstOrFail();
            $this->assertSame($rewrite['title'], $post->title);
            $this->assertSame('html', $post->content_format);
            $this->assertStringContainsString('<h2>Primary source', $post->content);
            $this->assertStringNotContainsString('<h1', $post->content);
        }

        $secondRun = app(ApplyAdsenseArticleRewrites::class)->run();

        foreach ($secondRun['updates'] as $update) {
            $this->assertSame([], $update['changed_fields']);
        }
    }

    public function test_web_trigger_is_not_available_on_the_public_web_surface(): void
    {
        $this->post('/maintenance/apply-adsense-article-rewrites')->assertNotFound();
    }
}
