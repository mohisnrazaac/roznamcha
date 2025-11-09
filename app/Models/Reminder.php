<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'household_id',
        'title',
        'type',
        'reminder_type',
        'schedule_cron',
        'next_due',
        'next_run_at',
        'last_notified_at',
        'due_date',
        'frequency',
        'status',
        'is_done',
        'starts_on',
        'ends_on',
        'timezone',
        'is_active',
        'notes',
        'description',
    ];

    protected $casts = [
        'starts_on' => 'date',
        'ends_on' => 'date',
        'is_active' => 'boolean',
        'next_due' => 'datetime',
        'next_run_at' => 'datetime',
        'last_notified_at' => 'datetime',
        'due_date' => 'date',
        'is_done' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }
}
