import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const sections = [
    {
        title: 'Who controls this site',
        body: 'Roznamcha.pk is an independent web application and household budgeting platform operated from Pakistan. Questions regarding data handling, corrections, consent, or account deletion can be directed to our published support team.',
        bullets: [
            'Support and compliance inquiries can be sent directly to support@roznamcha.pk.',
            'This Privacy Policy applies to the public website, educational guides, interactive calculators, and public tools on roznamcha.pk.',
            'Optional registered user accounts and saved ledgers are managed under authenticated access sessions with explicit user-initiated persistence.',
        ],
    },
    {
        title: 'Data we collect on public pages',
        body: 'We practice data minimization on all public pages. However, standard network communications inevitably generate technical metadata required to deliver and protect the service.',
        bullets: [
            'Web server logs automatically record standard request data: visitor IP addresses, browser user-agent strings, device identifiers, referring URLs, requested resources, HTTP status codes, and server timestamps.',
            'Contact form messages: When you send an inquiry via our contact form, we collect your name, email address, message body, and IP address for reply delivery and abuse prevention.',
            'Interactive calculator inputs: Numerical values entered into our public calculators (such as electricity units, ration quantities, or monthly salary figures) are processed locally in your browser. They are not stored on our servers as identifiable guest profiles.',
        ],
    },
    {
        title: 'Children’s privacy protection',
        body: 'Roznamcha is a personal finance, household budgeting, and economic analysis platform intended strictly for adult household managers, professionals, and general audiences.',
        bullets: [
            'Our website, content, and planning tools are not directed to children under the age of 13 (or under 16 in applicable jurisdictions).',
            'We do not knowingly collect, solicit, or maintain personal information from children.',
            'If you become aware that a minor has provided us with personal information without parental consent, please contact us at support@roznamcha.pk and we will promptly investigate and purge the data from our records.',
        ],
    },
    {
        title: 'Cookies, web beacons, and local storage',
        body: 'Roznamcha uses essential cookies and local browser storage to provide core technical functionality and remember security states. Third-party advertising and analytics storage are strictly governed by visitor consent.',
        bullets: [
            'Essential session cookies: We use roznamcha_session (encrypted session identifier, expiring after 120 minutes of user inactivity) and XSRF-TOKEN (session CSRF token) to secure forms and prevent cross-site request forgery.',
            'Consent storage: When you interact with our cookie preference modal, your decision is saved in browser local storage and an HTTP cookie named roznamcha_cookie_consent for 180 days to remember your choice across visits.',
            'Web beacons and scripts: Third-party advertising partners may use web beacons (small transparent pixel tags) and JavaScript scripts to measure ad performance, prevent click fraud, and detect invalid traffic on eligible pages.',
        ],
    },
    {
        title: 'Google advertising and third-party measurement',
        body: 'To fund our independent research, server hosting, and free public financial tools, we partner with Google AdSense to display advertisements on designated public content pages.',
        bullets: [
            'Third-party vendors, including Google, use cookies and web beacons to serve advertisements based on a user’s prior visits to our website or other websites across the Internet.',
            'Google’s use of advertising cookies enables it and its partners to serve relevant ads to users based on their navigation history across our site and other online properties.',
            <span>
                To understand how Google collects and uses information across partner websites and apps, review the official guide at{' '}
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
                Visitors may opt out of personalized advertising at any time by visiting{' '}
                <a
                    href="https://www.aboutads.info/choices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#001a4a] underline hover:no-underline"
                >
                    aboutads.info
                </a>{' '}
                or adjusting preferences in Google Ad Settings.
            </span>,
            'Advertising scripts and slots are strictly disabled across sensitive surfaces including login, registration, user account dashboards, legal policy pages, and noindexed blog articles.',
        ],
    },
    {
        title: 'How to manage or withdraw your consent',
        body: 'You maintain continuous control over your cookie and tracking preferences on Roznamcha.',
        bullets: [
            <span>
                You can change or withdraw your consent at any time by clicking the{' '}
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
                button located in the footer of every page.
            </span>,
            'You may also configure your web browser controls to block, refuse, or delete cookies. Blocking essential cookies may affect basic navigation and session state.',
            'If you withdraw consent, non-essential advertising and analytics scripts are withheld from executing on future page requests.',
        ],
    },
    {
        title: 'Data retention periods',
        body: 'We retain collected information only for concrete, operationally necessary periods aligned with our systems architecture:',
        bullets: [
            'Web server request logs: IP addresses and access logs are retained in automated rotating server logs for 30 to 90 days for technical debugging, DDoS mitigation, and intrusion detection, after which they are permanently overwritten.',
            'Web user sessions: Browser sessions (roznamcha_session) expire automatically after 120 minutes of user inactivity.',
            'Cookie consent records: Consent preferences (roznamcha_cookie_consent) persist for 180 days unless cleared earlier in your browser settings.',
            'Support and contact messages: Inquiries sent via the contact form or email are retained for up to 12 months to provide customer assistance and resolve audit inquiries, after which they are archived or deleted.',
            'Registered accounts: User profile data and saved kharcha logs are retained for the active lifecycle of the account. Upon receiving an account deletion request, user data is permanently erased from active databases within 30 days.',
        ],
    },
    {
        title: 'Security and infrastructure safeguards',
        body: 'We apply defense-in-depth architectural safeguards to protect user communication and infrastructure integrity without making unverifiable claims.',
        bullets: [
            'Encryption in transit: All data exchanged between your browser and our servers is strictly encrypted using industry-standard Transport Layer Security (TLS/HTTPS).',
            'Credential hashing: User account passwords are never stored in plain text; they are cryptographically hashed using salted, slow-hashing algorithms (bcrypt).',
            'Database access controls: Application databases are secured behind network firewalls with restricted credentials and principle-of-least-privilege access rules.',
            'We do not claim proprietary field-level client encryption for individual grocery calculations; instead, public tool computations occur locally in your browser sandbox.',
        ],
    },
    {
        title: 'Your choices and rights',
        body: 'Under applicable privacy principles, visitors and registered users hold enforceable rights regarding their personal data.',
        bullets: [
            'Access and portability: You may request a copy of personal information or account data you have submitted to us.',
            'Correction and rectification: If any information we maintain is inaccurate or incomplete, you can request an immediate correction.',
            'Erasure: You may request complete deletion of your account and associated financial logs, subject to statutory tax and legal requirements.',
            'To exercise any of these rights, email support@roznamcha.pk with the subject line "Privacy Rights Request".',
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
                    <p className="text-sm font-medium text-slate-500">Last updated: November 18, 2026</p>
                    <p className="text-base text-slate-700">
                        How Roznamcha handles public browsing data, protects account information through secure infrastructure and authenticated sessions, and respects your privacy choices under Pakistani and international standards.
                    </p>
                </header>

                {sections.map((section) => (
                    <article key={section.title} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                        <h2 className="text-2xl font-semibold text-[#001a4a]">{section.title}</h2>
                        <p className="text-base text-slate-700">{section.body}</p>
                        <ul className="list-disc pl-5 space-y-2 text-slate-700">
                            {section.bullets.map((point, idx) => (
                                <li key={idx}>{point}</li>
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
