<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RationHistory extends Model {
    protected $table = 'ration_history';
    protected $fillable = ['ration_item_id','change_date','change_type','quantity_change','notes'];

    protected $casts = [
        'change_date' => 'date',
        'quantity_change' => 'decimal:2',
    ];

    public function item(): BelongsTo {
        return $this->belongsTo(RationItem::class, 'ration_item_id');
    }
}
