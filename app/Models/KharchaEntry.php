<?php

// Purpose: Kharcha entry scoping for multi-tenant enforcement. Date: 2026-02-22. Author: Codex.

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Concerns\BelongsToUser;

class KharchaEntry extends Model
{
    use BelongsToUser;

    protected $fillable = [
        'user_id',
        'category_id',
        'date',
        'amount',
        'vendor',
        'notes',
        'receipt_path',
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
