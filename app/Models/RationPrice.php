<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RationPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'ration_item_id',
        'household_id',
        'price',
        'priced_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'priced_at' => 'date',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(RationItem::class, 'ration_item_id');
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
