import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://roznamcha.local';
const defaultOgImage = 'https://placehold.co/1200x630.png?text=Roznamcha';

export default function SurvivalReport() {
    const pageUrl = `${baseUrl}/survival-report`;
    const meta = {
        title: 'Survival Report — month-end PDF summary for Pakistani households',
        description:
            'Roznamcha Survival Report creates a month-end PDF showing total spending by category, ration inflation and upcoming reminders so Pakistani families can plan the next month calmly.',
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
                    <h1 className="text-3xl font-bold text-[#001a4a]">Month-end Survival Report for your household</h1>
                    <p className="text-base text-slate-700">
                        The Survival Report is a premium-quality PDF generated from your Kharcha Map, Ration Brain, and Reminders. It sums up the month with clean charts and Urdu-friendly text so you can plan the next salary cycle with clarity.
                    </p>
                </header>

                <article className="space-y-6">
                    <Section
                        title="What is the Survival Report?"
                        content="A downloadable PDF snapshot that highlights the month’s total spend, ration inflation trend, and outstanding reminders (rent, bijli bill, school dues). Share it with your spouse, parents, or accountant without exposing your login."
                    />

                    <Section
                        title="How the Survival Report helps you plan next month"
                        content="Instead of stressing on the 25th, open the Survival Report and know exactly where the rupees went. Adjust ration targets, negotiate tuition fees, or hold back impulse buys based on facts, not emotions."
                        bullets={[
                            'Set smarter budgets for ration and transport.',
                            'Alert the family about upcoming reminders (fees, maintenance, zakat).',
                            'Track health reminders like BP medicine so no refill is missed.',
                        ]}
                    />

                    <Section
                        title="What is inside the report?"
                        content="Each report includes:"
                        bullets={[
                            'Totals by category (rent, school fees, ration, petrol, utilities).',
                            'Ration inflation overview sourced from Ration Brain entries.',
                            'Upcoming reminders and their due dates pulled from Roznamcha Reminders.',
                            'Health and wellbeing signals such as medicine schedules or doctor follow-ups.',
                        ]}
                    />
                </article>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <p className="text-base text-slate-700">
                        The MVP offers Survival Reports free of charge so you build the habit. Future premium tiers will add AI-powered advice,
                        multi-household benchmarking, and shareable branded reports.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-lg bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-yellow-300 hover:bg-[#112e66]"
                        >
                            Create your first Survival Report
                        </Link>
                        <Link href={route('public.kharcha-map')} className="text-sm font-semibold text-[#001a4a] hover:underline">
                            Visit Kharcha Map
                        </Link>
                        <Link href={route('public.ration-brain')} className="text-sm font-semibold text-[#001a4a] hover:underline">
                            Explore Ration Brain
                        </Link>
                        <Link href={route('public.contact')} className="text-sm font-semibold text-[#001a4a] hover:underline">
                            Contact Roznamcha
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function Section({ title, content, bullets }) {
    return (
        <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-[#001a4a]">{title}</h2>
            <p className="text-base text-slate-700">{content}</p>
            {bullets && (
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    {bullets.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            )}
        </section>
    );
}
