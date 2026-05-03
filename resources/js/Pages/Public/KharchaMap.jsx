import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const benefitBullets = [
    'Spot overspending on rent, fuel, or lifestyle treats before payday',
    'Explain monthly totals to family in clear Urdu charts',
    'Plan ahead for school fees, petrol hikes, and ration restocks',
    'Share data with spouses or parents without sending spreadsheets',
];

const steps = [
    'Log in and open the household workspace.',
    'Tap “Add kharcha”, enter amount, category, and short Urdu note.',
    'Repeat daily or weekly to capture groceries, bills, transport, or fees.',
    'Use filters to compare weeks and download summaries for the Survival Report.',
];

const faqs = [
    {
        question: 'Is Kharcha Map free?',
        answer: 'Yes, Kharcha Map is included in the free Roznamcha plan so every household can track expenses without paying upfront.',
    },
    {
        question: 'Do I need to be good with numbers?',
        answer: 'No. You just enter rupee amounts; the dashboard handles totals, charts, and comparisons.',
    },
    {
        question: 'Can my family members also use it?',
        answer: 'Invite any trusted family member into the same household workspace so everyone can log and review kharcha together.',
    },
    {
        question: 'Is data secure?',
        answer: 'Entries stay encrypted and private; only users you invite can see your kharcha timeline.',
    },
    {
        question: 'Do I need to install an app?',
        answer: 'No installation needed. Open roznamcha.pk on your phone or computer browser and start tracking.',
    },
];

export default function KharchaMap({ seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? seoContent.kharchaMap;
    const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Kharcha Map – the Urdu expense tracker Pakistan trusts</h1>
                    <p className="text-base text-slate-700">
                        Kharcha Map is the center of Roznamcha’s kharcha tracker. It records day-to-day expenses in Urdu, whether it’s milk, mobile
                        data, rent, or school fees, so Pakistani families finally know where each rupee went.
                    </p>
                </header>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">What Kharcha Map does</h2>
                    <p className="text-base text-slate-700">
                        Kharcha Map breaks every rupee into a timeline of daily, weekly, and monthly spending. Log groceries, fuel, electricity,
                        school van fees, rent, and healthcare. See totals by category, compare current weeks with last month, and watch how close
                        you are to your monthly plan. Categories stay flexible so you can add zakat, savings, or business reimbursements.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">How Kharcha Map helps Pakistani families</h2>
                    <p className="text-base text-slate-700">
                        When families see real numbers, they make better decisions. Kharcha Map reveals spending patterns that notebooks never
                        capture.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        {benefitBullets.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">How to use Kharcha Map</h2>
                    <p className="text-base text-slate-700">
                        Using Kharcha Map is straightforward even if you’ve never maintained a budget before.
                    </p>
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
                        Explore{' '}
                        <Link href={route('public.ration-brain')} className="underline hover:no-underline">
                            Ration Brain
                        </Link>{' '}
                        for grocery and ration tracking.
                    </p>
                    <p>
                        See the{' '}
                        <Link href={route('public.survival-report')} className="underline hover:no-underline">
                            Survival Report
                        </Link>{' '}
                        for a monthly summary.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
