import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const audience = [
    'Salaried families stretching paychecks through the 30th',
    'Small business owners balancing shop and home kharcha',
    'Parents managing school fees, tuition, and ration together',
    'People sending money to relatives and needing visibility on usage',
];

export default function About() {
    const seo = seoContent.about;
    const jsonLd = buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">About Roznamcha</h1>
                    <p className="text-base text-slate-700">
                        Roznamcha is a household survival cockpit built in Pakistan for Pakistan. Kharcha Map, Ration Brain, and the Survival Report
                        give families the visibility they never had with diaries or spreadsheets.
                    </p>
                </header>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Why Roznamcha was created</h2>
                    <p className="text-base text-slate-700">
                        We watched relatives juggle salaries against runaway mehngai. Rent climbed, petrol hiked, school fees arrived without notice,
                        and ration diaries never balanced. There was no Urdu budget app that showed the full picture. Roznamcha was created so every
                        household could log expenses, track ration prices, and see a survival report in the language they speak at home.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">What Roznamcha offers</h2>
                    <p className="text-base text-slate-700">
                        Three modules keep Pakistani households steady.{' '}
                        <Link href={route('public.kharcha-map')} className="font-semibold text-[#001a4a] underline">
                            Kharcha Map
                        </Link>{' '}
                        is the kharcha tracker that records every rupee—from chai to rent.{' '}
                        <Link href={route('public.ration-brain')} className="font-semibold text-[#001a4a] underline">
                            Ration Brain
                        </Link>{' '}
                        tracks grocery prices so mehngai is measured, not guessed. The{' '}
                        <Link href={route('public.survival-report')} className="font-semibold text-[#001a4a] underline">
                            Survival Report
                        </Link>{' '}
                        combines everything into a monthly budget report that families can share.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Our promise</h2>
                    <p className="text-base text-slate-700">
                        Roznamcha stays privacy-first, simple, and Urdu friendly. Your kharcha and ration data belongs to you. We design for shared
                        phones, slow internet, and bilingual notes, and we answer support messages with real humans. No corporate buzzwords—just tools
                        that work for actual Pakistani life.
                    </p>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Who Roznamcha is for</h2>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        {audience.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Future roadmap</h2>
                    <p className="text-base text-slate-700">
                        We are building deeper insights, localized alerts, and eventually mobile apps so Pakistani households receive ration tips and
                        kharcha reminders on the go. User feedback drives every release.
                    </p>
                </section>

                <div className="text-sm text-[#001a4a] font-semibold space-y-2">
                    <p>
                        Go back to the{' '}
                        <Link href={route('public.home')} className="underline hover:no-underline">
                            Home page
                        </Link>{' '}
                        or explore{' '}
                        <Link href={route('public.kharcha-map')} className="underline hover:no-underline">
                            Kharcha Map
                        </Link>
                        ,{' '}
                        <Link href={route('public.ration-brain')} className="underline hover:no-underline">
                            Ration Brain
                        </Link>
                        , and the{' '}
                        <Link href={route('public.survival-report')} className="underline hover:no-underline">
                            Survival Report
                        </Link>
                        .
                    </p>
                    <p>
                        Need help?{' '}
                        <Link href={route('public.contact')} className="underline hover:no-underline">
                            Contact the team
                        </Link>
                        .
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
