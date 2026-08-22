<?php

namespace Tests\Feature;

use App\Actions\Blog\ApplyPhase25CleanupDecisions;
use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class BlogCleanupImplementationTest extends TestCase
{
    use RefreshDatabase;

    public function test_noindex_blog_post_stays_reachable_but_leaves_archive_surfaces(): void
    {
        config()->set('blog_cleanup.noindex_slugs', ['new-utility-store-price-list-january-2026-today-subsidized-rates']);
        config()->set('blog_cleanup.redirects', []);

        $noindexPost = BlogPost::factory()->published()->create([
            'title' => 'Utility Store January 2026',
            'slug' => 'new-utility-store-price-list-january-2026-today-subsidized-rates',
        ]);

        $indexPost = BlogPost::factory()->published()->create([
            'title' => 'Visible Post',
            'slug' => 'visible-post',
        ]);

        $this->get(route('public.blog.show', $noindexPost->slug))
            ->assertOk()
            ->assertSee('meta name="robots" content="noindex,follow"', false);

        $this->get(route('public.blog.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Public/Blog/Index')
                ->where('posts.data', function ($posts) {
                    $slugs = collect($posts)->pluck('slug')->all();

                    $this->assertNotContains('new-utility-store-price-list-january-2026-today-subsidized-rates', $slugs);
                    $this->assertContains('visible-post', $slugs);

                    return true;
                })
            );

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertDontSee(route('public.blog.show', ['slug' => $noindexPost->slug], true))
            ->assertSee(route('public.blog.show', ['slug' => $indexPost->slug], true));
    }

    public function test_merge_source_slug_redirects_to_surviving_target_and_leaves_archive_surfaces(): void
    {
        config()->set('blog_cleanup.noindex_slugs', []);
        config()->set('blog_cleanup.redirects', [
            'cost-of-living-pakistan-2026-monthly-budget-with-ai' => 'cost-of-living-pakistan-2026-monthly-budget',
        ]);

        $target = BlogPost::factory()->published()->create([
            'title' => 'Cost of Living in Pakistan 2026',
            'slug' => 'cost-of-living-pakistan-2026-monthly-budget',
        ]);

        BlogPost::factory()->draft()->create([
            'title' => 'Cost of Living in Pakistan 2026 with AI',
            'slug' => 'cost-of-living-pakistan-2026-monthly-budget-with-ai',
        ]);

        $this->get(route('public.blog.show', ['slug' => 'cost-of-living-pakistan-2026-monthly-budget-with-ai']))
            ->assertStatus(301)
            ->assertRedirect(route('public.blog.show', ['slug' => $target->slug]));

        $this->get(route('public.blog.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('posts.data', function ($posts) use ($target) {
                    $slugs = collect($posts)->pluck('slug')->all();

                    $this->assertContains($target->slug, $slugs);
                    $this->assertNotContains('cost-of-living-pakistan-2026-monthly-budget-with-ai', $slugs);

                    return true;
                })
            );

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee(route('public.blog.show', ['slug' => $target->slug], true))
            ->assertDontSee(route('public.blog.show', ['slug' => 'cost-of-living-pakistan-2026-monthly-budget-with-ai'], true));
    }

    public function test_phase25_cleanup_action_retires_remove_and_merge_source_posts_only(): void
    {
        config()->set('blog_cleanup.remove_slugs', ['roznamcha-with-ai']);
        config()->set('blog_cleanup.redirects', [
            'petrol-prices-today-pakistan-2026-monthly-budget-impact' => 'pakistan-petrol-price-april-2026-rs458-budget-guide',
        ]);

        $remove = BlogPost::factory()->published()->create([
            'slug' => 'roznamcha-with-ai',
        ]);

        $mergeSource = BlogPost::factory()->published()->create([
            'slug' => 'petrol-prices-today-pakistan-2026-monthly-budget-impact',
        ]);

        $target = BlogPost::factory()->published()->create([
            'slug' => 'pakistan-petrol-price-april-2026-rs458-budget-guide',
        ]);

        $result = app(ApplyPhase25CleanupDecisions::class)->run();

        $remove->refresh();
        $mergeSource->refresh();
        $target->refresh();
        $retired = $result['retired'];
        sort($retired);

        $this->assertSame('draft', $remove->status);
        $this->assertSame('draft', $mergeSource->status);
        $this->assertSame('published', $target->status);
        $this->assertSame(
            ['petrol-prices-today-pakistan-2026-monthly-budget-impact', 'roznamcha-with-ai'],
            $retired
        );
    }

    public function test_shared_blog_catalog_excludes_weak_survivor_promotions(): void
    {
        $catalog = config('internal_links.blogs', []);
        $blogToolMappings = config('internal_links.mappings.blog_to_related_tools', []);

        $this->assertArrayHasKey('ghar-ka-monthly-budget', $catalog);
        $this->assertArrayHasKey('best-monthly-budget-50000-salary-pakistan-2026', $catalog);
        $this->assertArrayHasKey('pakistani-family-monthly-expense-control', $catalog);
        $this->assertArrayNotHasKey('cost-of-living-pakistan-2026-monthly-budget', $catalog);
        $this->assertArrayNotHasKey('inflation-household-budget-pakistan-2026', $catalog);
        $this->assertArrayNotHasKey('school-fee-inflation-pakistan-2026', $catalog);
        $this->assertArrayNotHasKey('electricity-bill-breakdown-pakistan-2026-unit-cost-fpa', $catalog);
        $this->assertArrayNotHasKey('utility-store-vs-open-market-price-comparison-2026-pakistan', $catalog);

        $this->assertArrayHasKey('best-monthly-budget-50000-salary-pakistan-2026', $blogToolMappings);
        $this->assertArrayHasKey('how-to-use-digital-roznamcha-for-business-and-personal-finance-2025', $blogToolMappings);
        $this->assertArrayHasKey('pakistani-family-monthly-expense-control', $blogToolMappings);
        $this->assertArrayNotHasKey('cost-of-living-pakistan-2026-monthly-budget', $blogToolMappings);
        $this->assertArrayNotHasKey('inflation-household-budget-pakistan-2026', $blogToolMappings);
        $this->assertArrayNotHasKey('school-fee-inflation-pakistan-2026', $blogToolMappings);
        $this->assertArrayNotHasKey('electricity-bill-breakdown-pakistan-2026-unit-cost-fpa', $blogToolMappings);
        $this->assertArrayNotHasKey('utility-store-vs-open-market-price-comparison-2026-pakistan', $blogToolMappings);
    }
}
