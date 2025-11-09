<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Expense;
use App\Models\Household;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['roznamcha.enable_households' => true]);
    }

    public function test_user_can_create_update_and_delete_expense(): void
    {
        [$user, $household] = $this->userWithHousehold();
        $category = Category::factory()->create();

        $this->actingAs($user)
            ->post(route('panel.kharcha.store'), [
                'amount' => 1999,
                'tx_date' => now()->toDateString(),
                'category_id' => $category->id,
                'note' => 'Utility Store',
            ])
            ->assertRedirect(route('panel.kharcha.index'));

        $expense = Expense::first();

        $this->assertNotNull($expense);
        $this->assertEquals($household->id, $expense->household_id);

        $this->put(route('panel.kharcha.update', $expense->id), [
            'amount' => 2500,
            'tx_date' => now()->toDateString(),
            'category_id' => $category->id,
            'note' => 'Updated',
        ])->assertRedirect(route('panel.kharcha.index'));

        $this->assertDatabaseHas('expenses', [
            'id' => $expense->id,
            'note' => 'Updated',
        ]);

        $this->delete(route('panel.kharcha.destroy', $expense->id))
            ->assertRedirect(route('panel.kharcha.index'));

        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }

    public function test_filters_limit_results(): void
    {
        [$user, $household] = $this->userWithHousehold();
        $categoryA = Category::factory()->create();
        $categoryB = Category::factory()->create();

        Expense::factory()->create([
            'user_id' => $user->id,
            'household_id' => $household->id,
            'category_id' => $categoryA->id,
            'tx_date' => now()->subDays(2)->toDateString(),
            'note' => 'Atta',
        ]);

        Expense::factory()->create([
            'user_id' => $user->id,
            'household_id' => $household->id,
            'category_id' => $categoryB->id,
            'tx_date' => now()->toDateString(),
            'note' => 'Fuel',
        ]);

        $response = $this->actingAs($user)
            ->get(route('panel.kharcha.index', [
                'category' => $categoryA->id,
                'from' => now()->subDays(3)->toDateString(),
                'to' => now()->subDay()->toDateString(),
            ]));

        $response->assertOk();
        $this->assertStringContainsString('Atta', $response->getContent());
    }

    private function userWithHousehold(): array
    {
        $user = User::factory()->create();
        $household = Household::factory()->create(['owner_id' => $user->id]);
        $household->users()->syncWithoutDetaching([$user->id => ['is_owner' => true]]);

        return [$user, $household];
    }
}
