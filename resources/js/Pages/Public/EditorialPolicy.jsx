import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';

export default function EditorialPolicy({ seo, jsonLd, contactEmail = 'support@roznamcha.pk' }) {
    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Standards &amp; Integrity</p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001a4a]">
                        Editorial Policy &amp; Review Standards
                    </h1>
                    <p className="text-lg text-slate-700 leading-relaxed">
                        At Roznamcha.pk, we provide practical, transparent, and mathematically sound household finance tools and economic guides tailored specifically to Pakistani families. Our editorial standards ensure that every calculation model, tariff slab, and grocery index is rigorously verified, culturally coherent, and free from commercial bias.
                    </p>
                </header>

                <article className="space-y-10">
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">1. Core Principles &amp; Editorial Independence</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Pakistani households navigate high volatility in utility tariffs, food inflation, and consumer prices. Most international finance advice assumes automated banking APIs and card-first economies, which do not reflect Pakistan’s cash-heavy daily kharcha realities. Roznamcha was founded to provide transparent, uncompromised planning tools that help families protect their hard-earned income.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            Our editorial content and interactive models are strictly independent. We do not accept paid placements to endorse specific bank loan products, commercial solar EPC installers, private school networks, or commercial grocery brands. When brand comparisons or commodity alternatives are mentioned, they are presented purely as illustrative budgeting options for consumer education.
                        </p>
                    </section>

                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">2. Data Verification &amp; Primary Sourcing Standards</h2>
                        <p className="text-slate-700 leading-relaxed">
                            We ground all calculations in verified statutory notices, official regulatory documentation, and observable ground realities across Pakistan:
                        </p>
                        <ul className="list-disc pl-6 space-y-3 text-slate-700 leading-relaxed">
                            <li>
                                <strong>Electricity Tariffs &amp; Slab Logic:</strong> Sourced directly from statutory notifications (SROs) published by the National Electric Power Regulatory Authority (NEPRA) and billing schedules from distribution companies (LESCO, K-Electric, IESCO, FESCO, MEPCO, GEPCO, PESCO, HESCO, SEPCO, QESCO). We strictly model both protected and unprotected consumer tiers, GST, TV fees, and Fuel Price Adjustment (FPA) mechanics.
                            </li>
                            <li>
                                <strong>Kitchen Ration &amp; Grocery Price Baselines:</strong> Cross-verified against the Pakistan Bureau of Statistics (PBS) Weekly Sensitive Price Indicator (SPI) reports, and primary wholesale grain markets (ghalla mandi) in Karachi, Lahore, and Rawalpindi.
                            </li>
                            <li>
                                <strong>Solar Net Metering &amp; Buyback Rates:</strong> Modeled using NEPRA Net Billing regulations, National Average Energy Purchase Price benchmarks, and verified 2026 Tier-1 solar EPC component warranties.
                            </li>
                            <li>
                                <strong>School Fee Inflation &amp; Amortization:</strong> Derived from observed annual fee structures, registration costs, and regulatory private school frameworks across provincial education directorates.
                            </li>
                        </ul>
                    </section>

                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">3. Authorship &amp; Subject-Matter Expertise</h2>
                        <p className="text-slate-700 leading-relaxed">
                            All interactive calculators, economic models, and cornerstone financial guides on Roznamcha are architected and reviewed under the direction of <strong>Mohsin</strong>, Founder of Roznamcha.pk.
                        </p>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                            <h3 className="text-lg font-bold text-[#001a4a]">Lead Author &amp; Systems Architect: Mohsin</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Software Architect with over 16 years of professional experience designing robust distributed computing systems, consumer-facing software, and financial planning engines. He specializes in translating complex macroeconomic regulations (such as NEPRA tariff matrices, currency devaluation shocks, and localized CPI shifts) into intuitive, actionable planning tools for everyday citizens.
                            </p>
                            <p className="text-xs text-slate-500 pt-1">
                                For detailed background and professional profile, read our <Link href="/about" className="text-[#001a4a] font-semibold underline">About Page</Link>.
                            </p>
                        </div>
                    </section>

                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">4. Revision Protocol, Corrections &amp; Feedback</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Pakistan’s economic landscape changes rapidly. When NEPRA announces revised base tariffs, or when the federal government introduces new utility surcharges or sales tax amendments, our team updates the underlying calculator databases and publishes contextual advisories.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            We welcome reader feedback and fact-checking. If you detect a numerical discrepancy, outdated tariff reference, or regional price variation, please email us directly at{' '}
                            <a href={`mailto:${contactEmail}`} className="font-semibold text-[#001a4a] underline">
                                {contactEmail}
                            </a>{' '}
                            or submit a ticket through our{' '}
                            <Link href="/contact" className="font-semibold text-[#001a4a] underline">
                                Contact Page
                            </Link>
                            . Legitimate corrections are validated and deployed within 48 hours with transparent update timestamps.
                        </p>
                    </section>

                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">5. Planning Boundaries &amp; Financial Disclaimer</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Roznamcha publishes budgeting simulators, expense tracking applications, and educational articles for personal decision support and comparison. Nothing published on this site constitutes certified financial, legal, investment, or tax advice. Every household operates with unique financial obligations, debt structures, and risk profiles. Users remain responsible for verifying official utility bills, loan contracts, and bank commitments.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            For complete legal terms and planning limitations, please review our full{' '}
                            <Link href="/disclaimer" className="font-semibold text-[#001a4a] underline">
                                Disclaimer
                            </Link>{' '}
                            and{' '}
                            <Link href="/terms" className="font-semibold text-[#001a4a] underline">
                                Terms of Service
                            </Link>
                            .
                        </p>
                    </section>
                </article>

                <nav aria-label="Related transparency links" className="border-t border-slate-200 pt-6 flex flex-wrap gap-4 text-sm font-medium text-[#001a4a]">
                    <Link href="/methodology" className="hover:underline">Methodology &amp; Sources →</Link>
                    <Link href="/about" className="hover:underline">About the Author →</Link>
                    <Link href="/contact" className="hover:underline">Contact Editorial Team →</Link>
                    <Link href="/tools/monthly-household-budget-calculator" className="hover:underline">Budget Calculator →</Link>
                </nav>
            </section>
        </PublicLayout>
    );
}
