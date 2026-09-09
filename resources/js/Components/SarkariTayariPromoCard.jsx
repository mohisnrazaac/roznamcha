import React from 'react';

/**
 * Reusable, responsive promotional card driving referral traffic to SarkariTayari.pk.
 * Designed to maintain Core Web Vitals, zero dependencies, and optimal mobile tap targets.
 */
export default function SarkariTayariPromoCard({ className = '', style = {} }) {
    return (
        <aside
            aria-label="Career & Income Upgrade"
            className={`w-full box-border rounded-xl border border-[#10b981] p-5 sm:p-6 text-white shadow-xl transition-shadow duration-300 ${className}`}
            style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                boxShadow: '0 10px 25px -5px rgba(6, 78, 59, 0.3)',
                ...style,
            }}
        >
            <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded-full bg-[#10b981] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Career & Income Upgrade
                </span>
                <span className="text-xs sm:text-[13px] font-medium text-[#a7f3d0]">
                    Pakistan Public Sector Jobs
                </span>
            </div>

            <h3 className="mb-2.5 text-lg sm:text-xl font-extrabold leading-snug text-white">
                Tired of Daily Inflation Eating Your Monthly Budget?
            </h3>

            <p className="mb-4 text-xs sm:text-sm leading-relaxed text-[#d1fae5]">
                Managing your household kharcha on <strong className="font-semibold text-white">Roznamcha</strong> is only half the battle—increasing your stable income is the real long-term fix. Explore verified FPSC, PPSC, and provincial government vacancies, pay-scale breakdowns, and exam syllabus blueprints.
            </p>

            <div className="pt-1">
                <a
                    href="https://sarkaritayari.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 text-center text-sm font-bold text-gray-900 transition-colors duration-200 hover:bg-[#fbbf24] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#064e3b]"
                >
                    <span>Find Government Jobs &amp; Prep Guides on SarkariTayari.pk</span>
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        </aside>
    );
}
