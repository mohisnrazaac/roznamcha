<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportCache extends Model {
    protected $table = 'reports_cache';
    protected $fillable = ['user_id','period_start','period_end','total_spend','top_categories_json','ration_days_left_snapshot','warnings_text','generated_at'];
    protected $casts = [
        'top_categories_json' => 'array',
        'period_start' => 'date',
        'period_end' => 'date',
        'generated_at' => 'datetime',
    ];
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
