<?php

namespace Tests\Feature;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
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

    public function testSitemapExcludesReservedNonPublicSlugs(): void
    {
        BlogPost::factory()->published()->create([
            'title' => 'Create Post',
            'slug' => 'create-post',
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertDontSee(route('public.blog.show', ['slug' => 'create-post'], true));
        $this->get(route('public.blog.show', ['slug' => 'create-post']))->assertNotFound();
    }

    public function testSitemapIncludesOnlyResolvablePublicPosts(): void
    {
        $published = BlogPost::factory()->published()->create([
            'slug' => 'resolvable-post',
        ]);

        BlogPost::factory()->draft()->create([
            'slug' => 'hidden-draft-post',
        ]);

        BlogPost::factory()->scheduled()->create([
            'slug' => 'scheduled-future-post',
            'published_at' => now()->addDay(),
        ]);

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertSee(route('public.blog.show', ['slug' => $published->slug], true));
        $response->assertDontSee(route('public.blog.show', ['slug' => 'hidden-draft-post'], true));
        $response->assertDontSee(route('public.blog.show', ['slug' => 'scheduled-future-post'], true));

        $this->get(route('public.blog.show', ['slug' => $published->slug]))->assertOk();
    }

    public function testSitemapIgnoresLegacyCachedXmlPayload(): void
    {
        $post = BlogPost::factory()->published()->create([
            'slug' => 'fresh-public-post',
        ]);

        Cache::put('sitemap:xml', '<urlset><url><loc>https://roznamcha.pk/blog/create-post</loc></url></urlset>', now()->addHour());

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertSee(route('public.blog.show', ['slug' => $post->slug], true));
        $response->assertDontSee('https://roznamcha.pk/blog/create-post');
        $this->assertSame($response->getContent(), Cache::get(BlogPost::publicSitemapCacheKey()));
    }

    public function testRssFeedUsesPublicArchiveVisiblePostsAndNeutralDescription(): void
    {
        $visible = BlogPost::factory()->published()->create([
            'slug' => 'rss-visible-post',
        ]);

        BlogPost::factory()->published()->create([
            'slug' => 'new-utility-store-price-list-january-2026-today-subsidized-rates',
        ]);

        $response = $this->get(route('public.blog.rss'));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/rss+xml; charset=UTF-8');
        $response->assertSee('Practical guides on household budgeting, ration planning, and month-end pressure for Pakistani families.', false);
        $response->assertSee(route('public.blog.show', $visible->slug));
        $response->assertDontSee(route('public.blog.show', ['slug' => 'new-utility-store-price-list-january-2026-today-subsidized-rates'], true), false);
    }

    public function testBlogIndexShowsOnlyPubliclyVisiblePosts(): void
    {
        $published = BlogPost::factory()->published()->create([
            'title' => 'Visible on Index',
            'slug' => 'visible-on-index',
        ]);

        BlogPost::factory()->published()->create([
            'title' => 'Create Post',
            'slug' => 'create-post',
        ]);

        BlogPost::factory()->draft()->create([
            'title' => 'Draft Post',
            'slug' => 'draft-post',
        ]);

        $response = $this->get(route('public.blog.index'));

        $response->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Public/Blog/Index')
                ->where('posts.data', function ($posts) use ($published) {
                    $slugs = collect($posts)->pluck('slug')->all();

                    $this->assertContains($published->slug, $slugs);
                    $this->assertNotContains('create-post', $slugs);
                    $this->assertNotContains('draft-post', $slugs);

                    return true;
                })
            );
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

    public function testBlogShowProvidesSharedFrameworkMetadataAndDefaultNextSteps(): void
    {
        $post = BlogPost::factory()->published()->create([
            'title' => 'Framework Test Post',
            'slug' => 'framework-test-post',
            'excerpt' => null,
            'content_format' => 'markdown',
            'content' => str_repeat('Monthly budget pressure needs a practical planning response. ', 80),
        ]);

        $response = $this->get(route('public.blog.show', $post->slug));
        $component = file_get_contents(resource_path('js/Pages/Public/Blog/Show.jsx'));
        $nextStepsComponent = file_get_contents(resource_path('js/Components/Blog/ArticleNextSteps.jsx'));

        $response->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Public/Blog/Show')
                ->where('post.slug', 'framework-test-post')
                ->where('post.excerpt', function (?string $excerpt) {
                    $this->assertNotEmpty($excerpt);
                    $this->assertStringContainsString('Monthly budget pressure needs a practical planning response.', $excerpt);

                    return true;
                })
                ->where('post.reading_time_label', '4 min read')
                ->where('post.author.name', 'Mohsin')
                ->where('relatedLinks.tools.0.key', 'ration-cost-estimator')
                ->where('relatedLinks.tools.1.key', 'kharcha-map')
                ->where('relatedLinks.tools.2.key', 'survival-report')
                ->where('relatedLinks.blogs.0.key', 'ghar-ka-monthly-budget')
                ->where('relatedLinks.blogs.1.key', 'pakistani-family-monthly-expense-control')
                ->where('relatedLinks.blogs.2.key', 'how-to-use-digital-roznamcha-for-business-and-personal-finance-2025')
            );

        $this->assertIsString($component);
        $this->assertStringContainsString('How To Use This Guide', $component);
        $this->assertStringContainsString('A stronger shared baseline for every article', $component);
        $this->assertIsString($nextStepsComponent);
        $this->assertStringContainsString('What To Do Next', $nextStepsComponent);
        $this->assertStringNotContainsString('DailyMoneySnapshot', $component);
        $this->assertStringNotContainsString('MiniCalculatorBlock', $component);
    }

    public function testWeakCategoryPageRendersNoindexRobotsMeta(): void
    {
        $category = BlogCategory::factory()->create([
            'name' => 'Personal Finance Pakistan',
            'slug' => 'personal-finance-pakistan',
        ]);

        $post = BlogPost::factory()->published()->create([
            'title' => 'Category Visible Post',
            'slug' => 'category-visible-post',
        ]);

        $post->categories()->attach($category->id);

        $response = $this->get(route('public.blog.category', ['slug' => $category->slug]));

        $response->assertOk();
        $response->assertSee('meta name="robots" content="noindex,follow"', false);
        $response->assertSee(
            'link rel="canonical" href="'.$this->publicRouteUrl('public.blog.category', ['slug' => $category->slug]).'" inertia="canonical"',
            false
        );
        $response->assertSee('Category Visible Post');
    }

    private function publicRouteUrl(string $routeName, array|string $parameters = []): string
    {
        return rtrim((string) config('roznamcha_seo.base_url'), '/').route($routeName, $parameters, false);
    }
}
