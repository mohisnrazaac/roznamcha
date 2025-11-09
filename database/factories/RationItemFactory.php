<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\RationItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RationItem>
 */
class RationItemFactory extends Factory
{
    protected $model = RationItem::class;

    public function definition(): array
    {
        $units = ['kg', 'litre', 'packet'];

        return [
            'user_id' => User::factory(),
            'household_id' => Household::factory(),
            'name' => ucfirst($this->faker->word()),
            'unit' => $this->faker->randomElement($units),
            'is_active' => true,
        ];
    }
}
