import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const sections = [
    {
        title: 'Planning content, not personal advice',
        body: 'Roznamcha publishes budgeting guides, calculators, and household-planning content for educational use. The site does not know your full circumstances, obligations, risk tolerance, or legal position.',
        bullets: [
            'Nothing on this site is personal financial, legal, tax, investment, or regulatory advice.',
            'Articles are meant to help readers ask better questions and plan more carefully.',
            'You remain responsible for verifying important decisions against official notices, contracts, bills, and local market conditions.',
        ],
    },
    {
        title: 'Rates, prices, and dates can change quickly',
        body: 'Public prices and rules discussed on the site may change after publication. This matters especially for petroleum pricing, utility tariffs, taxes, subsidy programs, and banking comparisons.',
        bullets: [
            'A historical article should not be treated as a live price notice.',
            'Always check the effective date shown on the page before relying on a number.',
            'Use official sources such as government notifications, regulators, banks, schools, and utility providers for binding decisions.',
        ],
    },
    {
        title: 'Calculator outputs are estimates',
        body: 'Roznamcha calculators use assumptions, user inputs, and simplified rules to create planning estimates. Actual bills, invoices, and household totals may differ.',
        bullets: [
            'Electricity, school, and grocery tools are designed to support planning, not guarantee exact outcomes.',
            'Taxes, fuel adjustments, local fees, discounts, or service charges may not be fully reflected.',
            'If a calculation affects a major financial choice, confirm the number from the original provider or official document.',
        ],
    },
    {
        title: 'No guarantee of savings, approval, or eligibility',
        body: 'Roznamcha does not guarantee that a reader will save money, qualify for a program, succeed in filing, or receive a particular market outcome.',
        bullets: [
            'Budget improvements depend on household behavior, prices, timing, and local conditions.',
            'Comparisons of banks, wallets, and investment products are informational snapshots, not endorsements.',
            'Government schemes, subsidies, and tax processes may change or end without notice.',
        ],
    },
];

export default function Disclaimer({ seo: seoProp, jsonLd: jsonLdProp, contactEmail = 'support@roznamcha.pk' }) {
    const seo = seoProp ?? seoContent.disclaimer;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <header className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Disclaimer</h1>
                    <p className="text-base text-slate-700">
                        Roznamcha helps with planning and comparison. It does not replace official notices, provider documents, or tailored professional advice.
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
                    <h2 className="text-xl font-semibold text-[#001a4a]">Need a correction or clarification?</h2>
                    <p className="text-base text-slate-700">
                        Email{' '}
                        <a href={`mailto:${contactEmail}`} className="font-semibold text-[#001a4a] hover:underline">
                            {contactEmail}
                        </a>{' '}
                        or use the{' '}
                        <Link href={route('public.contact')} className="font-semibold text-[#001a4a] hover:underline">
                            contact page
                        </Link>{' '}
                        if you find an outdated figure, a broken claim, or a page that needs stronger sourcing.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
