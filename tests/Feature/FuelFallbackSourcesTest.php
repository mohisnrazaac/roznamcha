<?php
// Purpose: Verify PakFuel fallback ingestion and PakWheels discrepancy auditing for petrol page freshness support. Date: 2026-03-29. Author: Mohsin.

namespace Tests\Feature;

use App\Models\City;
use App\Models\PetrolPrice;
use App\Seo\FuelPriceDiscrepancyAlertMail;
use App\Seo\OfficialPetrolNoticeService;
use App\Seo\PakFuelCityPriceScraperService;
use App\Seo\PakWheelsFuelPriceScraperService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class FuelFallbackSourcesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_refresh_command_uses_pakfuel_backup_when_official_source_is_unavailable(): void
    {
        $effectiveDate = Carbon::parse('2026-03-29', 'Asia/Karachi');
        $cityPayloads = collect(config('roznamcha_seo.cities', []))
            ->mapWithKeys(fn (string $city, int $index) => [
                $city => [
                    'current_price' => 320.50 + $index,
                    'previous_price' => 319.00 + $index,
                    'effective_date' => $effectiveDate->copy(),
                    'source_url' => 'https://pakfuel.today/',
                ],
            ])
            ->all();

        $this->mock(OfficialPetrolNoticeService::class, function ($mock): void {
            $mock->shouldReceive('latestVerifiedNotice')
                ->once()
                ->andReturn(null);
        });

        $this->mock(PakFuelCityPriceScraperService::class, function ($mock) use ($cityPayloads): void {
            $mock->shouldReceive('scrapeAndStore')
                ->once()
                ->andReturn([
                    'stored_count' => count($cityPayloads) * 2,
                    'unmatched' => [],
                ]);

            foreach ($cityPayloads as $city => $payload) {
                $mock->shouldReceive('latestCityFuel')
                    ->with($city, 'petrol')
                    ->once()
                    ->andReturn($payload);
            }
        });

        $this->artisan('roznamcha:refresh-seo-snapshots --date=2026-03-29')
            ->assertExitCode(0);

        $this->assertDatabaseCount('seo_page_snapshots', 14);
        $this->assertDatabaseHas('seo_page_snapshots', [
            'page_type' => 'petrol',
            'page_key' => 'karachi',
            'source_label' => 'PakFuel city listing fallback',
        ]);

        Cache::flush();

        $this->get('/petrol-price-karachi-today')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('SEO/Petrol')
                ->where('robots', 'noindex,follow')
                ->where('isIndexable', false)
                ->where('sourceLabel', 'PakFuel city listing fallback')
                ->where('noticeTitle', null)
                ->where('dataPoints.0.value', 'PKR 320.50 per litre')
                ->where('dataPoints.1.value', 'PKR 319.00 per litre')
            );
    }

    public function test_pakwheels_audit_command_logs_differences_and_sends_alert_email(): void
    {
        Mail::fake();

        $karachi = City::query()->where('slug', 'karachi')->firstOrFail();

        PetrolPrice::query()->create([
            'city_id' => $karachi->id,
            'fuel_type' => 'petrol',
            'price_per_litre' => 321.17,
            'effective_date' => '2026-03-28',
            'source_url' => 'https://pakfuel.today/',
        ]);

        PetrolPrice::query()->create([
            'city_id' => $karachi->id,
            'fuel_type' => 'diesel',
            'price_per_litre' => 329.00,
            'effective_date' => '2026-03-28',
            'source_url' => 'https://pakfuel.today/',
        ]);

        $this->mock(PakWheelsFuelPriceScraperService::class, function ($mock): void {
            $mock->shouldReceive('scrape')
                ->once()
                ->andReturn([
                    'source_url' => 'https://www.pakwheels.com/petroleum-prices-in-pakistan',
                    'effective_date' => Carbon::parse('2026-03-29', 'Asia/Karachi'),
                    'prices' => [
                        ['fuel_type' => 'petrol', 'label' => 'Petrol', 'price' => 324.50],
                        ['fuel_type' => 'diesel', 'label' => 'High Speed Diesel', 'price' => 330.00],
                    ],
                ]);
        });

        $this->artisan('pakwheels:scrape-fuel-prices')
            ->assertExitCode(0);

        $this->assertDatabaseCount('price_audit_logs', 2);
        $this->assertDatabaseHas('price_audit_logs', [
            'source' => 'pakwheels',
            'fuel_type' => 'petrol',
            'scraped_price' => 324.50,
            'stored_price' => 321.17,
            'difference' => 3.33,
        ]);

        Mail::assertSent(FuelPriceDiscrepancyAlertMail::class, function (FuelPriceDiscrepancyAlertMail $mail): bool {
            return count($mail->discrepancies) === 1
                && $mail->sourceUrl === 'https://www.pakwheels.com/petroleum-prices-in-pakistan';
        });
    }

    public function test_refresh_command_uses_pakwheels_nationwide_backup_when_city_rows_are_unavailable(): void
    {
        $this->mock(OfficialPetrolNoticeService::class, function ($mock): void {
            $mock->shouldReceive('latestVerifiedNotice')
                ->once()
                ->andReturn(null);
        });

        $this->mock(PakFuelCityPriceScraperService::class, function ($mock): void {
            $mock->shouldReceive('scrapeAndStore')
                ->once()
                ->andReturn([
                    'stored_count' => 0,
                    'unmatched' => [],
                ]);

            foreach (config('roznamcha_seo.cities', []) as $city) {
                $mock->shouldReceive('latestCityFuel')
                    ->with($city, 'petrol')
                    ->once()
                    ->andReturn(null);
            }
        });

        $this->mock(PakWheelsFuelPriceScraperService::class, function ($mock): void {
            $mock->shouldReceive('latestFuel')
                ->with('petrol')
                ->twice()
                ->andReturn([
                    'fuel_type' => 'petrol',
                    'label' => 'Petrol',
                    'price' => 321.17,
                    'effective_date' => Carbon::parse('2026-03-29', 'Asia/Karachi'),
                    'source_url' => 'https://www.pakwheels.com/petroleum-prices-in-pakistan',
                ]);
        });

        $this->artisan('roznamcha:refresh-seo-snapshots --date=2026-03-29')
            ->assertExitCode(0);

        $this->assertDatabaseCount('seo_page_snapshots', 14);
        $this->assertDatabaseHas('seo_page_snapshots', [
            'page_type' => 'petrol',
            'page_key' => 'karachi',
            'source_label' => 'PakWheels nationwide petroleum price fallback',
        ]);

        Cache::flush();

        $this->get('/petrol-price-karachi-today')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('SEO/Petrol')
                ->where('robots', 'noindex,follow')
                ->where('isIndexable', false)
                ->where('sourceLabel', 'PakWheels live petrol feed')
                ->where('dataPoints.0.value', 'PKR 321.17 per litre')
                ->where('dataPoints.1.value', 'PKR 321.17 per litre')
                ->where('dataPoints.3.value', 'PKR 0.00')
            );
    }
}
