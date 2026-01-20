<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Holds the last visit date and streak count so we can encourage quiet consistency.
 */
class DailyVisitStreak extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'last_visited_on',
        'streak_count',
    ];

    protected $casts = [
        'last_visited_on' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
