<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class BlogPublicTest extends TestCase
{
    use RefreshDatabase;

    public function testPublishedPostIsVisible(): void
    {
        $post = BlogPost::factory()->published()->create([
            'title' => 'Visible Post',
            'slug' => 'visible-post',
        ]);

        $this->get(route('public.blog.show', $post->slug))
            ->assertOk()
            ->assertSee('Visible Post');
    }

    public function testDraftPostReturnsNotFound(): void
    {
        $post = BlogPost::factory()->draft()->create([
            'title' => 'Hidden Draft',
            'slug' => 'hidden-draft',
        ]);

        $this->get(route('public.blog.show', $post->slug))->assertNotFound();
    }

    public function testScheduledPostVisibilityRespectsPublishDate(): void
    {
        $future = BlogPost::factory()->scheduled()->create([
            'slug' => 'scheduled-future',
            'published_at' => now()->addDay(),
        ]);

        $this->get(route('public.blog.show', $future->slug))->assertNotFound();

        $past = BlogPost::factory()->scheduled()->create([
            'slug' => 'scheduled-past',
            'published_at' => now()->subHour(),
        ]);

        $this->get(route('public.blog.show', $past->slug))->assertOk()->assertSee($past->title);
    }

    public function testSitemapIncludesPublishedPost(): void
    {
        $post = BlogPost::factory()->published()->create([
            'slug' => 'sitemap-check',
        ]);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee(route('public.blog.show', $post->slug));
    }

    public function testShowRouteReturnsRenderedHtmlContent(): void
    {
        $post = BlogPost::factory()->published()->create([
            'slug' => 'html-post',
            'content_format' => 'markdown',
            'content' => '<article><section><h2>How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity</h2><ul><li>Track ration</li></ul></section></article>',
        ]);

        $this->get(route('public.blog.show', $post->slug))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Public/Blog/Show')
                ->where('post.slug', $post->slug)
                ->where('post.content', function (?string $content) {
                    $this->assertNotEmpty($content);
                    $this->assertStringContainsString('<section>', $content);
                    $this->assertStringContainsString('How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', $content);

                    return true;
                })
            );
    }
}
