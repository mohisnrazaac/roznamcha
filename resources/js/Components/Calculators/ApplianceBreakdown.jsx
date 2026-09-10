// Purpose: Mobile-first interactive appliance breakdown with load sliders and two-way sync for Roznamcha electricity calculator. Author: Principal UX & Full-Stack Engineer. Date: 2026-09-10.

import React from 'react';
import PropTypes from 'prop-types';
import {
    APPLIANCE_PRESETS,
    calculateApplianceMonthlyUnits,
    calculateTotalApplianceUnits,
} from '../../lib/electricityTariff';

export default function ApplianceBreakdown({
    appliancesState,
    onChange,
    onCutUnits,
    currentUnits,
}) {
    // Calculate individual monthly units and total
    const computedBreakdown = React.useMemo(() => {
        let total = 0;
        const details = APPLIANCE_PRESETS.map((appliance) => {
            const state = appliancesState[appliance.id] || {
                hours: appliance.defaultHours,
                qty: appliance.defaultQty,
            };
            const monthlyUnits = calculateApplianceMonthlyUnits(appliance, state.hours, state.qty);
            total += monthlyUnits;
            return {
                ...appliance,
                hours: state.hours,
                qty: state.qty,
                monthlyUnits,
            };
        });

        return {
            total: Math.round(total),
            details,
        };
    }, [appliancesState]);

    const handleHoursChange = (id, newHours) => {
        const parsed = Math.max(0, Number(newHours) || 0);
        const nextState = {
            ...appliancesState,
            [id]: {
                ...(appliancesState[id] || {}),
                hours: parsed,
            },
        };
        const newTotal = calculateTotalApplianceUnits(nextState);
        onChange(nextState, newTotal);
    };

    const handleQtyChange = (id, newQty, maxQty) => {
        const clamped = Math.max(0, Math.min(maxQty, Number(newQty) || 0));
        const nextState = {
            ...appliancesState,
            [id]: {
                ...(appliancesState[id] || {}),
                qty: clamped,
            },
        };
        const newTotal = calculateTotalApplianceUnits(nextState);
        onChange(nextState, newTotal);
    };

    // Quick Action: Cut 10 Units to help escape a cliff
    const handleQuickCut = () => {
        // Find highest cooling or motor load to trim 10-15 units
        let nextState = { ...appliancesState };
        const ac15 = nextState.inverter_ac_1_5 || { hours: 4, qty: 1 };
        const ac10 = nextState.non_inverter_ac_1_0 || { hours: 0, qty: 1 };
        const pump = nextState.water_pump || { hours: 1, qty: 1 };

        if (ac15.qty > 0 && ac15.hours >= 0.5) {
            // Trimming 0.5 hr AC saves 0.5 * 1.2 * 30 = 18 units!
            nextState.inverter_ac_1_5 = { ...ac15, hours: Math.max(0, ac15.hours - 0.5) };
        } else if (ac10.qty > 0 && ac10.hours >= 0.5) {
            // Trimming 0.5 hr saves 0.5 * 0.9 * 30 = 13.5 units
            nextState.non_inverter_ac_1_0 = { ...ac10, hours: Math.max(0, ac10.hours - 0.5) };
        } else if (pump.qty > 0 && pump.hours > 0.25) {
            // Trimming 15 mins pump saves 0.25 * 1.1 * 30 = 8.25 units
            nextState.water_pump = { ...pump, hours: Math.max(0, pump.hours - 0.25) };
        }

        const newTotal = calculateTotalApplianceUnits(nextState);
        onChange(nextState, newTotal);
        if (typeof onCutUnits === 'function') {
            onCutUnits();
        }
    };

    // Reset to Pakistani standard averages
    const handleResetDefaults = () => {
        const defaults = {};
        APPLIANCE_PRESETS.forEach((preset) => {
            defaults[preset.id] = {
                hours: preset.defaultHours,
                qty: preset.defaultQty,
            };
        });
        const newTotal = calculateTotalApplianceUnits(defaults);
        onChange(defaults, newTotal);
    };

    return (
        <section
            id="appliance-breakdown"
            aria-label="Household Appliance Load Breakdown"
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-6 transition-all"
        >
            {/* Component Header & Quick Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#001a4a] flex items-center gap-2">
                        <span>⚡ Appliance Load Breakdown</span>
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5">
                            Real-time Load Sliders
                        </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Slide operating hours down to trim units and drop below the protected slab cliff.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleQuickCut}
                        className="inline-flex items-center gap-1 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900 transition active:scale-95 min-h-[44px]"
                        title="Reduce high-draw load by ~10-15 units to escape slab penalty"
                    >
                        <span>✂️ Quick Cut ~10-15 Units</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="inline-flex items-center rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition active:scale-95 min-h-[44px]"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Visual Share Bar: Which appliances drive the bill */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Monthly Appliance Share Breakdown</span>
                    <span className="text-slate-900 font-bold">
                        Total Appliance Load: {computedBreakdown.total} Units
                    </span>
                </div>

                <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200">
                    {computedBreakdown.details.map((item, idx) => {
                        const pct =
                            computedBreakdown.total > 0
                                ? (item.monthlyUnits / computedBreakdown.total) * 100
                                : 0;
                        if (pct <= 0) return null;
                        const colors = [
                            'bg-sky-500',
                            'bg-indigo-500',
                            'bg-emerald-500',
                            'bg-amber-500',
                            'bg-teal-400',
                        ];
                        return (
                            <div
                                key={item.id}
                                className={`h-full ${colors[idx % colors.length]} transition-all duration-300`}
                                style={{ width: `${pct}%` }}
                                title={`${item.name}: ${item.monthlyUnits} units (${Math.round(pct)}%)`}
                            />
                        );
                    })}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600">
                    <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-sky-500" /> 1.5T AC
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" /> 1.0T AC
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Fridge / Freezer
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500" /> Water Pump
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-teal-400" /> Fans & Lights
                    </span>
                </div>
            </div>

            {/* Grid of Interactive Appliance Cards (Responsive 1-col on mobile, 2-col on desktop) */}
            <div className="grid gap-4 sm:grid-cols-2">
                {computedBreakdown.details.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:bg-slate-50 hover:border-slate-300 flex flex-col justify-between space-y-3"
                        >
                            {/* Card Top: Name, Ratings & Monthly Units */}
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-base font-extrabold text-[#001a4a] block">
                                        {item.monthlyUnits}{' '}
                                        <span className="text-xs font-semibold text-slate-500">units</span>
                                    </span>
                                    <span className="text-[11px] text-slate-400">/ month</span>
                                </div>
                            </div>

                            {/* Controls: Quantity Selector + Hours Slider */}
                            <div className="space-y-3 pt-1">
                                {/* Quantity Stepper */}
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs font-medium text-slate-600">
                                        Quantity:
                                    </span>
                                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-sm">
                                        <button
                                            type="button"
                                            aria-label={`Decrease ${item.name} quantity`}
                                            disabled={item.qty <= 0}
                                            onClick={() => handleQtyChange(item.id, item.qty - 1, item.maxQty)}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-l-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-base active:bg-slate-200"
                                        >
                                            −
                                        </button>
                                        <span className="w-9 text-center text-xs font-bold text-slate-900">
                                            {item.qty}
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Increase ${item.name} quantity`}
                                            disabled={item.qty >= item.maxQty}
                                            onClick={() => handleQtyChange(item.id, item.qty + 1, item.maxQty)}
                                            className="inline-flex h-11 w-11 items-center justify-center rounded-r-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-base active:bg-slate-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Slider for Hours (if not daily fixed) */}
                                {!item.isDailyFixed ? (
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-slate-600">Daily Usage:</span>
                                            <span className="font-bold text-[#001a4a] bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {item.hours} {item.unitLabel}
                                            </span>
                                        </div>

                                        {/* Touch-Friendly Range Slider (min 44px tap target height) */}
                                        <div className="flex items-center h-11">
                                            <input
                                                type="range"
                                                min="0"
                                                max={item.maxHours}
                                                step={item.stepHours || 1}
                                                value={item.hours}
                                                disabled={item.qty === 0}
                                                aria-label={`${item.name} daily hours`}
                                                aria-valuemin="0"
                                                aria-valuemax={item.maxHours}
                                                aria-valuenow={item.hours}
                                                onChange={(e) => handleHoursChange(item.id, e.target.value)}
                                                className="w-full cursor-pointer appearance-none bg-slate-200 h-2.5 rounded-lg accent-[#001a4a] disabled:opacity-40 disabled:cursor-not-allowed"
                                                style={{ touchAction: 'manipulation' }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg bg-white/80 border border-slate-200 px-3 py-2 text-xs text-slate-600 flex items-center justify-between">
                                        <span>24-Hour Continuous Cycle</span>
                                        <span className="font-semibold text-emerald-700">~2.5 kWh / day</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Direct Sync Guidance Notice */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-base">🔄</span>
                    <span>
                        <strong>Two-way Synced:</strong> Sliding any appliance updates your total units
                        ({computedBreakdown.total} units) and instantly re-evaluates your NEPRA slab bill and cliff status above.
                    </span>
                </div>
            </div>
        </section>
    );
}

ApplianceBreakdown.propTypes = {
    appliancesState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onCutUnits: PropTypes.func,
    currentUnits: PropTypes.number,
};
