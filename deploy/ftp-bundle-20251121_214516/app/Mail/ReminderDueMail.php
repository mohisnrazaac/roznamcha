<?php

namespace App\Mail;

use App\Models\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReminderDueMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Reminder $reminder)
    {
    }

    public function build(): self
    {
        $subject = 'Reminder: '.$this->reminder->title;

        return $this->subject($subject)
            ->markdown('emails.reminders.due', [
                'reminder' => $this->reminder,
            ]);
    }
}
