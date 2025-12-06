<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Household>
 */
class HouseholdFactory extends Factory
{
    protected $model = Household::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->lastName().' Household',
            'slug' => Str::slug($this->faker->unique()->userName()).'-'.Str::random(4),
            'owner_id' => User::factory(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Household $household): void {
            if ($household->owner_id && ! $household->users()->where('user_id', $household->owner_id)->exists()) {
                $household->users()->attach($household->owner_id, ['is_owner' => true]);
            }
        });
    }
}
