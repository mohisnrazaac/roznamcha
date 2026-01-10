<?php

namespace App\Models;

use App\Support\BlogContentRenderer;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use HasFactory;

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

    public function scopePublished($query)
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
