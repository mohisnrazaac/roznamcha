<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ContentIngestionController extends Controller
{
    /**
     * Ingest and publish a blog post programmatically.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required_without:body', 'nullable', 'string'],
            'body' => ['required_without:content', 'nullable', 'string'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_posts', 'slug')],
            'excerpt' => ['nullable', 'string', 'max:600'],
            'content_format' => ['nullable', Rule::in(['markdown', 'html'])],
            'status' => ['nullable', Rule::in(['draft', 'published', 'scheduled'])],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'og_image_path' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'url', 'max:255'],
            'language' => ['nullable', 'string', 'max:8'],
            'feature_hooks' => ['nullable', 'array'],
            'categories' => ['nullable'],
            'category_ids' => ['nullable', 'array'],
            'category_id' => ['nullable'],
            'author_id' => ['nullable', 'integer', 'exists:users,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'created_by' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $candidateSlug = BlogPost::normalizeSlugCandidate($validated['slug'] ?? $validated['title']);
        if (BlogPost::isReservedPublicSlug($candidateSlug)) {
            throw ValidationException::withMessages([
                'slug' => 'Choose a different slug. This slug is reserved for non-public blog paths.',
            ]);
        }

        $trimmedTitle = trim($validated['title']);
        $existing = BlogPost::query()
            ->where(function ($query) use ($trimmedTitle, $candidateSlug) {
                $query->where('title', $trimmedTitle)
                    ->orWhere('slug', $candidateSlug);
            })
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'error' => 'duplicate_post',
                'message' => "A post with this title or slug already exists in the database (ID: {$existing->id}, Slug: {$existing->slug}).",
                'existing_id' => $existing->id,
                'existing_slug' => $existing->slug,
                'existing_title' => $existing->title,
                'existing_status' => $existing->status,
            ], 409);
        }

        $content = $validated['content'] ?? $validated['body'] ?? '';
        // Ingested posts always remain in 'draft' state until manual verification/publishing in the admin panel.
        $status = 'draft';
        $format = $validated['content_format'] ?? 'markdown';
        $publishedAt = null;

        $authorId = $validated['created_by']
            ?? $validated['author_id']
            ?? $validated['user_id']
            ?? null;

        if (! $authorId) {
            $authorId = User::query()
                ->whereIn('role', ['admin', 'superadmin', 'super_admin'])
                ->orderBy('id')
                ->value('id')
                ?? User::query()->orderBy('id')->value('id');
        }

        $post = new BlogPost;
        $post->title = $validated['title'];
        if (! empty($validated['slug'])) {
            $post->slug = $validated['slug'];
        }
        if (array_key_exists('excerpt', $validated)) {
            $post->excerpt = $validated['excerpt'];
        }
        $post->content = $content;
        $post->content_format = $format;
        $post->status = $status;
        $post->published_at = $publishedAt;
        if (array_key_exists('seo_title', $validated)) {
            $post->seo_title = $validated['seo_title'];
        }
        if (array_key_exists('seo_description', $validated)) {
            $post->seo_description = $validated['seo_description'];
        }
        if (array_key_exists('seo_keywords', $validated)) {
            $post->seo_keywords = $validated['seo_keywords'];
        }
        if (array_key_exists('og_image_path', $validated)) {
            $post->og_image_path = $validated['og_image_path'];
        }
        if (array_key_exists('canonical_url', $validated)) {
            $post->canonical_url = $validated['canonical_url'];
        }
        if (array_key_exists('feature_hooks', $validated)) {
            $post->feature_hooks = $validated['feature_hooks'];
        }
        $post->language = $validated['language'] ?? 'ur';
        if ($authorId) {
            $post->created_by = $authorId;
            $post->updated_by = $authorId;
        }
        $post->save();

        $categoryIds = $this->resolveCategoryIds($request);
        if (! empty($categoryIds)) {
            $post->categories()->sync($categoryIds);
        }

        BlogPost::forgetPublicSitemapCache();
        Cache::forget('rss:blog');

        return response()->json([
            'success' => true,
            'id' => $post->id,
            'slug' => $post->slug ?? null,
        ], 201);
    }

    /**
     * Resolve category IDs from categories/category_ids/category_id inputs.
     *
     * @return list<int>
     */
    protected function resolveCategoryIds(Request $request): array
    {
        $raw = $request->input('categories')
            ?? $request->input('category_ids')
            ?? $request->input('category_id');

        if (empty($raw)) {
            return [];
        }

        if (! is_array($raw)) {
            $raw = [$raw];
        }

        $categoryIds = [];
        $numericIds = array_filter($raw, 'is_numeric');
        $stringValues = array_filter($raw, fn ($v) => is_string($v) && ! is_numeric($v));

        if (! empty($numericIds)) {
            $found = BlogCategory::query()->whereIn('id', $numericIds)->pluck('id')->all();
            $categoryIds = array_merge($categoryIds, $found);
        }

        if (! empty($stringValues)) {
            $found = BlogCategory::query()
                ->whereIn('slug', $stringValues)
                ->orWhereIn('name', $stringValues)
                ->pluck('id')
                ->all();
            $categoryIds = array_merge($categoryIds, $found);
        }

        return array_values(array_unique(array_map('intval', $categoryIds)));
    }

    /**
     * Check if an article with a given title, slug candidate, or topic already exists.
     */
    public function check(Request $request): JsonResponse
    {
        $title = trim((string) $request->query('title', ''));
        $slug = trim((string) $request->query('slug', ''));
        $topic = trim((string) $request->query('topic', ''));

        $candidateSlug = $slug ?: ($title || $topic ? BlogPost::normalizeSlugCandidate($title ?: $topic) : '');

        if (empty($title) && empty($candidateSlug) && empty($topic)) {
            return response()->json([
                'exists' => false,
                'count' => 0,
                'matches' => [],
            ]);
        }

        $query = BlogPost::query();

        $query->where(function ($q) use ($title, $candidateSlug, $topic) {
            if (! empty($title)) {
                $q->where('title', $title);
            }
            if (! empty($candidateSlug)) {
                $q->orWhere('slug', $candidateSlug);
            }
            if (! empty($topic)) {
                $q->orWhere('title', 'LIKE', '%'.$topic.'%')
                    ->orWhere('slug', 'LIKE', '%'.Str::slug($topic).'%');
            }
        });

        $matches = $query->take(5)->get(['id', 'title', 'slug', 'status', 'published_at']);

        return response()->json([
            'exists' => $matches->isNotEmpty(),
            'count' => $matches->count(),
            'matches' => $matches,
        ]);
    }

    /**
     * Get a list of recent post titles and slugs to prevent duplicate research/generation.
     */
    public function existingPosts(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 100), 1), 500);

        $posts = BlogPost::query()
            ->latest('id')
            ->take($limit)
            ->get(['id', 'title', 'slug', 'status', 'created_at']);

        return response()->json([
            'count' => $posts->count(),
            'posts' => $posts,
        ]);
    }
}
