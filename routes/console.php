<?php

use App\Console\Commands\RoznamchaGenerateDailySnapshot;
use App\Console\Commands\SendDueReminders;
use Illuminate\Support\Facades\Schedule;

Schedule::command(SendDueReminders::class)->everyMinute();

// Run the Pakistani economic snapshot just after midnight so the Daily Return card is ready for early visitors.
Schedule::command(RoznamchaGenerateDailySnapshot::class)
    ->dailyAt('00:'.config('daily_snapshot.cron_minute', '05'))
    ->timezone(config('daily_snapshot.timezone', 'Asia/Karachi'));
