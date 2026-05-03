import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ToolLayout from '../../../Layouts/ToolLayout';
import SeoHead from '../../../Components/SeoHead';
import { buildWebPageSchema, seoContent } from '../../../lib/seo';
import SaveWall from '../../../Components/Activation/SaveWall';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

const clampNumber = (value, min = 0) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return min;
    return Math.max(min, parsed);
};

const faqItems = [
    {
        question: 'Why does the real monthly school cost look higher than tuition?',
        answer: 'Because annual charges and recurring exam fees are spread across 12 months. This avoids budget shocks during fee-heavy months.',
    },
    {
        question: 'Does this planner store my school fee data?',
        answer: 'No. Guests can calculate instantly. Sign up only if you want to save the estimate inside your household ledger later.',
    },
    {
        question: 'What is the planning margin used for?',
        answer: 'It projects a safer monthly reserve for the next academic year by applying a configurable percentage to your current real monthly cost.',
    },
];

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
        },
    })),
};

const calculatorJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'School Fees Planner',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    url: 'https://roznamcha.pk/tools/school-fees-planner',
    description:
        'Guest-mode calculator for tuition, annual charges, exam fees, and monthly school fee planning in Pakistan.',
};

export default function SchoolFeesPlanner({ defaults, activationPrefill, seo: seoProp, jsonLd: jsonLdProp }) {
    const seo = seoProp ?? seoContent.schoolFeesPlanner;
    const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const prefilledInputs = activationPrefill?.inputs ?? {};
    const prefilledResults = activationPrefill?.results ?? null;
    const [form, setForm] = React.useState({
        children_count: prefilledInputs.children_count ?? defaults?.children_count ?? 2,
        monthly_tuition_per_child: prefilledInputs.monthly_tuition_per_child ?? defaults?.monthly_tuition_per_child ?? 18000,
        annual_charges: prefilledInputs.annual_charges ?? defaults?.annual_charges ?? 50000,
        exam_fee: prefilledInputs.exam_fee ?? defaults?.exam_fee ?? 6000,
        exam_frequency: prefilledInputs.exam_frequency ?? defaults?.exam_frequency ?? 2,
        inflation_buffer_percentage: prefilledInputs.inflation_buffer_percentage ?? defaults?.inflation_buffer_percentage ?? 12,
    });
    const [result, setResult] = React.useState(prefilledResults);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [revealResult, setRevealResult] = React.useState(Boolean(prefilledResults));
    const [scrollDepth, setScrollDepth] = React.useState(0);

    React.useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
            setScrollDepth(window.scrollY / maxScrollable);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    const shouldShowPreview = Boolean(result) && scrollDepth >= 0.65;
    const highlightResult = Boolean(result) && scrollDepth >= 0.65 && scrollDepth <= 0.75;

    const handleChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        setRevealResult(false);

        const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const response = await fetch('/tools/school-fees-planner/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    children_count: clampNumber(form.children_count, 1),
                    monthly_tuition_per_child: clampNumber(form.monthly_tuition_per_child, 0),
                    annual_charges: clampNumber(form.annual_charges, 0),
                    exam_fee: clampNumber(form.exam_fee, 0),
                    exam_frequency: clampNumber(form.exam_frequency, 0),
                    inflation_buffer_percentage: clampNumber(form.inflation_buffer_percentage, 0),
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.message ?? 'Calculation failed');
            }

            setResult(data);
            window.requestAnimationFrame(() => setRevealResult(true));
        } catch (submitError) {
            setError(submitError.message || 'Unable to calculate right now.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ToolLayout
            title="School Fees Planner"
            subtitle="Calculate the real monthly school cost before annual charges and exam months catch your household off guard."
            description="Guest mode tool for Pakistan households: tuition + annual charges + exam fees + planning margin projection."
        >
            <SeoHead {...seo} jsonLd={pageSchema} />
            <Head>
                <script
                    key="school-fees-faq-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
                <script
                    key="school-fees-calculator-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
                />
            </Head>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-[#001a4a]">School Fee Details</h2>
                            <p className="text-sm text-slate-500">Calculate first. Decide about signup later.</p>
                        </div>
                        <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200">
                            Guest Mode
                        </span>
                    </div>

                    <Field
                        label="Children count"
                        type="number"
                        min="1"
                        value={form.children_count}
                        onChange={(e) => handleChange('children_count', e.target.value)}
                    />
                    <Field
                        label="Monthly tuition per child (PKR)"
                        type="number"
                        min="0"
                        value={form.monthly_tuition_per_child}
                        onChange={(e) => handleChange('monthly_tuition_per_child', e.target.value)}
                    />
                    <Field
                        label="Annual charges (PKR)"
                        type="number"
                        min="0"
                        value={form.annual_charges}
                        onChange={(e) => handleChange('annual_charges', e.target.value)}
                    />
                    <Field
                        label="Exam fee (per exam cycle, PKR)"
                        type="number"
                        min="0"
                        value={form.exam_fee}
                        onChange={(e) => handleChange('exam_fee', e.target.value)}
                    />
                    <Field
                        label="Exam frequency (per year)"
                        type="number"
                        min="0"
                        value={form.exam_frequency}
                        onChange={(e) => handleChange('exam_frequency', e.target.value)}
                    />
                    <Field
                        label="Planning margin (%)"
                        type="number"
                        min="0"
                        value={form.inflation_buffer_percentage}
                        onChange={(e) => handleChange('inflation_buffer_percentage', e.target.value)}
                    />

                    {error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#012261] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Calculating...' : 'Calculate School Fees Plan'}
                    </button>
                </form>

                <div className="space-y-5">
                    <section
                        className={[
                            'rounded-2xl border p-6 transition-all duration-500',
                            result
                                ? 'bg-white border-slate-200 shadow-sm'
                                : 'bg-slate-50 border-slate-200/80',
                            revealResult ? 'opacity-100 translate-y-0' : 'opacity-100',
                            highlightResult ? 'ring-2 ring-amber-300 shadow-xl motion-safe:animate-pulse' : '',
                        ].join(' ')}
                    >
                        {!result ? (
                            <div className="space-y-2">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Result</p>
                                <h3 className="text-2xl font-semibold text-[#001a4a]">Your real monthly school cost will appear here</h3>
                                <p className="text-sm text-slate-500">
                                    Tuition-only thinking hides annual charges and exam spikes. This planner converts those into a monthly reserve target.
                                </p>
                            </div>
                        ) : (
                            <div className={`space-y-4 transform transition-all duration-500 ${revealResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">School Cost Breakdown</p>
                                    <h3 className="text-3xl font-semibold text-[#001a4a] mt-2">
                                        PKR {formatCurrency(result.real_monthly_cost)}
                                    </h3>
                                    <p className="text-sm text-slate-500">Real monthly school cost (including amortized annual + exam fees).</p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <MetricCard
                                        label="Tuition outflow"
                                        value={`PKR ${formatCurrency(result.monthly_outflow)}`}
                                    />
                                    <MetricCard
                                        label="Amortized annual charges"
                                        value={`PKR ${formatCurrency(result.amortized_monthly)}`}
                                    />
                                    <MetricCard
                                        label="Real monthly cost"
                                        value={`PKR ${formatCurrency(result.real_monthly_cost)}`}
                                    />
                                    <MetricCard
                                        label="Projected next year"
                                        value={`PKR ${formatCurrency(result.projected_next_year)}`}
                                    />
                                </div>
                            </div>
                        )}
                    </section>

                    {result ? (
                        // ROZNAMCHA-ACTIVATION: place save wall immediately below computed result.
                        <SaveWall
                            toolKey="school_fees_planner"
                            inputs={{ ...form }}
                            results={{ ...result }}
                            isAuthenticated={isAuthenticated}
                            saveEndpoint="tools.snapshots.store"
                            returnUrl={typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/tools/school-fees-planner'}
                        />
                    ) : null}

                    {result && shouldShowPreview ? (
                        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm transition-all duration-500">
                            <p className="text-xs uppercase tracking-[0.25em] text-amber-700">Output Preview</p>
                            <h3 className="text-xl font-semibold text-[#001a4a] mt-2">
                                You are not paying PKR {formatCurrency(result.monthly_outflow)} per month. You are effectively paying PKR {formatCurrency(result.real_monthly_cost)}.
                            </h3>
                            <p className="text-sm text-slate-700 mt-2">
                                To avoid panic months, you should reserve PKR {formatCurrency(result.real_monthly_cost)} monthly.
                            </p>

                            <div className="mt-5 rounded-xl border border-white/80 bg-white p-4">
                                <p className="text-base font-semibold text-[#001a4a]">Save this for my household</p>
                                <p className="text-sm text-slate-500 mt-1">Track this inside your household ledger</p>
                                <Link
                                    href="/register"
                                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[#001a4a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#012261]"
                                >
                                    Save this estimate
                                </Link>
                            </div>
                        </section>
                    ) : null}

                    <section className="bg-[#001a4a] text-white rounded-2xl p-6 shadow-lg">
                        <p className="text-xs uppercase tracking-[0.25em] text-yellow-200">Continuity</p>
                        <p className="text-sm text-white/80 mt-2">
                            Signup is only for memory. All calculations remain visible in guest mode.
                        </p>
                        <Link
                            href="/register"
                            className="mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-white"
                        >
                            Save this for my household
                        </Link>
                    </section>
                </div>
            </div>

            <section className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 space-y-4" itemScope itemType="https://schema.org/FAQPage">
                <h2 className="text-xl font-semibold text-[#001a4a]">School Fees Planner FAQs</h2>
                {faqItems.map((faq) => (
                    <div key={faq.question} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                        <h3 className="font-semibold text-slate-800" itemProp="name">{faq.question}</h3>
                        <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                            <p className="text-sm text-slate-600 mt-1" itemProp="text">{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </section>
        </ToolLayout>
    );
}

function Field({ label, ...props }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
                {...props}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
            />
        </label>
    );
}

function MetricCard({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="text-lg font-semibold text-[#001a4a] mt-1">{value}</p>
        </div>
    );
}
