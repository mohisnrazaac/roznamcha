<?php

namespace App\Console\Commands;

use App\Jobs\SendReminderEmail;
use App\Models\Reminder;
use App\Support\ReminderScheduler;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;

class SendDueReminders extends Command
{
    protected $signature = 'reminders:send-due {--dry-run : Do not enqueue emails, just log matches}';

    protected $description = 'Dispatch email reminders that are due based on their cron schedule.';

    public function handle(): int
    {
        if (! Schema::hasColumn('reminders', 'schedule_cron')
            || ! Schema::hasColumn('reminders', 'timezone')
            || (! Schema::hasColumn('reminders', 'next_run_at') && ! Schema::hasColumn('reminders', 'next_due'))
        ) {
            $this->error('Reminder scheduling columns are missing. Please run `php artisan migrate` to add schedule_cron/timezone/next_run_at before dispatching emails.');
            return self::FAILURE;
        }

        $activeColumn = $this->activeColumn();
        $nextRunColumn = Schema::hasColumn('reminders', 'next_run_at') ? 'next_run_at' : 'next_due';

        $dueReminders = Reminder::query()
            ->when($activeColumn, function ($query) use ($activeColumn) {
                if (in_array($activeColumn, ['is_active', 'is_done'], true)) {
                    $value = $activeColumn === 'is_done' ? false : true;
                    $query->where($activeColumn, $value);
                }

                return $query;
            })
            ->whereNotNull('schedule_cron')
            ->whereNotNull('timezone')
            ->whereNotNull($nextRunColumn)
            ->where($nextRunColumn, '<=', now('UTC'))
            ->get();

        if ($dueReminders->isEmpty()) {
            $this->info('No reminders due at this time.');
            return self::SUCCESS;
        }

        foreach ($dueReminders as $reminder) {
            $this->info("Dispatching reminder #{$reminder->id} ({$reminder->title})");

            if (! $this->option('dry-run')) {
                SendReminderEmail::dispatch($reminder->id);
            }

            $nextRun = ReminderScheduler::nextRun(
                $reminder->schedule_cron,
                $reminder->timezone ?? config('app.timezone'),
                $reminder->starts_on ?? null,
                $reminder->ends_on ?? null,
            );

            $reminder->forceFill([$nextRunColumn => $nextRun])->save();
        }

        return self::SUCCESS;
    }

    private function activeColumn(): ?string
    {
        if (Schema::hasColumn('reminders', 'is_active')) {
            return 'is_active';
        }

        if (Schema::hasColumn('reminders', 'is_done')) {
            return 'is_done';
        }

        if (Schema::hasColumn('reminders', 'status')) {
            return 'status';
        }

        return null;
    }
}
