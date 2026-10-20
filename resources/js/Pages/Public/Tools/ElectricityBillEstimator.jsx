import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import SeoHead from '../../../Components/SeoHead';
import { buildWebPageSchema, seoContent } from '../../../lib/seo';
import SaveWall from '../../../Components/Activation/SaveWall';
import FinancialDisclaimer from '../../../Components/Public/FinancialDisclaimer';
import SlabCliffVisualizer from '../../../Components/Calculators/SlabCliffVisualizer';
import ApplianceBreakdown from '../../../Components/Calculators/ApplianceBreakdown';
import { APPLIANCE_PRESETS } from '../../../lib/electricityTariff';
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

const defaultFaqItems = [
    {
        question: 'Does this estimator use fixed slab values in code?',
        answer: 'No. The progressive slab billing reads from the official NEPRA tariff schedule so rates can be updated without changing frontend logic.',
    },
    {
        question: 'Why is this an estimate and not my exact bill?',
        answer: 'It includes configurable placeholders for FPA and surcharges and applies GST, but actual utility bills can include additional line items or timing-based adjustments.',
    },
    {
        question: 'Can I use this without creating an account?',
        answer: 'Yes. The estimator works fully in guest mode. Signup is only for saving estimates and reminders later.',
    },
    {
        question: 'What is the difference between protected and unprotected consumers in Pakistan?',
        answer: 'Under NEPRA tariff regulations, consumers using under 200 units per month consecutively for six months are classified as protected with subsidized rates. Exceeding 200 units reclassifies the meter as unprotected, triggering substantially higher progressive slab rates.',
    },
    {
        question: 'How do Fuel Price Adjustments (FPA) and taxes affect my final bill?',
        answer: 'FPA accounts for monthly changes in generation fuel mix approved by NEPRA. Bills also incur electricity duty, financing cost surcharges, standard GST, and fixed meter charges that apply above the raw slab rate.',
    },
];

export default function ElectricityBillEstimator({
    defaults,
    categories = [],
    gstPercentage = 17,
    gst_percentage,
    initialResult,
    activationPrefill,
    faqItems: faqItemsProp,
    seo: seoProp,
    jsonLd: jsonLdProp,
}) {
    const seo = seoProp ?? seoContent.electricityBillEstimator;
    const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
    const activeFaqItems = faqItemsProp ?? defaultFaqItems;
    const effectiveGst = gst_percentage ?? gstPercentage;
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const prefilledInputs = activationPrefill?.inputs ?? {};
    const defaultInitialResult = initialResult ?? activationPrefill?.results ?? {
        slab_cost: 5250,
        total_bill: 7020,
        last_year_estimate: 5118.75,
        difference: 1901.25,
    };
    const [form, setForm] = React.useState({
        units_used: prefilledInputs.units_used ?? defaults?.units_used ?? 250,
        user_category: prefilledInputs.user_category ?? defaults?.user_category ?? 'unprotected',
    });

    const defaultAppliances = React.useMemo(() => {
        const state = {};
        APPLIANCE_PRESETS.forEach((preset) => {
            state[preset.id] = {
                hours: preset.defaultHours,
                qty: preset.defaultQty,
            };
        });
        return state;
    }, []);

    const [appliancesState, setAppliancesState] = React.useState(defaultAppliances);

    const handleApplianceChange = (nextState, newTotal) => {
        setAppliancesState(nextState);
        setForm((prev) => ({
            ...prev,
            units_used: newTotal,
            user_category: newTotal <= 200 ? 'protected' : 'unprotected',
        }));
    };
    const [result, setResult] = React.useState(defaultInitialResult);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [revealResult, setRevealResult] = React.useState(Boolean(defaultInitialResult));
    const [scrollDepth, setScrollDepth] = React.useState(0);

    React.useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
            setScrollDepth(window.scrollY / maxScrollable);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const highlightResult = Boolean(result) && scrollDepth >= 0.65 && scrollDepth <= 0.75;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setRevealResult(false);

        const csrfToken = (typeof window !== 'undefined' && window.getCsrfToken ? await window.getCsrfToken() : null)
            || document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || '';

        try {
            const response = await fetch('/tools/electricity-bill-estimator/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    units_used: clampNumber(form.units_used, 1),
                    user_category: form.user_category,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.message ?? 'Calculation failed');
            }

            setResult(data);
            window.requestAnimationFrame(() => setRevealResult(true));
        } catch (submitError) {
            setError(submitError.message || 'Unable to estimate bill right now.');
        } finally {
            setIsLoading(false);
        }
    };

    const estimatedAnnualSavings = React.useMemo(() => {
        if (!result || !form.units_used) return 0;
        const averageCostPerUnit = Number(result.total_bill || 0) / Math.max(1, Number(form.units_used));
        return Math.max(0, averageCostPerUnit * 40 * 12);
    }, [form.units_used, result]);

    return (
        <ToolLayout
            title="Electricity Bill Estimator"
            subtitle="Estimate your bill with progressive slab rates, GST, and surcharge placeholders before the bill arrives."
            description="Guest mode electricity estimator for Pakistan households with last-year comparison and configurable slab rates."
        >
            <SeoHead {...seo} jsonLd={pageSchema} />




            {/* Editorial Context Block */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
                <h2 className="text-xl font-bold text-[#001a4a]">Electricity Bill Estimator: Anticipate Unit Slabs & Surcharges</h2>
                <p className="text-sm leading-6 text-slate-700">
                    <strong>Understanding NEPRA's Progressive Slabs:</strong> Pakistani electricity bills are governed by a progressive slab structure. Crossing a single unit threshold (such as moving from 200 to 201 units, or 300 to 301 units) doesn't just charge the extra unit at a higher rate—it recalculates your entire bill on a significantly higher tariff bracket.
                </p>
                <p className="text-sm leading-6 text-slate-700">
                    This tool simulates your monthly bill based on current NEPRA consumer categories (Protected vs. Unprotected) and adjustable surcharges. By tracking your daily meter readings, you can adjust your household usage before you cross into a penalizing tier.
                </p>
                <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-base font-semibold text-[#001a4a] mb-2">How to Use the Electricity Bill Estimator</h3>
                    <ol className="list-decimal pl-5 text-sm text-slate-600 space-y-1">
                        <li><strong>Check Your Protected Status:</strong> If you consume under 200 units consistently for 6 months, you remain in the subsidized Protected category.</li>
                        <li><strong>Input Estimated Monthly Units:</strong> Enter your expected unit consumption based on your meter readings.</li>
                        <li><strong>Preview Taxes and FPA:</strong> See a breakdown of Fuel Price Adjustments (FPA), financing surcharges, and GST.</li>
                        <li><strong>Optimize Consumption:</strong> Identify how many units you need to save to drop back down to the next lower billing slab.</li>
                    </ol>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-[#001a4a]">Bill Inputs</h2>
                            <p className="text-sm text-slate-500">Run a quick estimate in guest mode.</p>
                        </div>
                        <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200">
                            Guest Mode
                        </span>
                    </div>

                    <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-slate-700">Units used</span>
                        <input
                            type="number"
                            min="1"
                            value={form.units_used}
                            onChange={(e) => setForm((prev) => ({ ...prev, units_used: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                        />
                    </label>

                    <label className="block space-y-1.5">
                        <span className="text-sm font-medium text-slate-700">Category</span>
                        <select
                            value={form.user_category}
                            onChange={(e) => setForm((prev) => ({ ...prev, user_category: e.target.value }))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-[#001a4a] focus:outline-none"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'protected' ? 'Protected' : 'Unprotected'}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 space-y-1">
                        <p>GST applied in estimate: {effectiveGst}%</p>
                        <p>FPA and surcharges are configurable placeholders (not locked values).</p>
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#012261] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Estimating...' : 'Estimate Electricity Bill'}
                    </button>
                </form>

                <div className="space-y-5">
                    {/* Component 1: Smart Slab-Cliff Visualizer & Warning Engine */}
                    <SlabCliffVisualizer
                        units={Math.max(1, Number(form.units_used) || 1)}
                        disco="lesco"
                    />

                    <section
                        className={[
                            'rounded-2xl border p-6 transition-all duration-500',
                            result ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200/80',
                            highlightResult ? 'ring-2 ring-amber-300 shadow-xl motion-safe:animate-pulse' : '',
                        ].join(' ')}
                    >
                        {!result ? (
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Result</p>
                                <h3 className="text-2xl font-semibold text-[#001a4a]">Estimated bill will appear here</h3>
                                <p className="text-sm text-slate-500">
                                    This estimator uses progressive slabs and a last-year comparison to make tariff changes visible before bill day.
                                </p>
                            </div>
                        ) : (
                            <div className={`space-y-4 transform transition-all duration-500 ${revealResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Estimated Bill</p>
                                    <h3 className="text-3xl font-semibold text-[#001a4a] mt-2">
                                        PKR {formatCurrency(result.total_bill)}
                                    </h3>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-700">
                                        Due to tariff adjustments, your bill is PKR {formatCurrency(Math.abs(Number(result.difference) || 0))} {Number(result.difference) >= 0 ? 'higher' : 'lower'} than last year.
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Slab cost: PKR {formatCurrency(result.slab_cost)} | Last year estimate: PKR {formatCurrency(result.last_year_estimate)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    {result ? (
                        // ROZNAMCHA-ACTIVATION: place save wall immediately below computed result.
                        <SaveWall
                            toolKey="electricity_bill_estimator"
                            inputs={{ ...form }}
                            results={{ ...result }}
                            isAuthenticated={isAuthenticated}
                            saveEndpoint="tools.snapshots.store"
                            returnUrl={typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/tools/electricity-bill-estimator'}
                        />
                    ) : null}

                    <FinancialDisclaimer />

                    <section className="rounded-2xl border border-[#001a4a]/10 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.25em] text-blue-700">Ask Roza: Electricity Insight</p>
                        <p className="text-sm text-slate-700 mt-2">
                            Reducing 40 units per month could save PKR {formatCurrency(estimatedAnnualSavings)} annually.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Manage heavy appliances during daylight hours or off-peak times to keep usage in lower slabs.
                        </p>
                    </section>

                    <section className="bg-[#001a4a] text-white rounded-2xl p-6 shadow-lg">
                        <p className="text-base font-semibold">Save this estimation for next month</p>
                        <p className="text-sm text-white/75 mt-1">Get reminder before bill arrives</p>
                        <Link
                            href="/register"
                            className="mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-white"
                        >
                            Save this estimation
                        </Link>
                    </section>
                </div>
            </div>

            {/* Component 2: Interactive Appliance Unit Breakdown & Load Sliders */}
            <div className="mt-8">
                <ApplianceBreakdown
                    appliancesState={appliancesState}
                    onChange={handleApplianceChange}
                    currentUnits={Math.max(1, Number(form.units_used) || 1)}
                />
            </div>

            {/* Semantic Editorial Scaffolding Section */}
            <article className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
                <header className="space-y-2 border-b border-slate-100 pb-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#8c5a00] font-semibold">Editorial Documentation</p>
                    <h2 className="text-2xl font-bold text-[#001a4a]">NEPRA Tariff Slabs, Billing Formulas & Optimization Guide</h2>
                    <p className="text-sm text-slate-600">
                        A detailed breakdown of progressive tariff slabs, surcharges, protected consumer thresholds, and household conservation practices across Pakistani DISCOs.
                    </p>
                </header>

                {/* Part 1: Methodology & Calculation Mechanics */}
                <section className="space-y-3">
                    <h3 className="text-xl font-bold text-[#001a4a]">Methodology & Calculation Mechanics</h3>
                    <p className="text-sm leading-7 text-slate-700">
                        Residential electricity billing in Pakistan follows a multi-tier progressive slab schedule specified by NEPRA. Your consumption is tiered across sequential brackets (1–100, 101–200, 201–300, 301–400, 401–500, 501–600, 601–700, and 701+ units).
                    </p>
                    <p className="text-sm leading-7 text-slate-700">
                        <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#001a4a]">
                            Total Payable Bill = (Cumulative Base Slab Cost) + (Fuel Price Adjustment / FPA × Units) + (Financing Cost Surcharge) + (Electricity Duty) + (General Sales Tax / GST at 17%) + (TV License Fee & Meter Rent)
                        </code>.
                        The estimator calculates each bracket mathematically to reveal the exact marginal cost of incremental kilowatt-hours.
                    </p>
                    <p className="text-sm leading-7 text-slate-700">
                        If your monthly bill is consuming a large share of your household earnings, simulate rooftop solar generation with our{' '}
                        <Link href="/tools/solar-net-metering-roi-calculator" className="font-semibold text-[#001a4a] underline">
                            Solar Net Metering & ROI Calculator
                        </Link>{' '}
                        or balance your utilities against total earnings in our{' '}
                        <Link href="/tools/monthly-household-budget-calculator" className="font-semibold text-[#001a4a] underline">
                            Monthly Household Budget Calculator
                        </Link>.
                    </p>
                </section>

                {/* Part 2: Underlying Data Baseline & Assumptions */}
                <section className="space-y-3 border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">Underlying Data Baseline & Economic Assumptions</h3>
                    <p className="text-sm leading-7 text-slate-700">
                        Tariff slabs mirror the latest NEPRA federal notifications. Under prevailing statutory rules, residential consumers maintaining monthly consumption under 200 units consecutively for six months qualify as Protected Consumers, receiving heavily subsidized base tariffs. Consuming even a single unit above 200 (i.e. 201 units) immediately triggers the Unprotected Consumer schedule for the entire month, increasing the marginal unit cost by over 180%.
                    </p>
                    <p className="text-sm leading-7 text-slate-700">
                        To explore how our energy models track government notifications, inspect our{' '}
                        <Link href="/methodology" className="font-semibold text-[#001a4a] underline">
                            Methodology & Data Sources
                        </Link>{' '}
                        directory.
                    </p>
                </section>

                {/* Part 3: Practical Application Guide */}
                <section className="space-y-3 border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">Practical Application Guide: Avoiding the 201-Unit Cliff</h3>
                    <p className="text-sm leading-7 text-slate-700">
                        Household electricity bills can surge exponentially from minor usage changes. Implement these rules to protect your monthly energy budget:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm leading-7 text-slate-700">
                        <li>
                            <strong>Monitor Meter Readings on Day 20:</strong> Check your meter dial 10 days before the meter reader visits. If reading 180 units, restrict air cooler, iron, and washing machine usage to remain strictly below the 200-unit cliff.
                        </li>
                        <li>
                            <strong>Isolate Heavy Inductive Loads:</strong> Ironing clothes in a single batch, servicing refrigerator coils, and setting inverter AC thermostats to 26°C instead of 20°C cuts monthly energy consumption by 40 to 60 units.
                        </li>
                        <li>
                            <strong>Evaluate Solar Net Metering:</strong> If your household consistently consumes 500+ units monthly, installing rooftop solar offsets peak grid tariffs (Rs. 58+/unit) with a rapid 3-year payback.
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
        </ToolLayout>
    );
}
