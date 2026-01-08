<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogPublicController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = $this->baseQuery()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (BlogPost $post) => $this->transformPostSummary($post));

        $categories = BlogCategory::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Public/Blog/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'seo' => $this->seoForIndex(),
        ]);
    }

    public function category(string $slug): Response
    {
        $category = BlogCategory::where('slug', $slug)->firstOrFail();

        $posts = $this->baseQuery()
            ->whereHas('categories', fn ($query) => $query->where('blog_categories.id', $category->id))
            ->paginate(10)
            ->withQueryString()
            ->through(fn (BlogPost $post) => $this->transformPostSummary($post));

        return Inertia::render('Public/Blog/Category', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ],
            'posts' => $posts,
            'seo' => $this->seoForCategory($category),
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        Log::channel('blog_pages')->info('Blog page request', $this->blogLogContext($request, [
            'slug' => $slug,
            'query' => $request->query(),
        ]));

        $post = BlogPost::query()
            ->with('categories')
            ->where('slug', $slug)
            ->first();

        if (! $post) {
            Log::channel('blog_pages')->warning('Blog page missing', $this->blogLogContext($request, [
                'slug' => $slug,
            ]));

            abort(404);
        }

        if (! $post->isVisible()) {
            Log::channel('blog_pages')->notice('Blog page hidden', $this->blogLogContext($request, [
                'slug' => $slug,
                'post_id' => $post->id,
                'status' => $post->status,
                'published_at' => optional($post->published_at)->toIso8601String(),
            ]));

            abort(404);
        }

        $url = route('public.blog.show', ['slug' => $post->slug], true);
        $description = $post->seo_description
            ?? Str::limit(strip_tags($post->excerpt ?: $post->rendered_content), 155);

        $seo = [
            'title' => $post->seo_title ?? "{$post->title} | Roznamcha Blog",
            'description' => $description,
            'url' => $url,
            'canonical' => $post->canonical_url ?: $url,
            'keywords' => $post->seo_keywords,
            'image' => $post->og_image_url,
            'type' => 'article',
        ];

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $post->seo_title ?? $post->title,
            'description' => $description,
            'datePublished' => optional($post->published_at)->toIso8601String(),
            'dateModified' => optional($post->updated_at)->toIso8601String(),
            'author' => [
                '@type' => 'Organization',
                'name' => 'Roznamcha',
                'url' => config('app.url'),
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'Roznamcha',
                'url' => config('app.url'),
            ],
            'mainEntityOfPage' => $seo['canonical'],
        ];

        if ($post->og_image_url) {
            $jsonLd['image'] = [$post->og_image_url];
        }

        $postPayload = [
            'id' => $post->id,
            'title' => $post->title,
            'excerpt' => $post->excerpt,
            'content' => $post->rendered_content,
            'slug' => $post->slug,
            'published_at' => optional($post->published_at)->toDateTimeString(),
            'published_label' => optional($post->published_at)->format('F j, Y'),
            'categories' => $post->categories->map(fn (BlogCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ]),
            'og_image_url' => $post->og_image_url,
        ];

        Log::channel('blog_pages')->info('Blog page rendered', $this->blogLogContext($request, [
            'slug' => $slug,
            'post_id' => $post->id,
            'status' => $post->status,
            'content_format' => $post->content_format,
            'content_length' => strlen($post->content ?? ''),
            'rendered_length' => strlen($post->rendered_content ?? ''),
        ]));

        return Inertia::render('Public/Blog/Show', [
            'post' => $postPayload,
            'seo' => $seo,
            'jsonLd' => $jsonLd,
        ]);
    }

    protected function baseQuery()
    {
        return BlogPost::query()
            ->published()
            ->with('categories')
            ->orderByDesc('published_at')
            ->orderByDesc('id');
    }

    protected function transformPostSummary(BlogPost $post): array
    {
        $excerpt = $post->excerpt ?: Str::limit(strip_tags($post->rendered_content), 220);

        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $excerpt,
            'published_at' => optional($post->published_at)->toDateTimeString(),
            'published_label' => optional($post->published_at)->format('F j, Y'),
            'categories' => $post->categories->map(fn (BlogCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ]),
            'og_image_url' => $post->og_image_url,
            'url' => route('public.blog.show', ['slug' => $post->slug], true),
        ];
    }

    protected function seoForIndex(): array
    {
        $url = route('public.blog.index', [], true);

        return [
            'title' => 'Roznamcha Blog – Daily tips on Pakistani budgets, kharcha, and ration planning',
            'description' => 'Fresh Urdu-first insights on surviving inflation, stretching ration budgets, and running Pakistani households the Roznamcha way.',
            'url' => $url,
            'canonical' => $url,
            'type' => 'website',
            'keywords' => 'Roznamcha blog, Pakistan budgeting tips, ration prices, household survival guide',
        ];
    }

    protected function seoForCategory(BlogCategory $category): array
    {
        $url = route('public.blog.category', ['slug' => $category->slug], true);

        return [
            'title' => "{$category->name} – Roznamcha Blog",
            'description' => "Stories and insights about {$category->name} for Pakistani households.",
            'url' => $url,
            'canonical' => $url,
            'type' => 'website',
            'keywords' => "{$category->name}, Roznamcha blog",
        ];
    }

    protected function blogLogContext(Request $request, array $context = []): array
    {
        return array_merge([
            'ip' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 255),
            'referer' => $request->headers->get('referer'),
        ], $context);
    }
}
