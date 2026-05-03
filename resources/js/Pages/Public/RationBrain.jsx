import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const benefits = [
    'Budget groceries with confidence even when prices spike',
    'Decide when to buy in bulk or switch brands',
    'Explain mehngai to family members using actual data',
    'Feed ration data into Kharcha Map and the Survival Report automatically',
];

const steps = [
    'Create your ration list with atta, dal, chawal, ghee, cheeni, tea, spices, and cleaning items.',
    'After every grocery trip, log the date, quantity, price, and store or vendor.',
    'Compare current prices with older entries to see how much each item increased.',
    'View the total ration cost and send it to the Survival Report to see the real impact on the budget.',
];

const faqs = [
    {
        question: 'What items can I track in Ration Brain?',
        answer: 'Track any grocery item—atta, rice, lentils, spices, oil, milk, cleaning supplies, or custom categories you name yourself.',
    },
    {
        question: 'How often should I update prices?',
        answer: 'Update whenever you shop. Weekly, fortnightly, or monthly updates still reveal trends and highlight inflation.',
    },
    {
        question: 'Can I use Ration Brain for both small and large families?',
        answer: 'Yes. It scales from single-room rentals to big joint families; simply enter the quantities that match your kitchen.',
    },
    {
        question: 'Is my ration data private?',
        answer: 'Yes. Only invited household members can view or edit your ration log, and Roznamcha encrypts all entries.',
    },
    {
        question: 'Is Ration Brain linked with Kharcha Map?',
        answer: 'Ration entries sync directly with Kharcha Map so your monthly expense tracker always reflects grocery totals.',
    },
];

export default function RationBrain({ seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? seoContent.rationBrain;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Ration Brain – grocery price tracker for Pakistani kitchens</h1>
                    <p className="text-base text-slate-700">
                        Ration Brain keeps a running log of what you paid for dal, atta, chawal, ghee, cheeni, sabzi, and spices. It exposes mehngai
                        trends and keeps ration planning predictable for every Urdu-speaking household.
                    </p>
                </header>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Track ration prices over time</h2>
                    <p className="text-base text-slate-700">
                        Each ration purchase becomes a data point. Record amounts, weights, and prices, then see how atta jumped before Ramzan, how
                        tea leaves cooled, or how cooking oil responded to global rates. The timeline keeps your grocery price tracker honest.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Why a ration price tracker matters in Pakistan</h2>
                    <p className="text-base text-slate-700">
                        Taking inflation seriously is the only way to protect monthly budgets. Ration Brain gives you the proof to make decisions.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        {benefits.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">How Ration Brain works</h2>
                    <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                        {steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" itemScope itemType="https://schema.org/FAQPage">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">FAQ</h2>
                    {faqs.map((faq) => (
                        <div
                            key={faq.question}
                            itemScope
                            itemProp="mainEntity"
                            itemType="https://schema.org/Question"
                            className="border border-slate-200 rounded-xl p-4 space-y-2"
                        >
                            <h3 itemProp="name" className="text-lg font-semibold text-[#001a4a]">
                                {faq.question}
                            </h3>
                            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                <p itemProp="text" className="text-sm text-slate-700">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="text-sm text-[#001a4a] font-semibold space-y-2">
                    <p>
                        Review overall expenses with{' '}
                        <Link href={route('public.kharcha-map')} className="underline hover:no-underline">
                            Kharcha Map
                        </Link>
                        .
                    </p>
                    <p>
                        Understand full-month impact in the{' '}
                        <Link href={route('public.survival-report')} className="underline hover:no-underline">
                            Survival Report
                        </Link>
                        .
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
