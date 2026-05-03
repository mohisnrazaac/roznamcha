<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Seo\SeoPageUrlGenerator;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BlogPublicController extends Controller
{
    public function __construct(
        private readonly SeoPageUrlGenerator $urlGenerator,
    ) {
    }

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

    public function show(Request $request, string $slug): Response|RedirectResponse
    {
        Log::channel('blog_pages')->info('Blog page request', $this->blogLogContext($request, [
            'slug' => $slug,
            'query' => $request->query(),
        ]));

        if (! BlogPost::hasValidPublicSlug($slug)) {
            Log::channel('blog_pages')->notice('Blog page hidden', $this->blogLogContext($request, [
                'slug' => $slug,
                'reason' => 'invalid_public_slug',
            ]));

            abort(404);
        }

        if ($redirectTargetSlug = BlogPost::redirectTargetSlug($slug)) {
            return redirect()->route('public.blog.show', ['slug' => $redirectTargetSlug], 301);
        }

        $post = BlogPost::query()
            ->publiclyVisible()
            ->with('categories')
            ->where('slug', $slug)
            ->first();

        if (! $post) {
            $hiddenPost = BlogPost::query()
                ->where('slug', $slug)
                ->first(['id', 'slug', 'status', 'published_at']);

            if ($hiddenPost) {
                Log::channel('blog_pages')->notice('Blog page hidden', $this->blogLogContext($request, [
                    'slug' => $slug,
                    'post_id' => $hiddenPost->id,
                    'status' => $hiddenPost->status,
                    'published_at' => optional($hiddenPost->published_at)->toIso8601String(),
                ]));
            } else {
                Log::channel('blog_pages')->warning('Blog page missing', $this->blogLogContext($request, [
                    'slug' => $slug,
                ]));
            }

            abort(404);
        }

        $siteUrl = $this->urlGenerator->baseUrl();
        $canonicalUrl = $this->urlGenerator->routeUrl('public.blog.show', ['slug' => $post->slug]);
        $postUrl = route('public.blog.show', ['slug' => $post->slug], true);
        $headline = $this->resolvedHeadline($post);
        $description = $this->resolvedDescription($post, $headline);
        $excerpt = $this->resolvedExcerpt($post, 220);

        $seo = [
            'title' => $this->resolvedSeoTitle($post, $headline),
            'description' => $description,
            'url' => $post->canonical_url ?: $canonicalUrl,
            'canonical' => $post->canonical_url ?: $canonicalUrl,
            'keywords' => $post->seo_keywords,
            'image' => $post->og_image_url,
            'type' => 'article',
            'robots' => BlogPost::shouldNoindexPublicSlug($post->slug) ? 'noindex,follow' : 'index,follow',
        ];

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'headline' => $headline,
            'description' => $description,
            'datePublished' => optional($post->published_at)->toIso8601String(),
            'dateModified' => optional($post->updated_at)->toIso8601String(),
            'author' => [
                '@type' => 'Person',
                'name' => 'Mohsin',
                'url' => $this->urlGenerator->routeUrl('public.about'),
                'description' => 'Founder of Roznamcha.pk and Software Architect with 16 years of experience.',
                'jobTitle' => 'Software Architect',
            ],
            'publisher' => [
                '@type' => 'Organization',
                '@id' => "{$siteUrl}#organization",
                'name' => 'Roznamcha',
                'url' => $siteUrl,
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => "{$siteUrl}/icons/appicon.png",
                ],
            ],
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $seo['canonical'],
            ],
        ];

        if ($post->og_image_url) {
            $jsonLd['image'] = [$post->og_image_url];
        }

        $postPayload = [
            'id' => $post->id,
            'title' => $post->title,
            'excerpt' => $excerpt,
            'content' => $post->rendered_content,
            'slug' => $post->slug,
            'url' => $postUrl,
            'published_at' => optional($post->published_at)->toDateTimeString(),
            'published_label' => optional($post->published_at)->format('F j, Y'),
            'updated_label' => $this->updatedLabel($post),
            'reading_time_label' => $this->readingTimeLabel($post),
            'categories' => $post->categories->map(fn (BlogCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
            ]),
            'og_image_url' => $post->og_image_url,
            'feature_hooks' => $post->feature_hooks,
            'author' => [
                'name' => 'Mohsin',
                'role' => 'Founder of Roznamcha.pk',
                'url' => $this->urlGenerator->routeUrl('public.about'),
                'bio' => 'Builds practical budgeting tools and guides for Pakistani households dealing with monthly money pressure.',
            ],
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
            'relatedLinks' => $this->resolveRelatedLinks($post),
            'seo' => $seo,
            'jsonLd' => $jsonLd,
        ]);
    }

    protected function baseQuery()
    {
        return BlogPost::query()
            ->publicArchiveVisible()
            ->with('categories')
            ->orderByDesc('published_at')
            ->orderByDesc('id');
    }

    protected function transformPostSummary(BlogPost $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $this->resolvedExcerpt($post, 220),
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
        $url = $this->urlGenerator->routeUrl('public.blog.index');

        return [
            'title' => 'Roznamcha Blog – Daily tips on Pakistani budgets, kharcha, and ration planning',
            'description' => 'Practical guides on household budgeting, ration planning, and month-end pressure for Pakistani families.',
            'url' => $url,
            'canonical' => $url,
            'type' => 'website',
            'keywords' => 'Roznamcha blog, Pakistan budgeting tips, ration prices, household survival guide',
        ];
    }

    protected function seoForCategory(BlogCategory $category): array
    {
        $url = $this->urlGenerator->routeUrl('public.blog.category', ['slug' => $category->slug]);
        $robots = $this->shouldNoindexCategory($category->slug) ? 'noindex,follow' : 'index,follow';

        return [
            'title' => "{$category->name} – Roznamcha Blog",
            'description' => "Stories and insights about {$category->name} for Pakistani households.",
            'url' => $url,
            'canonical' => $url,
            'type' => 'website',
            'keywords' => "{$category->name}, Roznamcha blog",
            'robots' => $robots,
        ];
    }

    protected function shouldNoindexCategory(string $slug): bool
    {
        return in_array(
            $slug,
            config('roznamcha_seo.search_surface.noindex_blog_category_slugs', []),
            true
        );
    }

    protected function blogLogContext(Request $request, array $context = []): array
    {
        return array_merge([
            'ip' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 255),
            'referer' => $request->headers->get('referer'),
        ], $context);
    }

    protected function resolvedSeoTitle(BlogPost $post, string $headline): string
    {
        $seoTitle = $this->normalizeMetaText($post->seo_title);

        if ($seoTitle !== '' && ! $this->looksPlaceholderText($seoTitle)) {
            return $seoTitle;
        }

        return "{$headline} | Roznamcha Blog";
    }

    protected function resolvedHeadline(BlogPost $post): string
    {
        $headline = $this->normalizeMetaText($post->title);

        if ($headline === '') {
            return $this->headlineFromSlug($post->slug);
        }

        if ($this->titleLooksMismatchedToSlug($headline, $post->slug)) {
            return $this->headlineFromSlug($post->slug);
        }

        return $headline;
    }

    protected function resolvedDescription(BlogPost $post, string $headline): string
    {
        $titleLooksMismatched = $this->titleLooksMismatchedToSlug($this->normalizeMetaText($post->title), $post->slug);
        $description = $this->normalizeMetaText($post->seo_description);

        if ($this->shouldFallbackDescription($description, $headline)) {
            $description = $this->normalizeMetaText($post->excerpt);
        }

        if ($this->shouldFallbackDescription($description, $headline)) {
            $description = Str::limit($this->normalizeMetaText(strip_tags($post->rendered_content)), 155);
        }

        if ($this->shouldFallbackDescription($description, $headline)) {
            $description = "Read {$headline} on Roznamcha for practical Pakistan household budgeting and planning guidance.";
        }

        if ($titleLooksMismatched && count(array_intersect($this->meaningfulTokens($description), $this->meaningfulTokens($headline))) === 0) {
            $description = "Read {$headline} on Roznamcha for practical Pakistan household budgeting and planning guidance.";
        }

        return Str::limit($description, 155);
    }

    protected function shouldFallbackDescription(string $description, string $headline): bool
    {
        $normalizedDescription = Str::lower($description);
        $normalizedHeadline = Str::lower($headline);

        return $description === ''
            || $this->looksPlaceholderText($description)
            || $normalizedDescription === $normalizedHeadline
            || ($normalizedHeadline !== '' && substr_count($normalizedDescription, $normalizedHeadline) >= 2)
            || Str::length($description) < 70;
    }

    protected function titleLooksMismatchedToSlug(string $title, string $slug): bool
    {
        $slugTokens = $this->meaningfulTokens($slug);

        if (count($slugTokens) < 3 || ! $this->looksPlaceholderText($title)) {
            return false;
        }

        $titleTokens = $this->meaningfulTokens($title);
        $overlap = count(array_intersect($slugTokens, $titleTokens));

        return ($overlap / max(count($slugTokens), 1)) < 0.34;
    }

    protected function headlineFromSlug(string $slug): string
    {
        return Str::of($slug)
            ->replace('-', ' ')
            ->headline()
            ->toString();
    }

    protected function resolvedExcerpt(BlogPost $post, int $limit = 220): string
    {
        $excerpt = $this->normalizeMetaText($post->excerpt);

        if ($excerpt !== '' && ! $this->looksPlaceholderText($excerpt)) {
            return Str::limit($excerpt, $limit);
        }

        return Str::limit($this->normalizeMetaText(strip_tags($post->rendered_content)), $limit);
    }

    protected function readingTimeLabel(BlogPost $post): string
    {
        $wordCount = max(1, str_word_count(strip_tags((string) $post->rendered_content)));
        $minutes = max(1, (int) ceil($wordCount / 180));

        return $minutes.' min read';
    }

    protected function updatedLabel(BlogPost $post): ?string
    {
        if (! ($post->published_at instanceof CarbonInterface) || ! ($post->updated_at instanceof CarbonInterface)) {
            return null;
        }

        if ($post->updated_at->lte($post->published_at->copy()->addDay())) {
            return null;
        }

        return $post->updated_at->format('F j, Y');
    }

    protected function resolveRelatedLinks(BlogPost $post): array
    {
        $config = config('internal_links', []);

        $toolKeys = data_get(
            $config,
            "mappings.blog_to_related_tools.{$post->slug}",
            data_get($config, 'defaults.blog_related_tools', [])
        );

        $blogKeys = collect(data_get(
            $config,
            "mappings.blog_to_related_blogs.{$post->slug}",
            data_get($config, 'defaults.blog_related_blogs', [])
        ))
            ->reject(fn (string $slug) => $slug === $post->slug)
            ->values()
            ->all();

        return [
            'tools' => $this->resolveConfiguredLinks(data_get($config, 'tools', []), $toolKeys),
            'blogs' => $this->resolveConfiguredLinks(data_get($config, 'blogs', []), $blogKeys),
        ];
    }

    protected function resolveConfiguredLinks(array $catalog, array $keys): array
    {
        return collect($keys)
            ->map(function (string $key) use ($catalog) {
                $link = $catalog[$key] ?? null;

                if (! is_array($link) || empty($link['title'])) {
                    return null;
                }

                $href = $this->resolveLinkHref($link);

                if (! $href) {
                    return null;
                }

                return [
                    'key' => $key,
                    'title' => $link['title'],
                    'href' => $href,
                    'description' => $link['description'] ?? null,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    protected function resolveLinkHref(array $link): ?string
    {
        if (! empty($link['route_name'])) {
            return route($link['route_name'], $link['route_params'] ?? [], false);
        }

        if (! empty($link['href']) && is_string($link['href'])) {
            return $link['href'];
        }

        return null;
    }

    protected function meaningfulTokens(string $value): array
    {
        $normalized = Str::of(Str::lower($value))
            ->replaceMatches('/[^a-z0-9\s-]+/u', ' ')
            ->replace('-', ' ')
            ->squish()
            ->toString();

        $stopWords = ['and', 'the', 'for', 'with', 'from', 'into', 'your', 'this', 'that', 'blog', 'post'];

        return collect(explode(' ', $normalized))
            ->filter(fn (string $token) => $token !== '' && strlen($token) > 2 && ! in_array($token, $stopWords, true))
            ->values()
            ->all();
    }

    protected function normalizeMetaText(?string $text): string
    {
        return Str::of(strip_tags((string) $text))
            ->replaceMatches('/\s+/u', ' ')
            ->trim()
            ->toString();
    }

    protected function looksPlaceholderText(string $text): bool
    {
        $normalized = Str::lower($this->normalizeMetaText($text));

        if ($normalized === '') {
            return false;
        }

        $needles = [
            'lorem ipsum',
            'voluptatibus',
            'asperiores',
            'excepturi',
            'consectetur',
            'adipiscing',
            'dolor sit',
            'porro',
            'officiis',
            'temporibus',
            'pariatur',
            'dolorum',
            'quibusdam',
            'culpa',
            'nihil',
        ];

        foreach ($needles as $needle) {
            if (str_contains($normalized, $needle)) {
                return true;
            }
        }

        return false;
    }
}
