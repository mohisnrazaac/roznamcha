import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://roznamcha.local';
const defaultOgImage = 'https://placehold.co/1200x630.png?text=Roznamcha';

export default function RationBrain() {
    const pageUrl = `${baseUrl}/ration-brain`;
    const meta = {
        title: 'Ration Brain — grocery ration tracking & mehngai insights for Pakistan',
        description:
            'Roznamcha Ration Brain tracks atta, ghee, daal, chawal, tea, sugar and cooking oil prices so Pakistani households can watch inflation, compare shops and plan ration refills.',
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
                    <h1 className="text-3xl font-bold text-[#001a4a]">Ration Brain — understand your ration prices and mehngai</h1>
                    <p className="text-base text-slate-700">
                        Pakistan’s ration list is the heartbeat of every kitchen. Ration Brain keeps daily essentials like atta, ghee, daal, chawal,
                        tea, sugar, and cooking oil logged with dates and shop names so you can track mehngai with proof, not guesses.
                    </p>
                </header>

                <article className="space-y-6">
                    <Section
                        title="Track ration prices over months"
                        content="Capture each shopping trip with quantity and price. Whether you buy 20kg atta, 5 litre cooking oil, or 1kg basmati chawal, the graph shows the exact journey."
                        bullets={[
                            'Record price, quantity, vendor, and receipt notes.',
                            'Compare prices from Utility Store vs corner karyana.',
                            'Spot panic buying before Ramzan and stock wisely.',
                        ]}
                    />

                    <Section
                        title="See inflation on your daily essentials"
                        content="Monthly mehngai becomes visible when Ration Brain calculates percent change. Families can tell exactly when sugar jumped, when daal mash cooled down, or when tea leaves surged."
                        bullets={[
                            'Inflation badges highlight steep increases.',
                            'Future plan: premium tips will suggest cheaper trusted brands or wholesale alternatives.',
                            'Free version today shows history, current price, and days of ration left.',
                        ]}
                    />

                    <Section
                        title="Why Ration Brain is better than a paper daftar"
                        content="Paper registers get lost, while Ration Brain travels with your phone. Plus, it shares intelligence with Kharcha Map and Survival Report for a complete household picture."
                        bullets={[
                            'Digital backup with secure cloud storage.',
                            'Respects bilingual notes so Amma can write “Barkat store ka besan”.',
                            'Syncs with other Roznamcha modules to power the Survival Report.',
                        ]}
                    />
                </article>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Ready to take ration control?</h2>
                    <p className="text-base text-slate-700">
                        Sign up free to start logging prices, or jump straight to the Survival Report to see how ration inflation affects your
                        month-end.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-lg bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-yellow-300 hover:bg-[#112e66]"
                        >
                            Create a free account
                        </Link>
                        <Link href={route('public.survival-report')} className="text-sm font-semibold text-[#001a4a] hover:underline">
                            View the Survival Report →
                        </Link>
                    </div>
                </div>

                <nav className="flex flex-wrap gap-4 text-sm font-semibold text-[#001a4a]">
                    <Link href={route('public.home')} className="hover:underline">
                        Home
                    </Link>
                    <Link href={route('public.kharcha-map')} className="hover:underline">
                        Kharcha Map
                    </Link>
                    <Link href={route('public.survival-report')} className="hover:underline">
                        Survival Report
                    </Link>
                    <Link href={route('public.about')} className="hover:underline">
                        About
                    </Link>
                    <Link href={route('public.contact')} className="hover:underline">
                        Contact
                    </Link>
                </nav>
            </section>
        </PublicLayout>
    );
}

function Section({ title, content, bullets }) {
    return (
        <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-[#001a4a]">{title}</h2>
            <p className="text-base text-slate-700">{content}</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {bullets.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </section>
    );
}
