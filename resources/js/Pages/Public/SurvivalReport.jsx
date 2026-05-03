import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const keyQuestions = [
    'Did the household stay within its real monthly limit or drift past it?',
    'Which categories created the biggest squeeze this month?',
    'Is spending rising compared with the previous month, or stabilising?',
];

const reportSignals = [
    {
        title: 'Total monthly spend',
        body: 'The report sums what was recorded for the selected month so the household sees one honest rupee total instead of scattered guesses.',
    },
    {
        title: 'Average daily spend',
        body: 'It turns the month into a daily run rate, which helps families see whether the money pressure is concentrated or steadily leaking out.',
    },
    {
        title: 'Month-over-month change',
        body: 'If the previous month has data, the report shows whether spending moved up or down and by how much.',
    },
    {
        title: 'Category breakdown',
        body: 'It highlights the biggest cost buckets so the family can see whether rent, school, transport, utilities, or groceries are driving the squeeze.',
    },
    {
        title: 'Previous-month baseline',
        body: 'When the previous month exists, the report shows whether spending is moving up or down instead of forcing the household to rely on memory.',
    },
];

const examples = [
    {
        title: 'School-fee month quietly breaks the budget',
        body: 'A family sees that total spend jumped versus last month, and the category breakdown shows school costs moved ahead of groceries and utilities. That is the signal to reserve earlier next month instead of treating the fee as a surprise.',
    },
    {
        title: 'Daily leakage matters more than one big bill',
        body: 'The total may look manageable, but the daily average shows spending never really slowed. That tells the household to review transport, snacks, delivery, and top-up habits before the next month starts.',
    },
    {
        title: 'The pressure is mostly in one category',
        body: 'If rent and ration are taking the largest share, the report makes that visible quickly. That is more useful than arguing in general terms about why the month felt tight.',
    },
];

const methodologyPoints = [
    'The report uses the selected month and the expenses already recorded in the workspace.',
    'It calculates a monthly total, an average daily spend figure, a category breakdown, and a month-over-month change when the previous month exists.',
    'It works best as a month-end review and comparison tool, not as a forward forecast.',
];

const limitPoints = [
    'It cannot see cash spending or bills that were never recorded.',
    'It cannot know exact future prices, exact future utility bills, or shocks that have not happened yet.',
    'Category quality depends on how honestly the household records its own spending.',
];

const planningSteps = [
    'Use Kharcha Map during the month so the report has real numbers to work with.',
    'Review the report near month-end to see the total, biggest categories, and whether spending rose or fell against the previous month.',
    'Turn the findings into action for the next month: trim one leaking category, reserve for a known fee, or test the ration and utility pressure separately.',
];

const relatedLinks = [
    {
        title: 'Kharcha Map',
        href: '/kharcha-map',
        body: 'Start here if you need the underlying expense record that feeds a monthly survival view.',
    },
    {
        title: 'Ration Cost Estimator',
        href: '/tools/ration-cost-estimator',
        body: 'Pressure-test the grocery side of the month before the market trip forces reactive cuts.',
    },
    {
        title: 'School Fees Planner',
        href: '/tools/school-fees-planner',
        body: 'Reserve for tuition, annual charges, and exam fees instead of letting one school payment distort the whole month.',
    },
];

const faqs = [
    {
        question: 'Do I need an account to generate my own Survival Report?',
        answer: 'Yes. The public page explains the report, but your own report depends on your recorded monthly data inside the logged-in workspace.',
    },
    {
        question: 'What does the report depend on most?',
        answer: 'Recorded expenses and clean categories. If the month is only partly logged, the report will only be partly useful.',
    },
    {
        question: 'Does the report predict the future?',
        answer: 'No. It helps the household understand what has already been recorded for the selected month and how that compares with the previous month when data exists.',
    },
    {
        question: 'Can the report help even if the household is already under pressure?',
        answer: 'Yes. It is often most useful when the month feels unclear, because it turns vague pressure into visible totals and categories.',
    },
];

export default function SurvivalReport({ seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? seoContent.survivalReport;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
                <section className="overflow-hidden rounded-[2rem] border border-[#001a4a]/10 bg-[linear-gradient(135deg,_#f6fbff_0%,_#ffffff_58%,_#fff6df_100%)] p-6 shadow-sm lg:p-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:items-start">
                        <div className="space-y-5">
                            <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                            <h1 className="text-3xl font-bold leading-tight text-[#001a4a] sm:text-4xl">
                                Survival Report shows how the month actually went, not how the household hoped it went.
                            </h1>
                            <p className="max-w-3xl text-base leading-7 text-slate-700">
                                This page explains Roznamcha’s monthly survival view for Pakistani households. It is for families who need a clearer
                                answer to a practical question: did this month stay under control, and what should change before the next one begins?
                            </p>
                            <div className="grid gap-3 md:grid-cols-3">
                                <InfoCard
                                    title="Who it helps"
                                    body="Households trying to understand month-end pressure, category tradeoffs, and whether spending is improving or slipping."
                                />
                                <InfoCard
                                    title="What it answers"
                                    body="What the month cost, where the squeeze came from, and whether the next month needs a tighter plan."
                                />
                                <InfoCard
                                    title="What it does not claim"
                                    body="It is not a fortune-teller. It cannot know bills or shocks that were never recorded."
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/kharcha-map"
                                    className="inline-flex items-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#012261]"
                                >
                                    Start with Kharcha Map
                                </Link>
                                <Link
                                    href="/tools/ration-cost-estimator"
                                    className="inline-flex items-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5"
                                >
                                    Test ration pressure
                                </Link>
                            </div>
                        </div>

                        <section className="rounded-[1.75rem] border border-[#001a4a]/10 bg-white p-6 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Key Questions</p>
                            <div className="mt-4 space-y-3">
                                {keyQuestions.map((item) => (
                                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                                        <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                                <p className="text-sm font-semibold text-emerald-900">Public explainer first</p>
                                <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                                    Your own report is generated inside the logged-in workspace because it depends on your recorded monthly expenses and selected month.
                                </p>
                            </div>
                        </section>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">What The Report Actually Shows</p>
                        <h2 className="text-3xl font-semibold text-[#001a4a]">Useful monthly signals, not vague motivation</h2>
                        <p className="max-w-3xl text-base leading-7 text-slate-600">
                            The public value of this page should be clear even before sign-in: the Survival Report turns recorded monthly spending into a set of usable planning signals.
                        </p>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {reportSignals.map((signal) => (
                            <article key={signal.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-xl font-semibold text-[#001a4a]">{signal.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">{signal.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Worked Examples</p>
                        <h2 className="mt-2 text-3xl font-semibold text-[#001a4a]">How this helps with real month-end decisions</h2>
                        <div className="mt-6 space-y-4">
                            {examples.map((example) => (
                                <article key={example.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="text-xl font-semibold text-[#001a4a]">{example.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{example.body}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Methodology And Limits</p>
                        <h2 className="mt-2 text-3xl font-semibold text-[#001a4a]">What the report depends on</h2>
                        <div className="mt-6 space-y-5">
                            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-lg font-semibold text-[#001a4a]">Core logic</h3>
                                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                                    {methodologyPoints.map((point) => (
                                        <li key={point} className="flex gap-3">
                                            <span className="mt-2 h-2 w-2 rounded-full bg-[#8c5a00]" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                            <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                                <h3 className="text-lg font-semibold text-rose-900">What it cannot know</h3>
                                <ul className="mt-3 space-y-2 text-sm leading-6 text-rose-900/80">
                                    {limitPoints.map((point) => (
                                        <li key={point} className="flex gap-3">
                                            <span className="mt-2 h-2 w-2 rounded-full bg-rose-500" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        </div>
                    </section>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr),minmax(0,1.05fr)] lg:items-start">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">How To Use It</p>
                            <h2 className="mt-2 text-3xl font-semibold text-[#001a4a]">Use the report as a planning checkpoint</h2>
                            <p className="mt-3 text-base leading-7 text-slate-600">
                                The report is most useful when it leads to one or two real next-month decisions instead of becoming another screen that people read and ignore.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {planningSteps.map((step, index) => (
                                <article key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Step {index + 1}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">{step}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Where To Go Next</p>
                            <h2 className="mt-2 text-3xl font-semibold text-[#001a4a]">Use stronger adjacent pages in the same workflow</h2>
                        </div>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {relatedLinks.map((item) => (
                            <article key={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-xl font-semibold text-[#001a4a]">{item.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                                <Link href={item.href} className="mt-5 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline">
                                    Open page →
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="survival-faq-heading">
                    <h2 id="survival-faq-heading" className="text-2xl font-semibold text-[#001a4a]">
                        Frequently Asked Questions
                    </h2>
                    <div className="mt-5 space-y-4">
                        {faqs.map((faq) => (
                            <article key={faq.question} className="rounded-2xl border border-slate-200 p-5">
                                <h3 className="text-lg font-semibold text-[#001a4a]">{faq.question}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </PublicLayout>
    );
}

function InfoCard({ title, body }) {
    return (
        <div className="rounded-2xl border border-[#001a4a]/10 bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8c5a00]">{title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
        </div>
    );
}
