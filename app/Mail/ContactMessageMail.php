<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $subjectLine,
        public string $messageBody
    ) {
    }

    public function build(): self
    {
        return $this->subject('[Roznamcha Contact] '.$this->subjectLine)
            ->view('emails.contact.message')
            ->with([
                'name' => $this->name,
                'email' => $this->email,
                'subjectLine' => $this->subjectLine,
                'messageBody' => $this->messageBody,
            ]);
    }
}
