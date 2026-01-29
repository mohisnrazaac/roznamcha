<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Stores the Urdu copy that powers the Daily Return snapshot so visitors find timely Pakistan context at 12 AM.
 * Automation writes these lines nightly, but we keep the model flexible so admin overrides remain possible.
 */
class DailyMoneySnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'snapshot_date',
        'expense_summary_text',
        'inflation_status_text',
        'saving_tip_text',
        'today_update_line',
        'yesterday_change_line',
        'kharcha_cta_label',
        'kharcha_cta_url',
        'ration_cta_label',
        'ration_cta_url',
        'source_metadata',
        'last_updated_at',
    ];

    protected $casts = [
        'snapshot_date' => 'date',
        'source_metadata' => 'array',
        'last_updated_at' => 'datetime',
    ];
}
