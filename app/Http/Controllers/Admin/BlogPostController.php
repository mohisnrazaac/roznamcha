<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $posts = BlogPost::query()
            ->with('categories')
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (BlogPost $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'status' => $post->status,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'published_at' => optional($post->published_at)->toDateTimeString(),
                'updated_at' => optional($post->updated_at)->toDateTimeString(),
                'categories' => $post->categories->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]),
            ]);

        return Inertia::render('Admin/Blog/PostsIndex', [
            'posts' => $posts,
            'filters' => $filters,
            'statusOptions' => ['draft', 'published', 'scheduled'],
        ]);
    }

    public function create(): Response
    {
        return $this->formResponse(new BlogPost());
    }

    public function edit(BlogPost $post): Response
    {
        return $this->formResponse($post);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        $post = new BlogPost();
        $this->assignData($post, $data, $request);

        return redirect()
            ->route('admin.blog.posts.index')
            ->with('success', 'Blog post created.');
    }

    public function update(Request $request, BlogPost $post): RedirectResponse
    {
        $data = $this->validatedData($request, $post);
        $this->assignData($post, $data, $request);

        return redirect()
            ->route('admin.blog.posts.index')
            ->with('success', 'Blog post updated.');
    }

    public function destroy(BlogPost $post): RedirectResponse
    {
        if ($post->og_image_path) {
            Storage::disk('public')->delete($post->og_image_path);
        }

        $post->categories()->detach();
        $post->delete();
        $this->flushBlogCaches();

        return redirect()
            ->route('admin.blog.posts.index')
            ->with('success', 'Blog post deleted.');
    }

    public function publish(Request $request, BlogPost $post): RedirectResponse
    {
        $post->publishNow();
        $post->updated_by = $request->user()->id;
        $post->save();
        $this->flushBlogCaches();

        return redirect()->back()->with('success', 'Post published.');
    }

    public function draft(Request $request, BlogPost $post): RedirectResponse
    {
        $post->status = 'draft';
        $post->published_at = null;
        $post->updated_by = $request->user()->id;
        $post->save();
        $this->flushBlogCaches();

        return redirect()->back()->with('success', 'Post moved to draft.');
    }

    protected function formResponse(BlogPost $post): Response
    {
        $categories = BlogCategory::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/Blog/PostForm', [
            'post' => $post->exists ? $this->transformPost($post) : null,
            'categories' => $categories,
            'statusOptions' => ['draft', 'published', 'scheduled'],
            'formatOptions' => ['markdown', 'html'],
        ]);
    }

    protected function transformPost(BlogPost $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'content_format' => $post->content_format,
            'status' => $post->status,
            'published_at' => optional($post->published_at)->format('Y-m-d\TH:i'),
            'seo_title' => $post->seo_title,
            'seo_description' => $post->seo_description,
            'seo_keywords' => $post->seo_keywords,
            'og_image_path' => $post->og_image_path,
            'og_image_url' => $post->og_image_url,
            'canonical_url' => $post->canonical_url,
            'language' => $post->language,
            'categories' => $post->categories->pluck('id'),
            'feature_hooks' => $post->feature_hooks,
        ];
    }

    protected function validatedData(Request $request, ?BlogPost $post = null): array
    {
        $postId = $post?->id;

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_posts', 'slug')->ignore($postId)],
            'excerpt' => ['nullable', 'string', 'max:600'],
            'content' => ['required', 'string'],
            'content_format' => ['required', Rule::in(['markdown', 'html'])],
            'status' => ['required', Rule::in(['draft', 'published', 'scheduled'])],
            'published_at' => [
                'nullable',
                'date',
            ],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'url', 'max:255'],
            'language' => ['nullable', 'string', 'max:8'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['integer', 'exists:blog_categories,id'],
            'og_image' => ['nullable', 'image'],
            'remove_og_image' => ['nullable', 'boolean'],
            'feature_hooks' => ['nullable', 'array'],
            'feature_hooks.primaryCategory' => ['nullable', 'string', 'max:255'],
            'feature_hooks.ctaRoute' => ['nullable', 'string', 'max:255'],
            'feature_hooks.calculator' => ['nullable', 'string', 'in:school_fee_increase'],
            'feature_hooks.prefill' => ['nullable', 'array'],
            'feature_hooks.prefill.category' => ['nullable', 'string', 'max:255'],
            'feature_hooks.prefill.tags' => ['nullable', 'array'],
            'feature_hooks.prefill.tags.*' => ['string', 'max:50'],
            'feature_hooks.prefill.amount' => ['nullable', 'numeric', 'min:0'],
            'feature_hooks.prefill.note' => ['nullable', 'string', 'max:255'],
        ]);

        if (($data['status'] ?? null) === 'scheduled' && empty($data['published_at'])) {
            throw ValidationException::withMessages([
                'published_at' => 'Please select a publish date when scheduling a post.',
            ]);
        }

        $publicSlugCandidate = BlogPost::normalizeSlugCandidate($data['slug'] ?: $data['title']);

        if (BlogPost::isReservedPublicSlug($publicSlugCandidate)) {
            throw ValidationException::withMessages([
                'slug' => 'Choose a different slug. This slug is reserved for non-public blog paths.',
            ]);
        }

        return $data;
    }

    protected function assignData(BlogPost $post, array $data, Request $request): void
    {
        $payload = Arr::except($data, ['categories', 'og_image', 'remove_og_image']);

        if (! empty($payload['published_at'])) {
            $payload['published_at'] = Carbon::parse($payload['published_at']);
        }

        if ($payload['status'] === 'draft') {
            $payload['published_at'] = null;
        } elseif ($payload['status'] === 'published' && empty($payload['published_at'])) {
            $payload['published_at'] = now();
        }

        $post->fill($payload);
        $post->updated_by = $request->user()->id;

        if (! $post->exists) {
            $post->created_by = $request->user()->id;
        }

        if ($request->boolean('remove_og_image') && $post->og_image_path) {
            Storage::disk('public')->delete($post->og_image_path);
            $post->og_image_path = null;
        }

        if ($request->file('og_image')) {
            if ($post->og_image_path) {
                Storage::disk('public')->delete($post->og_image_path);
            }

            $storageBase = storage_path('app/public/blog/og-images');
            if (! is_dir($storageBase)) {
                mkdir($storageBase, 0755, true);
            }

            $post->og_image_path = $request->file('og_image')->store('blog/og-images', 'public');
        }

        $post->save();

        $post->categories()->sync($data['categories'] ?? []);
        $this->flushBlogCaches();
    }

    protected function flushBlogCaches(): void
    {
        BlogPost::forgetPublicSitemapCache();
        Cache::forget('rss:blog');
    }
}
