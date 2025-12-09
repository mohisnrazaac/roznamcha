<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ContactController extends Controller
{
    public function show(Request $request): Response
    {
        $timestamp = now()->timestamp;

        return Inertia::render('Public/Contact', [
            'formTimestamp' => $timestamp,
        ]);
    }

    public function send(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:20', 'max:2000'],
            'timestamp' => ['required', 'integer'],
            'website' => ['nullable', 'string', 'max:0'],
        ], [
            'website.max' => __('Invalid submission.'),
        ]);

        if (! empty($request->input('website'))) {
            throw ValidationException::withMessages([
                'name' => __('Please try again.'),
            ]);
        }

        $submittedAt = Carbon::createFromTimestamp((int) $data['timestamp']);
        if ($submittedAt->diffInSeconds(now()) < 4) {
            throw ValidationException::withMessages([
                'name' => __('Please take a moment before submitting the form.'),
            ]);
        }

        $recipient = config('mail.contact_to', 'micasony@gmail.com');

        try {
            Mail::to($recipient)->send(new ContactMessageMail(
                $data['name'],
                $data['email'],
                $data['subject'],
                $data['message']
            ));
        } catch (Throwable $exception) {
            Log::error('contact_form_mail_failed', [
                'error' => $exception->getMessage(),
                'name' => $data['name'],
                'email' => $data['email'],
                'subject' => $data['subject'],
            ]);

            throw ValidationException::withMessages([
                'message' => __('We could not deliver your message right now. Please try again later or email support@roznamcha.pk.'),
            ]);
        }

        return redirect()
            ->route('public.contact')
            ->with('status', __('Thank you! Your message has been sent.'));
    }
}
