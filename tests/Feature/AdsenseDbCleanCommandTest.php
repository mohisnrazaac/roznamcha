<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class AdsenseDbCleanCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_adsense_db_clean_command_strips_sarkaritayari_links(): void
    {
        $post = BlogPost::factory()->published()->create([
            'slug' => 'test-sarkari-cleaning',
            'content' => '<p>Budgeting advice.</p><p>Check openings on <a href="https://sarkaritayari.pk">sarkaritayari.pk</a>.</p><p>Conclusion.</p>',
            'content_format' => 'html',
        ]);

        Artisan::call('roznamcha:adsense-db-clean');

        $post->refresh();
        $this->assertStringNotContainsString('sarkaritayari.pk', $post->content);
        $this->assertStringContainsString('Budgeting advice.', $post->content);
        $this->assertStringContainsString('Conclusion.', $post->content);
    }

    public function test_adsense_db_clean_command_fixes_electrity_typo(): void
    {
        $post = BlogPost::factory()->published()->create([
            'slug' => 'test-electrity-fix',
            'content' => '<p>Fixing #electrity bill issues.</p>',
            'feature_hooks' => ['tags' => ['electrity']],
            'content_format' => 'html',
        ]);

        Artisan::call('roznamcha:adsense-db-clean');

        $post->refresh();
        $this->assertStringNotContainsString('#electrity', $post->content);
        $this->assertStringContainsString('#electricity', $post->content);
        $this->assertEquals(['tags' => ['electricity']], $post->feature_hooks);
    }

    public function test_adsense_db_clean_command_unpublishes_thin_posts(): void
    {
        // 1. Thin post with only 50 words
        $thinPost = BlogPost::factory()->published()->create([
            'slug' => 'test-thin-article',
            'content' => '<p>Short paragraph with only a few words that fails the one thousand word requirement threshold.</p>',
            'content_format' => 'html',
        ]);

        Artisan::call('roznamcha:adsense-db-clean');

        $thinPost->refresh();
        $this->assertSame('draft', $thinPost->status);
        $this->assertNull($thinPost->published_at);
    }

    public function test_adsense_db_clean_command_expands_flagship_articles(): void
    {
        BlogPost::factory()->published()->create([
            'slug' => 'ghar-ka-monthly-budget',
            'title' => 'Old Title',
            'content' => '<p>Old short content</p>',
            'content_format' => 'html',
        ]);

        BlogPost::factory()->published()->create([
            'slug' => 'pakistani-family-monthly-expense-control',
            'title' => 'Old Title',
            'content' => '<p>Old short content with Utility Store Buffer bullet</p>',
            'content_format' => 'html',
        ]);

        Artisan::call('roznamcha:adsense-db-clean');

        $gharPost = BlogPost::where('slug', 'ghar-ka-monthly-budget')->first();
        $this->assertNotNull($gharPost);
        $this->assertGreaterThanOrEqual(1300, preg_match_all('/[\p{L}\p{N}\-]+/u', strip_tags($gharPost->content)));
        $this->assertStringContainsString('<table', $gharPost->content);

        $expensePost = BlogPost::where('slug', 'pakistani-family-monthly-expense-control')->first();
        $this->assertNotNull($expensePost);
        $this->assertGreaterThanOrEqual(1300, preg_match_all('/[\p{L}\p{N}\-]+/u', strip_tags($expensePost->content)));
        $this->assertStringNotContainsString('Utility Store Buffer', $expensePost->content);
        $this->assertStringContainsString('Wholesale Mandi', $expensePost->content);
    }
}
