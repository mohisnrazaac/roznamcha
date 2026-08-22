import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const sections = [
    {
        title: 'Who controls this site',
        body: 'Roznamcha.pk is the public website for Roznamcha. Questions about privacy, corrections, consent, or account data can be sent to our published support contact.',
        bullets: [
            'Public-site questions can be sent to support@roznamcha.pk.',
            'This policy covers the public website, public tools, and marketing pages.',
            'Separate account-level records may be created if you sign up and choose to save data inside the app.',
        ],
    },
    {
        title: 'Data we collect on public pages',
        body: 'We try to keep public-page collection limited, but some information is still processed automatically when you load a web page.',
        bullets: [
            'Server logs may include IP address, browser type, device information, requested URL, referrer, and timestamp.',
            'If you contact us, we receive the information you enter in the contact form or email.',
            'If you create an account, we collect the information needed to provide that account and the data you choose to store.',
        ],
    },
    {
        title: 'How we use that information',
        body: 'We use public-site data to deliver pages, keep the site secure, answer support requests, and understand whether the public pages are working.',
        bullets: [
            'Serve requested pages and files and protect the site from abuse or technical failure.',
            'Measure whether public pages, guides, and tools are being used and whether they are working correctly.',
            'Respond to support, correction, and compliance requests you send us.',
        ],
    },
    {
        title: 'Cookies, local storage, and similar technologies',
        body: 'Roznamcha uses essential browser storage for basic site behavior. Optional advertising and analytics storage is held back until the visitor allows it on supported public pages.',
        bullets: [
            'Essential storage may be used for security, session handling, and core site behavior.',
            'Optional cookies or similar identifiers may be used by Google and measurement providers only after the visitor allows them on this device.',
            'Your browser may also store the local consent choice so the site can remember it.',
        ],
    },
    {
        title: 'Google advertising and third-party measurement',
        body: 'When advertising is enabled on an eligible public page and the visitor has allowed it, Google may process cookies, web beacons, IP address, and similar identifiers to deliver and measure ads.',
        bullets: [
            'Google may use advertising cookies to show, limit, measure, and report ads.',
            'Google and its partners may use information from this and other sites to personalize ads if the visitor has allowed that use.',
            'Microsoft Clarity and Google Analytics may be used for site measurement only after the visitor has allowed optional measurement on supported public pages.',
        ],
    },
    {
        title: 'Consent choices and EEA, UK, Switzerland handling',
        body: 'Optional advertising and analytics are not meant to load until the visitor has made a consent choice on the public site. Visitors can keep essential-only settings or allow optional advertising and measurement on supported pages.',
        bullets: [
            'Visitors in the EEA, UK, and Switzerland may see additional consent requirements before optional Google advertising is allowed.',
            'You can choose essential-only settings and continue using the public site without allowing optional ads or analytics.',
            'You can change your browser-stored choice by clearing the consent state on your device or by contacting us if you need help.',
        ],
    },
    {
        title: 'Retention, sharing, and legal requests',
        body: 'We keep information only as long as reasonably needed for operations, support, legal compliance, and security.',
        bullets: [
            'We may share data with hosting, security, analytics, email, and advertising providers that help us operate the site.',
            'We may preserve or disclose information when required by law, lawful process, or a legitimate security need.',
            'We do not promise fixed retention periods here unless they are operationally enforced.',
        ],
    },
    {
        title: 'Your choices and rights',
        body: 'You can contact us to ask for correction, deletion, export, or clarification about data you have submitted to us.',
        bullets: [
            'You can ask us what contact-form or account information we hold about you.',
            'You can request deletion of account data, subject to legal or security retention needs.',
            'You can review Google ad controls through Google Ads Settings and similar provider controls.',
        ],
    },
];

export default function PrivacyPolicy({ seo: seoProp, jsonLd: jsonLdProp, contactEmail = 'support@roznamcha.pk' }) {
    const seo = seoProp ?? seoContent.privacy;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <header className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Privacy Policy</h1>
                    <p className="text-base text-slate-700">
                        See how we secure kharcha logs, encrypt ration records, and stay transparent with Pakistani households who trust us to run
                        their Urdu-first budgeting workflows.
                    </p>
                </header>

                {sections.map((section) => (
                    <article key={section.title} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                        <h2 className="text-2xl font-semibold text-[#001a4a]">{section.title}</h2>
                        <p className="text-base text-slate-700">{section.body}</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-700">
                            {section.bullets.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </article>
                ))}

                <div className="bg-[#fff9ef] border border-yellow-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-semibold text-[#001a4a]">Need clarification?</h2>
                    <p className="text-base text-slate-700">
                        Email{' '}
                        <a href={`mailto:${contactEmail}`} className="font-semibold text-[#001a4a] hover:underline">
                            {contactEmail}
                        </a>{' '}
                        or message the{' '}
                        <Link href={route('public.contact')} className="font-semibold text-[#001a4a] hover:underline">
                            support team
                        </Link>{' '}
                        to ask about privacy, consent, corrections, or your data.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
