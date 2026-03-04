<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('slab_rates')) {
            Schema::create('slab_rates', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('min_units');
                $table->unsignedInteger('max_units')->nullable();
                $table->decimal('rate_per_unit', 10, 2);
                $table->string('category', 32);
                $table->timestamps();

                $table->index(['category', 'min_units']);
            });
        }

        if (Schema::hasTable('slab_rates') && DB::table('slab_rates')->count() === 0) {
            $seedSlabs = config('public_tools.electricity_bill_estimator.seed_slabs', []);
            $now = now();
            $rows = [];

            foreach ($seedSlabs as $category => $slabs) {
                foreach ((array) $slabs as $slab) {
                    if (! isset($slab['min_units'], $slab['rate_per_unit'])) {
                        continue;
                    }

                    $rows[] = [
                        'min_units' => (int) $slab['min_units'],
                        'max_units' => array_key_exists('max_units', $slab) ? $slab['max_units'] : null,
                        'rate_per_unit' => (float) $slab['rate_per_unit'],
                        'category' => (string) $category,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            if ($rows !== []) {
                DB::table('slab_rates')->insert($rows);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('slab_rates');
    }
};
