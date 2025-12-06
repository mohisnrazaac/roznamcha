<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

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

        Mail::to('micasony@gmail.com')->send(new ContactMessageMail(
            $data['name'],
            $data['email'],
            $data['subject'],
            $data['message']
        ));

        return redirect()
            ->route('public.contact')
            ->with('status', __('Thank you! Your message has been sent.'));
    }
}
