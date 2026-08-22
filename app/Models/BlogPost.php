<?php

namespace App\Models;

use App\Support\BlogContentRenderer;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory;

    public const RESERVED_PUBLIC_SLUGS = [
        'create-post',
    ];

    public const PUBLIC_SITEMAP_CACHE_KEY = 'sitemap:xml:v4';

    public const LEGACY_PUBLIC_SITEMAP_CACHE_KEYS = [
        'sitemap:xml',
        'sitemap:xml:v2',
        'sitemap:xml:v3',
        'sitemap:templates:xml',
        'sitemap:templates:xml:v2',
        'sitemap:templates:xml:v3',
    ];

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'content_format',
        'status',
        'published_at',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'og_image_path',
        'canonical_url',
        'feature_hooks',
        'language',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'feature_hooks' => 'array',
    ];

    protected $appends = [
        'rendered_content',
        'og_image_url',
    ];

    protected static function booted(): void
    {
        static::creating(function (BlogPost $post) {
            $post->slug = $post->generateUniqueSlug($post->slug ?: $post->title);
        });

        static::updating(function (BlogPost $post) {
            if ($post->isDirty('slug') || ($post->isDirty('title') && empty($post->slug))) {
                $post->slug = $post->generateUniqueSlug($post->slug ?: $post->title, $post->id);
            }
        });
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_category_post');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where(function ($inner) {
                $inner->where('status', 'published')
                    ->orWhere(function ($scheduled) {
                        $scheduled->where('status', 'scheduled')
                            ->whereNotNull('published_at')
                            ->where('published_at', '<=', now());
                    });
            });
    }

    public function scopePubliclyVisible(Builder $query): Builder
    {
        $query = $query
            ->published()
            ->whereNotNull('slug')
            ->where('slug', '!=', '')
            ->whereNotIn('slug', static::reservedPublicSlugs());

        $driver = $query->getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            return $query
                ->whereRaw("slug NOT GLOB '*[^a-z0-9-]*'")
                ->where('slug', 'not like', '-%')
                ->where('slug', 'not like', '%-')
                ->where('slug', 'not like', '%--%');
        }

        return $query->whereRaw("slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$'");
    }

    public static function reservedPublicSlugs(): array
    {
        return self::RESERVED_PUBLIC_SLUGS;
    }

    public static function publicSitemapCacheKey(): string
    {
        return self::PUBLIC_SITEMAP_CACHE_KEY;
    }

    public static function forgetPublicSitemapCache(): void
    {
        foreach (array_unique([self::PUBLIC_SITEMAP_CACHE_KEY, ...self::LEGACY_PUBLIC_SITEMAP_CACHE_KEYS]) as $key) {
            Cache::forget($key);
        }
    }

    public static function normalizeSlugCandidate(?string $value): string
    {
        return Str::slug((string) $value);
    }

    public static function isReservedPublicSlug(?string $value): bool
    {
        $slug = static::normalizeSlugCandidate($value);

        return $slug !== '' && in_array($slug, static::reservedPublicSlugs(), true);
    }

    public static function hasValidPublicSlug(?string $value): bool
    {
        $slug = trim((string) $value);

        if ($slug === '' || Str::slug($slug) !== $slug) {
            return false;
        }

        return ! in_array($slug, static::reservedPublicSlugs(), true);
    }

    public static function noindexPublicSlugs(): array
    {
        return array_values(array_filter(config('blog_cleanup.noindex_slugs', []), 'is_string'));
    }

    public static function removedPublicSlugs(): array
    {
        return array_values(array_filter(config('blog_cleanup.remove_slugs', []), 'is_string'));
    }

    public static function redirectMap(): array
    {
        return array_filter(config('blog_cleanup.redirects', []), fn ($value, $key) => is_string($key) && is_string($value), ARRAY_FILTER_USE_BOTH);
    }

    public static function redirectTargetSlug(string $slug): ?string
    {
        $target = static::redirectMap()[$slug] ?? null;

        return is_string($target) && $target !== '' ? $target : null;
    }

    public static function archiveExcludedPublicSlugs(): array
    {
        return array_values(array_unique([
            ...static::noindexPublicSlugs(),
            ...static::removedPublicSlugs(),
            ...array_keys(static::redirectMap()),
        ]));
    }

    public static function shouldNoindexPublicSlug(string $slug): bool
    {
        return in_array($slug, static::noindexPublicSlugs(), true);
    }

    public function isVisible(): bool
    {
        if ($this->status === 'draft') {
            return false;
        }

        if ($this->status === 'scheduled') {
            return $this->published_at instanceof CarbonInterface
                ? $this->published_at->isPast()
                : false;
        }

        return true;
    }

    public function isPubliclyVisible(): bool
    {
        return $this->isVisible() && static::hasValidPublicSlug($this->slug);
    }

    public function isPublicArchiveVisible(): bool
    {
        return $this->isPubliclyVisible()
            && ! in_array($this->slug, static::archiveExcludedPublicSlugs(), true);
    }

    public function scopePublicArchiveVisible(Builder $query): Builder
    {
        $query = $query->publiclyVisible();

        $excludedSlugs = static::archiveExcludedPublicSlugs();

        if ($excludedSlugs === []) {
            return $query;
        }

        return $query->whereNotIn('slug', $excludedSlugs);
    }

    public function renderedContent(): Attribute
    {
        return Attribute::make(
            get: function () {
                return BlogContentRenderer::render($this->content ?? '', $this->content_format ?? 'markdown');
            }
        );
    }

    public function ogImageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->og_image_path) {
                    return null;
                }

                $disk = Storage::disk('public');
                if ($disk->exists($this->og_image_path)) {
                    return $disk->url($this->og_image_path);
                }

                $relative = 'storage/'.ltrim($this->og_image_path, '/');

                return url($relative);
            }
        );
    }

    public function publishNow(): void
    {
        $this->status = 'published';
        $this->published_at = now();
    }

    protected function generateUniqueSlug(?string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value ?? Str::random(8));

        if (empty($base)) {
            $base = Str::random(8);
        }

        $slug = $base;
        $counter = 2;

        while (static::where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
