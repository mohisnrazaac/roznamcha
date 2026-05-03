<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageMail;
use App\Seo\SeoPageUrlGenerator;
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
    public function __construct(
        private readonly SeoPageUrlGenerator $urlGenerator,
    ) {
    }

    public function show(Request $request): Response
    {
        $timestamp = now()->timestamp;
        $url = $this->urlGenerator->routeUrl('public.contact');
        $siteUrl = $this->urlGenerator->baseUrl();
        $publicContactEmail = (string) config('mail.public_contact_email', 'support@roznamcha.pk');
        $seo = [
            'title' => 'Contact Roznamcha.pk',
            'description' => 'Contact Roznamcha.pk for support, feedback, corrections, and partnership inquiries related to household budgeting tools.',
            'url' => $url,
            'canonical' => $url,
            'type' => 'website',
        ];

        return Inertia::render('Public/Contact', [
            'formTimestamp' => $timestamp,
            'contactEmail' => $publicContactEmail,
            'seo' => $seo,
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'ContactPage',
                '@id' => "{$url}#webpage",
                'name' => $seo['title'],
                'url' => $url,
                'description' => $seo['description'],
                'email' => $publicContactEmail,
                'inLanguage' => 'en',
                'mainEntity' => [
                    '@type' => 'Organization',
                    'name' => 'Roznamcha',
                    'email' => $publicContactEmail,
                    'url' => $siteUrl,
                ],
                'isPartOf' => [
                    '@id' => "{$siteUrl}#website",
                ],
            ],
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

        $recipient = (string) config('mail.contact_to', config('mail.public_contact_email', 'support@roznamcha.pk'));

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
                'message' => __('We could not deliver your message right now. Please try again later or email :email.', [
                    'email' => (string) config('mail.public_contact_email', 'support@roznamcha.pk'),
                ]),
            ]);
        }

        return redirect()
            ->route('public.contact')
            ->with('status', __('Thank you! Your message has been sent.'));
    }
}
