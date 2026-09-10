// Purpose: High-conversion Solar Net Metering teaser card embedded below DISCO bill calculator results.
// Author: Principal Full-Stack Engineer & Renewable Energy Systems Architect. Date: 2026-09-10.

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/react';
import {
    recommendSolarSystemSize,
    calculateSolarRoi,
    SOLAR_SYSTEM_BENCHMARKS,
} from '../../lib/solarRoiEngine';

export default function SolarTeaserCard({ units = 650, bill = 32000 }) {
    const cleanUnits = Math.max(1, Number(units) || 250);
    const cleanBill = Math.max(0, Number(bill) || 0);

    const sizing = useMemo(() => {
        const key = recommendSolarSystemSize(cleanUnits, cleanBill);
        const system = SOLAR_SYSTEM_BENCHMARKS[key] || SOLAR_SYSTEM_BENCHMARKS['5kw'];
        const roi = calculateSolarRoi({
            systemSizeKey: key,
            monthlyUnits: cleanUnits,
            monthlyBill: cleanBill,
        });

        return { system, roi };
    }, [cleanUnits, cleanBill]);

    const destinationUrl = `/tools/solar-net-metering-roi-calculator?units=${cleanUnits}&bill=${cleanBill}`;

    return (
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-xl">
            {/* Background Decorative Pattern */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-yellow-300/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-amber-700/30 blur-xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left: Hook & Value Proposition */}
                <div className="space-y-3 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-100 border border-white/20">
                            ☀️ Solar Net Billing Bridge
                        </span>
                        <span className="inline-flex items-center rounded-full bg-emerald-900/40 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30">
                            ⚡ Recommended: {sizing.system.name}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            High DISCO Bill? Slash it by up to 90% with Solar
                        </h3>
                        <p className="mt-1 text-sm text-amber-100/90 leading-relaxed">
                            Under NEPRA's Net Billing framework, a {sizing.system.name} produces ~
                            <strong className="text-white">{sizing.system.monthlyGen} units/month</strong>, offsetting peak slab tariffs and exporting excess energy at national buyback rates.
                        </p>
                    </div>

                    {/* Quick Metric Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                        <div className="rounded-2xl bg-black/20 backdrop-blur-sm p-3 border border-white/10">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200 block">
                                Est. Monthly Savings
                            </span>
                            <span className="text-lg sm:text-xl font-black text-white block mt-0.5">
                                PKR {sizing.roi.monthlySavings.toLocaleString('en-PK')}
                            </span>
                        </div>
                        <div className="rounded-2xl bg-black/20 backdrop-blur-sm p-3 border border-white/10">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200 block">
                                Est. Payback
                            </span>
                            <span className="text-lg sm:text-xl font-black text-white block mt-0.5">
                                ~{sizing.roi.paybackFormatted}
                            </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-black/20 backdrop-blur-sm p-3 border border-white/10">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200 block">
                                25-Yr Free Energy
                            </span>
                            <span className="text-lg sm:text-xl font-black text-emerald-200 block mt-0.5">
                                PKR {(sizing.roi.lifetimeGrossSavings / 100000).toFixed(1)} Lakhs
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Conversion Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-center gap-3">
                    <Link
                        href={destinationUrl}
                        className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-extrabold text-orange-600 shadow-lg transition-all duration-200 hover:bg-yellow-50 hover:shadow-xl active:scale-[0.98]"
                    >
                        <span>Calculate Solar ROI & Payback</span>
                        <span className="transition-transform group-hover:translate-x-1 font-black">→</span>
                    </Link>
                    <span className="text-center text-xs font-medium text-amber-100/80">
                        Pre-filled with your current {cleanUnits} units load
                    </span>
                </div>
            </div>
        </div>
    );
}

SolarTeaserCard.propTypes = {
    units: PropTypes.number,
    bill: PropTypes.number,
};
