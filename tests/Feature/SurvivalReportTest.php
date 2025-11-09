<?php

namespace Tests\Feature;

use App\Models\Expense;
use App\Models\Household;
use App\Models\User;
use App\Services\Reports\SurvivalReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SurvivalReportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['roznamcha.enable_households' => true]);
    }

    public function test_pdf_file_is_created(): void
    {
        Storage::fake('public');

        [$user, $household] = $this->userWithHousehold();

        Expense::factory()->count(2)->create([
            'user_id' => $user->id,
            'household_id' => $household->id,
            'tx_date' => now()->toDateString(),
            'amount' => 500,
        ]);

        $service = app(SurvivalReportService::class);
        $month = now()->startOfMonth();
        $url = $service->generate($user, $household, $month);

        $this->assertNotEmpty($url);
        $expectedPath = sprintf(
            'reports/household-%s/survival-%s.pdf',
            $household->id,
            $month->format('Ym')
        );

        Storage::disk('public')->assertExists($expectedPath);
        $this->assertTrue(Storage::disk('public')->size($expectedPath) > 0);
    }

    public function test_pdf_generation_without_households(): void
    {
        config(['roznamcha.enable_households' => false]);
        Storage::fake('public');

        $user = User::factory()->create();

        Expense::factory()->create([
            'user_id' => $user->id,
            'tx_date' => now()->toDateString(),
            'amount' => 750,
        ]);

        $service = app(SurvivalReportService::class);
        $month = now()->startOfMonth();
        $url = $service->generate($user, null, $month);

        $this->assertNotEmpty($url);
        $expectedPath = sprintf(
            'reports/user-%s/survival-%s.pdf',
            $user->id,
            $month->format('Ym')
        );

        Storage::disk('public')->assertExists($expectedPath);
    }

    private function userWithHousehold(): array
    {
        $user = User::factory()->create();
        $household = Household::factory()->create(['owner_id' => $user->id]);
        $household->users()->syncWithoutDetaching([$user->id => ['is_owner' => true]]);

        return [$user, $household];
    }
}
