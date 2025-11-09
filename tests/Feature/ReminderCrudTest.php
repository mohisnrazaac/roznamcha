<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\Reminder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReminderCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['roznamcha.enable_households' => true]);
    }

    public function test_user_can_create_and_toggle_reminders(): void
    {
        [$user, $household] = $this->userWithHousehold();

        $payload = [
            'title' => 'BP Medicine',
            'type' => 'health',
            'schedule_cron' => '0 20 * * *',
            'starts_on' => now()->toDateString(),
            'ends_on' => null,
            'timezone' => 'Asia/Karachi',
            'is_active' => true,
            'notes' => 'Daily after dinner',
        ];

        $this->actingAs($user)
            ->post(route('panel.reminders.store'), $payload)
            ->assertRedirect(route('panel.reminders.index'));

        $reminder = Reminder::first();
        $this->assertNotNull($reminder);
        $this->assertTrue($reminder->is_active);
        $this->assertSame('0 20 * * *', $reminder->schedule_cron);
        $this->assertNotNull($reminder->next_run_at);
        $this->assertSame('Asia/Karachi', $reminder->timezone);

        $this->post(route('panel.reminders.toggle', $reminder->id))
            ->assertRedirect();

        $this->assertFalse($reminder->fresh()->is_active);

        $this->delete(route('panel.reminders.destroy', $reminder->id))
            ->assertRedirect(route('panel.reminders.index'));

        $this->assertDatabaseMissing('reminders', ['id' => $reminder->id]);
    }

    private function userWithHousehold(): array
    {
        $user = User::factory()->create();
        $household = Household::factory()->create(['owner_id' => $user->id]);
        $household->users()->syncWithoutDetaching([$user->id => ['is_owner' => true]]);

        return [$user, $household];
    }
}
