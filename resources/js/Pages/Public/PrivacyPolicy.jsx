import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const sections = [
    {
        title: 'Data we collect for Pakistani households',
        body: 'To power Kharcha Map, Ration Brain, and the Survival Report we collect the minimum data required to show your rupees clearly.',
        bullets: [
            'Account information such as name, email, and optional household labels.',
            'Expense, ration, and reminder entries (amounts, categories, Urdu notes).',
            'Metadata like device type or city to diagnose bugs and improve localization.',
        ],
    },
    {
        title: 'How Roznamcha uses that information',
        body: 'Entries stay inside your encrypted Roznamcha workspace and only surface inside dashboards or reports you intentionally generate.',
        bullets: [
            'Render charts inside Kharcha Map and month-end Survival Reports.',
            'Send optional reminder emails or WhatsApp alerts about bills you configure.',
            'Analyse anonymized trends to improve insights relevant to Pakistani inflation.',
        ],
    },
    {
        title: 'Security and storage',
        body: 'We host infrastructure in reputable cloud regions with strict firewall policies. All traffic is served via HTTPS and sensitive fields are encrypted at rest.',
        bullets: [
            'Role-based permissions so only invited household members can view entries.',
            'Backups stored in Pakistan-friendly zones with retention limits.',
            'Regular reviews against PECA and international privacy expectations.',
        ],
    },
    {
        title: 'Your choices and rights',
        body: 'Roznamcha honors Pakistani residents’ rights to access, export, or delete their kharcha history.',
        bullets: [
            'Request a machine-readable export of expenses, ration logs, and reminders.',
            'Ask us to delete your account and associated data at any time.',
            'Update contact preferences or opt out of non-essential communication.',
        ],
    },
];

export default function PrivacyPolicy() {
    const seo = seoContent.privacy;
    const jsonLd = buildWebPageSchema(seo);

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
                        Email privacy@roznamcha.pk or message the{' '}
                        <Link href={route('public.contact')} className="font-semibold text-[#001a4a] hover:underline">
                            support team
                        </Link>{' '}
                        to exercise your rights or ask about compliance.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
