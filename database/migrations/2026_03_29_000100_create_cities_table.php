<?php
// Purpose: Create a lightweight cities lookup table for fuel-price scraping and slug-based matching. Date: 2026-03-29. Author: Mohsin.

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        $now = now();
        $rows = collect(config('roznamcha_seo.petrol.city_seed_list', []))
            ->map(fn (string $name, string $slug) => [
                'name' => $name,
                'slug' => $slug,
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->values()
            ->all();

        if (! empty($rows)) {
            DB::table('cities')->insert($rows);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
