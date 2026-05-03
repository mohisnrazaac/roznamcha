<?php
// Purpose: Compare PakWheels fuel prices against stored fallback fuel records and alert when drift exceeds the allowed threshold. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use App\Models\PetrolPrice;
use App\Models\PriceAuditLog;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;

class FuelPriceAuditService
{
    public function __construct(private readonly PakWheelsFuelPriceScraperService $pakWheelsFuelPriceScraperService)
    {
    }

    public function auditPakwheelsAgainstStoredPrices(): array
    {
        if (! Schema::hasTable('petrol_prices') || ! Schema::hasTable('price_audit_logs')) {
            throw new \RuntimeException('petrol_prices or price_audit_logs table is missing.');
        }

        $scraped = $this->pakWheelsFuelPriceScraperService->scrape();
        $checkedAt = now(config('app.timezone', 'Asia/Karachi'));
        $threshold = (float) config('roznamcha_seo.petrol.audit_threshold_rupees', 2.0);
        $discrepancies = [];

        foreach ($scraped['prices'] as $row) {
            $storedPrice = $this->latestComparableStoredPrice($row['fuel_type']);
            $difference = $storedPrice === null ? null : round((float) $row['price'] - $storedPrice, 2);

            PriceAuditLog::query()->create([
                'source' => 'pakwheels',
                'fuel_type' => $row['fuel_type'],
                'scraped_price' => $row['price'],
                'stored_price' => $storedPrice,
                'difference' => $difference,
                'checked_at' => $checkedAt,
            ]);

            if ($difference !== null && abs($difference) > $threshold) {
                $discrepancies[] = [
                    'fuel_type' => $row['fuel_type'],
                    'scraped_price' => (float) $row['price'],
                    'stored_price' => $storedPrice,
                    'difference' => $difference,
                ];
            }
        }

        if ($discrepancies !== []) {
            Mail::to((string) config('roznamcha_seo.petrol.discrepancy_alert_email', config('mail.contact_to')))
                ->send(new FuelPriceDiscrepancyAlertMail($discrepancies, $scraped['source_url'], $checkedAt));
        }

        return [
            'checked_count' => count($scraped['prices']),
            'discrepancies' => $discrepancies,
            'checked_at' => $checkedAt,
            'source_url' => $scraped['source_url'],
        ];
    }

    private function latestComparableStoredPrice(string $fuelType): ?float
    {
        $rows = PetrolPrice::query()
            ->forFuel($fuelType)
            ->orderByDesc('effective_date')
            ->orderByDesc('id')
            ->get();

        if ($rows->isEmpty()) {
            return null;
        }

        if (in_array($fuelType, ['petrol', 'diesel'], true)) {
            $latestDate = optional($rows->first()->effective_date)?->toDateString();

            if (! $latestDate) {
                return null;
            }

            $storedPrice = $rows
                ->filter(fn (PetrolPrice $row) => optional($row->effective_date)?->toDateString() === $latestDate)
                ->min(fn (PetrolPrice $row) => (float) $row->price_per_litre);

            return $storedPrice !== null ? (float) $storedPrice : null;
        }

        $latestRow = $rows->first();

        return $latestRow ? (float) $latestRow->price_per_litre : null;
    }
}
