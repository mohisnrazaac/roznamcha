<?php
// Purpose: Track a user's saved smart budget templates and premium unlock metadata. Date: 2026-03-27. Author: Codex.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetTemplateSave extends Model
{
    use HasFactory;

    protected $table = 'budget_template_user';

    protected $fillable = [
        'budget_template_id',
        'user_id',
        'household_id',
        'saved_at',
        'last_viewed_at',
        'last_downloaded_at',
        'pro_unlocked_at',
        'purchase_provider',
        'purchase_reference',
    ];

    protected $casts = [
        'saved_at' => 'datetime',
        'last_viewed_at' => 'datetime',
        'last_downloaded_at' => 'datetime',
        'pro_unlocked_at' => 'datetime',
    ];

    public function budgetTemplate(): BelongsTo
    {
        return $this->belongsTo(BudgetTemplate::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function hasProAccess(): bool
    {
        return $this->pro_unlocked_at !== null;
    }
}
