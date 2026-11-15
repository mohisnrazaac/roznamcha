import React from 'react';
import { Link } from '@inertiajs/react';

const suiteTools = [
    {
        title: 'Electricity Bill Calculator',
        href: '/tools/electricity-bill-estimator',
        desc: 'NEPRA slabs, FPA, QTA & 18% GST calculation',
        icon: '⚡',
        badge: 'NEPRA 2026',
    },
    {
        title: 'Monthly Ration Cost Calculator',
        href: '/tools/ration-cost-estimator',
        desc: 'Live Mandi rates for atta, ghee, rice & sugar',
        icon: '🛒',
        badge: 'PBS Aligned',
    },
    {
        title: 'Household Budget Calculator',
        href: '/tools/monthly-household-budget-calculator',
        desc: '50/30/20 rule calibrated for Pakistani kharcha',
        icon: '📊',
        badge: 'Ghar Ka Budget',
    },
    {
        title: 'Solar ROI & Net Metering',
        href: '/tools/solar-net-metering-roi-calculator',
        desc: 'Payback period & net billing savings (3-15 kW)',
        icon: '☀️',
        badge: 'Net Metering',
    },
    {
        title: 'School Fees & Education Planner',
        href: '/tools/school-fees-planner',
        desc: 'Tuition, annual charges & inflation buffer',
        icon: '🎓',
        badge: 'Education',
    },
    {
        title: 'Monthly Expense Tracker',
        href: '/features/monthly-expense-tracker-pakistan',
        desc: 'Daily ledger, kharcha tracking & budget alerts',
        icon: '📱',
        badge: 'Web App',
    },
];

export default function HouseholdPlanningSuite({ currentPath = '' }) {
    return (
        <section className="mt-12 rounded-3xl border border-[#001a4a]/15 bg-gradient-to-br from-white via-slate-50/70 to-emerald-50/30 p-6 md:p-8 shadow-sm" aria-label="Roznamcha Household Planning Suite">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Integrated Family Finance
                    </span>
                    <h2 className="mt-2 text-xl md:text-2xl font-bold text-[#001a4a]">
                        Roznamcha Household Planning Suite
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                        A unified set of financial calculators calibrated for Pakistani salaries, utility tariffs, and real market prices.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suiteTools.map((tool) => {
                    const isCurrent = currentPath === tool.href;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                                isCurrent
                                    ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md'
                                    : 'border-slate-200/90 bg-white hover:border-[#001a4a]/30 hover:shadow-sm hover:-translate-y-0.5'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-2xl" role="img" aria-label={tool.title}>{tool.icon}</span>
                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                        isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-[#001a4a]/10 group-hover:text-[#001a4a]'
                                    }`}>
                                        {isCurrent ? 'Active Tool' : tool.badge}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-base font-semibold text-[#001a4a] group-hover:text-emerald-700 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    {tool.desc}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-700 group-hover:underline">
                                {isCurrent ? 'Currently viewing' : 'Open calculator →'}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
