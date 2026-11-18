<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SyncSlabRatesCommand extends Command
{
    protected $signature = 'seo:sync-slab-rates';

    protected $description = 'Sync slab_rates table with NEPRA domestic tariff schedule from config/public_tools.php';

    public function handle(): int
    {
        if (! Schema::hasTable('slab_rates')) {
            $this->error('The slab_rates table does not exist.');

            return self::FAILURE;
        }

        $seedSlabs = config('public_tools.electricity_bill_estimator.seed_slabs', []);
        if (empty($seedSlabs)) {
            $this->error('No seed slabs found in config/public_tools.php');

            return self::FAILURE;
        }

        $now = now();
        $count = 0;

        foreach ($seedSlabs as $category => $slabs) {
            foreach ((array) $slabs as $slab) {
                if (! isset($slab['min_units'], $slab['rate_per_unit'])) {
                    continue;
                }

                $min = (int) $slab['min_units'];
                $max = array_key_exists('max_units', $slab) ? $slab['max_units'] : null;
                $rate = (float) $slab['rate_per_unit'];

                DB::table('slab_rates')->updateOrInsert(
                    [
                        'category' => (string) $category,
                        'min_units' => $min,
                    ],
                    [
                        'max_units' => $max,
                        'rate_per_unit' => $rate,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ]
                );

                $count++;
            }
        }

        $this->info("Successfully synced {$count} slab rates from config.");

        return self::SUCCESS;
    }
}
