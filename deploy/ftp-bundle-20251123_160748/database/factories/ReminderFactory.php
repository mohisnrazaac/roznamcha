<?php

namespace Database\Factories;

use App\Models\Household;
use App\Models\Reminder;
use App\Models\User;
use App\Support\ReminderScheduler;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reminder>
 */
class ReminderFactory extends Factory
{
    protected $model = Reminder::class;

    public function definition(): array
    {
        $types = ['finance', 'health', 'faith', 'other'];

        $timezone = config('app.timezone');
        $cron = '0 '.$this->faker->numberBetween(0, 23).' * * *';
        $start = Carbon::now($timezone)->toDateString();

        $type = $this->faker->randomElement($types);

        return [
            'user_id' => User::factory(),
            'household_id' => Household::factory(),
            'title' => $this->faker->sentence(3),
            'type' => $type,
            'reminder_type' => $type,
            'schedule_cron' => $cron,
            'starts_on' => $start,
            'ends_on' => null,
            'timezone' => $timezone,
            'next_run_at' => ReminderScheduler::nextRun(
                $cron,
                $timezone,
                Carbon::parse($start, $timezone)
            ),
            'is_active' => true,
            'notes' => $this->faker->sentence(),
        ];
    }
}
