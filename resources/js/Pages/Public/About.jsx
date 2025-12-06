import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://roznamcha.local';
const defaultOgImage = 'https://placehold.co/1200x630.png?text=Roznamcha';

export default function About() {
    const pageUrl = `${baseUrl}/about`;
    const meta = {
        title: 'About Roznamcha — household survival cockpit for Pakistan',
        description:
            'Roznamcha is an Urdu-first personal finance and ration awareness tool. Learn why we built Kharcha Map, Ration Brain, Reminders, and Survival Report for Pakistani families.',
        image: defaultOgImage,
    };

    return (
        <PublicLayout variant="inner">
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:image" content={meta.image} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.image} />
            </Head>

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4">
                    <h1 className="text-3xl font-bold text-[#001a4a]">About Roznamcha</h1>
                    <p className="text-base text-slate-700">
                        Roznamcha is the household survival cockpit for Pakistan. We combine Kharcha Map, Ration Brain, Reminders, and Survival Report
                        to help families control budgets, ration lists, and upcoming dues in one Urdu-first control room.
                    </p>
                </header>

                <section className="space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Why we built Roznamcha</h2>
                    <p className="text-base text-slate-700">
                        Inflation, unstable income, and the lack of simple Urdu finance tools pushed us to build Roznamcha. Our parents and friends
                        still used diaries for ration, another for kharcha, and WhatsApp reminders for bills. We wanted one clean cockpit that
                        respects Pakistani realities.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">How Roznamcha works</h2>
                    <p className="text-base text-slate-700">Inside the app you will find:</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                            <Link href={route('public.kharcha-map')} className="font-semibold hover:underline">
                                Kharcha Map
                            </Link>{' '}
                            to log rent, school fees, petrol, and more.
                        </li>
                        <li>
                            <Link href={route('public.ration-brain')} className="font-semibold hover:underline">
                                Ration Brain
                            </Link>{' '}
                            to track atta, ghee, sugar, chai, and other staples.
                        </li>
                        <li>Reminder tools for school fees, rent, bijli bills, BP medicine, and zakat.</li>
                        <li>
                            <Link href={route('public.survival-report')} className="font-semibold hover:underline">
                                Survival Report
                            </Link>{' '}
                            for a detailed month-end PDF summary.
                        </li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Who Roznamcha is for</h2>
                    <p className="text-base text-slate-700">
                        Families managing joint budgets, students sharing apartments, salaried people balancing EMIs, freelancers with uneven cash
                        flow, and small shop owners who want to separate shop vs home kharcha all rely on Roznamcha. If you work in PKR and think in
                        Urdu, you’re home.
                    </p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Trust and privacy</h2>
                    <p className="text-base text-slate-700">
                        Your household data belongs to you. We store it securely, give owners full control, and provide exports or deletion on
                        request. Our support inbox is run by humans—message us anytime.
                    </p>
                    <p className="text-base text-slate-700">
                        Need help?{' '}
                        <Link href={route('public.contact')} className="font-semibold text-[#001a4a] hover:underline">
                            Contact Roznamcha
                        </Link>
                        .
                    </p>
                </section>

                <nav className="flex flex-wrap gap-4 text-sm font-semibold text-[#001a4a]">
                    <Link href={route('public.home')} className="hover:underline">
                        Home
                    </Link>
                    <Link href={route('public.kharcha-map')} className="hover:underline">
                        Kharcha Map
                    </Link>
                    <Link href={route('public.ration-brain')} className="hover:underline">
                        Ration Brain
                    </Link>
                    <Link href={route('public.survival-report')} className="hover:underline">
                        Survival Report
                    </Link>
                    <Link href={route('public.contact')} className="hover:underline">
                        Contact
                    </Link>
                </nav>
            </section>
        </PublicLayout>
    );
}
