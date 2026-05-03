<?php
// Purpose: Represent stored freshness snapshots for programmatic SEO landing pages. Date: 2026-03-29. Author: Mohsin.

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoPageSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_type',
        'page_key',
        'title',
        'value_1',
        'value_2',
        'value_3',
        'summary_text',
        'comparison_text',
        'effective_date',
        'source_label',
        'extra_json',
    ];

    protected $casts = [
        'value_1' => 'decimal:2',
        'value_2' => 'decimal:2',
        'value_3' => 'decimal:2',
        'effective_date' => 'date',
        'extra_json' => 'array',
    ];

    public function scopeForPage(Builder $query, string $pageType, string $pageKey): Builder
    {
        return $query
            ->where('page_type', $pageType)
            ->where('page_key', $pageKey);
    }
}
