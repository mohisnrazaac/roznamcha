import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const firstClickPages = [
    {
        title: 'Monthly Expense Tracker Pakistan',
        href: '/features/monthly-expense-tracker-pakistan',
        body: 'Track your daily PKR household spending, income streams, and inflation leaks.',
    },
    {
        title: 'Ration Cost Estimator',
        href: '/tools/ration-cost-estimator',
        body: 'Start with a staple-basket estimate, see what drives the total, and use it before the next market trip.',
    },
    {
        title: 'Monthly Household Budget Calculator',
        href: '/tools/monthly-household-budget-calculator',
        body: 'Plan rent, groceries, school fees, transport, and utility bills to see your surplus or deficit in guest mode.',
    },
    {
        title: 'Electricity Bill Estimator',
        href: '/tools/electricity-bill-estimator',
        body: 'Stress-test a 100, 200, or 300-unit month before the bill arrives and forces cuts elsewhere.',
    },
    {
        title: '50k Salary Survival Guide',
        href: '/templates/50k-salary-survival-guide',
        body: 'Open a survival-first budget example built for a tight salary instead of a generic lifestyle template.',
    },
];

const proofCards = [
    {
        eyebrow: 'Expense Tracker',
        title: 'Monthly Expense Tracker Pakistan',
        href: '/features/monthly-expense-tracker-pakistan',
        description: 'See how Pakistani households log daily kharcha, curb inflation leaks, and track monthly surplus.',
    },
    {
        eyebrow: 'Grocery Planning',
        title: 'Ration Cost Estimator',
        href: '/tools/ration-cost-estimator',
        description: 'Calculate monthly grocery basket expenses based on family size and market price averages.',
    },
    {
        eyebrow: 'Household Budget',
        title: 'Monthly Household Budget Calculator',
        href: '/tools/monthly-household-budget-calculator',
        description: 'Get a clear breakdown of all variable and fixed costs against your net monthly household income.',
    },
    {
        eyebrow: 'Utility Planning',
        title: 'Electricity Bill Estimator',
        href: '/tools/electricity-bill-estimator',
        description: 'Forecast residential electricity bills across tariff slabs before high-consumption months push the budget off course.',
    },
    {
        eyebrow: 'Budget Template',
        title: '50k Salary Survival Guide',
        href: '/templates/50k-salary-survival-guide',
        description: 'Practical allocation breakdown showing how to manage essential expenses on a tighter monthly salary.',
    },
    {
        eyebrow: 'Expense Breakdown',
        title: 'Kharcha Map',
        href: '/kharcha-map',
        description: 'Visualize rent, groceries, school fees, utilities, and everyday expenses in a single monthly view.',
    },
    {
        eyebrow: 'Financial Health',
        title: 'Survival Report',
        href: '/survival-report',
        description: 'Review actual spending patterns at month-end to see whether your household maintained a surplus or deficit.',
    },
];

const pressureJourneys = [
    {
        title: 'Groceries keep slipping every month',
        description: 'Open the ration estimator first when the market trip feels unpredictable and the basket total has become harder to trust.',
        href: '/tools/ration-cost-estimator',
        action: 'Estimate ration cost',
    },
    {
        title: 'The monthly salary budget feels out of control',
        description: 'Use the monthly household budget planner to allocate income across rent, utilities, ration, and education.',
        href: '/tools/monthly-household-budget-calculator',
        action: 'Calculate monthly budget',
    },
    {
        title: 'Electricity is about to squeeze the month',
        description: 'Use the bill estimator before a high-usage month so the household can plan around it instead of reacting late.',
        href: '/tools/electricity-bill-estimator',
        action: 'Estimate electricity pressure',
    },
    {
        title: 'The whole month feels unclear',
        description: 'Start with the Survival Report or Kharcha Map when the problem is not one bill, but how everything piles up together.',
        href: '/survival-report',
        action: 'See the survival view',
    },
];

const trustPoints = [
    {
        title: 'Public pages first',
        body: 'The strongest calculators, guides, and explainers are already open. You do not need an account to see whether Roznamcha is useful.',
    },
    {
        title: 'Planning aids, not fake precision',
        body: 'Household totals can change by city, usage pattern, school policy, brand, and shop. The aim is a better plan, not a false promise of exactness.',
    },
    {
        title: 'Built for Pakistan-specific pressure',
        body: 'The public surface is centered on ration cost, school fees, electricity pressure, and month-end survival instead of generic personal-finance slogans.',
    },
];

const guideLabels = {
    'ghar-ka-monthly-budget': 'Budget guide',
    'pakistani-family-monthly-expense-control': 'Expense control guide',
    'how-to-use-digital-roznamcha-for-business-and-personal-finance-2025': 'Product guide',
};

export default function Home({ featuredGuides = [], seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? seoContent.home;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="landing">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="bg-[#000f2d] text-white">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr),380px] lg:px-8 lg:py-24">
                    <div className="space-y-6">
                        <p className="text-xs uppercase tracking-[0.45em] text-yellow-200/80">Pakistan household budgeting platform</p>
                        <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl">
                            Roznamcha helps Pakistani households plan ration, school fees, electricity bills, and month-end survival with practical public pages.
                        </h1>
                        <p className="max-w-3xl text-base leading-7 text-yellow-100/90 sm:text-lg">
                            Free calculators, practical budgeting templates, and local cost estimators designed specifically for Pakistani families managing rising living expenses.
                        </p>

                        <div className="grid gap-3 md:grid-cols-3">
                            <StatCard
                                title="What it covers"
                                body="Ration pressure, school-fee reserves, electricity shocks, and the wider monthly budget picture."
                            />
                            <StatCard
                                title="Who it helps"
                                body="Households that need a clearer plan before the next market trip, school payment, or utility bill."
                            />
                            <StatCard
                                title="What it does not claim"
                                body="These are planning aids, not exact market or billing guarantees. The goal is a more honest monthly plan."
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/tools/ration-cost-estimator"
                                className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-base font-semibold text-[#001a4a] shadow-lg transition hover:bg-white"
                            >
                                Start with ration planning
                            </Link>
                            <Link
                                href="/survival-report"
                                className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-white/10"
                            >
                                See the survival view
                            </Link>
                            <Link
                                href="/templates/50k-salary-survival-guide"
                                className="inline-flex items-center justify-center rounded-full border border-yellow-200/60 px-5 py-2.5 text-base font-semibold text-yellow-100 transition hover:bg-white/10"
                            >
                                Open a real budget example
                            </Link>
                        </div>
                    </div>

                    <section className="rounded-[2rem] border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-yellow-200/80">Quick Start</p>
                        <h2 className="mt-3 text-2xl font-semibold text-white">Popular Budgeting Tools</h2>
                        <p className="mt-3 text-sm leading-6 text-yellow-100/85">
                            Start with the calculator or guide that matches your immediate household planning need.
                        </p>
                        <div className="mt-6 space-y-3">
                            {firstClickPages.map((page) => (
                                <Link
                                    key={page.href}
                                    href={page.href}
                                    className="block rounded-2xl border border-white/10 bg-white/10 px-4 py-4 transition hover:bg-white/15"
                                >
                                    <p className="text-sm font-semibold text-white">{page.title}</p>
                                    <p className="mt-1 text-sm leading-6 text-yellow-100/80">{page.body}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </section>

            <section className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Explore Tools & Guides</p>
                        <h2 className="text-3xl font-semibold text-[#001a4a]">Essential Resources for Household Finance</h2>
                        <p className="max-w-3xl text-base leading-7 text-slate-600">
                            Explore our suite of interactive estimators, budget templates, and expense analysis tools built for everyday Pakistani living.
                        </p>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {proofCards.map((page) => (
                            <ProofCard key={page.href} page={page} />
                        ))}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr),minmax(0,0.85fr)]">
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Start With The Pressure You Already Feel</p>
                        <h2 className="mt-2 text-3xl font-semibold text-[#001a4a]">Most households do not need everything at once</h2>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {pressureJourneys.map((item) => (
                                <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="text-xl font-semibold text-[#001a4a]">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                                    <Link href={item.href} className="mt-4 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline">
                                        {item.action} →
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Transparency & Methodology</p>
                        <h2 className="mt-2 text-3xl font-semibold text-[#001a4a]">Open, Accessible, and Independent</h2>
                        <div className="mt-6 space-y-4">
                            {trustPoints.map((item) => (
                                <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <h3 className="text-lg font-semibold text-[#001a4a]">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                                </article>
                            ))}
                        </div>
                        <div className="mt-6 rounded-2xl border border-[#001a4a]/10 bg-[#001a4a] p-5 text-white">
                            <p className="text-lg font-semibold">Track and save your monthly records.</p>
                            <p className="mt-2 text-sm leading-6 text-white/80">
                                All our calculators and guides are free to use without an account. Create a free account when you want to save recurring expenses, track progress month-over-month, and download custom reports.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-white"
                                >
                                    Create free account
                                </Link>
                                <Link
                                    href="/features"
                                    className="inline-flex items-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                                >
                                    Review features
                                </Link>
                            </div>
                        </div>
                    </section>
                </section>

                {featuredGuides.length > 0 && (
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Useful Reading</p>
                                <h2 className="mt-2 text-3xl font-semibold text-[#001a4a]">Open a guide when you need fuller context</h2>
                            </div>
                            <Link href="/blog/ghar-ka-monthly-budget" className="text-sm font-semibold text-[#001a4a] hover:underline">
                                Read the main budget guide →
                            </Link>
                        </div>
                        <div className="mt-8 grid gap-4 lg:grid-cols-3">
                            {featuredGuides.map((guide) => (
                                <article key={guide.id} className="rounded-2xl border border-slate-200 p-5">
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                                        {guideLabels[guide.slug] ?? 'Guide'}
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold text-[#001a4a]">
                                        <Link href={guide.url} className="hover:underline">
                                            {guide.title}
                                        </Link>
                                    </h3>
                                    {guide.published_label ? (
                                        <p className="mt-2 text-sm text-slate-500">{guide.published_label}</p>
                                    ) : null}
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </section>
        </PublicLayout>
    );
}

function StatCard({ title, body }) {
    return (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-200/75">{title}</p>
            <p className="mt-2 text-sm leading-6 text-yellow-100/90">{body}</p>
        </div>
    );
}

function ProofCard({ page }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">{page.eyebrow}</p>
            <h3 className="mt-3 text-xl font-semibold text-[#001a4a]">{page.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{page.description}</p>
            <Link href={page.href} className="mt-5 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline">
                Open page →
            </Link>
        </article>
    );
}
