<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RationEntry extends Model
{
    protected $fillable = [
        'user_id',
        'item_name',
        'qty_used',
        'unit',
        'days_left_estimate',
        'notes',
    ];

    protected $casts = [
        'qty_used' => 'decimal:2',
        'days_left_estimate' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
