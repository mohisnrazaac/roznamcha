import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';

export default function About({ seo, jsonLd, contactEmail = 'support@roznamcha.pk' }) {
    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">About Roznamcha</h1>
                    <p className="text-base text-slate-700">
                        Roznamcha.pk is a practical budgeting and household tracking product built for Pakistan. It exists to help families follow
                        daily expenses, ration pressure, reminders, and month-end budget stress without financial jargon or spreadsheet fatigue.
                    </p>
                </header>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">About Mohsin</h2>
                    <p className="text-base text-slate-700">
                        Mohsin is the Founder of Roznamcha.pk and a Software Architect. With 16 years of experience
                        building software and digital systems, he created Roznamcha to help Pakistani households track daily expenses, ration costs,
                        reminders, and budget pressure in plain language that feels useful in everyday life.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Why Roznamcha was built</h2>
                    <p className="text-base text-slate-700">
                        Household budgeting in Pakistan is messy for most people. Prices move quickly, bills do not wait, and families usually need
                        practical tracking instead of finance jargon. Roznamcha was built to give people one place to record spending, stay aware of
                        grocery and ration shifts, and plan the month with more confidence.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">What Roznamcha covers</h2>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        <li>Monthly budget tracking for Pakistani households trying to understand where money is going.</li>
                        <li>
                            Ration and grocery cost awareness through tools like{' '}
                            <Link href={route('public.ration-brain')} className="font-semibold text-[#001a4a] underline">
                                Ration Brain
                            </Link>{' '}
                            and the{' '}
                            <Link href={route('public.tools.ration-cost-estimator')} className="font-semibold text-[#001a4a] underline">
                                Ration Cost Estimator
                            </Link>
                            .
                        </li>
                        <li>
                            Reminders for bills, medicine, school fees, and recurring household needs so families miss fewer important dates.
                        </li>
                        <li>
                            Practical articles and tools around household money management in Pakistan, including{' '}
                            <Link href={route('public.kharcha-map')} className="font-semibold text-[#001a4a] underline">
                                Kharcha Map
                            </Link>{' '}
                            and the{' '}
                            <Link href={route('public.survival-report')} className="font-semibold text-[#001a4a] underline">
                                Survival Report
                            </Link>
                            .
                        </li>
                    </ul>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Editorial approach</h2>
                    <p className="text-base text-slate-700">
                        Roznamcha content is written and reviewed with a practical, Pakistan-first lens. Articles and page updates may use public data,
                        market observation, product experience, and manual research to explain household budgeting issues in plain terms.
                    </p>
                    <p className="text-base text-slate-700">
                        Content is for informational purposes only. It is not personal financial advice, legal advice, tax advice, or a substitute for
                        professional guidance tailored to your situation.
                    </p>
                    <p className="text-base text-slate-700">
                        We update content when tools change, when the local market shifts materially, or when a page needs clearer context for Pakistani
                        households trying to make better day-to-day decisions.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Contact</h2>
                    <p className="text-base text-slate-700">
                        If you need help, want to report an issue, or have a question about the site, email{' '}
                        <a href={`mailto:${contactEmail}`} className="font-semibold text-[#001a4a] underline">
                            {contactEmail}
                        </a>{' '}
                        or use the{' '}
                        <Link href={route('public.contact')} className="font-semibold text-[#001a4a] underline">
                            contact page
                        </Link>
                        .
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Trust statement</h2>
                    <p className="text-base text-slate-700">
                        Roznamcha does not claim fake credentials, fake certifications, fake media endorsements, or a fake office presence. The site
                        does not promise guaranteed savings or claim to replace a licensed financial, legal, or tax professional. It is a practical
                        product and content platform built to help Pakistani households think more clearly about real spending.
                    </p>
                </section>

                <div className="text-sm text-[#001a4a] font-semibold space-y-2">
                    <p>
                        Start from the{' '}
                        <Link href={route('public.home')} className="underline hover:no-underline">
                            Home page
                        </Link>{' '}
                        or explore the{' '}
                        <Link href={route('public.features')} className="underline hover:no-underline">
                            Features
                        </Link>{' '}
                        page.
                    </p>
                    <p>
                        For direct questions, use the{' '}
                        <Link href={route('public.contact')} className="underline hover:no-underline">
                            contact page
                        </Link>{' '}
                        or email {contactEmail}.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
