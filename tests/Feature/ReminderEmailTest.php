<?php

namespace Tests\Feature;

use App\Jobs\SendReminderEmail;
use App\Mail\ReminderDueMail;
use App\Models\Reminder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ReminderEmailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['roznamcha.enable_households' => false]);
    }

    public function test_due_reminders_are_dispatched_and_rescheduled(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $reminder = Reminder::factory()->create([
            'user_id' => $user->id,
            'schedule_cron' => '*/5 * * * *',
            'timezone' => 'UTC',
            'next_run_at' => now('UTC')->subMinute(),
            'is_active' => true,
        ]);

        $this->artisan('reminders:send-due')
            ->assertExitCode(0);

        Queue::assertPushed(SendReminderEmail::class, function ($job) use ($reminder) {
            return $job->reminderId === $reminder->id;
        });

        $this->assertTrue($reminder->fresh()->next_run_at->greaterThan(now()));
    }

    public function test_send_reminder_email_job_sends_mail(): void
    {
        Mail::fake();

        $user = User::factory()->create(['email' => 'test@example.com']);
        $reminder = Reminder::factory()->create([
            'user_id' => $user->id,
            'schedule_cron' => '0 12 * * *',
            'timezone' => 'UTC',
            'next_run_at' => now('UTC'),
            'is_active' => true,
        ]);

        (new SendReminderEmail($reminder->id))->handle();

        Mail::assertSent(ReminderDueMail::class, function ($mail) use ($reminder) {
            return $mail->reminder->is($reminder);
        });

        $this->assertNotNull($reminder->fresh()->last_notified_at);
    }
}
