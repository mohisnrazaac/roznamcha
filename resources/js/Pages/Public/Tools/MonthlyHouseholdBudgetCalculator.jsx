import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import RelatedLinksBlock from '../../../Components/RelatedLinksBlock';
import SaveWall from '../../../Components/Activation/SaveWall';
import SeoHead from '../../../Components/SeoHead';
import FinancialDisclaimer from '../../../Components/Public/FinancialDisclaimer';
import AuthorEditorialBlock from '../../../Components/AuthorEditorialBlock';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

const clampNumber = (value, min = 0) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return min;
    return Math.max(min, parsed);
};

const budgetScenarios = [
    {
        key: 'survival',
        title: 'Tighter Salary Survival Basket',
        description: 'Designed for a household budget of Rs 50,000–60,000 under active month-end pressure.',
        inputs: {
            monthly_income: 55000,
            rent: 15000,
            ration: 20000,
            utilities: 8000,
            education: 4000,
            transport: 4000,
            misc: 2000,
        }
    },
    {
        key: 'average-family',
        title: 'Mid-Income 4-Person Family',
        description: 'A sturdier model for a middle-class home with Rs 100,000–120,000 monthly income.',
        inputs: {
            monthly_income: 110000,
            rent: 30000,
            ration: 35000,
            utilities: 18000,
            education: 12000,
            transport: 8000,
            misc: 5000,
        }
    },
    {
        key: 'joint-family',
        title: 'Joint Family Setup',
        description: 'Useful when a larger household with Rs 180,000+ income manages multiple students and refilling items.',
        inputs: {
            monthly_income: 200000,
            rent: 50000,
            ration: 60000,
            utilities: 30000,
            education: 25000,
            transport: 15000,
            misc: 10000,
        }
    }
];

const defaultFaqItems = [
    {
        question: 'What is a normal savings rate for a Pakistani household?',
        answer: 'Due to recent high inflation, many middle-income households in Pakistan experience a very tight budget with a savings rate below 10%. A target of 15% is ideal but requires strict allocation of variable expenses like utilities and transport.',
    },
    {
        question: 'How can I reduce variable household expenses in Pakistan?',
        answer: 'Focus on progressive slab management for electricity (staying below 200 or 300 units), buying monthly grocery items in bulk from wholesale markets instead of neighborhood shops, and consolidating transit trips to reduce fuel costs.',
    },
    {
        question: 'Can I use this budget planner without signing up?',
        answer: 'Yes. The Monthly Household Budget Calculator works fully in guest mode. You only need to create a free account if you wish to persist your budget snapshot, compare it against live market updates, and get automated alerts.',
    },
    {
        question: 'How should I prioritize expenses if running a monthly deficit?',
        answer: 'Prioritize non-negotiable survival obligations first: housing rent, basic dry ration staples, and keeping electricity consumption below the next slab threshold. Audit discretionary medical/misc buffers and vehicle fuel trips before borrowing.',
    },
];

export function computeBudgetSummary(inputs) {
    const income = Number(inputs.monthly_income) || 0;
    const rent = Number(inputs.rent) || 0;
    const ration = Number(inputs.ration) || 0;
    const utilities = Number(inputs.utilities) || 0;
    const education = Number(inputs.education) || 0;
    const transport = Number(inputs.transport) || 0;
    const misc = Number(inputs.misc) || 0;

    const total_expenses = rent + ration + utilities + education + transport + misc;
    const surplus_deficit = income - total_expenses;
    const savings_rate = income > 0 ? Math.round((surplus_deficit / income) * 10000) / 100 : 0;

    const shares = {
        rent: total_expenses > 0 ? Math.round((rent / total_expenses) * 10000) / 100 : 0,
        ration: total_expenses > 0 ? Math.round((ration / total_expenses) * 10000) / 100 : 0,
        utilities: total_expenses > 0 ? Math.round((utilities / total_expenses) * 10000) / 100 : 0,
        education: total_expenses > 0 ? Math.round((education / total_expenses) * 10000) / 100 : 0,
        transport: total_expenses > 0 ? Math.round((transport / total_expenses) * 10000) / 100 : 0,
        misc: total_expenses > 0 ? Math.round((misc / total_expenses) * 10000) / 100 : 0,
    };

    return {
        total_expenses,
        surplus_deficit,
        savings_rate,
        shares,
    };
}

export default function MonthlyHouseholdBudgetCalculator({ defaults, initialResult, activationPrefill, faqItems: faqItemsProp, seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? {
        title: 'Monthly Household Budget Calculator Pakistan – Ghar ka budget planner | Roznamcha',
        description: 'Calculate your monthly household budget in Pakistan by tracking rent, ration, school fees, transport, and utilities to see your surplus or deficit.',
        url: 'https://roznamcha.pk/tools/monthly-household-budget-calculator',
        canonical: 'https://roznamcha.pk/tools/monthly-household-budget-calculator'
    };
    const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
    const activeFaqItems = faqItemsProp ?? defaultFaqItems;
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const prefilledInputs = activationPrefill?.inputs ?? {};
    const initialInputs = {
        monthly_income: prefilledInputs.monthly_income ?? defaults?.monthly_income ?? 85000,
        rent: prefilledInputs.rent ?? defaults?.rent ?? 20000,
        ration: prefilledInputs.ration ?? defaults?.ration ?? 25000,
        utilities: prefilledInputs.utilities ?? defaults?.utilities ?? 12000,
        education: prefilledInputs.education ?? defaults?.education ?? 8000,
        transport: prefilledInputs.transport ?? defaults?.transport ?? 6000,
        misc: prefilledInputs.misc ?? defaults?.misc ?? 4000,
    };

    const defaultInitialResult = initialResult ?? activationPrefill?.results ?? computeBudgetSummary(initialInputs);

    const [form, setForm] = React.useState(initialInputs);
    const [result, setResult] = React.useState(defaultInitialResult);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [revealResult, setRevealResult] = React.useState(Boolean(defaultInitialResult));

    const handleScenarioSelect = (scenarioInputs) => {
        setForm({ ...scenarioInputs });
        const computed = computeBudgetSummary(scenarioInputs);
        setResult(computed);
        setRevealResult(true);
    };

    const handleInputChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: Number(value) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setRevealResult(false);

        const csrfToken = (typeof window !== 'undefined' && window.getCsrfToken ? await window.getCsrfToken() : null)
            || document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || '';

        try {
            const response = await fetch('/tools/monthly-household-budget-calculator/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    monthly_income: clampNumber(form.monthly_income, 0),
                    rent: clampNumber(form.rent, 0),
                    ration: clampNumber(form.ration, 0),
                    utilities: clampNumber(form.utilities, 0),
                    education: clampNumber(form.education, 0),
                    transport: clampNumber(form.transport, 0),
                    misc: clampNumber(form.misc, 0),
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.message ?? 'Calculation failed');
            }

            setResult(data);
            window.requestAnimationFrame(() => setRevealResult(true));
        } catch (submitError) {
            setError(submitError.message || 'Unable to calculate budget right now.');
        } finally {
            setIsLoading(false);
        }
    };

    const expenseBreakdown = React.useMemo(() => {
        if (!result) return [];
        return [
            { key: 'rent', label: 'Rent / Housing', value: form.rent, share: result.shares?.rent ?? 0, color: '#f59e0b' },
            { key: 'ration', label: 'Ration / Groceries', value: form.ration, share: result.shares?.ration ?? 0, color: '#10b981' },
            { key: 'utilities', label: 'Utilities', value: form.utilities, share: result.shares?.utilities ?? 0, color: '#3b82f6' },
            { key: 'education', label: 'Education / School Fees', value: form.education, share: result.shares?.education ?? 0, color: '#8b5cf6' },
            { key: 'transport', label: 'Transport / Fuel', value: form.transport, share: result.shares?.transport ?? 0, color: '#ec4899' },
            { key: 'misc', label: 'Miscellaneous', value: form.misc, share: result.shares?.misc ?? 0, color: '#6b7280' },
        ].sort((a, b) => b.value - a.value);
    }, [form, result]);

    return (
        <ToolLayout
            title="Monthly Household Budget Calculator"
            subtitle="Plan monthly income, rent, groceries, school fees, fuel, and utility bills to see your surplus or deficit."
            description="Guest mode Pakistan household budget planner with localized category splits, visual share breakdown, and budget health signals."
        >
            <SeoHead {...seo} jsonLd={pageSchema} />




            {/* Editorial Context Block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-bold text-[#001a4a]">Monthly Household Budget Calculator: Map Your Income to Essential Squeezes</h2>
                <p className="text-sm leading-6 text-slate-700">
                    <strong>A Reality Check for Salaried Households:</strong> Budgeting is not about restricting your lifestyle; it is about allocating limited resources to competing needs. For salaried classes in Pakistan, the primary challenges are fixed overheads (rent, school fees) and volatile running expenses (ration, petrol, electricity).
                </p>
                <p className="text-sm leading-6 text-slate-700">
                    This calculator helps you map your exact salary range (from Rs. 50,000 to Rs. 150,000+) against actual cost baselines. It gives you an immediate picture of where your salary stretches and where you need a planning buffer.
                </p>
                <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-base font-semibold text-[#001a4a] mb-2">How to Use the Monthly Household Budget Calculator</h3>
                    <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-1">
                        <li><strong>Enter Your Net Take-Home Pay:</strong> Use your final salary after tax deductions.</li>
                        <li><strong>Distribute Core Fixed Costs:</strong> Input your rent, school fees, and debt commitments.</li>
                        <li><strong>Allocate Volatile Variable Costs:</strong> Set estimates for grocery, petrol, and medical budgets.</li>
                        <li><strong>Save Your Baseline:</strong> Connect these settings with the <strong>Kharcha Map</strong> to measure actual vs. planned expenses in real-time.</li>
                    </ol>
                </div>
            </div>

            <section className="grid gap-6 md:grid-cols-3">
                {budgetScenarios.map((scenario) => (
                    <button
                        key={scenario.key}
                        type="button"
                        onClick={() => handleScenarioSelect(scenario.inputs)}
                        className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#001a4a] hover:bg-slate-50 transition"
                    >
                        <h3 className="text-base font-semibold text-[#001a4a]">{scenario.title}</h3>
                        <p className="mt-2 text-xs text-slate-500">{scenario.description}</p>
                        <p className="mt-3 text-sm font-semibold text-[#001a4a]/85">
                            Income: Rs {formatCurrency(scenario.inputs.monthly_income)}
                        </p>
                    </button>
                ))}
            </section>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-[#001a4a]">Budget Entries</h2>
                            <p className="text-sm text-slate-500">Enter your household income and expenses in PKR.</p>
                        </div>
                        <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200">
                            Guest Mode
                        </span>
                    </div>

                    <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-slate-700">Monthly Net Income (Rs)</span>
                        <input
                            type="number"
                            min="0"
                            value={form.monthly_income || ''}
                            onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                        />
                    </label>

                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-2">Monthly Expenses</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Rent / Housing</span>
                            <input
                                type="number"
                                min="0"
                                value={form.rent || ''}
                                onChange={(e) => handleInputChange('rent', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                            />
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Ration / Groceries</span>
                            <input
                                type="number"
                                min="0"
                                value={form.ration || ''}
                                onChange={(e) => handleInputChange('ration', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                            />
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Electricity / Gas / Water</span>
                            <input
                                type="number"
                                min="0"
                                value={form.utilities || ''}
                                onChange={(e) => handleInputChange('utilities', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                            />
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Education / School Fees</span>
                            <input
                                type="number"
                                min="0"
                                value={form.education || ''}
                                onChange={(e) => handleInputChange('education', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                            />
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Transport / Fuel</span>
                            <input
                                type="number"
                                min="0"
                                value={form.transport || ''}
                                onChange={(e) => handleInputChange('transport', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                            />
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-sm font-medium text-slate-700">Medical & Miscellaneous</span>
                            <input
                                type="number"
                                min="0"
                                value={form.misc || ''}
                                onChange={(e) => handleInputChange('misc', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                            />
                        </label>
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#001a4a] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#012261] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Calculating...' : 'Calculate Budget Summary'}
                    </button>
                </form>

                <div className="space-y-6">
                    <section
                        className={[
                            'rounded-2xl border p-6 transition-all duration-500',
                            result ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200/80',
                        ].join(' ')}
                    >
                        {!result ? (
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Result</p>
                                <h3 className="text-2xl font-semibold text-[#001a4a]">Budget calculations will appear here</h3>
                                <p className="text-sm text-slate-500 leading-6">
                                    Fill in the fields on the left and submit to view your total expense breakdown, surplus or deficit, and overall budget health.
                                </p>
                            </div>
                        ) : (
                            <div className={`space-y-5 transform transition-all duration-500 ${revealResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Remaining Balance (Surplus / Deficit)</p>
                                    <h3 className={`text-3xl font-semibold mt-2 ${result.surplus_deficit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        Rs {formatCurrency(result.surplus_deficit)}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Total Expenses: Rs {formatCurrency(result.total_expenses)} | Savings Rate: {result.savings_rate}%
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-700">Expense Allocations (%)</h4>
                                    <div className="space-y-2">
                                        {expenseBreakdown.map((item) => (
                                            <div key={item.key} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                                                    <span>{item.label}</span>
                                                    <span>Rs {formatCurrency(item.value)} ({item.share}%)</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{ width: `${item.share}%`, backgroundColor: item.color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {result ? (
                        <SaveWall
                            toolKey="monthly_household_budget_calculator"
                            inputs={{ ...form }}
                            results={{ ...result }}
                            isAuthenticated={isAuthenticated}
                            saveEndpoint="tools.snapshots.store"
                            returnUrl={typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/tools/monthly-household-budget-calculator'}
                        />
                    ) : null}

                    <FinancialDisclaimer />
                </div>
            </div>

            {/* SECTION B: Rich text/HTML container optimized for SEO reading */}
            <hr className="my-10 border-slate-200" />

            {/* Semantic Editorial Scaffolding Section */}
            <article className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
                <header className="space-y-2 border-b border-slate-100 pb-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#8c5a00] font-semibold">Editorial Documentation</p>
                    <h2 className="text-2xl font-bold text-[#001a4a]">Household Budget Allocation Model & Economic Baseline</h2>
                    <p className="text-sm text-slate-600">
                        A detailed review of how household income is modeled against essential Pakistani expense categories, surplus/deficit dynamics, and actionable balancing techniques.
                    </p>
                </header>

                {/* Part 1: Methodology & Calculation Mechanics */}
                <section className="space-y-3">
                    <h3 className="text-xl font-bold text-[#001a4a]">Methodology & Calculation Mechanics</h3>
                    <p className="text-sm leading-7 text-slate-700">
                        The calculator aggregates your monthly net income against 6 primary expenditure categories:
                        <code className="mx-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#001a4a]">Total Expenses = Rent + Ration + Utilities + Education + Transport + Miscellaneous</code>.
                        Surplus or Deficit is calculated as <code className="mx-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#001a4a]">Monthly Income - Total Expenses</code>, and the Savings Rate equals <code className="mx-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#001a4a]">(Surplus / Monthly Income) × 100</code>.
                        Each category's percentage share is computed to highlight budget disproportion relative to standard urban middle-class baselines.
                    </p>
                    <p className="text-sm leading-7 text-slate-700">
                        To drill down into specific cost drivers, cross-check your grocery basket with our{' '}
                        <Link href="/tools/ration-cost-estimator" className="font-semibold text-[#001a4a] underline">
                            Ration Cost Estimator
                        </Link>
                        , simulate power tariff brackets with our{' '}
                        <Link href="/tools/electricity-bill-estimator" className="font-semibold text-[#001a4a] underline">
                            Electricity Bill Estimator
                        </Link>
                        , or plan school fees using our{' '}
                        <Link href="/tools/school-fees-planner" className="font-semibold text-[#001a4a] underline">
                            School Fees Planner
                        </Link>.
                    </p>
                </section>

                {/* Part 2: Underlying Data Baseline & Assumptions */}
                <section className="space-y-3 border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">Underlying Data Baseline & Economic Assumptions</h3>
                    <p className="text-sm leading-7 text-slate-700">
                        Traditional international budgeting benchmarks (like the 50/30/20 rule) assume moderate inflation and low fixed housing shares. In Pakistan, economic baseline conditions differ sharply: rent in major urban hubs (Karachi, Lahore, Islamabad) typically consumes 30% to 40% of net middle-class earnings, while groceries and utilities account for another 40% to 50%, compressing discretionary savings to under 10% for unoptimized households.
                    </p>
                    <p className="text-sm leading-7 text-slate-700">
                        To see full details on our inflation baselines and economic data sources, visit our{' '}
                        <Link href="/methodology" className="font-semibold text-[#001a4a] underline">
                            Methodology & Data Sources
                        </Link>{' '}
                        page.
                    </p>
                </section>

                {/* Part 3: Practical Application Guide */}
                <section className="space-y-3 border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">Practical Application Guide: Restoring a Budget Surplus</h3>
                    <p className="text-sm leading-7 text-slate-700">
                        If your budget indicates a deficit or a savings rate below 10%, execute these tactical adjustments:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm leading-7 text-slate-700">
                        <li>
                            <strong>Cap Discretionary Kharcha First:</strong> Dine-outs, online food delivery apps, and impromptu ride-hailing represent the most flexible expense leaks. Curtailing them provides immediate cash liquidity.
                        </li>
                        <li>
                            <strong>Manage Utility Slabs Defensively:</strong> Electricity slab management and fuel route optimization can recover Rs. 8,000 to Rs. 15,000 monthly without compromising family well-being.
                        </li>
                        <li>
                            <strong>Build a 3-Month Emergency Liquidity Vault:</strong> Direct any surplus into a dedicated, liquid savings fund before allocating money to lifestyle upgrades.
                        </li>
                    </ul>
                </section>

                {/* Part 4: Frequently Asked Questions */}
                <section className="border-t border-slate-100 pt-6 space-y-4">
                    <h3 className="text-xl font-bold text-[#001a4a]">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        {activeFaqItems.map((faq) => (
                            <div key={faq.question} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                <h4 className="font-semibold text-[#001a4a]">{faq.question}</h4>
                                <p className="mt-1 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <AuthorEditorialBlock
                    authorName="Mohsin Raza"
                    authorRole="Founder & Software Architect (16+ Years Experience)"
                    lastUpdated="September 2026"
                />
            </article>

                <RelatedLinksBlock
                relatedTools={[]}
                relatedBlogs={[
                    { title: 'Ghar Ka Monthly Budget Guide', href: '/blog/ghar-ka-monthly-budget' },
                    { title: 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', href: '/blog/pakistani-family-monthly-expense-control' }
                ]}
            />
        </ToolLayout>
    );
}

function buildWebPageSchema(seo) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${seo.url}#webpage`,
        'name': seo.schemaName ?? seo.title ?? 'Monthly Household Budget Calculator',
        'url': seo.url,
        'description': seo.description ?? '',
        'inLanguage': 'en',
    };
}
