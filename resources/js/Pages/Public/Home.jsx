import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import DailyMoneySnapshot from '../../Components/Daily/DailyMoneySnapshot';
import { seoContent, buildWebPageSchema } from '../../lib/seo';

const heroBullets = ['خرچ کا ریکارڈ', 'راشن کی قیمتوں پر نظر', 'مہینے کے آخر میں Survival Report'];

const socialProofTestimonials = [
    {
        quote: 'Roznamcha reminded us to log kharcha nightly so the ration bill never surprises the family budget.',
        author: 'Ayesha, Lahore',
    },
    {
        quote: 'My husband checks the Survival Report before every payday to stay calm about school fees.',
        author: 'Imran, Karachi',
    },
    {
        quote: 'It keeps dadi and I aligned on groceries without pushing another WhatsApp list.',
        author: 'Rida, Faisalabad',
    },
];

const metricBadges = [
    'Households using Roznamcha: (coming soon)',
    'Daily snapshots generated: (coming soon)',
    'Built for Pakistan: Urdu-first workflows',
];

const kharchaBullets = [
    'Record daily expenses',
    'See monthly spending totals',
    'Spot unnecessary spending',
    'Plan a realistic monthly budget',
    'Understand where most money goes',
];

const rationBullets = [
    'Track ration item prices over months',
    'Monitor inflation on essential goods',
    'Create your own ration list',
    'Avoid sudden surprises in grocery budget',
];

const survivalBullets = [
    'Month-end summary of all expenses',
    'Identify overspending areas',
    'Get a projected next-month estimate',
    'Understand inflation impact on your home',
];

const faqs = [
    {
        question: 'How can I manage my monthly household budget in Pakistan effectively?',
        answer: 'Effective budgeting starts with categorizing your income into fixed costs like rent and bills, and variable costs like groceries and fuel. Many families follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Regularly tracking these categories helps identify overspending areas and ensures your monthly salary lasts until the next payday.',
    },
    {
        question: 'What is the best way to track daily expenses (Kharcha) on a mobile phone?',
        answer: 'The most reliable method is to record every transaction immediately, from small grocery bills to large utility payments. Using a digital ledger or expense diary allows you to see real-time spending patterns. This transparency is crucial for Pakistani households to stay within their budget limits and avoid the stress of running out of cash by the month-end.',
    },
    {
        question: 'How can I monitor the changing prices of daily ration items in Pakistan?',
        answer: 'Keeping a personal record of prices for staples like atta, ghee, and sugar allows you to spot inflation trends early. By comparing prices from different months or markets, you can make smarter purchasing decisions, such as buying in bulk when prices are lower. Monitoring these fluctuations is essential for maintaining a stable household food budget during high inflation.',
    },
    {
        question: 'What is a survival report and why is it useful for households?',
        answer: 'A survival report is a summary that evaluates your financial health at the end of the month by comparing total income against all expenses. It highlights whether you lived within your means or overspent. For families in Pakistan, this report serves as a monthly audit, providing the data needed to adjust spending and plan better for the upcoming month.',
    },
    {
        question: 'How much money should a middle-class family in Pakistan save monthly?',
        answer: 'Financial experts generally recommend saving at least 10% to 20% of your net monthly income. Building an emergency fund that covers three to six months of expenses is vital for protection against unexpected costs like medical bills or inflation spikes. Consistently setting aside even small amounts each month significantly improves long-term financial security for the household.',
    },
];

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
};

export default function Home({ latestPosts = [], showAiBanner = false, youtubeDemoUrl = null }) {
    const seo = seoContent.home;
    const jsonLd = buildWebPageSchema(seo);

    return (
        <PublicLayout variant="landing">
            <SeoHead {...seo} jsonLd={jsonLd} />
            <Head>
                <script
                    key="faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            </Head>

            <section className="bg-[#000f2d] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid gap-10 lg:grid-cols-[minmax(0,1fr),420px]">
                    <div className="space-y-6">
                        <p className="text-xs uppercase tracking-[0.5em] text-yellow-200/80">Pakistan survival cockpit</p>
                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                            Stay ahead of ration shocks, utility hikes, and end-of-month panic.
                        </h1>
                        <p className="text-base sm:text-lg text-yellow-100/90">
                            Roznamcha is the Urdu-first household console that keeps your kharcha map, ration brain, reminders, and survival report front and center.
                            <span className="block">Sign up before the month slips away.</span>
                        </p>
                        <ul className="space-y-2">
                            {heroBullets.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-lg text-yellow-200/90">
                                    <span className="h-2 w-2 rounded-full bg-yellow-300" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-base font-semibold text-[#001a4a] shadow-lg transition hover:bg-white"
                            >
                                Sign up (Free)
                            </Link>
                            <Link
                                href="/tools/ration-cost-estimator"
                                className="inline-flex items-center justify-center rounded-full border border-yellow-200/60 px-5 py-2.5 text-base font-semibold text-yellow-100 transition hover:bg-white/10"
                            >
                                Ration Cost Estimator
                            </Link>
                            <Link
                                href="/features"
                                className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-white/10"
                            >
                                See Features
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm leading-relaxed">
                            <p className="font-semibold">
                                آپ کا ڈیٹا آپ کا ہے — ہم آپ کا ڈیٹا فروخت نہیں کرتے۔
                            </p>
                            <p className="text-yellow-100/80">Basic encryption + access control</p>
                        </div>
                    </div>
                    <DailyMoneySnapshot className="shadow-2xl ring-1 ring-yellow-200/60" />
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
                {showAiBanner && (
                    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-yellow-900">🔥 New: AI Budget Advisor (Free for all users)</p>
                            <p className="text-sm text-yellow-800">
                                Roznamcha now includes AI-powered money tips. Track inflation, control groceries, and survive the month smarter.
                            </p>
                        </div>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#012261]"
                        >
                            Sign up (Free)
                        </Link>
                    </div>
                )}

                <SocialProofSection testimonials={socialProofTestimonials} metricBadges={metricBadges} />
                <DemoSection youtubeDemoUrl={youtubeDemoUrl} />

                <Section
                    title="Roznamcha keeps daily inflation honest"
                    body="Money slips away when there is no clear record. Roznamcha helps you stay in control of daily expenses, grocery prices, and unexpected costs. You can check where you spent more, how ration prices changed, and what to expect next month. The goal is simple: make life easier and help families survive monthly inflation with confidence."
                />

                <FeatureBlock
                    title="Track Every Rupee with Kharcha Map"
                    body="Kharcha Map gives you a clean breakdown of your daily, weekly, and monthly expenses. It shows how much went into groceries, fuel, school fees, bills, and other categories. Over time, you’ll see spending patterns that help you cut unnecessary costs. It’s built in Urdu so every family member can understand it easily."
                    bullets={kharchaBullets}
                    link={route('public.kharcha-map')}
                />

                <FeatureBlock
                    title="Know Your Ration Prices with Ration Brain"
                    body="Ration Brain helps you track changes in grocery prices. Whether it's dal, atta, chawal, ghee, or cheeni, you can keep a record of what you paid last time and how much prices changed. This makes grocery shopping smarter and more predictable, especially during high inflation."
                    bullets={rationBullets}
                    link={route('public.ration-brain')}
                />

                <FeatureBlock
                    title="Get a Clear Survival Report at Month-End"
                    body="The Survival Report gives you a summary of your income, expenses, and the overall health of your budget. It shows what you saved, where you overspent, and what to expect in the coming month. It works like a monthly audit of your household."
                    bullets={survivalBullets}
                    link={route('public.survival-report')}
                />

                {latestPosts.length > 0 && (
                    <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-semibold text-[#001a4a]">Latest from the Blog</h2>
                                <p className="text-sm text-slate-500">
                                    Daily Roznamcha commentary on ration strategy, inflation, and Pakistani household survival.
                                </p>
                            </div>
                            <Link href={route('public.blog.index')} className="text-sm font-semibold text-[#001a4a] hover:underline">
                                View all →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {latestPosts.map((post) => (
                                <article key={post.id} className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">{post.published_label}</p>
                                    <h3 className="text-xl font-semibold text-[#001a4a]">
                                        <Link href={post.url} className="hover:underline">
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-slate-600">{post.excerpt}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                <Section
                    title="Designed for Pakistani Homes"
                    body="Roznamcha is made for our local needs. Every feature, every label, and every screen is built with Urdu language and Pakistani lifestyle in mind. No complex terms. No foreign budgeting style. Just a simple tool that anyone can use."
                />

                <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4" aria-labelledby="faq-heading">
                    <h2 id="faq-heading" className="text-2xl font-semibold text-[#001a4a]">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.question} className="border border-slate-200 rounded-xl p-4 space-y-2">
                                <h3 className="text-lg font-semibold text-[#001a4a]">{faq.question}</h3>
                                <p className="text-base text-slate-700">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-[#001a4a] text-yellow-200 rounded-2xl p-6 space-y-4">
                    <h2 className="text-2xl font-semibold">Explore Roznamcha Features</h2>
                    <p className="text-sm text-yellow-100">
                        Google and people both understand Roznamcha better when these links stay visible.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <InternalLink href={route('public.features')} label="Features" />
                        <InternalLink href="/tools/ration-cost-estimator" label="Ration Cost Estimator" />
                        <InternalLink href={route('public.kharcha-map')} label="Kharcha Map" />
                        <InternalLink href={route('public.ration-brain')} label="Ration Brain" />
                        <InternalLink href={route('public.survival-report')} label="Survival Report" />
                        <InternalLink href={route('public.about')} label="About" />
                        <InternalLink href={route('public.contact')} label="Contact" />
                    </div>
                </section>
            </section>
        </PublicLayout>
    );
}

function SocialProofSection({ testimonials, metricBadges: badges }) {
    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-[#001a4a]">Trusted by Pakistani households</h2>
                    <p className="text-sm text-slate-500">Placeholder signals while we ship analytics and public stats.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {badges.map((badge) => (
                        <MetricBadge key={badge} label={badge} />
                    ))}
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.author} quote={testimonial.quote} author={testimonial.author} />
                ))}
            </div>
        </section>
    );
}

function DemoSection({ youtubeDemoUrl }) {
    const hasEmbed = Boolean(youtubeDemoUrl);
    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div>
                <h2 className="text-2xl font-semibold text-[#001a4a]">Roznamcha Demo (Coming Soon)</h2>
                <p className="text-base text-slate-600">یہاں آپ جلد YouTube پر مکمل ڈیمو دیکھ سکیں گے۔</p>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-dashed border-yellow-300 bg-[#fff9ef]">
                {hasEmbed ? (
                    <iframe
                        title="Roznamcha demo"
                        src={youtubeDemoUrl}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-[#001a4a]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#001a4a] text-2xl font-semibold">
                            ▶
                        </div>
                        <p className="text-base font-semibold">YouTube demo will be embedded here</p>
                        <p className="text-sm text-slate-600">Set ROZNAMCHA_YOUTUBE_DEMO_URL to replace this block.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function TestimonialCard({ quote, author }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
            <p className="text-base text-[#001a4a]">&ldquo;{quote}&rdquo;</p>
            <p className="text-sm font-semibold text-slate-600">{author}</p>
        </article>
    );
}

function MetricBadge({ label }) {
    return (
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-[#001a4a]">
            {label}
        </div>
    );
}

function Section({ title, body }) {
    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-[#001a4a]">{title}</h2>
            <p className="text-base text-slate-700">{body}</p>
        </section>
    );
}

function FeatureBlock({ title, body, bullets, link }) {
    return (
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-[#001a4a]">{title}</h2>
            <p className="text-base text-slate-700">{body}</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {bullets.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <Link href={link} className="text-sm font-semibold text-[#001a4a] hover:underline">
                Learn more →
            </Link>
        </section>
    );
}

function InternalLink({ href, label }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center rounded-full border border-yellow-200 px-4 py-2 text-sm font-semibold text-yellow-100 hover:bg-white/10"
        >
            {label}
        </Link>
    );
}
