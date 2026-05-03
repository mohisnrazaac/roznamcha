<?php
// Purpose: Represent smart budget template catalog entries with persisted AI output. Date: 2026-03-27. Author: Codex.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'base_salary_target',
        'is_premium',
        'price',
        'template_json',
    ];

    protected $casts = [
        'is_premium' => 'boolean',
        'template_json' => 'array',
    ];

    public function saves(): HasMany
    {
        return $this->hasMany(BudgetTemplateSave::class);
    }
}
