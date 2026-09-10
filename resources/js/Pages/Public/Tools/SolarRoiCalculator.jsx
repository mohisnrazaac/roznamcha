// Purpose: Phase 3 Flagship Solar Net Metering & Financial ROI Engine for roznamcha.pk
// Implements NEPRA Net Billing / Buyback framework, sizing heuristics, and 10-year battery TCO analysis.
// Author: Principal Full-Stack Engineer & Renewable Energy Systems Architect. Date: 2026-09-10.

import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Head, Link, usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import SeoHead from '../../../Components/SeoHead';
import FinancialDisclaimer from '../../../Components/Public/FinancialDisclaimer';
import SarkariTayariPromoCard from '../../../Components/SarkariTayariPromoCard';
import SaveWall from '../../../Components/Activation/SaveWall';
import {
    SOLAR_SYSTEM_BENCHMARKS,
    BATTERY_BENCHMARKS,
    DEFAULT_NEPRA_BUYBACK_RATE,
    DEFAULT_SELF_CONSUME_RATIO,
    recommendSolarSystemSize,
    calculateSolarRoi,
    calculateBatteryTco,
    getDefaultAvoidedTariff,
    estimateBillFromUnits,
    estimateUnitsFromBill,
} from '../../../lib/solarRoiEngine';

const faqItems = [
    {
        question: 'How does NEPRA Net Billing differ from traditional Net Metering?',
        answer: 'Under traditional Net Metering, exported solar units offset imported grid units 1-to-1 at retail slab rates. Under NEPRA\'s Net Billing (Buyback) framework, self-consumed solar power saves you the full DISCO retail tariff (Rs. 42–58+/unit), while exported excess units are credited at the National Average Energy Purchase Price (~Rs. 11.00/unit). Maximizing daytime self-consumption delivers the highest ROI.',
    },
    {
        question: 'Why does LiFePO4 battery storage cost less over 10 years than Tubular?',
        answer: 'While Tall Tubular lead-acid batteries have a lower upfront cost (Rs. ~140,000 per 48V bank), they degrade rapidly in Pakistani summer temperatures with a cycle life of only 800–1,200 cycles (2–3 years at 50% DoD), requiring 3 to 4 complete bank replacements over 10 years. LiFePO4 lithium batteries last 5,000–6,000 cycles (10+ years at 90% DoD) with zero replacements, resulting in ~35%–40% lower cost per stored kWh.',
    },
    {
        question: 'How long does the DISCO Green Meter process take in Pakistan?',
        answer: 'Typical processing time across LESCO, IESCO, GEPCO, and other DISCOs ranges from 45 to 90 days. The turnkey process includes NEPRA generation license application, distribution transformer load verification, third-party inspection, and bidirectional meter installation.',
    },
    {
        question: 'Can I run inverter air conditioners during grid load shedding?',
        answer: 'Standard On-Grid string inverters shut down immediately during grid outages for lineman safety (anti-islanding). To run air conditioners during load shedding, you need a Hybrid inverter with either Tubular or LiFePO4 battery storage sized to handle compressor inrush currents.',
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

const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Solar Net Metering & ROI Calculator Pakistan',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: 'https://roznamcha.pk/tools/solar-net-metering-roi-calculator',
    description:
        'Calculate turnkey solar system payback, NEPRA buyback earnings, and battery TCO (Tubular vs LiFePO4) under current Pakistan DISCO tariffs.',
};

export default function SolarRoiCalculator({
    defaults = {},
    initialUnits = 650,
    initialBill = 32000,
    seo: seoProp,
    jsonLd: jsonLdProp,
}) {
    const { url } = usePage();

    // Query parameters parser
    const queryParams = useMemo(() => {
        if (typeof window === 'undefined') return {};
        const params = new URLSearchParams(window.location.search);
        return {
            units: params.get('units') ? parseInt(params.get('units'), 10) : null,
            bill: params.get('bill') ? parseInt(params.get('bill'), 10) : null,
            size: params.get('size') || null,
        };
    }, []);

    // Initial state setup from query or props
    const [monthlyUnits, setMonthlyUnits] = useState(
        queryParams.units || defaults.monthlyUnits || initialUnits
    );
    const [monthlyBill, setMonthlyBill] = useState(
        queryParams.bill || defaults.monthlyBill || initialBill
    );

    // Dynamic recommendation based on input load
    const recommendedKey = useMemo(
        () => recommendSolarSystemSize(monthlyUnits, monthlyBill),
        [monthlyUnits, monthlyBill]
    );

    // Manual override state for system size
    const [selectedSystemKey, setSelectedSystemKey] = useState(
        queryParams.size && SOLAR_SYSTEM_BENCHMARKS[queryParams.size]
            ? queryParams.size
            : recommendedKey
    );

    // Synchronize recommendation if user hasn't explicitly locked a size
    const [hasUserOverriddenSize, setHasUserOverriddenSize] = useState(Boolean(queryParams.size));

    useEffect(() => {
        if (!hasUserOverriddenSize) {
            setSelectedSystemKey(recommendedKey);
        }
    }, [recommendedKey, hasUserOverriddenSize]);

    // Financial & Technical Control States
    const [selfConsumeRatio, setSelfConsumeRatio] = useState(DEFAULT_SELF_CONSUME_RATIO);
    const [retailTariff, setRetailTariff] = useState(() => getDefaultAvoidedTariff(monthlyUnits));
    const [isRetailTariffCustom, setIsRetailTariffCustom] = useState(false);

    // Auto update avoided tariff when units change (unless user manually customized it)
    useEffect(() => {
        if (!isRetailTariffCustom) {
            setRetailTariff(getDefaultAvoidedTariff(monthlyUnits));
        }
    }, [monthlyUnits, isRetailTariffCustom]);

    const [buybackRate, setBuybackRate] = useState(DEFAULT_NEPRA_BUYBACK_RATE);
    const [batteryType, setBatteryType] = useState('none');
    const [dailyStorageKwh, setDailyStorageKwh] = useState(5.12);
    const [copiedShare, setCopiedShare] = useState(false);

    // Active calculations
    const roiData = useMemo(() => {
        return calculateSolarRoi({
            systemSizeKey: selectedSystemKey,
            monthlyUnits,
            monthlyBill,
            selfConsumeRatio,
            retailTariff,
            buybackRate,
            batteryType,
            dailyStorageKwh,
        });
    }, [
        selectedSystemKey,
        monthlyUnits,
        monthlyBill,
        selfConsumeRatio,
        retailTariff,
        buybackRate,
        batteryType,
        dailyStorageKwh,
    ]);

    // Battery 10-Year TCO comparison data
    const batteryComparison = useMemo(() => {
        return calculateBatteryTco(dailyStorageKwh, 10, batteryType);
    }, [dailyStorageKwh, batteryType]);

    // Handlers
    const handleUnitsChange = (e) => {
        const val = Math.max(1, Math.min(50000, parseInt(e.target.value, 10) || 0));
        setMonthlyUnits(val);
        setMonthlyBill(estimateBillFromUnits(val));
    };

    const handleBillChange = (e) => {
        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
        setMonthlyBill(val);
        setMonthlyUnits(estimateUnitsFromBill(val));
    };

    const handleSelectSize = (key) => {
        setSelectedSystemKey(key);
        setHasUserOverriddenSize(true);
    };

    // WhatsApp Formatted Text Export
    const whatsappShareText = useMemo(() => {
        const urlWithParams = typeof window !== 'undefined'
            ? `${window.location.origin}/tools/solar-net-metering-roi-calculator?units=${monthlyUnits}&bill=${monthlyBill}&size=${selectedSystemKey}`
            : `https://roznamcha.pk/tools/solar-net-metering-roi-calculator?units=${monthlyUnits}&bill=${monthlyBill}`;

        return `My ${roiData.systemName} Solar Payback is ${roiData.paybackYears} years on Roznamcha.pk! Estimated monthly savings: PKR ${roiData.monthlySavings.toLocaleString('en-PK')}. Check yours: ${urlWithParams}`;
    }, [roiData, monthlyUnits, monthlyBill, selectedSystemKey]);

    const handleWhatsAppShare = () => {
        const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`;
        window.open(shareUrl, '_blank');
    };

    const handleCopySummary = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(whatsappShareText);
            setCopiedShare(true);
            setTimeout(() => setCopiedShare(false), 2000);
        }
    };

    const currentSystem = SOLAR_SYSTEM_BENCHMARKS[selectedSystemKey] || SOLAR_SYSTEM_BENCHMARKS['5kw'];

    return (
        <ToolLayout
            title="Solar Net Metering & Financial ROI Calculator Pakistan"
            description="Calculate turnkey solar payback, NEPRA buyback earnings, and battery TCO (Tubular vs LiFePO4) under real-world Pakistan DISCO tariffs."
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'Tools', href: '/tools' },
                { label: 'Solar ROI Calculator', href: '/tools/solar-net-metering-roi-calculator' },
            ]}
        >
            <Head>
                <title>Solar Net Metering & ROI Calculator Pakistan | Roznamcha</title>
                <meta
                    name="description"
                    content="Calculate residential turnkey solar system payback, NEPRA buyback earnings, and 10-year battery degradation (Tubular vs LiFePO4) in Pakistan."
                />
                <script type="application/ld+json">{JSON.stringify(webAppJsonLd)}</script>
                <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
            </Head>

            <div className="w-full space-y-8 pb-12">
                {/* Hero Header */}
                <div className="space-y-2 text-center max-w-3xl mx-auto pt-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-bold text-amber-900">
                        <span>☀️ NEPRA Net Billing & Payback Engine</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        <span>2026 Turnkey EPC Benchmarks</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#001a4a]">
                        Solar Net Metering & Financial ROI Engine
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        Model exact financial breakeven periods under NEPRA's Net Billing framework, compare avoided retail tariffs against national export buyback rates, and analyze 10-year battery degradation.
                    </p>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 1. TOP INPUT CARD: Sizing Bridge & Presets */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-bold text-[#001a4a]">
                                Step 1: Consumption Load & System Sizing
                            </h2>
                            <p className="text-xs text-slate-500">
                                Enter your monthly bill or units to auto-recommend the optimal residential capacity.
                            </p>
                        </div>
                        {/* Auto-suggested recommendation badge */}
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-extrabold text-emerald-800">
                            <span>⚡ Recommended for your load:</span>
                            <span className="rounded-lg bg-emerald-600 px-2 py-0.5 text-white uppercase tracking-wider font-black">
                                {SOLAR_SYSTEM_BENCHMARKS[recommendedKey]?.name}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        {/* Monthly Units Slider & Input */}
                        <div className="space-y-3 rounded-2xl bg-slate-50 p-5 border border-slate-200">
                            <div className="flex items-center justify-between">
                                <label htmlFor="solar-units-input" className="text-sm font-bold text-slate-700">
                                    Monthly Units Consumed (kWh)
                                </label>
                                <span className="text-xs font-bold text-slate-500">
                                    {monthlyUnits} units / month
                                </span>
                            </div>
                            <input
                                id="solar-units-slider"
                                type="range"
                                min="100"
                                max="2500"
                                step="25"
                                value={monthlyUnits}
                                onChange={handleUnitsChange}
                                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                            />
                            <div className="relative">
                                <input
                                    id="solar-units-input"
                                    type="number"
                                    min="1"
                                    max="50000"
                                    value={monthlyUnits}
                                    onChange={handleUnitsChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xl font-bold text-[#001a4a] focus:border-amber-500 focus:ring-amber-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                    kWh / mo
                                </span>
                            </div>
                        </div>

                        {/* Average Monthly Bill Slider & Input */}
                        <div className="space-y-3 rounded-2xl bg-slate-50 p-5 border border-slate-200">
                            <div className="flex items-center justify-between">
                                <label htmlFor="solar-bill-input" className="text-sm font-bold text-slate-700">
                                    Average Monthly Bill (PKR)
                                </label>
                                <span className="text-xs font-bold text-slate-500">
                                    PKR {monthlyBill.toLocaleString('en-PK')}
                                </span>
                            </div>
                            <input
                                id="solar-bill-slider"
                                type="range"
                                min="5000"
                                max="150000"
                                step="1000"
                                value={monthlyBill}
                                onChange={handleBillChange}
                                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                            />
                            <div className="relative">
                                <input
                                    id="solar-bill-input"
                                    type="number"
                                    min="0"
                                    max="5000000"
                                    value={monthlyBill}
                                    onChange={handleBillChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xl font-bold text-[#001a4a] focus:border-amber-500 focus:ring-amber-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                    PKR
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive System Size Selector Pills */}
                    <div className="mt-6 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                            Explore Turnkey Capacity:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {Object.entries(SOLAR_SYSTEM_BENCHMARKS).map(([key, item]) => {
                                const isSelected = selectedSystemKey === key;
                                const isRec = recommendedKey === key;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleSelectSize(key)}
                                        className={`relative flex flex-col items-start rounded-2xl p-4 text-left transition-all duration-150 border-2 ${
                                            isSelected
                                                ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/30'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        {isRec && (
                                            <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                                                RECOMMENDED
                                            </span>
                                        )}
                                        <span className="text-base font-extrabold text-[#001a4a]">
                                            {item.name}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 mt-0.5">
                                            Outputs ~{item.monthlyGen} units/mo
                                        </span>
                                        <span className="text-xs font-bold text-amber-700 mt-2">
                                            PKR {(item.totalCapex / 100000).toFixed(1)} Lakhs EPC
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 2. INTERACTIVE FINANCIAL ROI SUMMARY CARD */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-3xl border-2 border-[#001a4a] bg-gradient-to-br from-[#001a4a] via-[#02286b] to-[#011638] p-6 sm:p-8 text-white shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block">
                                Real-World Financial Return
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                                {roiData.systemName} Payback & Savings Summary
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleWhatsAppShare}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow transition active:scale-95"
                            >
                                <span>📲 Share on WhatsApp</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleCopySummary}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2.5 text-xs font-bold text-slate-200 transition"
                            >
                                <span>{copiedShare ? '✓ Copied' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>

                    {/* 4 Core Financial Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                        {/* Metric 1: Total Upfront Investment */}
                        <div className="rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/10">
                            <span className="text-xs font-medium uppercase tracking-wider text-blue-200 block">
                                Upfront Investment (Capex)
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-white block mt-1">
                                PKR {roiData.totalSystemCapex.toLocaleString('en-PK')}
                            </span>
                            <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-blue-300">
                                <span>EPC: {(currentSystem.turnkeyEpc / 100000).toFixed(1)}L</span>
                                <span>•</span>
                                <span>Meter: {(currentSystem.greenMeterFee / 1000).toFixed(0)}k</span>
                                {roiData.batteryCapex > 0 && (
                                    <>
                                        <span>•</span>
                                        <span>Bat: {(roiData.batteryCapex / 100000).toFixed(1)}L</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Metric 2: Monthly Bill Reduction */}
                        <div className="rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/10">
                            <span className="text-xs font-medium uppercase tracking-wider text-emerald-300 block">
                                Monthly Bill Reduction
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-emerald-300 block mt-1">
                                PKR {roiData.monthlySavings.toLocaleString('en-PK')}
                            </span>
                            <span className="mt-2 text-[11px] text-emerald-200/80 block">
                                Avoided: Rs. {roiData.avoidedCostSavings.toLocaleString('en-PK')} | Export: Rs. {roiData.exportRevenue.toLocaleString('en-PK')}
                            </span>
                        </div>

                        {/* Metric 3: Estimated Payback Period */}
                        <div className="rounded-2xl bg-amber-500/20 backdrop-blur-md p-5 border border-amber-400/30">
                            <span className="text-xs font-medium uppercase tracking-wider text-amber-300 block">
                                Estimated Payback Period
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-amber-300 block mt-1">
                                {roiData.paybackFormatted}
                            </span>
                            <span className="mt-2 text-[11px] text-amber-200/90 block font-semibold">
                                {roiData.paybackYears} Years to Full Breakeven
                            </span>
                        </div>

                        {/* Metric 4: 25-Year Lifetime Energy Value */}
                        <div className="rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/10">
                            <span className="text-xs font-medium uppercase tracking-wider text-blue-200 block">
                                25-Year Free Energy Value
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-cyan-300 block mt-1">
                                PKR {(roiData.lifetimeGrossSavings / 100000).toFixed(1)} Lakhs
                            </span>
                            <span className="mt-2 text-[11px] text-cyan-200/80 block">
                                Net Value: PKR {(roiData.lifetimeNetValue / 100000).toFixed(1)} Lakhs ({roiData.lifetimeRoiPercent}% ROI)
                            </span>
                        </div>
                    </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 3. INTERACTIVE CONTROLS: Self-Consumption & Tariff Ratios */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Control Card A: Self-Consumption vs Export Slider */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-[#001a4a]">
                                Self-Consumption vs. Grid Export Ratio
                            </h3>
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                {selfConsumeRatio}% Self / {100 - selfConsumeRatio}% Export
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Under NEPRA Net Billing, self-consumed solar energy directly offsets expensive DISCO retail tariffs, while exported energy is credited at the national buyback rate.
                        </p>

                        <div className="space-y-2 pt-2">
                            <input
                                type="range"
                                min="20"
                                max="90"
                                step="5"
                                value={selfConsumeRatio}
                                onChange={(e) => setSelfConsumeRatio(parseInt(e.target.value, 10))}
                                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                            />
                            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                <span>20% (Vacant / Low Daytime Load)</span>
                                <span>Default (60%)</span>
                                <span>90% (Daytime Commercial / ACs)</span>
                            </div>
                        </div>

                        {/* Energy Split Visualizer */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5">
                                <span className="text-xs font-bold text-amber-900 block">
                                    ☀️ Self-Consumed (Daytime Load)
                                </span>
                                <span className="text-lg font-black text-amber-800 block mt-1">
                                    {roiData.selfConsumedUnits} kWh / mo
                                </span>
                                <span className="text-xs text-amber-700 block mt-0.5">
                                    Saves: Rs. {roiData.avoidedCostSavings.toLocaleString('en-PK')} @ Rs. {retailTariff}/kWh
                                </span>
                            </div>

                            <div className="rounded-2xl bg-sky-50 border border-sky-200 p-3.5">
                                <span className="text-xs font-bold text-sky-900 block">
                                    ⚡ Exported to DISCO (Green Meter)
                                </span>
                                <span className="text-lg font-black text-sky-800 block mt-1">
                                    {roiData.exportedUnits} kWh / mo
                                </span>
                                <span className="text-xs text-sky-700 block mt-0.5">
                                    Credits: Rs. {roiData.exportRevenue.toLocaleString('en-PK')} @ Rs. {buybackRate}/kWh
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Control Card B: NEPRA Buyback & Retail Avoided Tariffs */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                        <h3 className="text-base font-bold text-[#001a4a]">
                            Tariff Differential (Net Billing Parameters)
                        </h3>
                        <p className="text-xs text-slate-500">
                            Adjust avoided retail import cost and NEPRA buyback export rates to match your utility profile.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {/* Avoided Retail Tariff */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="retail-tariff-input" className="text-xs font-bold text-slate-700">
                                        Avoided Retail Tariff (PKR/kWh)
                                    </label>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        (DISCO Retail + Taxes)
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        id="retail-tariff-input"
                                        type="number"
                                        step="0.5"
                                        min="20"
                                        max="100"
                                        value={retailTariff}
                                        onChange={(e) => {
                                            setRetailTariff(parseFloat(e.target.value) || 0);
                                            setIsRetailTariffCustom(true);
                                        }}
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                        Rs. / unit
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-500 block">
                                    Auto-calibrated based on slab consumption.
                                </span>
                            </div>

                            {/* NEPRA Buyback Rate */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="buyback-rate-input" className="text-xs font-bold text-slate-700">
                                        NEPRA Buyback Rate (PKR/kWh)
                                    </label>
                                    <span
                                        className="text-[10px] text-amber-700 font-semibold cursor-help"
                                        title="National Average Energy Purchase Price (EPP) calibrated under NEPRA SRO Net Billing framework"
                                    >
                                        ℹ️ NEPRA SRO
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        id="buyback-rate-input"
                                        type="number"
                                        step="0.25"
                                        min="5"
                                        max="30"
                                        value={buybackRate}
                                        onChange={(e) => setBuybackRate(parseFloat(e.target.value) || 0)}
                                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-amber-500 focus:ring-amber-500"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                        Rs. / unit
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-500 block">
                                    National Average EPP buyback (~Rs. 11/unit).
                                </span>
                            </div>
                        </div>

                        {/* Annual Inverter Reserve */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-600">
                                    Turnkey Inverter & Panel Area
                                </span>
                                <span className="font-bold text-slate-800">
                                    ~{currentSystem.requiredAreaSqFt} sq. ft. rooftop space
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 4. MODULE C: BATTERY STORAGE & 10-YEAR TCO SELECTOR */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-indigo-100 text-indigo-900 px-2.5 py-0.5 text-xs font-bold">
                                    Module C
                                </span>
                                <h3 className="text-xl font-bold text-[#001a4a]">
                                    Battery Storage & Degradation Selector (Tubular vs. LiFePO4)
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Analyze backup storage options, replacement shock timelines, and 10-year Total Cost of Ownership.
                            </p>
                        </div>

                        {/* Battery Selection Toggles */}
                        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                            {['none', 'tubular', 'lifepo4'].map((bType) => (
                                <button
                                    key={bType}
                                    type="button"
                                    onClick={() => setBatteryType(bType)}
                                    className={`rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all ${
                                        batteryType === bType
                                            ? 'bg-white text-[#001a4a] shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {bType === 'none' && 'On-Grid Only'}
                                    {bType === 'tubular' && 'Hybrid + Tubular'}
                                    {bType === 'lifepo4' && 'Hybrid + LiFePO4'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 10-Year TCO Comparison Table / Visualizer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Tubular Lead-Acid Card */}
                        <div
                            className={`rounded-2xl p-5 border-2 transition-all ${
                                batteryType === 'tubular'
                                    ? 'border-amber-400 bg-amber-50/50 shadow-md'
                                    : 'border-slate-200 bg-slate-50/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-slate-800">
                                    Tall Tubular Lead-Acid (48V Bank)
                                </span>
                                <span className="rounded-md bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-bold">
                                    50% DoD Max
                                </span>
                            </div>

                            <div className="mt-4 space-y-2 text-xs text-slate-600">
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>Initial 48V Bank Cost:</span>
                                    <strong className="text-slate-900">PKR 140,000</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>Cycle Life (1 cycle/day):</span>
                                    <strong className="text-slate-900">~912 cycles (~2.5 Years)</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>10-Year Replacement Schedule:</span>
                                    <strong className="text-rose-600">Years 2.5, 5.0, 7.5 (3 Replacements)</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>Total Replacement Capex:</span>
                                    <strong className="text-slate-900">PKR {batteryComparison.comparison.tubular.totalReplacementCost.toLocaleString('en-PK')}</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>10-Year TCO (incl. water/maintenance):</span>
                                    <strong className="text-base font-black text-rose-700">
                                        PKR {batteryComparison.comparison.tubular.tenYearTco.toLocaleString('en-PK')}
                                    </strong>
                                </div>
                                <div className="flex justify-between py-1 pt-2">
                                    <span>Effective Cost per Stored kWh:</span>
                                    <strong className="text-sm font-bold text-slate-900">
                                        Rs. {batteryComparison.comparison.tubular.costPerStoredKwh} / kWh
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* LiFePO4 Card */}
                        <div
                            className={`rounded-2xl p-5 border-2 transition-all ${
                                batteryType === 'lifepo4'
                                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                                    : 'border-slate-200 bg-slate-50/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black text-[#001a4a]">
                                    LiFePO4 Lithium (5.12 kWh Rack)
                                </span>
                                <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold">
                                    90% Usable DoD
                                </span>
                            </div>

                            <div className="mt-4 space-y-2 text-xs text-slate-600">
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>Initial 5.12 kWh Rack Cost:</span>
                                    <strong className="text-slate-900">PKR 400,000</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>Cycle Life (1 cycle/day):</span>
                                    <strong className="text-emerald-700 font-bold">5,000–6,000 cycles (10+ Years)</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>10-Year Replacement Schedule:</span>
                                    <strong className="text-emerald-700">Zero Mid-Term Replacements</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>Cycle Health after 3,650 Cycles:</span>
                                    <strong className="text-emerald-700 font-bold">{batteryComparison.comparison.lifepo4.residualHealthPercent}% Residual Health (&gt;75%)</strong>
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-200/80">
                                    <span>10-Year Total TCO:</span>
                                    <strong className="text-base font-black text-emerald-700">
                                        PKR {batteryComparison.comparison.lifepo4.tenYearTco.toLocaleString('en-PK')}
                                    </strong>
                                </div>
                                <div className="flex justify-between py-1 pt-2">
                                    <span>Effective Cost per Stored kWh:</span>
                                    <div className="text-right">
                                        <strong className="text-sm font-bold text-emerald-800 block">
                                            Rs. {batteryComparison.comparison.lifepo4.costPerStoredKwh} / kWh
                                        </strong>
                                        <span className="text-[10px] text-emerald-600 font-bold">
                                            ({batteryComparison.comparison.lifepo4SavingsPercent}% cheaper over 10 years)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ────────────────────────────────────────────────────────── */}
                {/* 5. PRACTICAL FREQUENTLY ASKED QUESTIONS (FAQ Accordion) */}
                {/* ────────────────────────────────────────────────────────── */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-[#001a4a]">
                            Frequently Asked Questions (Solar Net Billing in Pakistan)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Essential facts about NEPRA SRO buyback rules, DISCO meter applications, and inverter warranties.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqItems.map((faq, idx) => (
                            <details
                                key={idx}
                                className="group rounded-2xl border border-slate-200 bg-slate-50/50 p-4 open:bg-white open:border-amber-300 transition-colors"
                            >
                                <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-800 group-open:text-[#001a4a] text-sm">
                                    <span>{faq.question}</span>
                                    <span className="text-slate-400 group-open:rotate-180 transition-transform font-black">
                                        ▼
                                    </span>
                                </summary>
                                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Save Wall & Activation */}
                <SaveWall toolKey="solar_roi_calculator" currentResults={roiData} />

                {/* Sarkari Tayari Promo Card */}
                <SarkariTayariPromoCard currentContext="solar-net-metering" />

                {/* Financial Disclaimer */}
                <FinancialDisclaimer />
            </div>
        </ToolLayout>
    );
}

SolarRoiCalculator.propTypes = {
    defaults: PropTypes.object,
    initialUnits: PropTypes.number,
    initialBill: PropTypes.number,
    seo: PropTypes.object,
    jsonLd: PropTypes.object,
};
