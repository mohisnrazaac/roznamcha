<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Persisted AI line so every user sees the same blunt reminder throughout the day.
 */
class DailyAiInsight extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'insight_date',
        'ai_text',
    ];

    protected $casts = [
        'insight_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
