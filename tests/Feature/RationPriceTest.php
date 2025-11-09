<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\RationItem;
use App\Models\RationPrice;
use App\Models\User;
use App\Services\InflationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RationPriceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['roznamcha.enable_households' => true]);
    }

    public function test_delta_is_computed_between_periods(): void
    {
        [$user, $household] = $this->userWithHousehold();
        $item = RationItem::factory()->create([
            'user_id' => $user->id,
            'household_id' => $household->id,
        ]);

        RationPrice::factory()->create([
            'ration_item_id' => $item->id,
            'household_id' => $household->id,
            'price' => 100,
            'priced_at' => now()->subMonths(2)->toDateString(),
        ]);

        RationPrice::factory()->create([
            'ration_item_id' => $item->id,
            'household_id' => $household->id,
            'price' => 125,
            'priced_at' => now()->subDays(5)->toDateString(),
        ]);

        $delta = app(InflationService::class)->deltaForItem(
            $item->id,
            now()->subMonth()->startOfMonth(),
            now()
        );

        $this->assertEquals(25.0, $delta);
    }

    public function test_delta_returns_null_without_previous_price(): void
    {
        [$user, $household] = $this->userWithHousehold();
        $item = RationItem::factory()->create([
            'user_id' => $user->id,
            'household_id' => $household->id,
        ]);

        RationPrice::factory()->create([
            'ration_item_id' => $item->id,
            'household_id' => $household->id,
            'price' => 200,
            'priced_at' => now()->toDateString(),
        ]);

        $delta = app(InflationService::class)->deltaForItem(
            $item->id,
            now()->subMonth()->startOfMonth(),
            now()
        );

        $this->assertNull($delta);
    }

    private function userWithHousehold(): array
    {
        $user = User::factory()->create();
        $household = Household::factory()->create(['owner_id' => $user->id]);
        $household->users()->syncWithoutDetaching([$user->id => ['is_owner' => true]]);

        return [$user, $household];
    }
}
