<?php
// Purpose: Persist city-level scraped fuel prices from fallback sources without touching the SEO snapshot table. Date: 2026-03-29. Author: Mohsin.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('petrol_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_id')->constrained('cities')->cascadeOnDelete();
            $table->string('fuel_type', 50);
            $table->decimal('price_per_litre', 12, 2);
            $table->date('effective_date');
            $table->string('source_url', 500);
            $table->timestamps();

            $table->index(['fuel_type', 'effective_date']);
            $table->unique(['city_id', 'fuel_type', 'effective_date', 'source_url'], 'petrol_prices_unique_record');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('petrol_prices');
    }
};
