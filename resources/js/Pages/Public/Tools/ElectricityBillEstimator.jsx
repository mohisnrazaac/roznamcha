import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import SeoHead from '../../../Components/SeoHead';
import { buildWebPageSchema, seoContent } from '../../../lib/seo';
import SaveWall from '../../../Components/Activation/SaveWall';
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

const faqItems = [
    {
        question: 'Does this estimator use fixed slab values in code?',
        answer: 'No. The progressive slab billing reads from the configurable slab_rates table so rates can be updated without changing frontend logic.',
    },
    {
        question: 'Why is this an estimate and not my exact bill?',
        answer: 'It includes configurable placeholders for FPA and surcharges and applies GST, but actual utility bills can include additional line items or timing-based adjustments.',
    },
    {
        question: 'Can I use this without creating an account?',
        answer: 'Yes. The estimator works fully in guest mode. Signup is only for saving estimates and reminders later.',
    },
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
    name: 'Electricity Bill Estimator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: 'https://roznamcha.pk/tools/electricity-bill-estimator',
    description:
        'Guest-mode Pakistan electricity bill estimator using progressive slab rates, GST, and surcharge placeholders with last-year comparison.',
};

export default function ElectricityBillEstimator({ defaults, categories = [], gstPercentage = 17, gst_percentage, activationPrefill, seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? seoContent.electricityBillEstimator;
    const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
    const effectiveGst = gst_percentage ?? gstPercentage;
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const prefilledInputs = activationPrefill?.inputs ?? {};
    const prefilledResults = activationPrefill?.results ?? null;
    const [form, setForm] = React.useState({
        units_used: prefilledInputs.units_used ?? defaults?.units_used ?? 250,
        user_category: prefilledInputs.user_category ?? defaults?.user_category ?? 'unprotected',
    });
    const [result, setResult] = React.useState(prefilledResults);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [revealResult, setRevealResult] = React.useState(Boolean(prefilledResults));
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

        const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

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
            <Head>
                <script
                    key="electricity-faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
                <script
                    key="electricity-calculator-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
                />
            </Head>



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
                            Static placeholder tip for now. Can be replaced with personalized AI suggestions later.
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

            {/* SECTION B: Rich text/HTML container optimized for SEO reading */}
            <section className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#001a4a]">Understanding NEPRA Tariff Slabs</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        Electricity billing in Pakistan is governed by NEPRA's progressive slab rates, which categorize residential consumers into 'Protected' and 'Unprotected' groups. Understanding how these slabs function is critical to planning your monthly energy budget.
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        For 'Protected' users (who use less than 200 units consecutively for 6 months), the per-unit rates are heavily subsidized. However, once you cross the 200-unit threshold, your category shifts to 'Unprotected', where per-unit rates increase significantly for each slab (e.g., 1–100, 101–200, 201–300, and so on).
                    </p>
                </div>
                <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xl font-bold text-[#001a4a]">Surcharges, Fuel Price Adjustments (FPA), and Taxes</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        A common source of confusion in Pakistani utility bills is the difference between the base tariff slab rate and the final payable bill. The final bill includes various surcharges, Fuel Price Adjustments (FPA), and Government Taxes (including GST at 17% or higher, Excise Duty, and TV License fees). Since FPA varies month-to-month based on generation costs, keeping a buffer in your utility budget is highly recommended.
                    </p>
                </div>
            </section>

            <section className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-[#001a4a]">Electricity Bill Estimator FAQs</h2>
                {faqItems.map((faq) => (
                    <div key={faq.question} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                        <h3 className="font-semibold text-slate-800">{faq.question}</h3>
                        <p className="text-sm text-slate-600 mt-1">{faq.answer}</p>
                    </div>
                ))}
            </section>
        </ToolLayout>
    );
}
