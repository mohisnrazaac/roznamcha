import React from 'react';
import { usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import RelatedLinksBlock from '../../../Components/RelatedLinksBlock';
import SaveWall from '../../../Components/Activation/SaveWall';

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

export default function RationCostEstimator({
    currency,
    currencySymbol,
    comparisonPlaceholderPercent,
    defaultHouseholdSize,
    items,
    relatedLinks,
    activationPrefill,
}) {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
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

    const total = React.useMemo(() => {
        return (items ?? []).reduce((sum, item) => {
            const qty = clampNumber(quantities[item.key] ?? 0);
            return sum + qty * (item.price ?? 0);
        }, 0);
    }, [items, quantities]);

    const handleQuantityChange = (key, value) => {
        setQuantities((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <ToolLayout
            title="Ration Cost Estimator"
            subtitle="Estimate your monthly ration spend in Pakistan without logging in."
            description="Use base prices for atta, rice, oil, sugar, and daal to get a quick monthly total."
        >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="household">
                            Household size
                        </label>
                        <input
                            id="household"
                            type="number"
                            min="1"
                            value={householdSize}
                            onChange={(event) => setHouseholdSize(clampNumber(event.target.value, 1))}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                        />
                        <p className="text-xs text-slate-500">
                            Used for context only. Future updates can scale quantities per person.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-base font-semibold text-[#001a4a]">Monthly quantities</h2>
                        <div className="space-y-3">
                            {(items ?? []).map((item) => (
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
                        <p className="text-sm text-white/80">Estimated monthly ration cost ({currency}).</p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 text-sm text-white/90">
                        This is {comparisonPlaceholderPercent}% higher than last month.
                    </div>

                    {/* ROZNAMCHA-ACTIVATION: result-adjacent save wall replaces passive sidebar CTA. */}
                    <SaveWall
                        toolKey="ration_cost_estimator"
                        inputs={{ householdSize, quantities, source: activationPrefill?.source ?? 'direct' }}
                        results={{ total, currency, currencySymbol, comparisonPlaceholderPercent }}
                        isAuthenticated={isAuthenticated}
                        saveEndpoint="tools.snapshots.store"
                        returnUrl={typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/tools/ration-cost-estimator'}
                    />
                </aside>
            </div>

            <div className="mt-10 text-xs text-slate-500">
                {/* Extension point: plug in live market prices or household-based scaling rules here later. */}
                Base prices are configurable and can be updated without redeploying the estimator UI.
            </div>

            <RelatedLinksBlock
                relatedTools={relatedLinks?.relatedTools ?? []}
                relatedBlogs={relatedLinks?.relatedBlogs ?? []}
            />
        </ToolLayout>
    );
}
