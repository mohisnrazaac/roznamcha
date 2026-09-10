// Purpose: High-retention Smart Slab-Cliff Visualizer and NEPRA warning engine for Pakistan electricity bills. Author: Principal UX & Full-Stack Engineer. Date: 2026-09-10.

import React from 'react';
import PropTypes from 'prop-types';
import { evaluateSlabCliff, calculatePakistanElectricityBill } from '../../lib/electricityTariff';

/**
 * Maps units (0 to 800) non-linearly to percentage (0% to 100%) for clear meter readability
 * 0-50 -> 0% to 15%
 * 50-100 -> 15% to 30%
 * 100-200 -> 30% to 55%  (Cliff is at exactly 55%)
 * 200-300 -> 55% to 75%
 * 300-700 -> 75% to 92%
 * 700+ -> 92% to 100%
 */
function getMeterPercentage(units) {
    const u = Math.max(0, Math.min(800, Number(units) || 0));
    if (u <= 50) return (u / 50) * 15;
    if (u <= 100) return 15 + ((u - 50) / 50) * 15;
    if (u <= 200) return 30 + ((u - 100) / 100) * 25;
    if (u <= 300) return 55 + ((u - 200) / 100) * 20;
    if (u <= 700) return 75 + ((u - 300) / 400) * 17;
    return Math.min(100, 92 + ((u - 700) / 100) * 8);
}

export default function SlabCliffVisualizer({
    units,
    disco = 'lesco',
    onScrollToAppliances,
}) {
    const cliffData = React.useMemo(() => evaluateSlabCliff(units, disco), [units, disco]);
    const billData = React.useMemo(() => calculatePakistanElectricityBill(units, disco), [units, disco]);
    const meterPercent = getMeterPercentage(units);

    const handleCtaClick = (e) => {
        e.preventDefault();
        if (typeof onScrollToAppliances === 'function') {
            onScrollToAppliances();
        } else {
            const el = document.getElementById('appliance-breakdown');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                el.classList.add('ring-4', 'ring-amber-400');
                setTimeout(() => el.classList.remove('ring-4', 'ring-amber-400'), 2000);
            }
        }
    };

    // Card styling based on alert level
    const cardThemes = {
        danger: {
            bg: 'bg-rose-50/80',
            border: 'border-rose-300',
            glow: 'ring-1 ring-rose-300 shadow-rose-100',
            titleText: 'text-rose-900',
            bodyText: 'text-rose-800',
            ctaBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200',
            badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
        },
        warning: {
            bg: 'bg-amber-50/80',
            border: 'border-amber-300',
            glow: 'ring-1 ring-amber-300 shadow-amber-100',
            titleText: 'text-amber-950',
            bodyText: 'text-amber-900',
            ctaBtn: 'bg-[#001a4a] hover:bg-[#012261] text-white shadow-slate-200',
            badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
        },
        success: {
            bg: 'bg-emerald-50/70',
            border: 'border-emerald-300',
            glow: 'ring-1 ring-emerald-200',
            titleText: 'text-emerald-950',
            bodyText: 'text-emerald-900',
            ctaBtn: 'bg-emerald-700 hover:bg-emerald-800 text-white',
            badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        },
        info: {
            bg: 'bg-sky-50/80',
            border: 'border-sky-300',
            glow: 'ring-1 ring-sky-200',
            titleText: 'text-sky-950',
            bodyText: 'text-sky-900',
            ctaBtn: 'bg-sky-700 hover:bg-sky-800 text-white',
            badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        },
    };

    const theme = cardThemes[cliffData.level] || cardThemes.info;

    return (
        <section
            aria-label="NEPRA Slab Cliff Visualizer"
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-6"
        >
            {/* Header: Consumer State Badges & Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            NEPRA Tariff Status
                        </span>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${theme.badgeClass}`}
                        >
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    cliffData.badgeColor === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                            />
                            {cliffData.badge}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                        Current Input: <strong className="text-slate-900 font-semibold">{units} Units</strong>
                        <span className="mx-2 text-slate-300">|</span>
                        Est. Bill:{' '}
                        <strong className="text-[#001a4a] font-bold">
                            PKR {billData.totalBill.toLocaleString('en-PK')}
                        </strong>
                        <span className="text-xs text-slate-500 font-normal ml-1">
                            (~Rs. {billData.effectiveRatePerUnit}/unit avg)
                        </span>
                    </p>
                </div>

                <div className="text-right">
                    <span className="text-xs text-slate-400 block">Critical Cutoff</span>
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5 inline-block">
                        200-Unit Cliff Wall
                    </span>
                </div>
            </div>

            {/* Interactive Progress Meter Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span className="text-emerald-700">Protected Tier (1-200)</span>
                    <span className="font-bold text-rose-600">⚡ 200 Slab Cliff</span>
                    <span className="text-slate-600">Unprotected Tier (201+)</span>
                </div>

                {/* Progress Meter Track */}
                <div
                    className="relative h-7 w-full overflow-hidden rounded-xl bg-slate-100 p-1 border border-slate-200"
                    role="progressbar"
                    aria-label="Units consumed relative to NEPRA slab thresholds"
                    aria-valuenow={units}
                    aria-valuemin={0}
                    aria-valuemax={800}
                >
                    {/* Background Slab Bands */}
                    <div className="absolute inset-0 flex h-full w-full opacity-70">
                        {/* 0 - 50: Lifeline */}
                        <div className="h-full bg-emerald-300" style={{ width: '15%' }} title="0-50 Lifeline" />
                        {/* 50 - 100: Protected Lower */}
                        <div className="h-full bg-emerald-400" style={{ width: '15%' }} title="50-100 Protected Tier 1" />
                        {/* 100 - 200: Protected Upper */}
                        <div className="h-full bg-teal-400" style={{ width: '25%' }} title="100-200 Protected Tier 2" />
                        {/* 200 - 300: Unprotected Tier 1 */}
                        <div className="h-full bg-amber-400" style={{ width: '20%' }} title="201-300 Unprotected" />
                        {/* 300 - 700: Unprotected Tier 2 */}
                        <div className="h-full bg-orange-400" style={{ width: '17%' }} title="301-700 Upper Tier" />
                        {/* 700+: Peak Slab */}
                        <div className="h-full bg-rose-500" style={{ width: '8%' }} title="700+ Peak Rate" />
                    </div>

                    {/* Slab Cliff Wall Line at 200 units (55% width) */}
                    <div
                        className="absolute top-0 bottom-0 z-10 w-1 bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.8)] animate-pulse"
                        style={{ left: '55%' }}
                    />

                    {/* Active Consumption Fill Overlay */}
                    <div
                        className={`absolute top-1 bottom-1 left-1 rounded-lg transition-all duration-300 ease-out ${
                            units <= 200 ? 'bg-emerald-600/60' : 'bg-slate-900/65'
                        }`}
                        style={{ width: `calc(${Math.min(99, meterPercent)}% - 2px)` }}
                    />

                    {/* Position Indicator Pin */}
                    <div
                        className="absolute top-0 bottom-0 z-20 flex -translate-x-1/2 items-center justify-center transition-all duration-300 ease-out"
                        style={{ left: `${Math.max(2, Math.min(98, meterPercent))}%` }}
                    >
                        <div className="h-8 w-3 rounded-full border-2 border-white bg-slate-900 shadow-md ring-2 ring-slate-900/20" />
                    </div>
                </div>

                {/* Meter Ticks & Labels */}
                <div className="relative h-6 text-[11px] font-semibold text-slate-500">
                    <span className="absolute left-0 -translate-x-0">0</span>
                    <span className="absolute" style={{ left: '15%', transform: 'translateX(-50%)' }}>
                        50
                    </span>
                    <span className="absolute" style={{ left: '30%', transform: 'translateX(-50%)' }}>
                        100
                    </span>
                    <span
                        className="absolute text-rose-600 font-extrabold flex flex-col items-center"
                        style={{ left: '55%', transform: 'translateX(-50%)' }}
                    >
                        <span>200</span>
                    </span>
                    <span className="absolute" style={{ left: '75%', transform: 'translateX(-50%)' }}>
                        300
                    </span>
                    <span className="absolute" style={{ left: '92%', transform: 'translateX(-50%)' }}>
                        700
                    </span>
                </div>
            </div>

            {/* Live Announcement Region & Dynamic Alert Card */}
            <div
                role="status"
                aria-live="polite"
                className={`rounded-xl border p-4 sm:p-5 shadow-sm transition-all duration-300 ${theme.bg} ${theme.border} ${theme.glow}`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <h3 className={`text-base sm:text-lg font-bold ${theme.titleText}`}>
                                {cliffData.title}
                            </h3>
                            {cliffData.savings > 0 && (
                                <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                                    Save ~Rs. {cliffData.savings.toLocaleString('en-PK')}
                                </span>
                            )}
                        </div>

                        <p className={`text-sm sm:text-base leading-relaxed ${theme.bodyText}`}>
                            {cliffData.message}
                        </p>

                        {cliffData.type === 'cliff_critical' && (
                            <p className="text-xs text-rose-700 font-medium">
                                💡 Tip: Surcharges (FPA, FC Surcharge) and GST apply at full commercial/unprotected
                                rates once 200 units are exceeded.
                            </p>
                        )}
                    </div>

                    <div className="sm:shrink-0">
                        <button
                            type="button"
                            onClick={handleCtaClick}
                            className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 shadow ${theme.ctaBtn}`}
                        >
                            {cliffData.ctaText}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

SlabCliffVisualizer.propTypes = {
    units: PropTypes.number.isRequired,
    disco: PropTypes.string,
    onScrollToAppliances: PropTypes.func,
};
