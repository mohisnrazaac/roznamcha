<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RationItem extends Model {
    protected $fillable = ['user_id','item_name','unit','stock_quantity','daily_usage','price_per_unit'];

    protected $casts = [
        'stock_quantity' => 'decimal:2',
        'daily_usage' => 'decimal:2',
        'price_per_unit' => 'decimal:2',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    public function history(): HasMany {
        return $this->hasMany(RationHistory::class);
    }
}
