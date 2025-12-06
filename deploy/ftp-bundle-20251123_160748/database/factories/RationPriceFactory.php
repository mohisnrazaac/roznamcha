<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\RationItem;
use App\Models\RationPrice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RationPrice>
 */
class RationPriceFactory extends Factory
{
    protected $model = RationPrice::class;

    public function definition(): array
    {
        return [
            'ration_item_id' => RationItem::factory(),
            'household_id' => Household::factory(),
            'price' => $this->faker->randomFloat(2, 50, 1200),
            'priced_at' => $this->faker->dateTimeBetween('-2 months', 'now'),
        ];
    }
}
