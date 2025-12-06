<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Expense;
use App\Models\Household;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'household_id' => Household::factory(),
            'category_id' => Category::factory(),
            'amount' => $this->faker->randomFloat(2, 50, 20000),
            'tx_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'note' => $this->faker->sentence(4),
        ];
    }
}
