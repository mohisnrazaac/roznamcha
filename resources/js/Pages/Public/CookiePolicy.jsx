import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const sections = [
    {
        title: 'What Are Cookies?',
        body: 'Cookies are small text files placed on your computer or mobile device when you visit our website. They are widely used to make websites work efficiently, as well as to provide reporting information and personalized experiences.',
        bullets: [
            'First-party cookies are set by us to ensure the site functions properly.',
            'Third-party cookies are set by our partners (like Google AdSense or Analytics) to deliver advertisements and track site usage.',
        ],
    },
    {
        title: 'How We Use Cookies',
        body: 'Roznamcha uses cookies for several purposes, primarily focusing on essential functionality, analytics, and advertising.',
        bullets: [
            'Essential Cookies: Required for core site functionality like remembering your session if you log in or keeping track of your cookie consent preferences.',
            'Performance/Analytics Cookies: Used to understand how visitors interact with our website so we can improve content and tools.',
            'Advertising Cookies: We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website or other websites.',
        ],
    },
    {
        title: 'Google AdSense & Third-Party Cookies',
        body: 'We partner with Google AdSense to monetize our content so we can keep our tools free.',
        bullets: [
            'Google\'s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.',
            'You may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads).',
            'Alternatively, you can opt out of a third-party vendor\'s use of cookies for personalized advertising by visiting www.aboutads.info.',
        ],
    },
    {
        title: 'Managing Your Cookie Preferences',
        body: 'You have the right to decide whether to accept or reject non-essential cookies.',
        bullets: [
            'You can set or amend your web browser controls to accept or refuse cookies.',
            'If you choose to reject cookies, you may still use our website, but access to some functionality and areas may be restricted.',
            'You can update your cookie consent settings on our site at any time using the Cookie Preferences link in the footer.',
        ],
    }
];

export default function CookiePolicy({ seo: seoProp, jsonLd: jsonLdProp, contactEmail = 'support@roznamcha.pk' }) {
    const seo = seoProp ?? seoContent.cookiePolicy;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout>
            <SeoHead
                title={seo.title}
                description={seo.description}
                canonicalUrl={seo.canonical}
                keywords={seo.keywords}
                jsonLd={jsonLd}
            />

            <main className="flex-1 w-full">
                <article className="mx-auto max-w-3xl space-y-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                    <header className="space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#001a4a]/70">Legal</p>
                        <h1 className="text-3xl font-bold text-[#001a4a] sm:text-4xl">Cookie Policy</h1>
                        <p className="text-lg leading-8 text-slate-600">
                            How we use cookies and tracking technologies at Roznamcha.pk.
                        </p>
                    </header>

                    <div className="space-y-12">
                        {sections.map((section) => (
                            <section key={section.title} className="space-y-4">
                                <h2 className="text-2xl font-bold text-[#001a4a]">{section.title}</h2>
                                <p className="text-base leading-7 text-slate-700">{section.body}</p>
                                {section.bullets && section.bullets.length > 0 && (
                                    <ul className="list-outside list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                                        {section.bullets.map((bullet, idx) => (
                                            <li key={idx} className="pl-1 marker:text-slate-400">
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}

                        <section className="space-y-4 rounded-2xl bg-slate-50 p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-[#001a4a]">Still have questions?</h2>
                            <p className="text-base leading-7 text-slate-700">
                                If you have any questions about our use of cookies or other technologies, please email us at{' '}
                                <a href={`mailto:${contactEmail}`} className="font-semibold text-[#001a4a] hover:underline">
                                    {contactEmail}
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </article>
            </main>
        </PublicLayout>
    );
}
