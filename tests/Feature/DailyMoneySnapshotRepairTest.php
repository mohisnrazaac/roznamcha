<?php
// Purpose: Verify the patched Daily Snapshot service can parse the live World Bank, PBS, and currency feed shapes. Date: 2026-03-28. Author: Codex.

namespace Tests\Feature;

use App\Models\DailyMoneySnapshot;
use App\Services\DailyMoneySnapshotService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DailyMoneySnapshotRepairTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_generates_a_snapshot_from_world_bank_pbs_and_the_new_currency_feed(): void
    {
        config()->set('daily_snapshot.sources', [
            'cpi' => 'https://example.test/cpi',
            'spi' => 'https://example.test/spi',
            'fuel' => null,
            'utility' => null,
            'currency' => 'https://example.test/currency',
        ]);

        Http::fake([
            'https://example.test/cpi' => Http::response([
                ['page' => 1],
                [
                    ['date' => '2025', 'value' => null],
                    ['date' => '2024', 'value' => 12.6325318530452],
                ],
            ], 200),
            'https://example.test/spi' => Http::response(<<<'HTML'
                <script>
                    function drawSPIChart() {
                        Highcharts.chart('spi-chart-container', {
                            xAxis: {
                                categories: ['18-03-2026', '26-03-2026'],
                                labels: { rotation: -45 }
                            },
                            series: [
                                {
                                    name: 'Combined',
                                    data: [5.77, 7.02]
                                }
                            ]
                        });
                    }
                </script>
                HTML, 200),
            'https://example.test/currency' => Http::response([
                'date' => '2026-03-28',
                'usd' => [
                    'pkr' => 279.20360802,
                ],
            ], 200),
        ]);

        $snapshot = app(DailyMoneySnapshotService::class)->generate();

        $this->assertInstanceOf(DailyMoneySnapshot::class, $snapshot);
        $this->assertDatabaseCount('daily_money_snapshots', 1);
        $this->assertSame(12.6325318530452, data_get($snapshot->source_metadata, 'inflation.value'));
        $this->assertSame(7.02, data_get($snapshot->source_metadata, 'spi.value'));
        $this->assertSame('26-03-2026', data_get($snapshot->source_metadata, 'spi.as_of'));
        $this->assertSame(279.20360802, data_get($snapshot->source_metadata, 'currency.value'));
        $this->assertNotEmpty($snapshot->today_update_line);
    }
}
