<?php

// Purpose: Multi-tenant ration item scoping + default flags. Date: 2026-02-22. Author: Codex.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Schema;
use App\Models\Concerns\BelongsToUser;

class RationItem extends Model
{
    use HasFactory;
    use BelongsToUser;

    protected $fillable = [
        'user_id',
        'household_id',
        'name',
        'item_name',
        'unit',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function prices(): HasMany
    {
        return $this->hasMany(RationPrice::class)->orderByDesc('priced_at');
    }

    public function scopeDefaults($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeCustom($query)
    {
        return $query->where('is_default', false);
    }

    public static function normalizeName(string $name): string
    {
        return preg_replace('/\s+/', ' ', trim(mb_strtolower($name)));
    }
}
