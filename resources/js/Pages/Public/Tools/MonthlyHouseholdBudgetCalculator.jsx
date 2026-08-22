import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import RelatedLinksBlock from '../../../Components/RelatedLinksBlock';
import SaveWall from '../../../Components/Activation/SaveWall';
import SeoHead from '../../../Components/SeoHead';
import FinancialDisclaimer from '../../../Components/Public/FinancialDisclaimer';

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

const faqItems = [
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
    }
];

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
};

const calculatorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Monthly Household Budget Calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: 'https://roznamcha.pk/tools/monthly-household-budget-calculator',
    description: 'Guest-mode monthly household budget calculator to estimate monthly rent, ration, utilities, education, transport, and miscellaneous costs in Pakistan.',
};

export default function MonthlyHouseholdBudgetCalculator({ defaults, activationPrefill, seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? {
        title: 'Monthly Household Budget Calculator Pakistan – Ghar ka budget planner | Roznamcha',
        description: 'Calculate your monthly household budget in Pakistan by tracking rent, ration, school fees, transport, and utilities to see your surplus or deficit.',
        url: 'https://roznamcha.pk/tools/monthly-household-budget-calculator',
        canonical: 'https://roznamcha.pk/tools/monthly-household-budget-calculator'
    };
    const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const prefilledInputs = activationPrefill?.inputs ?? {};
    const prefilledResults = activationPrefill?.results ?? null;

    const [form, setForm] = React.useState({
        monthly_income: prefilledInputs.monthly_income ?? defaults?.monthly_income ?? 85000,
        rent: prefilledInputs.rent ?? defaults?.rent ?? 20000,
        ration: prefilledInputs.ration ?? defaults?.ration ?? 25000,
        utilities: prefilledInputs.utilities ?? defaults?.utilities ?? 12000,
        education: prefilledInputs.education ?? defaults?.education ?? 8000,
        transport: prefilledInputs.transport ?? defaults?.transport ?? 6000,
        misc: prefilledInputs.misc ?? defaults?.misc ?? 4000,
    });

    const [result, setResult] = React.useState(prefilledResults);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [revealResult, setRevealResult] = React.useState(Boolean(prefilledResults));

    const handleScenarioSelect = (scenarioInputs) => {
        setForm({ ...scenarioInputs });
        setResult(null);
        setRevealResult(false);
    };

    const handleInputChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: Number(value) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setRevealResult(false);

        const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

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
            <Head>
                <script
                    key="budget-calculator-faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
                <script
                    key="budget-calculator-app-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
                />
            </Head>



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

            <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#001a4a]">Understanding Monthly Budgeting in Pakistan</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        Managing a household budget in Pakistan requires navigating a mix of fixed structural commitments and highly volatile variable expenses. Under recent economic pressures and shifting inflation trends, maintaining a strict record of where your rupee goes is no longer optional—it is the baseline for financial stability. This guide explores the core categories that drive household spending and offers practical ways to optimize them.
                    </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">How to Manage Rent and Variable Utility Cost-Fluctuations</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        For renting families in urban centers like Karachi, Lahore, and Islamabad, house rent represents the largest fixed commitment, typically swallowing 25% to 40% of net monthly income. 
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        Utilities, however, are highly variable and present the greatest risk of budget derailment. Electricity bills in Pakistan need to be checked against the current DISCO tariff, taxes, fixed charges, and billing rules in force for the relevant month. A household should track meter readings and heavy-usage periods instead of relying on a generic threshold claim alone.
                    </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">Optimizing Ration Baskets and Educational Expenses</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        Grocery bills (or kitchen ration) are highly vulnerable to localized price fluctuations. Flour (atta), cooking oil/ghee, sugar, rice, and pulses are staple drivers of this expense. A family should compare wholesale, neighborhood, and supermarket pricing based on current local availability instead of assuming a subsidy or a single government-backed source is still active.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        Education represents a non-negotiable cost for most parents. However, many budgets break because parents only prepare for monthly tuition fees, ignoring seasonal costs like annual charges, registration, books, uniforms, and exam fees. Amortizing these annual charges into a monthly savings reserve prevents sudden cost pressures from breaking your budget.
                    </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">Actionable Strategies for Running a Budget Surplus</h3>
                    <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600 list-disc pl-5">
                        <li><strong>Track and Categorize:</strong> Log every single expense. Uncategorized cash withdrawals represent the single biggest source of budget leakage.</li>
                        <li><strong>Stay Under Key Utility Slabs:</strong> Target consumption thresholds (e.g. keeping your electricity consumption strictly below 300 units per month) to avoid punitive tariff brackets.</li>
                        <li><strong>Amortize Seasonal Expenses:</strong> Build dedicated savings vaults for yearly fees, Eid shopping, and vehicle maintenance, rather than funding them out of current salary.</li>
                        <li><strong>Adopt the 50/30/20 Rule with Local Tweaks:</strong> Aim to allocate 50% for absolute needs (rent, basic ration, utilities), 30% for variable desires and education, and target a 20% savings buffer for emergency liquidity.</li>
                    </ul>
                </div>
            </section>

            <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#001a4a]">Frequently Asked Questions (FAQs)</h2>
                {faqItems.map((faq) => (
                    <div key={faq.question} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                        <h3 className="font-semibold text-slate-800">{faq.question}</h3>
                        <p className="text-sm text-slate-600 mt-1">{faq.answer}</p>
                    </div>
                ))}
            </section>

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
