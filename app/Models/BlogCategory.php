<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class BlogCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    protected static function booted(): void
    {
        static::creating(function (BlogCategory $category) {
            $category->slug = $category->generateUniqueSlug($category->slug ?: $category->name);
        });

        static::updating(function (BlogCategory $category) {
            if ($category->isDirty('slug') || ($category->isDirty('name') && empty($category->slug))) {
                $category->slug = $category->generateUniqueSlug($category->slug ?: $category->name, $category->id);
            }
        });
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(BlogPost::class, 'blog_category_post');
    }

    protected function generateUniqueSlug(?string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value ?? Str::random(6));

        if (empty($base)) {
            $base = Str::random(6);
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
