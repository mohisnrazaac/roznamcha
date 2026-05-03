import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import RelatedLinksBlock from '../../../Components/RelatedLinksBlock';
import SaveWall from '../../../Components/Activation/SaveWall';
import SeoHead from '../../../Components/SeoHead';
import { buildWebPageSchema, seoContent } from '../../../lib/seo';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

const clampNumber = (value, min = 0) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return min;
    return Math.max(min, parsed);
};

const calculateTotal = (items, quantities) =>
    (items ?? []).reduce((sum, item) => {
        const qty = clampNumber(quantities?.[item.key] ?? 0);
        return sum + qty * Number(item.price ?? 0);
    }, 0);

const exampleScenarios = [
    {
        key: 'small-household',
        title: 'Small household keeping basics simple',
        householdSize: 2,
        description:
            'A couple or two adults buying only staple kitchen items here and handling sabzi, doodh, and meat separately.',
        quantities: {
            atta: 12,
            rice: 5,
            oil: 3,
            sugar: 3,
            daal: 4,
        },
    },
    {
        key: 'default-family',
        title: 'Four-person family starter basket',
        householdSize: 4,
        description:
            'A practical starting point for a small family before fresh produce, tea, milk, and school snacks are added.',
        quantities: {
            atta: 20,
            rice: 10,
            oil: 5,
            sugar: 6,
            daal: 6,
        },
    },
    {
        key: 'mid-size-family',
        title: 'Six-person family under pressure',
        householdSize: 6,
        description:
            'A mid-size household that cooks most meals at home and needs a sturdier monthly ration line in the budget.',
        quantities: {
            atta: 28,
            rice: 14,
            oil: 7,
            sugar: 8,
            daal: 9,
        },
    },
    {
        key: 'joint-family',
        title: 'Larger family with frequent refills',
        householdSize: 8,
        description:
            'Useful when a joint family or guest-heavy household needs to stress-test staples before the month starts.',
        quantities: {
            atta: 36,
            rice: 18,
            oil: 9,
            sugar: 10,
            daal: 12,
        },
    },
];

const calculatorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Ration Cost Estimator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: 'https://roznamcha.pk/tools/ration-cost-estimator',
    description:
        'Guest-mode Pakistan ration budget calculator using configurable staple prices for atta, rice, oil, sugar, and daal.',
};

export default function RationCostEstimator({
    currency,
    currencySymbol,
    defaultHouseholdSize,
    items,
    relatedLinks,
    activationPrefill,
    seo: seoProp,
    jsonLd: jsonLdProp,
}) {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const seo = seoProp ?? seoContent.rationCostEstimator;
    const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
    const prefillInputs = activationPrefill?.inputs ?? {};
    const [householdSize, setHouseholdSize] = React.useState(
        clampNumber(prefillInputs.householdSize ?? defaultHouseholdSize ?? 4, 1)
    );
    const [quantities, setQuantities] = React.useState(() =>
        (items ?? []).reduce((acc, item) => {
            const prefilled = prefillInputs?.quantities?.[item.key];
            acc[item.key] = prefilled ?? item.default_quantity ?? 0;
            return acc;
        }, {})
    );
    const lineItems = items ?? [];

    const total = React.useMemo(() => {
        return calculateTotal(lineItems, quantities);
    }, [lineItems, quantities]);

    const breakdown = React.useMemo(() => {
        const subtotal = total || 1;

        return lineItems
            .map((item) => {
                const quantity = clampNumber(quantities[item.key] ?? 0);
                const itemTotal = quantity * Number(item.price ?? 0);

                return {
                    ...item,
                    quantity,
                    itemTotal,
                    share: Math.round((itemTotal / subtotal) * 100),
                };
            })
            .sort((left, right) => right.itemTotal - left.itemTotal);
    }, [lineItems, quantities, total]);

    const scenarioCards = React.useMemo(() => {
        return exampleScenarios.map((scenario) => ({
            ...scenario,
            total: calculateTotal(lineItems, scenario.quantities),
        }));
    }, [lineItems]);

    const handleQuantityChange = (key, value) => {
        setQuantities((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <ToolLayout
            title="Ration Cost Estimator"
            subtitle="Estimate a realistic staple ration budget for your household before the next grocery run or monthly budget reset."
            description="This guest-mode tool gives Pakistani families a quick planning benchmark using configurable base prices for atta, rice, oil, sugar, and daal."
        >
            <SeoHead {...seo} jsonLd={pageSchema} />
            <Head>
                <script
                    key="ration-estimator-calculator-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
                />
            </Head>

            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70">Who It Helps</p>
                    <h2 className="mt-3 text-lg font-semibold text-[#001a4a]">Households planning before prices bite</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        Use this page if you want a quick ration benchmark before salary day, market day, or a monthly budget review.
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70">What Is Included</p>
                    <h2 className="mt-3 text-lg font-semibold text-[#001a4a]">Five staple items with editable quantities</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        The built-in basket covers {lineItems.map((item) => item.label).join(', ')}. You can change every quantity before calculating.
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70">What It Is Not</p>
                    <h2 className="mt-3 text-lg font-semibold text-[#001a4a]">A planning benchmark, not a live market survey</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        This page does not pull live mandi or supermarket prices, and it does not include sabzi, gosht, doodh, masalay, or delivery costs.
                    </p>
                </div>
            </section>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-[#001a4a]">Build your monthly staple basket</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Start with your normal monthly quantities. Adjust the basket to match how your household actually buys staples.
                            </p>
                        </div>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Guest Mode
                        </span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-base font-semibold text-[#001a4a]">Monthly quantities</h3>
                        <div className="space-y-3">
                            {lineItems.map((item) => (
                                <div
                                    key={item.key}
                                    className="grid gap-2 sm:grid-cols-[1.4fr_0.8fr_0.6fr] items-center"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{item.label}</p>
                                        <p className="text-xs text-slate-500">
                                            Base price: {currencySymbol} {formatCurrency(item.price ?? 0)} / {item.unit}
                                        </p>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={quantities[item.key] ?? ''}
                                        onChange={(event) => handleQuantityChange(item.key, event.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                                    />
                                    <span className="text-xs text-slate-500">{item.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="bg-[#001a4a] text-white rounded-2xl p-6 space-y-6 shadow-lg">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-yellow-200">Estimate</p>
                        <h2 className="text-3xl font-semibold mt-2">
                            {currencySymbol} {formatCurrency(total)}
                        </h2>
                        <p className="text-sm text-white/80">
                            Estimated monthly staple ration cost ({currency}) for the basket you entered.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                        <h3 className="text-sm font-semibold text-white">How to use this result</h3>
                        <ul className="mt-3 space-y-2 text-sm text-white/85">
                            <li>Use this number as your staple ration line, not as your full kitchen or food budget.</li>
                            <li>If you usually buy in weekly trips, split this total across about four market visits instead of treating it as one rigid shop.</li>
                            <li>Check the highest-cost items first before cutting every item equally.</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#08245d] p-4">
                        <h3 className="text-sm font-semibold text-white">Current cost drivers</h3>
                        <div className="mt-3 space-y-3">
                            {breakdown.slice(0, 3).map((item) => (
                                <div key={item.key} className="space-y-1">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span>{item.label}</span>
                                        <span className="text-white/80">
                                            {currencySymbol} {formatCurrency(item.itemTotal)}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/10">
                                        <div
                                            className="h-2 rounded-full bg-yellow-300"
                                            style={{ width: `${Math.max(item.share, 6)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ROZNAMCHA-ACTIVATION: result-adjacent save wall replaces passive sidebar CTA. */}
                    <SaveWall
                        toolKey="ration_cost_estimator"
                        inputs={{ householdSize, quantities, source: activationPrefill?.source ?? 'direct' }}
                        results={{ total, currency, currencySymbol }}
                        isAuthenticated={isAuthenticated}
                        saveEndpoint="tools.snapshots.store"
                        returnUrl={typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/tools/ration-cost-estimator'}
                    />
                </aside>
            </div>

            <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">How this estimate works</h2>
                    <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                        <li>1. Enter the monthly quantity you expect to buy for each staple item.</li>
                        <li>2. The tool multiplies each quantity by the fixed base price currently configured in Roznamcha.</li>
                        <li>3. It adds those line items into one monthly ration benchmark you can use in planning.</li>
                    </ol>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <h3 className="text-base font-semibold text-[#001a4a]">Current base basket on this page</h3>
                        <div className="mt-4 space-y-3">
                            {lineItems.map((item) => (
                                <div
                                    key={item.key}
                                    className="grid gap-2 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[1.2fr_0.8fr_0.8fr]"
                                >
                                    <div className="text-sm font-medium text-slate-700">{item.label}</div>
                                    <div className="text-sm text-slate-600">
                                        {currencySymbol} {formatCurrency(item.price ?? 0)} / {item.unit}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Default: {item.default_quantity} {item.unit}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-[#001a4a]">Assumptions and limits</h2>
                        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                            <li>This estimate uses fixed internal benchmark prices, not live city-by-city market feeds.</li>
                            <li>Household size is a guide for interpretation only. The tool does not auto-scale your basket.</li>
                            <li>Fresh vegetables, fruit, meat, milk, tea, spices, and brand upgrades are outside this staple-only model.</li>
                            <li>Utility Store rates, wholesale buying, and neighborhood kiryana prices can shift the real number materially.</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-[#001a4a]/10 bg-[#eef4ff] p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-[#001a4a]">How to use this estimate</h2>
                        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                            <li>Put this figure into the ration line of your monthly budget first, then add sabzi, meat, milk, and school snacks separately.</li>
                            <li>If the total feels high, cut or swap the two most expensive staples before you touch everything else.</li>
                            <li>Leave some room in your budget if flour, oil, or daal prices in your area move quickly between shops.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70">Context Only</p>
                        <h2 className="mt-2 text-xl font-semibold text-[#001a4a]">Add your household size for comparison, not calculation</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            This number does not change the estimate above. It is only here to help you compare your basket against the worked examples below and keep that context when you save the result.
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700" htmlFor="household">
                            Household size for comparison only
                        </label>
                        <input
                            id="household"
                            type="number"
                            min="1"
                            value={householdSize}
                            onChange={(event) => setHouseholdSize(clampNumber(event.target.value, 1))}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                        />
                    </div>
                </div>
            </section>

            <section className="mt-12">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0b2b6f]/70">Worked Examples</p>
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Worked household examples using the current built-in prices</h2>
                    <p className="text-sm leading-6 text-slate-600 max-w-3xl">
                        These are illustrative baskets built from the same base prices used by this page. They are here to help you judge your own estimate, not to claim one national market truth for every city.
                    </p>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    {scenarioCards.map((scenario) => (
                        <article key={scenario.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#001a4a]">{scenario.title}</h3>
                                    <p className="mt-1 text-sm text-slate-500">{scenario.householdSize}-person planning scenario</p>
                                </div>
                                <div className="rounded-full bg-[#eef4ff] px-3 py-1 text-sm font-semibold text-[#001a4a]">
                                    {currencySymbol} {formatCurrency(scenario.total)}
                                </div>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{scenario.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {lineItems.map((item) => (
                                    <span
                                        key={`${scenario.key}-${item.key}`}
                                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
                                    >
                                        {item.label}: {scenario.quantities[item.key] ?? 0} {item.unit}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">What can change your ration bill</h2>
                    <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                        <li>City and market choice: wholesale, Utility Store, and neighborhood kiryana rates rarely move together.</li>
                        <li>Brand habits: branded oil, premium rice, or packaged daal can raise the total quickly.</li>
                        <li>Buying rhythm: one big monthly stock-up behaves differently from weekly refills.</li>
                        <li>Family routine: guests, Ramadan cooking, school lunches, and work-from-home meals can shift staple usage.</li>
                    </ul>
                </div>

                <div className="rounded-2xl border border-[#001a4a]/10 bg-[#001a4a] p-6 text-white shadow-sm">
                    <h2 className="text-2xl font-semibold">Where to go next</h2>
                    <p className="mt-3 text-sm leading-6 text-white/80">
                        After estimating ration, compare it against the rest of your household pressure instead of treating groceries in isolation.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/kharcha-map"
                            className="inline-flex items-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-white"
                        >
                            Open Kharcha Map
                        </Link>
                        <Link
                            href="/survival-report"
                            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            View Survival Report
                        </Link>
                        <Link
                            href="/blog/ghar-ka-monthly-budget"
                            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            Read Ghar Ka Monthly Budget
                        </Link>
                    </div>
                </div>
            </section>

            <RelatedLinksBlock
                relatedTools={relatedLinks?.relatedTools ?? []}
                relatedBlogs={relatedLinks?.relatedBlogs ?? []}
            />
        </ToolLayout>
    );
}
