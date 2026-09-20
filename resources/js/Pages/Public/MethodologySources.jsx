import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';

export default function MethodologySources({ seo, jsonLd, contactEmail = 'support@roznamcha.pk' }) {
    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Mathematical Models &amp; Baselines</p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001a4a]">
                        Methodology &amp; Data Baseline Sources
                    </h1>
                    <p className="text-lg text-slate-700 leading-relaxed">
                        Every tool and calculation engine on Roznamcha is built upon open, empirical formulas and officially recognized Pakistani economic baselines. This document details the mathematical logic, regulatory sources, and empirical assumptions powering our calculators.
                    </p>
                </header>

                <article className="space-y-10">
                    {/* Section 1: Electricity Tariff Mechanics */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">1. Electricity Bill Estimator &amp; Slab Logic</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Residential electricity billing in Pakistan is structured under progressive tariff schedules administered by the National Electric Power Regulatory Authority (NEPRA). Our model reflects the exact tiered billing algorithm:
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-[#001a4a]/20">
                            <h3 className="font-semibold text-slate-900">Progressive Slab Calculation Formula:</h3>
                            <p className="text-sm font-mono bg-slate-50 p-3 rounded-lg text-slate-800">
                                Base Slab Cost = &Sigma; [ min(Remaining Units, Slab Bracket Size) &times; Slab Per-Unit Rate ]
                            </p>
                            <h3 className="font-semibold text-slate-900">Total Payable Bill Formula:</h3>
                            <p className="text-sm font-mono bg-slate-50 p-3 rounded-lg text-slate-800">
                                Total Bill = (Base Slab Cost) + (Units &times; FPA Rate) + Financing Surcharge + Electricity Duty + GST (17%) + Fixed Meter Charges + TV Fee (Rs. 35)
                            </p>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm">
                            <strong>Regulatory Sources:</strong> NEPRA Federal Tariff Notifications (SROs) for DISCOs (LESCO, K-Electric, IESCO, FESCO, MEPCO, GEPCO, PESCO, HESCO, SEPCO, QESCO). Our system explicitly distinguishes between <em>Protected Consumers</em> (under 200 kWh/month for 6 consecutive months) and <em>Unprotected Consumers</em>, dynamically simulating the financial cliff that occurs upon crossing unit thresholds.
                        </p>
                    </section>

                    {/* Section 2: Ration Cost Estimator */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">2. Kitchen Ration &amp; Grocery Price Baselines</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Food budgeting requires isolating non-perishable staple carbohydrates and cooking fats from perishable daily items. The Ration Cost Estimator focuses exclusively on core non-perishable kitchen drivers:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-700 border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[#001a4a]">
                                        <th className="py-2.5 px-3 font-semibold">Commodity</th>
                                        <th className="py-2.5 px-3 font-semibold">Standard Unit</th>
                                        <th className="py-2.5 px-3 font-semibold">Primary Baseline Source</th>
                                        <th className="py-2.5 px-3 font-semibold">Review Cadence</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="py-2.5 px-3 font-medium">Wheat Flour (Atta)</td>
                                        <td className="py-2.5 px-3">20 kg bag / 10 kg bag</td>
                                        <td className="py-2.5 px-3">PBS Weekly SPI / Wholesale Grain Mandi</td>
                                        <td className="py-2.5 px-3">Monthly</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-medium">Cooking Oil / Ghee</td>
                                        <td className="py-2.5 px-3">1 Litre / 5 Litre pouch</td>
                                        <td className="py-2.5 px-3">Utility Stores Subsidy + Open Retail</td>
                                        <td className="py-2.5 px-3">Monthly</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-medium">Basmati &amp; IRRI Rice</td>
                                        <td className="py-2.5 px-3">Kilogram (kg)</td>
                                        <td className="py-2.5 px-3">Punjab &amp; Sindh Mandi Rate Lists</td>
                                        <td className="py-2.5 px-3">Monthly</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-medium">Refined White Sugar</td>
                                        <td className="py-2.5 px-3">Kilogram (kg)</td>
                                        <td className="py-2.5 px-3">Ex-Mill &amp; Retail Benchmark Reports</td>
                                        <td className="py-2.5 px-3">Monthly</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 px-3 font-medium">Pulses (Daal Da Chana, Moong, Masoor)</td>
                                        <td className="py-2.5 px-3">Kilogram (kg)</td>
                                        <td className="py-2.5 px-3">Importers Association &amp; Wholesale Indices</td>
                                        <td className="py-2.5 px-3">Monthly</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm">
                            <strong>Why Fresh Produce is Separated:</strong> Perishables (tomatoes, onions, fresh milk, beef, and chicken) experience localized volatility of up to 40% in a single week based on fuel freight adjustments and seasonal monsoon cycles. Households should calculate dry staples first to anchor their non-negotiable kitchen baseline, then assign a distinct flexible line item for weekly bazaar shopping.
                        </p>
                    </section>

                    {/* Section 3: Monthly Household Budget Calculator */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">3. Monthly Household Budgeting &amp; Surplus/Deficit Metrics</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Our Monthly Household Budget Calculator categorizes spending across 6 localized expenditure vectors: Rent, Ration, Utilities, Education, Transport, and Miscellaneous/Medical.
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-[#001a4a]/20 text-sm">
                            <p><strong>Net Surplus / Deficit:</strong> Monthly Take-Home Income &minus; Total Categorized Expenses.</p>
                            <p><strong>Savings Rate Percentage:</strong> (Surplus / Monthly Income) &times; 100.</p>
                            <p><strong>Healthy Budget Thresholds:</strong> In urban Pakistan, a savings rate &ge;15% represents strong resilience against unexpected shocks. A savings rate between 5%–14% indicates a compressed budget vulnerable to mid-month emergencies. A rate &lt;0% represents an active deficit that compounds debt.</p>
                        </div>
                    </section>

                    {/* Section 4: Solar Net Metering & Battery TCO */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">4. Solar Net Metering ROI &amp; 10-Year Battery TCO</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Solar financial modeling operates under NEPRA’s Net Billing framework, distinguishing between daytime self-consumption and exported grid energy:
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-[#001a4a]/20 text-sm">
                            <p><strong>Avoided Grid Cost:</strong> Self-Consumed Solar Units &times; Avoided Retail Grid Slab Tariff (Rs. 42 to 71+/kWh).</p>
                            <p><strong>Export Credit Revenue:</strong> Exported Units &times; National Average Buyback Rate (~Rs. 11.00/kWh).</p>
                            <p><strong>Simple Payback Period (Years):</strong> Total Turnkey Installation Cost (CAPEX) / Annualized Total Net Financial Savings.</p>
                            <p><strong>10-Year Battery TCO Comparison:</strong> Tall Tubular lead-acid batteries (50% max Depth of Discharge, 900 cycles, 2.5-year replacement interval) incur 3 full bank replacements over a 10-year span. Lithium Iron Phosphate (LiFePO4) storage (90% usable DoD, 5,000–6,000 cycles, 10+ year lifespan) eliminates mid-term replacements, delivering an effective 35%–40% lower cost per stored kilowatt-hour.</p>
                        </div>
                    </section>

                    {/* Section 5: School Fees Planner */}
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#001a4a]">5. School Fees Planner &amp; Annual Amortization</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Education budgeting fails when families treat monthly school vouchers as their total cost, ignoring annual admission fees, activity charges, and examination registration deadlines.
                        </p>
                        <div className="space-y-3 pl-4 border-l-2 border-[#001a4a]/20 text-sm">
                            <p><strong>Real Monthly Cost Formula:</strong> (Children Count &times; Monthly Tuition) + [(Annual Charges + Exam Fee &times; Exam Frequency) / 12].</p>
                            <p><strong>Inflation Planning Margin:</strong> Real Monthly Cost &times; (1 + Inflation Buffer % / 100). Private schools in Pakistan escalate tuition by an average of 10% to 15% each academic cycle.</p>
                        </div>
                    </section>
                </article>

                <nav aria-label="Related transparency links" className="border-t border-slate-200 pt-6 flex flex-wrap gap-4 text-sm font-medium text-[#001a4a]">
                    <Link href="/editorial-policy" className="hover:underline">Editorial Policy &amp; Review Standards →</Link>
                    <Link href="/about" className="hover:underline">About the Founder →</Link>
                    <Link href="/contact" className="hover:underline">Contact Editorial Team →</Link>
                    <Link href="/tools/electricity-bill-estimator" className="hover:underline">Electricity Estimator →</Link>
                    <Link href="/tools/solar-net-metering-roi-calculator" className="hover:underline">Solar ROI Calculator →</Link>
                </nav>
            </section>
        </PublicLayout>
    );
}
