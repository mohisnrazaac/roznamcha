import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://roznamcha.local';
const defaultOgImage = 'https://placehold.co/1200x630.png?text=Roznamcha';

export default function KharchaMap() {
    const pageUrl = `${baseUrl}/kharcha-map`;
    const meta = {
        title: 'Kharcha Map — track every rupee of your Pakistani household budget',
        description:
            'Roznamcha Kharcha Map helps Pakistani families map monthly kharcha, categorize grocery, rent, school fees, utility bills and petrol to see exactly where money goes.',
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
                    <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Kharcha Map — track every rupee of your household budget</h1>
                    <p className="text-base text-slate-700">
                        Cut through guesswork by logging day-to-day kharcha for grocery, rent, school van, mobile package, medicine, and chai.
                        Kharcha Map keeps monthly burn visible for joint families, students, and salaried couples managing Pakistani inflation.
                    </p>
                </header>

                <article className="space-y-6">
                    <Section
                        title="How Kharcha Map works"
                        content="Open the panel, add today’s kharcha with date, category, and optional Urdu notes. The map instantly plots totals by day and category so you spot spikes—maybe fuel because of extra trips or school fee quarter hitting."
                        bullets={[
                            'Add unlimited entries with PKR amounts and bilingual notes.',
                            'Filter date ranges to compare Ramzan vs regular months.',
                            'Export data into the month-end Survival Report instantly.',
                        ]}
                    />

                    <Section
                        title="Why Kharcha Map is made for Pakistani families"
                        content="We built Kharcha Map for the mix of cash + digital payments most households live with. You can tag rent, bijli bill, gas bill, milk, roti, mobile top-up, or even chai da dabba. The dashboard respects shared devices and low-bandwidth connections."
                        bullets={[
                            'Designed for Urdu/English bilingual inputs.',
                            'Works for joint families, students sharing flats, or shop owners separating business vs home kharcha.',
                            'Highlights essentials like school fees, kirana credit, and Qarz payments.',
                        ]}
                    />

                    <Section
                        title="Examples of kharcha categories"
                        content="Start with default buckets or create your own. Popular categories include:"
                        bullets={[
                            'Grocery + Ration (atta, roti, sabzi, milk, daal, masalay)',
                            'Utilities (KE bijli bill, sui gas, PTCL, water tanker)',
                            'Transport (petrol, Careem, school van, local bus cards)',
                            'Education + Fees (school fee, tuition, books, uniforms)',
                            'Health + Care (clinic visits, medicine, multivitamins)',
                            'Lifestyle (mobile package, Netflix, mehndi, gifting)',
                        ]}
                    />
                </article>

                <section className="bg-white border border-slate-200 rounded-2xl p-6" itemScope itemType="https://schema.org/FAQPage">
                    <h2 className="text-2xl font-semibold text-[#001a4a] mb-4">Kharcha Map FAQ</h2>
                    <div className="space-y-4">
                        <FAQ
                            question="Is my household data private?"
                            answer="Yes. Kharcha entries live in your secure Roznamcha account. Only logged-in household members you invite can view them."
                        />
                        <FAQ
                            question="Can I manage multiple households?"
                            answer="Roznamcha supports multiple households; switch between your parents’ home and your own within the Control Room."
                        />
                        <FAQ
                            question="How is data stored?"
                            answer="Entries are saved in an encrypted database hosted in secure cloud regions. You can delete any record or export your data at any time."
                        />
                    </div>
                </section>

                <nav className="flex flex-wrap gap-4 text-sm font-semibold text-[#001a4a]">
                    <Link href={route('public.home')} className="hover:underline">
                        ← Home
                    </Link>
                    <Link href={route('public.ration-brain')} className="hover:underline">
                        Ration Brain
                    </Link>
                    <Link href={route('public.survival-report')} className="hover:underline">
                        Survival Report
                    </Link>
                    <Link href={route('public.about')} className="hover:underline">
                        About Roznamcha
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

function FAQ({ question, answer }) {
    return (
        <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="border border-slate-200 rounded-xl p-4">
            <h3 itemProp="name" className="text-lg font-semibold text-[#001a4a]">
                {question}
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="mt-2 text-sm text-slate-700">
                    {answer}
                </p>
            </div>
        </div>
    );
}
