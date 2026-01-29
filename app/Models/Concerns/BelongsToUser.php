<?php

// Purpose: Shared user ownership helpers for multi-tenant scoping. Date: 2026-02-22. Author: Codex.

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToUser
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser(Builder $query, ?User $user): Builder
    {
        if (! $user) {
            return $query;
        }

        if ($user->isAdmin()) {
            return $query;
        }

        return $query->where($this->getQualifiedUserIdColumn(), $user->getKey());
    }

    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where($this->getQualifiedUserIdColumn(), $user->getKey());
    }

    protected function getQualifiedUserIdColumn(): string
    {
        return $this->getTable().'.user_id';
    }
}
