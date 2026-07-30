import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const faqItems = [
    {
        question: 'Is Roznamcha free to use?',
        answer: 'Yes, tracking your daily expenses, basic ration items, and utility estimations is completely free under our standard plan.',
    },
    {
        question: 'Can my spouse or business partner log expenses on the same account?',
        answer: 'Absolutely. You can invite trusted household members to join your workspace so that everyone can log their daily cash outflows in real-time.',
    },
    {
        question: 'Is my financial data secure?',
        answer: 'We employ industry-standard encryption practices. Your records are private and can only be accessed by members you explicitly invite.',
    },
];

export default function ExpenseTrackerPakistan({ seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? seoContent.expenseTrackerPakistan;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Features</p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#001a4a] leading-tight">
                        The Best Monthly Expense Tracker for Pakistani Households
                    </h1>
                    <p className="text-lg text-slate-700 leading-relaxed">
                        Managing household finances in Pakistan requires tools built for local economic realities. 
                        Roznamcha helps you capture cash outflows, monitor fluctuating grocery rates, and stay within your monthly target.
                    </p>
                </header>

                {/* Section: Why conventional apps fail */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#001a4a]">
                        Why Conventional Budgeting Apps Fail in Pakistan
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                        Most foreign finance applications assume a fully digital card-based economy and automatically sync with bank feeds. 
                        However, Pakistani households face a unique set of financial parameters:
                    </p>

                    <div className="grid gap-6 md:grid-cols-3 pt-2">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-[#001a4a]">Cash-Heavy Economy</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                From the milkman (doodh wala) and domestic help salary to weekly vegetable carts, cash is king. Notebook records dry up, but Roznamcha makes logging cash simple.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-[#001a4a]">Dynamic Utilities</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                NEPRA tariff slabs, fuel price adjustments, and mobile tax rules mean your utility bills fluctuate month-to-month. A static budget cannot handle these changes.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-[#001a4a]">Collective Budgeting</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                In joint families or multi-earner homes, multiple people spend from one pool of money. Everyone needs access without sending endless WhatsApp updates.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section: Core features */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#001a4a]">
                        Core Features Built for Your Budget
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                            <h3 className="text-xl font-bold text-[#001a4a]">Kharcha Map</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                A live, categorized timeline of daily spending. Spot overspending on rent, fuel, or lifestyle luxuries before the 20th of the month.
                            </p>
                            <Link href="/kharcha-map" className="inline-flex text-sm font-semibold text-[#0b2b6f] hover:underline">
                                Learn about Kharcha Map →
                            </Link>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                            <h3 className="text-xl font-bold text-[#001a4a]">Ration Brain</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                A grocery price tracker designed for Pakistani kitchens. Check if you should buy wheat, ghee, or rice in bulk before prices spike.
                            </p>
                            <Link href="/ration-brain" className="inline-flex text-sm font-semibold text-[#0b2b6f] hover:underline">
                                Learn about Ration Brain →
                            </Link>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                            <h3 className="text-xl font-bold text-[#001a4a]">Survival Report</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Get a complete, downloadable PDF monthly summary. Compare your run rate against previous months without keeping notebooks.
                            </p>
                            <Link href="/survival-report" className="inline-flex text-sm font-semibold text-[#0b2b6f] hover:underline">
                                Learn about Survival Report →
                            </Link>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                            <h3 className="text-xl font-bold text-[#001a4a]">Smart Budget Templates</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Choose from pre-designed survival templates (e.g., student budget, Rs. 50k salary guide, joint family) and customize to your household.
                            </p>
                            <Link href="/templates" className="inline-flex text-sm font-semibold text-[#0b2b6f] hover:underline">
                                Browse templates →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Section: FAQ */}
                <section className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-[#001a4a]">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqItems.map((faq, index) => (
                            <div key={index} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0 space-y-1">
                                <h3 className="font-semibold text-[#001a4a]">{faq.question}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section: CTA */}
                <section className="rounded-2xl bg-gradient-to-br from-[#001a4a] to-[#1c4aa6] text-white p-8 text-center space-y-4 shadow-md">
                    <h2 className="text-2xl font-bold">Start Tracking Your Kharcha Today</h2>
                    <p className="text-white/80 max-w-xl mx-auto text-sm leading-relaxed">
                        Stop guessing where your money went. Sign up for a free Roznamcha account and build a sturdier household budget plan.
                    </p>
                    <div className="pt-2">
                        <Link href="/register" className="inline-flex items-center rounded-full bg-yellow-300 px-6 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-white transition-colors">
                            Create Free Account
                        </Link>
                    </div>
                </section>
            </section>
        </PublicLayout>
    );
}
