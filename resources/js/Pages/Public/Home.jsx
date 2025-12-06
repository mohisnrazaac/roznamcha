import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://roznamcha.local';
const defaultOgImage = 'https://placehold.co/1200x630.png?text=Roznamcha';

export default function Home() {
    const pageUrl = `${baseUrl}/`;
    const meta = {
        title: 'Roznamcha Kharcha Map, Ration Brain & Survival Report for Pakistani households',
        description:
            'Roznamcha is the Urdu-first household budget, kharcha, ration and survival report tracker built for Pakistan. Track expenses, ration lists, mehngai and plan monthly cash.',
        image: defaultOgImage,
    };

    return (
        <PublicLayout variant="landing">
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:image" content={meta.image} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.image} />
            </Head>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div className="space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[#001a4a] leading-tight">
                            Roznamcha — your Urdu-first household kharcha and ration tracker
                        </h1>
                        <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                            Pakistani families juggle rent, school fees, bijli bills, petrol, and ration refills
                            while Mehngai tightens every month. Roznamcha gives you the Kharcha Map, Ration Brain and
                            Survival Report so every rupee is documented and every month end is calmer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center justify-center rounded-lg bg-[#001a4a] px-6 py-3 text-base font-semibold text-yellow-300 shadow hover:bg-[#112e66]"
                            >
                                Sign up and start tracking
                            </Link>
                            <Link
                                href={route('public.kharcha-map')}
                                className="inline-flex items-center justify-center rounded-lg border border-[#001a4a] px-6 py-3 text-base font-semibold text-[#001a4a] hover:bg-[#001a4a]/5"
                            >
                                Explore Kharcha Map
                            </Link>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
                            <span>Household cockpit</span>
                            <span>Roznamcha Preview</span>
                        </div>
                        <div className="bg-[#001a4a] text-white rounded-xl p-5 space-y-1">
                            <p className="text-sm text-yellow-200">This Month Kharcha</p>
                            <p className="text-3xl font-semibold">₨ 82,450</p>
                            <p className="text-xs text-slate-200">+12% vs last month (fuel + ration spike)</p>
                        </div>
                        <p className="text-sm text-slate-600">
                            Get totals, ration days left, reminders, and the Survival Report PDF inside the Control Room
                            once you sign up. No spreadsheets, no complicated English dashboards—just clear Urdu-first
                            insights.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ModuleCard
                        title="Kharcha Map"
                        description="Log every monthly kharcha from daal, school van, to mobile package and see the heatmap of spending."
                        link={route('public.kharcha-map')}
                        cta="Read about Kharcha Map"
                    />
                    <ModuleCard
                        title="Ration Brain"
                        description="Track ration list prices (atta, ghee, chawal, chai, sugar) and monitor mehngai trend."
                        link={route('public.ration-brain')}
                        cta="Learn about Ration Brain"
                    />
                    <ModuleCard
                        title="Survival Report"
                        description="Download a month-end Survival Report PDF that sums kharcha, ration inflation, and upcoming dues."
                        link={route('public.survival-report')}
                        cta="See Survival Report"
                    />
                </div>

                <FeatureSection
                    id="kharcha-map"
                    heading="Kharcha Map keeps monthly kharcha visible"
                    description="Every rupee for rent, school fee, bike petrol, medicine, and gup shup tea can be categorized—so you know exactly what ate the salary."
                    bullets={[
                        'Track kharcha by category in Urdu + English mix',
                        'Filter weeks to compare Eid spending vs normal weeks',
                        'Share insights with your partner without spreadsheets',
                    ]}
                    link={route('public.kharcha-map')}
                    linkLabel="Deep dive into Kharcha Map"
                />

                <FeatureSection
                    id="ration-brain"
                    heading="Ration Brain understands ration lists and mehngai"
                    description="Atta suddenly touched 145/kg? Cooking oil jumped before salary date? Ration Brain stores every refill price so you can bargain confidently."
                    bullets={[
                        'Maintain a living ration list with quantity and rate',
                        'See price deltas for atta, chawal, daal, ghee, sugar',
                        'Estimate how many days the current ration will last',
                    ]}
                    link={route('public.ration-brain')}
                    linkLabel="Explore Ration Brain"
                />

                <FeatureSection
                    id="survival-report"
                    heading="Survival Report keeps next month stress-free"
                    description="A PDF snapshot summarises totals by category, ration inflation, and reminder-based dues (rent, bijli bill, school fees) so you plan early."
                    bullets={[
                        'Auto-generate a bilingual PDF summary',
                        'Spot overspending early and adjust targets',
                        'Share the report with family or accountant',
                    ]}
                    link={route('public.survival-report')}
                    linkLabel="See Survival Report details"
                />

                <div className="bg-[#001a4a] text-yellow-200 rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <p className="text-xl font-semibold">Ready to steady your household cash?</p>
                        <p className="text-sm text-yellow-100 mt-1">
                            Create a free Roznamcha account and start logging kharcha + ration today.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-xl bg-yellow-300 px-6 py-3 text-sm font-semibold text-[#001a4a] hover:bg-yellow-200"
                        >
                            Sign up now
                        </Link>
                        <Link
                            href={route('public.contact')}
                            className="inline-flex items-center justify-center rounded-xl border border-yellow-200 px-6 py-3 text-sm font-semibold text-yellow-200 hover:bg-white/10"
                        >
                            Talk to us
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function ModuleCard({ title, description, link, cta }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-[#001a4a]">{title}</h2>
            <p className="text-sm text-slate-600 flex-1">{description}</p>
            <Link href={link} className="text-sm font-semibold text-[#001a4a] hover:underline">
                {cta}
            </Link>
        </div>
    );
}

function FeatureSection({ id, heading, description, bullets, link, linkLabel }) {
    return (
        <section id={id} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 space-y-4">
            <h2 className="text-2xl font-semibold text-[#001a4a]">{heading}</h2>
            <p className="text-base text-slate-700">{description}</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {bullets.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <Link href={link} className="inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline">
                {linkLabel}
            </Link>
        </section>
    );
}
