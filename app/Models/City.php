<?php
// Purpose: Represent fuel-scraper city records used for slug-based source matching. Date: 2026-03-29. Author: Mohsin.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    public function petrolPrices(): HasMany
    {
        return $this->hasMany(PetrolPrice::class);
    }
}
