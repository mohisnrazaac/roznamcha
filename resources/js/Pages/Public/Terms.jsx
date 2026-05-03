import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const sections = [
    {
        title: 'Service overview',
        body: 'Roznamcha provides an Urdu-first budgeting, ration, and reminder platform for Pakistani households and NGOs. Free and paid tiers share these core rules.',
    },
    {
        title: 'Accounts and access',
        body: 'You are responsible for keeping passwords secret and for inviting only trusted family members or colleagues into your household workspace.',
        bullets: [
            'You must be at least 18 or have guardian consent to create an account.',
            'Notify us immediately if you suspect unauthorized access.',
            'Do not share login credentials publicly or resell access.',
        ],
    },
    {
        title: 'Billing and upgrades',
        body: 'Some automation features may require a paid subscription. Fees are quoted in PKR, billed monthly or annually, and are non-refundable unless required by law.',
        bullets: [
            'Taxes, if applicable, will be added to invoices.',
            'Failure to pay may pause access to premium modules but will not delete your data automatically.',
            'We will notify you at least 30 days before pricing changes.',
        ],
    },
    {
        title: 'Acceptable use',
        body: 'Roznamcha is intended for legitimate household or NGO budgeting. Do not upload illegal content, spam other users, or misuse data scraped from other services.',
    },
    {
        title: 'Data and intellectual property',
        body: 'You own the data you enter. Roznamcha owns the software and content but grants you a non-transferable license to use the platform within these terms.',
    },
];

export default function Terms({ seo: seoProp, jsonLd: jsonLdProp, contactEmail = 'support@roznamcha.pk' }) {
    const seo = seoProp ?? seoContent.terms;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <header className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Terms of Service</h1>
                    <p className="text-base text-slate-700">
                        These terms explain how Roznamcha operates, what you can expect from us, and how Pakistani households should use the kharcha,
                        ration, and survival report platform responsibly.
                    </p>
                </header>

                {sections.map((section) => (
                    <article key={section.title} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                        <h2 className="text-2xl font-semibold text-[#001a4a]">{section.title}</h2>
                        <p className="text-base text-slate-700">{section.body}</p>
                        {section.bullets && (
                            <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                {section.bullets.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}

                <div className="bg-[#fff9ef] border border-yellow-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-semibold text-[#001a4a]">Questions or disputes</h2>
                    <p className="text-base text-slate-700">
                        Contact{' '}
                        <a href={`mailto:${contactEmail}`} className="text-[#001a4a] font-semibold hover:underline">
                            {contactEmail}
                        </a>{' '}
                        or message the{' '}
                        <Link href={route('public.contact')} className="font-semibold text-[#001a4a] hover:underline">
                            support desk
                        </Link>{' '}
                        for escalations. We aim to resolve Pakistani user issues within 14 working days.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
