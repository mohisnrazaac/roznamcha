<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Stores CMS-managed copy for the daily hooks so marketing can refresh the card without deploying.
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
        'last_updated_at',
    ];

    protected $casts = [
        'snapshot_date' => 'date',
        'last_updated_at' => 'datetime',
    ];
}
