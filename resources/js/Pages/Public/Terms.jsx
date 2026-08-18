import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { buildWebPageSchema, seoContent } from '../../lib/seo';

const sections = [
    {
        title: '1. Acceptable Use of the Platform',
        body: 'Roznamcha is built for personal and household financial planning purposes. You agree to use the service in compliance with all applicable local laws, specifically the Prevention of Electronic Crimes Act (PECA) of Pakistan.',
        bullets: [
            'Do not input or transmit malicious code, security exploits, or spam scripts.',
            'Do not attempt to access other user workspaces or disrupt server infrastructure.',
            'The platform is intended for human household planning. Mass automated scraping of calculator rates or pages is strictly prohibited.',
        ],
    },
    {
        title: '2. Calculation Tools and Estimates',
        body: 'Roznamcha provides interactive calculators (e.g. Electricity Bill Estimator, Ration Cost Estimator, School Fees Planner, and Budget Calculator) for educational and planning support only.',
        bullets: [
            'All calculations are estimations based on progressive slab algorithms, average rates, and custom user variables.',
            'We do not guarantee that the results will exactly match your actual utility bills, tuition invoices, or grocery store receipts.',
            'Calculations do not constitute legal, tax, or professional financial advice.',
        ],
    },
    {
        title: '3. Intellectual Property and Content Ownership',
        body: 'The calculations logic, UI design, blog content, and branding elements are the exclusive intellectual property of Roznamcha.',
        bullets: [
            'You retain full ownership of the expense entries, budget numbers, and logs you enter into your workspace.',
            'You may not copy, replicate, or resell the underlying source code or tool designs of the calculators.',
        ],
    },
    {
        title: '4. Limitation of Liability',
        body: 'Roznamcha is provided "as is" without warranties of any kind. We are not responsible for any financial decisions, budget errors, or planning miscalculations resulting from the use of our tools.',
        bullets: [
            'Always consult official sources (e.g. NEPRA SROs, school administrations) before making binding financial commitments.',
            'We do not assume liability for downtime, database sync errors, or data loss.',
        ],
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
                        Review the rules, liability parameters, and tool boundaries governing the use of Roznamcha’s Pakistani budgeting platform.
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
                    <h2 className="text-xl font-semibold text-[#001a4a]">Have questions about our terms?</h2>
                    <p className="text-base text-slate-700">
                        Email{' '}
                        <a href={`mailto:${contactEmail}`} className="font-semibold text-[#001a4a] hover:underline">
                            {contactEmail}
                        </a>{' '}
                        or contact the{' '}
                        <Link href={route('public.contact')} className="font-semibold text-[#001a4a] hover:underline">
                            support desk
                        </Link>{' '}
                        for help.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
