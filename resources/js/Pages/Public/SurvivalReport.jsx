import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const reportHighlights = [
    'Total income vs total expenses for the month',
    'Top spending categories such as rent, school fees, ration, fuel, and health',
    'Ration cost and the inflation impact pulled from Ration Brain',
    'Leftover balance, savings added, or gap that needs covering',
    'Trends compared to previous months so you see improvement or decline',
];

const faqs = [
    {
        question: 'Do I need to manually calculate the Survival Report?',
        answer: 'No. Once your kharcha and ration entries are recorded, Roznamcha compiles the report automatically.',
    },
    {
        question: 'Is this report auto generated?',
        answer: 'Yes, the report is generated with one click and updates whenever you add new data.',
    },
    {
        question: 'Can I export or share the report?',
        answer: 'Download a PDF or share it digitally with spouses, parents, or accountants without exposing your login.',
    },
    {
        question: 'Does the report support multiple months?',
        answer: 'You can review past months, compare trends, and keep an archive for future planning.',
    },
    {
        question: 'Does using the Survival Report cost money?',
        answer: 'It is included in the current plan. Advanced analytics may be offered as premium add-ons later.',
    },
];

export default function SurvivalReport() {
    const seo = seoContent.survivalReport;
    const jsonLd = buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Survival Report – monthly budget report for Pakistani households</h1>
                    <p className="text-base text-slate-700">
                        Survival Report is the month-end view of everything recorded in Kharcha Map, Ration Brain, reminders, and incomes. It answers
                        the question: how well did we survive this month, and what must we do before the next salary?
                    </p>
                </header>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">What is the Survival Report?</h2>
                    <p className="text-base text-slate-700">
                        It’s a combined snapshot that pulls in kharcha tracker data, ration price trends, and reminders. Instead of scattered notes,
                        you receive a single Urdu-friendly summary that shows income, expenses, savings, and risks.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">What the report shows</h2>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        {reportHighlights.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Why this matters for Pakistani families</h2>
                    <p className="text-base text-slate-700">
                        The Survival Report keeps everyone honest about the true cost of living. Families can spot when ration eats the salary,
                        understand how transport or school fees jump, and adjust before debt or qarz becomes unavoidable. It also helps those sending
                        money to parents in another city by showing exactly how funds were used.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" itemScope itemType="https://schema.org/FAQPage">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">FAQ</h2>
                    {faqs.map((faq) => (
                        <div
                            key={faq.question}
                            itemScope
                            itemProp="mainEntity"
                            itemType="https://schema.org/Question"
                            className="border border-slate-200 rounded-xl p-4 space-y-2"
                        >
                            <h3 itemProp="name" className="text-lg font-semibold text-[#001a4a]">
                                {faq.question}
                            </h3>
                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                <p itemProp="text" className="text-sm text-slate-700">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="text-sm text-[#001a4a] font-semibold space-y-2">
                    <p>
                        Keep logging spending in{' '}
                        <Link href={route('public.kharcha-map')} className="underline hover:no-underline">
                            Kharcha Map
                        </Link>{' '}
                        and ration in{' '}
                        <Link href={route('public.ration-brain')} className="underline hover:no-underline">
                            Ration Brain
                        </Link>
                        .
                    </p>
                    <p>
                        Visit the{' '}
                        <Link href={route('public.home')} className="underline hover:no-underline">
                            Home page
                        </Link>{' '}
                        to explore everything Roznamcha offers.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
