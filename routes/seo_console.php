<?php
// Purpose: Register programmatic SEO snapshot refresh commands without editing the locked default console routes file. Date: 2026-03-29. Author: Mohsin.

use App\Seo\FuelPriceAuditService;
use App\Seo\PakFuelCityPriceScraperService;
use App\Seo\SeoSnapshotService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

Artisan::command('roznamcha:refresh-seo-snapshots {--date=}', function (): int {
    $dateOption = $this->option('date');
    $date = $dateOption ? Carbon::parse($dateOption) : null;

    try {
        $snapshots = app(SeoSnapshotService::class)->refreshAll($date);
        $targetDate = ($date ?: now(config('app.timezone', 'Asia/Karachi')))->toDateString();

        $this->info('Stored '.count($snapshots)." SEO snapshots for {$targetDate}.");

        return Command::SUCCESS;
    } catch (\Throwable $exception) {
        report($exception);
        $this->error('Failed to refresh SEO snapshots: '.$exception->getMessage());

        return Command::FAILURE;
    }
})->purpose('Generate the latest programmatic SEO snapshot rows for petrol, electricity, and ration pages.');

Artisan::command('pakfuel:scrape-city-prices', function (): int {
    try {
        $result = app(PakFuelCityPriceScraperService::class)->scrapeAndStore();

        $this->info('Stored '.$result['stored_count'].' city fuel rows for '.$result['effective_date']->toDateString().'.');

        if (! empty($result['unmatched'])) {
            $this->warn('Unmatched cities skipped: '.implode(', ', $result['unmatched']));
        }

        return Command::SUCCESS;
    } catch (\Throwable $exception) {
        report($exception);
        $this->error('PakFuel city scrape failed: '.$exception->getMessage());

        return Command::FAILURE;
    }
})->purpose('Scrape PakFuel city prices and store matched petrol and diesel rows.');

Artisan::command('pakwheels:scrape-fuel-prices', function (): int {
    try {
        $result = app(FuelPriceAuditService::class)->auditPakwheelsAgainstStoredPrices();

        $this->info('Checked '.$result['checked_count'].' PakWheels fuel rows at '.$result['checked_at']->format('Y-m-d H:i:s').'.');

        if ($result['discrepancies'] === []) {
            $this->info('No discrepancies crossed the configured threshold.');
        } else {
            $this->warn(count($result['discrepancies']).' discrepancies crossed the configured threshold and were emailed for manual review.');
        }

        return Command::SUCCESS;
    } catch (\Throwable $exception) {
        report($exception);
        $this->error('PakWheels fuel audit failed: '.$exception->getMessage());

        return Command::FAILURE;
    }
})->purpose('Audit PakWheels fuel prices against stored fallback prices and email discrepancy alerts.');
