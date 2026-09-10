// Purpose: High-retention interactive Electricity Calculator Suite combining Slab-Cliff Visualizer and Appliance Breakdown with zero-latency two-way sync. Author: Principal Full-Stack Engineer & UX Specialist. Date: 2026-09-10.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SlabCliffVisualizer from './SlabCliffVisualizer';
import ApplianceBreakdown from './ApplianceBreakdown';
import SolarTeaserCard from './SolarTeaserCard';
import {
    DISCO_PRESETS,
    APPLIANCE_PRESETS,
    calculatePakistanElectricityBill,
    calculateTotalApplianceUnits,
} from '../../lib/electricityTariff';

export default function ElectricityCalculatorSuite({
    initialUnits = 204, // Default to cliff demo to hook retention immediately
    initialDisco = 'lesco',
    showDiscoSelector = true,
    onUnitsChangeExternal,
}) {
    // Current DISCO
    const [selectedDisco, setSelectedDisco] = useState(initialDisco);

    // Initial default appliances state
    const defaultAppliances = useMemo(() => {
        const state = {};
        APPLIANCE_PRESETS.forEach((preset) => {
            state[preset.id] = {
                hours: preset.defaultHours,
                qty: preset.defaultQty,
            };
        });
        return state;
    }, []);

    const [appliancesState, setAppliancesState] = useState(defaultAppliances);

    // Central Units state
    const [units, setUnits] = useState(initialUnits);

    // Calculated total from appliances
    const totalApplianceUnits = useMemo(
        () => calculateTotalApplianceUnits(appliancesState),
        [appliancesState]
    );

    // Bill calculation results
    const billData = useMemo(
        () => calculatePakistanElectricityBill(units, selectedDisco),
        [units, selectedDisco]
    );

    const breakdownRef = useRef(null);

    // When user manually changes units input
    const handleManualUnitsChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setUnits('');
            return;
        }
        const num = Math.max(1, Math.min(5000, parseInt(val, 10) || 0));
        setUnits(num);
        if (typeof onUnitsChangeExternal === 'function') {
            onUnitsChangeExternal(num);
        }
    };

    // When user adjusts appliance sliders
    const handleAppliancesChange = (newState, newTotal) => {
        setAppliancesState(newState);
        setUnits(newTotal);
        if (typeof onUnitsChangeExternal === 'function') {
            onUnitsChangeExternal(newTotal);
        }
    };

    // Smooth scroll down to appliances section
    const scrollToAppliances = () => {
        const el = document.getElementById('appliance-breakdown');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.classList.add('ring-4', 'ring-amber-400');
            setTimeout(() => {
                el.classList.remove('ring-4', 'ring-amber-400');
            }, 1800);
        }
    };

    const currentUnitsNumber = Number(units) || 1;

    return (
        <div className="w-full space-y-6">
            {/* Top Interactive Controller: Unit Input & DISCO Selector */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Left: Interactive Units Input */}
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                            <label htmlFor="units-consumed-input" className="text-sm font-bold text-[#001a4a]">
                                Units Consumed (kWh)
                            </label>
                            <span
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                    currentUnitsNumber <= 200
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-rose-100 text-rose-800'
                                }`}
                            >
                                {currentUnitsNumber <= 200 ? '🟢 Protected Status' : '🔴 Unprotected (Over 200)'}
                            </span>
                        </div>

                        <div className="relative">
                            <input
                                id="units-consumed-input"
                                type="number"
                                min="1"
                                max="5000"
                                value={units}
                                onChange={handleManualUnitsChange}
                                className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-2xl font-extrabold text-[#001a4a] shadow-inner focus:border-[#001a4a] focus:outline-none focus:ring-2 focus:ring-[#001a4a]/20"
                                placeholder="e.g. 204"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase">
                                Units / Month
                            </div>
                        </div>

                        {/* Quick Presets / Retention Triggers */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                            <span className="text-slate-400 font-medium">Quick Test:</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setUnits(194);
                                    if (onUnitsChangeExternal) onUnitsChangeExternal(194);
                                }}
                                className="rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-1 font-semibold transition border border-emerald-200"
                            >
                                ⚡ 194 (Safe Buffer)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setUnits(204);
                                    if (onUnitsChangeExternal) onUnitsChangeExternal(204);
                                }}
                                className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 px-2 py-1 font-semibold transition border border-rose-200"
                            >
                                ⚠️ 204 (Cliff Overhang)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setUnits(304);
                                    if (onUnitsChangeExternal) onUnitsChangeExternal(304);
                                }}
                                className="rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 px-2 py-1 font-semibold transition border border-amber-200"
                            >
                                304 (Tier 2 Jump)
                            </button>
                        </div>
                    </div>

                    {/* Right: DISCO Selector and Live Total */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        {showDiscoSelector ? (
                            <div className="space-y-1.5 min-w-[140px]">
                                <label htmlFor="disco-select" className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                                    Distribution Company
                                </label>
                                <select
                                    id="disco-select"
                                    value={selectedDisco}
                                    onChange={(e) => setSelectedDisco(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-[#001a4a] focus:border-[#001a4a] focus:outline-none"
                                >
                                    {Object.entries(DISCO_PRESETS).map(([key, item]) => (
                                        <option key={key} value={key}>
                                            {item.name} ({item.region.split('&')[0].trim()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="min-w-[120px]">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                                    DISCO
                                </span>
                                <span className="text-base font-bold text-[#001a4a]">
                                    {DISCO_PRESETS[selectedDisco]?.name || selectedDisco.toUpperCase()}
                                </span>
                            </div>
                        )}

                        {/* Total Estimated Bill Display */}
                        <div className="rounded-2xl bg-gradient-to-br from-[#001a4a] to-[#012f85] p-4 text-white shadow-md min-w-[180px]">
                            <span className="text-xs uppercase font-medium tracking-wider text-blue-200 block">
                                Estimated Total Bill
                            </span>
                            <span className="text-2xl font-black block mt-0.5">
                                PKR {billData.totalBill.toLocaleString('en-PK')}
                            </span>
                            <span className="text-[11px] text-blue-200/80 block mt-0.5">
                                Incl. Surcharges & Taxes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Live Bill Breakdown Drawer */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 text-xs">
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <span className="text-slate-500 block">Base Energy</span>
                        <span className="font-bold text-slate-900 text-sm">
                            PKR {billData.baseEnergyCost.toLocaleString('en-PK')}
                        </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <span className="text-slate-500 block">FPA + FC Surcharge</span>
                        <span className="font-bold text-slate-900 text-sm">
                            PKR {(billData.fcSurcharge + billData.fpa).toLocaleString('en-PK')}
                        </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <span className="text-slate-500 block">GST / Sales Tax</span>
                        <span className={`font-bold text-sm ${billData.gst === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {billData.gst === 0 ? '0% (Exempt)' : `PKR ${billData.gst.toLocaleString('en-PK')}`}
                        </span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <span className="text-slate-500 block">Effective Unit Rate</span>
                        <span className="font-bold text-[#001a4a] text-sm">
                            Rs. {billData.effectiveRatePerUnit} / unit
                        </span>
                    </div>
                </div>
            </div>

            {/* COMPONENT 1: Smart Slab-Cliff Visualizer & Warning Engine */}
            <SlabCliffVisualizer
                units={currentUnitsNumber}
                disco={selectedDisco}
                onScrollToAppliances={scrollToAppliances}
            />

            {/* HIGH CONVERSION SOLAR NET BILLING TEASER CARD */}
            <SolarTeaserCard
                units={currentUnitsNumber}
                bill={billData.totalBill}
            />

            {/* COMPONENT 2: Interactive Appliance Unit Breakdown & Load Sliders */}
            <ApplianceBreakdown
                appliancesState={appliancesState}
                onChange={handleAppliancesChange}
                onCutUnits={scrollToAppliances}
                currentUnits={currentUnitsNumber}
            />
        </div>
    );
}

ElectricityCalculatorSuite.propTypes = {
    initialUnits: PropTypes.number,
    initialDisco: PropTypes.string,
    showDiscoSelector: PropTypes.bool,
    onUnitsChangeExternal: PropTypes.func,
};
