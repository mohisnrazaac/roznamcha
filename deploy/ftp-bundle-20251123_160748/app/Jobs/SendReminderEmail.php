<?php

namespace App\Jobs;

use App\Mail\ReminderDueMail;
use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendReminderEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $reminderId)
    {
    }

    public function handle(): void
    {
        $reminder = Reminder::with('user')->find($this->reminderId);
        if (! $reminder || ! $reminder->user || ! $reminder->is_active) {
            return;
        }

        Mail::to($reminder->user->email)->send(new ReminderDueMail($reminder));

        $reminder->forceFill(['last_notified_at' => now('UTC')])->save();
    }
}
