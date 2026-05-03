<?php

namespace Tests\Feature;

use App\Actions\Blog\ApplySafeArchiveBatchFixes;
use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogArchiveBatchFixesTest extends TestCase
{
    use RefreshDatabase;

    public function testItAppliesOnlySafeSharedBlogCleanupPatterns(): void
    {
        $titlePost = BlogPost::factory()->published()->create([
            'title' => 'Basant 2026 in Lahore: Prices, Costs, and Household Impact',
            'slug' => 'basant-2026-lahore-kite-prices-household-cost',
            'content_format' => 'html',
            'content' => '<!-- ENGLISH VERSION --><h1>Basant 2026 in Lahore: Prices, Costs, and Household Impact</h1><p><strong>Published:</strong> April 3, 2026</p><hr><p>Body copy stays here.</p>',
        ]);

        $brandedPost = BlogPost::factory()->published()->create([
            'title' => 'How to Use Digital Roznamcha for Business and Personal Finance in 2025',
            'slug' => 'how-to-use-digital-roznamcha-for-business-and-personal-finance-2025',
            'content_format' => 'html',
            'content' => '<article><header><p class="text-xs">Roznamcha · Digital Finance</p><h1>How to Use Digital Roznamcha for Business and Personal Finance in 2025</h1></header><section><p>Useful guidance.</p></section></article>',
        ]);

        $ctaPost = BlogPost::factory()->published()->create([
            'title' => 'Utility Store Comparison Guide',
            'slug' => 'utility-store-comparison-guide',
            'content_format' => 'html',
            'content' => '<article><section><p>Real comparison body.</p></section><section><h2>Why Tools Like “Ration Brain” Matter</h2><p>Generic promo.</p></section><section><h2>Final Verdict</h2><p>Keep this.</p></section></article>',
        ]);

        $metadataPost = BlogPost::factory()->published()->create([
            'title' => 'Inflation and Your Budget in Pakistan 2026',
            'slug' => 'inflation-household-budget-pakistan-2026',
            'excerpt' => 'inflation impact on household budget Pakistan 2026, cost of living Pakistan inflation, grocery prices Pakistan 2026, budgeting during inflation Pakistan, monthly budget Pakistan inflation',
            'seo_description' => 'inflation impact on household budget Pakistan 2026, cost of living Pakistan inflation, grocery prices Pakistan 2026, budgeting during inflation Pakistan, monthly budget Pakistan inflation',
            'content_format' => 'html',
            'content' => '<h1>Inflation and Your Budget in Pakistan 2026</h1><p>Households still need a practical guide to track spending, compare essential costs, and react before month-end pressure gets worse.</p>',
        ]);

        $result = app(ApplySafeArchiveBatchFixes::class)->run();

        $titlePost->refresh();
        $brandedPost->refresh();
        $ctaPost->refresh();
        $metadataPost->refresh();

        $this->assertStringNotContainsString('<!-- ENGLISH VERSION -->', $titlePost->content);
        $this->assertStringNotContainsString('<h1>Basant 2026 in Lahore: Prices, Costs, and Household Impact</h1>', $titlePost->content);
        $this->assertStringNotContainsString('Published:', $titlePost->content);
        $this->assertStringStartsWith('<p>Body copy stays here.</p>', $titlePost->content);

        $this->assertStringNotContainsString('Roznamcha · Digital Finance', $brandedPost->content);
        $this->assertStringContainsString('<section><p>Useful guidance.</p></section>', $brandedPost->content);

        $this->assertStringNotContainsString('Why Tools Like “Ration Brain” Matter', $ctaPost->content);
        $this->assertStringContainsString('<h2>Final Verdict</h2>', $ctaPost->content);

        $this->assertNotSame('', (string) $metadataPost->excerpt);
        $this->assertNotSame('', (string) $metadataPost->seo_description);
        $this->assertStringNotContainsString('cost of living Pakistan inflation', (string) $metadataPost->excerpt);
        $this->assertStringNotContainsString('cost of living Pakistan inflation', (string) $metadataPost->seo_description);

        $this->assertSame(4, $result['stats']['posts_updated']);
        $this->assertSame(1, $result['stats']['language_comments_removed']);
        $this->assertSame(2, $result['stats']['duplicate_title_blocks_removed']);
        $this->assertSame(1, $result['stats']['branded_openers_removed']);
        $this->assertSame(1, $result['stats']['generic_cta_blocks_removed']);
        $this->assertSame(1, $result['stats']['excerpt_repaired']);
        $this->assertSame(1, $result['stats']['seo_description_repaired']);
    }
}
