import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const cookieTable = [
    {
        name: 'roznamcha_session',
        provider: 'Roznamcha (First-party)',
        type: 'Essential / Session',
        duration: '120 minutes of inactivity',
        purpose: 'Maintains authenticated user session or guest application state securely across requests.',
    },
    {
        name: 'XSRF-TOKEN',
        provider: 'Roznamcha (First-party)',
        type: 'Essential / Security',
        duration: 'Session',
        purpose: 'Protects visitors and form submissions against Cross-Site Request Forgery (CSRF) attacks.',
    },
    {
        name: 'roznamcha_cookie_consent',
        provider: 'Roznamcha (First-party)',
        type: 'Essential / Preference',
        duration: '180 days',
        purpose: 'Stores your consent preference choice (accepted or declined) in local storage and HTTP cookie so the banner does not repeatedly reappear.',
    },
    {
        name: '__gads, __gpi, IDE',
        provider: 'Google AdSense (Third-party)',
        type: 'Advertising (Optional)',
        duration: 'Up to 13 months',
        purpose: 'Used by Google and its certified ad partners to serve, personalize, and measure advertisements on eligible public pages after consent is granted.',
    },
];

const sections = [
    {
        title: 'What Are Cookies?',
        body: 'Cookies are compact text files and data records stored on your device by your web browser when visiting online sites. They enable websites to function properly, remember user preferences, maintain session security, and provide reporting insights.',
        bullets: [
            'First-party cookies are set directly by Roznamcha to support fundamental navigation and security features.',
            'Third-party cookies and web beacons are set by certified external partners (such as Google AdSense) on supported public content pages only after visitor permission.',
        ],
    },
    {
        title: 'Cookies & Storage Items Actually Set',
        body: 'Below is an itemized breakdown of the first-party and optional third-party cookies utilized on Roznamcha.pk:',
    },
    {
        title: 'Google AdSense & Third-Party Advertising',
        body: 'We partner with Google AdSense to serve advertisements on designated public content pages, allowing us to keep all our planning tools and articles accessible without charge.',
        bullets: [
            'Google and its third-party advertising partners use cookies and web beacons to serve ads based on your prior visits to Roznamcha.pk and other websites across the web.',
            'Google’s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.',
            <span>
                Learn how Google manages data on partner sites by visiting the official Google documentation at{' '}
                <a
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#001a4a] underline hover:no-underline"
                >
                    policies.google.com/technologies/partner-sites
                </a>
                .
            </span>,
            <span>
                You may opt out of personalized advertising by visiting Google Ad Settings or through the digital advertising industry portal at{' '}
                <a
                    href="https://www.aboutads.info/choices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#001a4a] underline hover:no-underline"
                >
                    aboutads.info
                </a>
                .
            </span>,
            'Advertising scripts are strictly suppressed on authentication pages (login, registration), user dashboards, and legal policy pages.',
        ],
    },
    {
        title: 'How to Manage or Change Your Cookie Consent',
        body: 'You have full autonomy over non-essential cookies and advertising identifiers on Roznamcha.pk.',
        bullets: [
            <span>
                You can reopen your consent choices at any time by clicking the{' '}
                <button
                    type="button"
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('roznamcha:open-consent-modal'));
                        }
                    }}
                    className="font-semibold text-[#001a4a] underline hover:no-underline cursor-pointer"
                >
                    Cookie settings
                </button>{' '}
                button available on every page.
            </span>,
            'You can also control or delete cookies directly through your browser settings. If you block essential cookies, certain features such as user login and form security may not function correctly.',
            'When you decline non-essential cookies, Google AdSense cookies and analytics trackers are withheld from loading on your device.',
        ],
    },
];

export default function CookiePolicy({ seo: seoProp, jsonLd: jsonLdProp, contactEmail = 'support@roznamcha.pk' }) {
    const seo = seoProp ?? seoContent.cookiePolicy;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    const openConsentModal = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('roznamcha:open-consent-modal'));
        }
    };

    return (
        <PublicLayout>
            <SeoHead
                title={seo.title}
                description={seo.description}
                canonical={seo.canonical}
                canonicalUrl={seo.canonical}
                keywords={seo.keywords}
                jsonLd={jsonLd}
            />

            <main className="flex-1 w-full">
                <article className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                    <header className="space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#001a4a]/70">Legal &amp; Compliance</p>
                        <h1 className="text-3xl font-bold text-[#001a4a] sm:text-4xl">Cookie Policy</h1>
                        <p className="text-sm font-medium text-slate-500">Last updated: November 18, 2026</p>
                        <p className="text-lg leading-8 text-slate-600">
                            How Roznamcha.pk uses essential cookies, local browser storage, and optional third-party advertising identifiers.
                        </p>
                    </header>

                    <div className="space-y-10">
                        {sections.map((section, idx) => (
                            <section key={section.title} className="space-y-4 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-[#001a4a]">{section.title}</h2>
                                <p className="text-base leading-7 text-slate-700">{section.body}</p>

                                {idx === 1 && (
                                    <div className="overflow-x-auto my-4">
                                        <table className="min-w-full text-left text-sm text-slate-700 border border-slate-200">
                                            <thead className="bg-slate-50 text-xs uppercase font-semibold text-[#001a4a] border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3">Cookie / Key</th>
                                                    <th className="px-4 py-3">Provider</th>
                                                    <th className="px-4 py-3">Classification</th>
                                                    <th className="px-4 py-3">Duration</th>
                                                    <th className="px-4 py-3">Purpose</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {cookieTable.map((row) => (
                                                    <tr key={row.name} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-3 font-mono text-xs font-semibold text-[#001a4a]">{row.name}</td>
                                                        <td className="px-4 py-3">{row.provider}</td>
                                                        <td className="px-4 py-3 font-medium">{row.type}</td>
                                                        <td className="px-4 py-3">{row.duration}</td>
                                                        <td className="px-4 py-3">{row.purpose}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {section.bullets && section.bullets.length > 0 && (
                                    <ul className="list-outside list-disc space-y-2 pl-5 text-base leading-7 text-slate-700">
                                        {section.bullets.map((bullet, bIdx) => (
                                            <li key={bIdx} className="pl-1 marker:text-slate-400">
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}

                        <div className="bg-[#fff9ef] border border-yellow-200 rounded-2xl p-6 sm:p-8 space-y-4">
                            <h2 className="text-xl font-bold text-[#001a4a]">Update Your Consent Preferences</h2>
                            <p className="text-base leading-7 text-slate-700">
                                You can adjust your consent settings for Roznamcha.pk at any time. Clicking the button below reopens the cookie settings modal.
                            </p>
                            <div>
                                <button
                                    type="button"
                                    onClick={openConsentModal}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#001a4a] hover:bg-[#002a7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001a4a] cursor-pointer"
                                >
                                    Open Cookie Settings
                                </button>
                            </div>
                        </div>

                        <section className="space-y-4 rounded-2xl bg-slate-50 p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-[#001a4a]">Still have questions?</h2>
                            <p className="text-base leading-7 text-slate-700">
                                If you have any questions about our use of cookies or privacy practices, please contact our team at{' '}
                                <a href={`mailto:${contactEmail}`} className="font-semibold text-[#001a4a] hover:underline">
                                    {contactEmail}
                                </a>{' '}
                                or message our{' '}
                                <Link href={route('public.contact')} className="font-semibold text-[#001a4a] hover:underline">
                                    contact page
                                </Link>
                                .
                            </p>
                        </section>
                    </div>
                </article>
            </main>
        </PublicLayout>
    );
}
