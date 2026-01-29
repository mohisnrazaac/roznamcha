<?php

// Purpose: Category scoping for multi-tenant ownership + defaults. Date: 2026-02-22. Author: Codex.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Concerns\BelongsToUser;
use App\Models\User;

class Category extends Model
{
    use HasFactory;
    use BelongsToUser;

    protected $fillable = ['name', 'color', 'description', 'user_id', 'is_default'];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function kharchaEntries(): HasMany
    {
        return $this->hasMany(KharchaEntry::class);
    }

    public function scopeDefaults($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($user) {
            $builder->where('is_default', true)
                ->orWhere('user_id', $user->getKey());
        });
    }

    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where('user_id', $user->getKey());
    }

    public static function normalizeName(string $name): string
    {
        return preg_replace('/\s+/', ' ', trim(mb_strtolower($name)));
    }
}
