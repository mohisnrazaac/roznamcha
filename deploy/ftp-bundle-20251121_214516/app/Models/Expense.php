<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Schema;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'household_id',
        'category_id',
        'amount',
        'tx_date',
        'date',
        'note',
        'notes',
        'description',
    ];

    protected $casts = [
        'tx_date' => 'date',
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeForHousehold(Builder $query, ?Household $household): Builder
    {
        if (! $household || ! Schema::hasColumn($this->getTable(), 'household_id')) {
            return $query;
        }

        return $query->where('household_id', $household->id);
    }
}
