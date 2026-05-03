<?php
// Purpose: Persist fuel-source comparison checks and discrepancy thresholds for manual review. Date: 2026-03-29. Author: Mohsin.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'source',
        'fuel_type',
        'scraped_price',
        'stored_price',
        'difference',
        'checked_at',
    ];

    protected $casts = [
        'scraped_price' => 'decimal:2',
        'stored_price' => 'decimal:2',
        'difference' => 'decimal:2',
        'checked_at' => 'datetime',
    ];
}
