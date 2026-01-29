// Purpose: Outline Roznamcha modules for public preview before signup. Date: 2026-01-28. Author: Codex.
import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const featureImages = {
    'kharcha-map': {
        src: '/media/features/kharcha-map-expense-tracking-pakistan.png',
        width: 599,
        height: 410,
    },
    'ration-brain': {
        src: '/media/features/ration-brain-grocery-price-tracking-pakistan.png',
        width: 598,
        height: 366,
    },
    reminders: {
        src: '/media/features/reminders-health-guard-bill-medicine-pakistan.png',
        width: 599,
        height: 358,
    },
    reports: {
        src: '/media/features/reports-signals-monthly-survival-report-pakistan.png',
        width: 598,
        height: 325,
    },
    'ai-insights': {
        src: '/media/features/ai-insights-urdu-financial-advice-pakistan.png',
        width: 598,
        height: 125,
    },
    'daily-hooks': {
        src: '/media/features/daily-money-snapshot-daily-hooks.png',
        width: 450,
        height: 744,
    },
};

const modules = [
    {
        key: 'kharcha-map',
        title: 'Kharcha Map',
        description: 'Visualize every rupee in Urdu timelines so you know where to cut back before the 20th of the month.',
        bullets: ['خرچ کا فوری ریکارڈ', 'کیٹیگری کی زبردست ٹوٹلنگ', 'ماہانہ لیکیج پر نظر'],
    },
    {
        key: 'ration-brain',
        title: 'Ration Brain',
        description: 'Track atta, ghee, chawal, and sabzi prices across bazaars so ration lists stay realistic.',
        bullets: ['مہنگائی کا لائیو الارم', 'راشن لسٹ کی ذہین کاپی', 'خریداری سے پہلے قیمت چیک'],
    },
    {
        key: 'reminders',
        title: 'Reminders / Health Guard',
        description: 'Set medicine, school fee, rent, or zakkat nudges that ping the whole household workspace.',
        bullets: ['واٹس ایپ نوٹ کی جگہ ایک ٹائم لائن', 'ہیلتھ گارڈ کے ساتھ دوا کی ٹریکنگ', 'مشترکہ شیڈول ایک نظر میں'],
    },
    {
        key: 'reports',
        title: 'Reports & Signals',
        description: 'Monthly survival reports and alert banners tell you whether you will make it to payday.',
        bullets: ['Survival Report اردو میں', 'اوور اسپیندنگ الرٹس', 'ماہانہ خلاصہ ڈاؤن لوڈ'],
    },
    {
        key: 'daily-hooks',
        title: 'Daily Money Snapshot (Daily Hooks)',
        description: 'Fresh CMS + AI notes show what changed in inflation today so you stay engaged.',
        bullets: ['آج کا خرچ خلاصہ', 'مہنگائی کا فوری ہیلپ لائن', 'گھر کی سٹریکس سنبھالیں'],
    },
    {
        key: 'ai-insights',
        title: 'AI Insights',
        description: 'Use Urdu prompts to ask Roznamcha AI about kharcha leaks, ration swaps, or next month projections.',
        bullets: ['Urdu AI coach', 'Inflation stress test', 'راشن پلاننگ تجاویز'],
    },
];

export default function Features() {
    const seo = seoContent.features;
    const jsonLd = buildWebPageSchema(seo);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Open preview</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">See every Roznamcha module without logging in</h1>
                    <p className="text-base text-slate-600">
                        Ration planning, kharcha logs, reminders, reports, and AI insights — all built for Pakistani homes running dark mode and yellow highlights.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/register"
                            className="inline-flex items-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-yellow-200 shadow hover:bg-[#012261]"
                        >
                            Sign up (Free)
                        </Link>
                        <Link href="/login" className="text-sm font-semibold text-[#001a4a] underline-offset-4 hover:underline">
                            Login
                        </Link>
                    </div>
                </header>

                {modules.map((module) => (
                    <ModuleCard key={module.key} module={module} />
                ))}
            </section>

            <div className="fixed inset-x-0 bottom-4 px-4 md:hidden">
                <div className="rounded-2xl bg-[#001a4a] px-4 py-3 shadow-2xl">
                    <Link
                        href="/register"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-300 px-4 py-2 text-base font-semibold text-[#001a4a]"
                    >
                        Sign up (Free)
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}

function ModuleCard({ module }) {
    const imageMeta = featureImages[module.key];
    const aspectStyle = imageMeta?.width && imageMeta?.height ? { aspectRatio: `${imageMeta.width}/${imageMeta.height}` } : undefined;
    const imageWrapperClass = `w-full rounded-2xl border border-dashed border-yellow-300 bg-[#fff9ef] overflow-hidden ${
        imageMeta ? '' : 'aspect-video'
    }`;

    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-[#001a4a]">{module.title}</h2>
                <p className="text-base text-slate-600">{module.description}</p>
            </div>
            <div className={imageWrapperClass} style={aspectStyle}>
                {imageMeta ? (
                    <img
                        src={imageMeta.src}
                        alt={`${module.title} screenshot`}
                        loading="lazy"
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#001a4a]">
                        Screenshot placeholder — update via CMS later.
                    </div>
                )}
            </div>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {module.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                ))}
            </ul>
            <Link
                href="/register"
                className="inline-flex items-center font-semibold text-[#001a4a] hover:underline"
            >
                Try it — Sign up →
            </Link>
        </section>
    );
}
