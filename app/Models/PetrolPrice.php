<?php
// Purpose: Store fallback source fuel prices by city and fuel type for SEO backup and auditing. Date: 2026-03-29. Author: Mohsin.

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PetrolPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_id',
        'fuel_type',
        'price_per_litre',
        'effective_date',
        'source_url',
    ];

    protected $casts = [
        'price_per_litre' => 'decimal:2',
        'effective_date' => 'date',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function scopeForFuel(Builder $query, string $fuelType): Builder
    {
        return $query->where('fuel_type', $fuelType);
    }
}
