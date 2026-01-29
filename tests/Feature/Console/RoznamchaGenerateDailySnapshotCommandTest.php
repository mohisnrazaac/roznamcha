<?php

namespace Tests\Feature\Console;

use App\Models\DailyMoneySnapshot;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Verifies the midnight automation keeps serving the Daily Return experience without data loss.
 */
class RoznamchaGenerateDailySnapshotCommandTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_generates_a_snapshot_when_sources_are_available(): void
    {
        config()->set('daily_snapshot.sources', [
            'cpi' => 'https://example.test/cpi',
            'spi' => 'https://example.test/spi',
            'fuel' => 'https://example.test/fuel',
            'utility' => 'https://example.test/utility',
            'currency' => 'https://example.test/currency',
        ]);

        Http::fake([
            'https://example.test/cpi' => Http::response([[], [['value' => 28.4]]], 200),
            'https://example.test/spi' => Http::response(['latest' => ['value' => 0.4]], 200),
            'https://example.test/fuel' => Http::response(['average' => ['petrol' => 282.3]], 200),
            'https://example.test/utility' => Http::response(['average' => 5200], 200),
            'https://example.test/currency' => Http::response(['pkr' => 278.25], 200),
        ]);

        $this->artisan('roznamcha:generate-daily-snapshot')
            ->assertExitCode(0);

        $this->assertDatabaseCount('daily_money_snapshots', 1);

        $snapshot = DailyMoneySnapshot::first();
        $this->assertNotNull($snapshot->source_metadata);
        $this->assertEquals(now()->toDateString(), $snapshot->snapshot_date->toDateString());
    }

    #[Test]
    public function it_leaves_existing_data_when_apis_fail(): void
    {
        $yesterday = now()->subDay()->toDateString();

        DailyMoneySnapshot::create([
            'snapshot_date' => $yesterday,
            'expense_summary_text' => 'existing',
            'inflation_status_text' => 'existing',
            'saving_tip_text' => 'existing',
            'today_update_line' => 'existing',
            'yesterday_change_line' => 'existing',
        ]);

        config()->set('daily_snapshot.sources', [
            'cpi' => null,
            'spi' => null,
            'fuel' => null,
            'utility' => null,
            'currency' => null,
        ]);

        $this->artisan('roznamcha:generate-daily-snapshot')
            ->assertExitCode(1);

        $this->assertDatabaseCount('daily_money_snapshots', 1);
        $this->assertDatabaseHas('daily_money_snapshots', [
            'snapshot_date' => Carbon::parse($yesterday)->toDateTimeString(),
            'expense_summary_text' => 'existing',
        ]);
    }
}
