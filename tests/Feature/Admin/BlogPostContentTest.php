<?php

namespace Tests\Feature\Admin;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogPostContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_persists_full_html_content(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $html = '<article><section><h2>Intro</h2><p>Budget basics</p></section></article>';

        $response = $this->actingAs($user)->post(route('admin.blog.posts.store'), [
            'title' => 'HTML Storage',
            'slug' => 'html-storage',
            'excerpt' => 'HTML storage test',
            'content' => $html,
            'content_format' => 'html',
            'status' => 'draft',
            'language' => 'en',
        ]);

        $response->assertRedirect(route('admin.blog.posts.index'));

        $post = BlogPost::where('slug', 'html-storage')->first();

        $this->assertNotNull($post);
        $this->assertSame($html, $post->content);
        $this->assertStringContainsString('<article>', $post->content);
        $this->assertStringContainsString('<section>', $post->content);
    }

    public function test_update_persists_full_html_content(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $post = BlogPost::factory()->create([
            'title' => 'Existing Post',
            'slug' => 'existing-post',
            'content' => '<p>Old</p>',
            'content_format' => 'html',
            'status' => 'draft',
        ]);

        $html = '<article><header><h1>Updated</h1></header><section><p>Fresh content</p></section></article>';

        $response = $this->actingAs($user)->put(route('admin.blog.posts.update', $post), [
            'title' => 'Existing Post',
            'slug' => 'existing-post',
            'excerpt' => 'Updated excerpt',
            'content' => $html,
            'content_format' => 'html',
            'status' => 'draft',
            'language' => 'en',
        ]);

        $response->assertRedirect(route('admin.blog.posts.index'));

        $post->refresh();
        $this->assertSame($html, $post->content);
        $this->assertStringContainsString('<article>', $post->content);
        $this->assertStringContainsString('<section>', $post->content);
    }
}
