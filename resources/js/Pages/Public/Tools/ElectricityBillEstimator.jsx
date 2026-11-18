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
import RelatedLinksBlock from '../../../Components/RelatedLinksBlock';
import HouseholdPlanningSuite from '../../../Components/Public/HouseholdPlanningSuite';

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
    gstPercentage = 18,
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
    const validInitialResult = Number(initialResult?.total_bill) > 0 ? initialResult : null;
    const defaultInitialResult = validInitialResult ?? activationPrefill?.results ?? {
        slab_cost: 8324,
        total_bill: 10616,
        last_year_estimate: 7850,
        difference: 2766,
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
                    <h3 className="text-xl font-bold text-[#001a4a]">NEPRA Uniform National Tariff & DISCO Coverage</h3>
                    <p className="text-sm leading-7 text-slate-700">
                        Under Pakistan's national uniform electricity tariff notified by NEPRA (S.R.O. 279(I)/2026), the exact same base slab rates apply identically across all distribution companies, including <strong>LESCO</strong> (Lahore), <strong>IESCO</strong> (Islamabad/Rawalpindi), <strong>MEPCO</strong> (Multan), <strong>FESCO</strong> (Faisalabad), <strong>GEPCO</strong> (Gujranwala), <strong>PESCO</strong> (Peshawar), <strong>HESCO</strong> (Hyderabad), <strong>SEPCO</strong> (Sukkur), <strong>QESCO</strong> (Quetta), and <strong>K-Electric</strong> (Karachi). Minor differences between your actual monthly bills across DISCOs arise solely from monthly variable Fuel Charges Adjustments (FCA/FPA), quarterly adjustments (QTA), and municipal electricity duties.
                    </p>
                    <p className="text-sm leading-7 text-slate-700">
                        Tariff slabs distinguish strictly between <strong>Protected Consumers</strong> (using 200 or fewer units consecutively for six months, who receive subsidized tiered pricing with previous-slab benefits) and <strong>Unprotected Consumers</strong> (whose entire monthly consumption is billed non-telescopically at the highest applicable slab rate).
                    </p>

                    <h4 className="text-base font-bold text-[#001a4a] pt-3">Worked Bill Examples by Unit Consumption (2026 NEPRA Domestic Slabs)</h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
                        <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700 font-semibold">
                                <tr>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3">Monthly Units</th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3">Consumer Category</th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3">Base Energy Tariff</th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3">Base Energy Cost</th>
                                    <th className="px-3 py-2 sm:px-4 sm:py-3">Estimated Total Bill (PKR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                                <tr>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900">100 Units</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-emerald-700 font-medium">Protected</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">Rs 10.54 / unit</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">Rs 1,054</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900">~Rs 1,690</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900">100 Units</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-amber-700 font-medium">Unprotected</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">Rs 22.44 / unit (non-telescopic)</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">Rs 2,244</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900">~Rs 4,288</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900">200 Units</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-emerald-700 font-medium">Protected</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">100 @ Rs 10.54 + 100 @ Rs 13.01</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">Rs 2,355</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900">~Rs 3,580</td>
                                </tr>
                                <tr className="bg-rose-50/50">
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-bold text-rose-900">201 Units (Cliff Jump!)</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-rose-700 font-bold">Unprotected</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-rose-800">All 201 @ Rs 33.15 / unit</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-rose-800">Rs 6,663</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-bold text-rose-900">~Rs 10,210 (+185% surge)</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900">300 Units</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-amber-700 font-medium">Unprotected</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">All 300 @ Rs 33.15 / unit</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">Rs 9,945</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900">~Rs 15,000</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900">500 Units</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 text-amber-700 font-medium">Unprotected</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">All 500 @ Rs 40.17 / unit</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3">Rs 20,085</td>
                                    <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900">~Rs 30,500 (incl. 7.5% Adv Tax)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="text-sm leading-7 text-slate-700 pt-2">
                        To explore how our energy models track government notifications, inspect our{' '}
                        <Link href="/methodology" className="font-semibold text-[#001a4a] underline">
                            Methodology & Data Sources
                        </Link>{' '}
                        directory.
                    </p>
                </section>

                {/* Part 3: Practical Application Guide */}
                <section className="space-y-4 border-t border-slate-100 pt-6">
                    {/* Current NEPRA Tariff & Adjustment Schedule Callout */}
                    <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-600" />
                            <h4 className="font-bold text-slate-900 text-base">
                                Current NEPRA Tariff & Adjustment Schedule (S.R.O. 279(I)/2026)
                            </h4>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700">
                            Effective nationwide under NEPRA notifications, all DISCO electricity bills are calculated with statutory monthly fuel charges and periodic surcharges:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                            <div className="rounded-xl border border-amber-200/80 bg-white p-3">
                                <span className="text-xs text-slate-500 font-medium">Fuel Charge Adjustment (FCA)</span>
                                <p className="text-base font-bold text-slate-900 mt-0.5">Rs 2.37 / unit</p>
                                <span className="text-[11px] text-slate-500">Monthly fuel price adjustment</span>
                            </div>
                            <div className="rounded-xl border border-amber-200/80 bg-white p-3">
                                <span className="text-xs text-slate-500 font-medium">Quarterly Adjustment (QTA)</span>
                                <p className="text-base font-bold text-slate-900 mt-0.5">Rs 0.52 / unit</p>
                                <span className="text-[11px] text-slate-500">System capacity recovery</span>
                            </div>
                            <div className="rounded-xl border border-amber-200/80 bg-white p-3">
                                <span className="text-xs text-slate-500 font-medium">Financing Cost Surcharge</span>
                                <p className="text-base font-bold text-slate-900 mt-0.5">Rs 3.23 / unit</p>
                                <span className="text-[11px] text-slate-500">Rs 0.43 for protected</span>
                            </div>
                            <div className="rounded-xl border border-amber-200/80 bg-white p-3">
                                <span className="text-xs text-slate-500 font-medium">Late Payment Surcharge</span>
                                <p className="text-base font-bold text-rose-700 mt-0.5">+5% to +10%</p>
                                <span className="text-[11px] text-slate-500">+5% within 3 days, +10% after</span>
                            </div>
                        </div>
                    </div>

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
                    authorRole="Founder & Software Architect, Roznamcha.pk"
                />
            </article>

            <HouseholdPlanningSuite currentPath="/tools/electricity-bill-estimator" />

            <RelatedLinksBlock
                relatedTools={[
                    { title: 'Solar Net Metering ROI Calculator', href: '/tools/solar-net-metering-roi-calculator' },
                    { title: 'Monthly Household Budget Calculator', href: '/tools/monthly-household-budget-calculator' },
                ]}
                relatedBlogs={[
                    { title: 'Pakistan Electricity Tariff Increases & Household Budgeting Defense (2026)', href: '/blog/pakistan-electricity-tariff-increases-and-household-budgeting-defense-2026' },
                    { title: 'Solar Net Metering Regulations in Pakistan (2026): ROI & Payback', href: '/blog/solar-net-metering-regulations-in-pakistan-2026-payback-period-and-roi-breakdown' },
                    { title: 'Ghar Ka Monthly Budget Kaise Banayein (2026)', href: '/blog/ghar-ka-monthly-budget' },
                ]}
            />
        </ToolLayout>
    );
}
