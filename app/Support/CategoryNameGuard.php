<?php

// Purpose: Shared helper to enforce unique category names per owner/default. Date: 2026-02-22. Author: Codex.

namespace App\Support;

use App\Models\Category;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class CategoryNameGuard
{
    public static function ensureAvailable(?int $userId, string $name, ?int $ignoreId = null): void
    {
        $normalized = Category::normalizeName($name);

        $candidates = Category::query()
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->where(function ($query) use ($userId) {
                if ($userId === null) {
                    $query->whereNull('user_id');
                } else {
                    $query->whereNull('user_id')
                        ->orWhere('user_id', $userId);
                }
            })
            ->get(['name']);

        if (self::hasNormalizedMatch($candidates, $normalized)) {
            throw ValidationException::withMessages([
                'name' => 'This category name already exists.',
            ]);
        }
    }

    protected static function hasNormalizedMatch(Collection $collection, string $needle): bool
    {
        return $collection->contains(function ($category) use ($needle) {
            return Category::normalizeName($category->name) === $needle;
        });
    }
}
