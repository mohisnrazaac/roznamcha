// Purpose: Show a single smart budget template with guest friction, saves, and downloads. Date: 2026-03-27. Author: Codex.

import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { buildWebPageSchema } from '../../lib/seo';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

const formatDate = (value) => {
    if (!value) return null;

    return new Intl.DateTimeFormat('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

export default function Show({ template, budget, proPreview, isGuest = false, guestReturnTo, seo: seoProp, jsonLd: jsonLdProp }) {
    const { auth, flash } = usePage().props;
    const isAuthenticated = Boolean(auth?.user) && !isGuest;
    const { post, processing } = useForm({
        slug: template.slug,
        source: 'template_show',
    });

    const returnUrl = guestReturnTo || template.show_url || `/templates/${template.slug}`;
    const loginHref = `/login?return_to=${encodeURIComponent(returnUrl)}`;
    const excelDownloadHref = isAuthenticated
        ? (template.excel_download_url || `${template.download_url}?format=excel`)
        : `/login?return_to=${encodeURIComponent(template.excel_download_url || `${template.download_url}?format=excel`)}`;
    const pdfDownloadHref = isAuthenticated
        ? `${template.download_url}?mode=free`
        : `/login?return_to=${encodeURIComponent(`${template.download_url}?mode=free`)}`;

    const showPremiumLock = template.is_premium && !template.has_pro_access;

    const handleSave = () => {
        post('/templates/save', {
            preserveScroll: true,
        });
    };

    const seo = seoProp ?? {
        title: `${template.title} | Smart Budget Templates | Roznamcha`,
        description:
            'Preview a Pakistan-specific survival budget template, save it to your household, and download the free PDF after login.',
        canonical: `https://roznamcha.pk${template.show_url}`,
        url: `https://roznamcha.pk${template.show_url}`,
        image: 'https://roznamcha.pk/icons/appicon.png',
        type: 'article',
        schemaName: template.title,
    };

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLdProp ?? buildWebPageSchema(seo)} />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]">
                                <span className="text-[#8c5a00]">{template.category_label}</span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                                    Family size {template.family_size}
                                </span>
                                {template.is_premium ? (
                                    <span className="rounded-full bg-[#001a4a] px-3 py-1 text-yellow-200">
                                        PRO layer available
                                    </span>
                                ) : (
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                                        Free template
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#001a4a]">
                                {template.title}
                            </h1>
                            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                                This template is structured for household survival first: core groceries, controlled utilities, school fees when needed, and enough discipline to keep at least one buffer alive.
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <HighlightCard label="Salary Target" value={`PKR ${formatCurrency(template.base_salary_target)}`} />
                                <HighlightCard label="Allocated" value={`PKR ${formatCurrency(budget.total_allocated)}`} />
                                <HighlightCard label="Status" value={isAuthenticated ? 'Dashboard Active' : 'Read-Only Preview'} />
                            </div>

                            {flash?.status ? (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {flash.status}
                                </div>
                            ) : null}

                            {template.saved_at ? (
                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    Saved on {formatDate(template.saved_at)}{template.household_label ? ` for ${template.household_label}` : ''}.
                                </div>
                            ) : null}

                            <div className="mt-6 flex flex-wrap gap-3">
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={processing}
                                            className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261] disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {processing ? 'Saving...' : 'Save to My Dashboard'}
                                        </button>
                                        <a
                                            href={excelDownloadHref}
                                            className="inline-flex items-center justify-center rounded-full border border-emerald-600/30 bg-emerald-50/60 px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                                        >
                                            Export as Excel
                                        </a>
                                        <a
                                            href={pdfDownloadHref}
                                            className="inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-[#001a4a]/5"
                                        >
                                            Download PDF
                                        </a>
                                        {template.is_premium ? (
                                            template.has_pro_access ? (
                                                <a
                                                    href={`${template.download_url}?mode=pro`}
                                                    className="inline-flex items-center justify-center rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-[#8c5a00] transition hover:bg-yellow-100"
                                                >
                                                    Download PRO PDF
                                                </a>
                                            ) : (
                                                <Link
                                                    href={route('public.contact')}
                                                    className="inline-flex items-center justify-center rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-[#8c5a00] transition hover:bg-yellow-100"
                                                >
                                                    Contact us for PRO access
                                                </Link>
                                            )
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={loginHref}
                                            className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261]"
                                        >
                                            Save to My Dashboard
                                        </Link>
                                        <a
                                            href={excelDownloadHref}
                                            className="inline-flex items-center justify-center rounded-full border border-emerald-600/30 bg-emerald-50/60 px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                                        >
                                            Export as Excel
                                        </a>
                                        <a
                                            href={pdfDownloadHref}
                                            className="inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-[#001a4a]/5"
                                        >
                                            Download PDF
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            {!isAuthenticated ? (
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none select-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
                                >
                                    <div className="rotate-[-22deg] text-center font-black tracking-[0.25em] uppercase text-slate-900/[0.04] text-4xl sm:text-6xl select-none leading-relaxed">
                                        ROZNAMCHA.PK<br />
                                        <span className="text-xl sm:text-2xl text-slate-900/[0.05]">SAMPLE PREVIEW • READ-ONLY</span>
                                    </div>
                                </div>
                            ) : null}

                            <div className="relative z-10">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">
                                            {!isAuthenticated ? 'Sample Breakdown' : 'Free breakdown'}
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-[#001a4a]">Category allocation</h2>
                                    </div>
                                    {!isAuthenticated ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                            Read-Only Preview
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                            Full Household Access
                                        </span>
                                    )}
                                </div>

                                {!isAuthenticated ? (
                                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900">
                                        <svg className="h-4 w-4 shrink-0 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>
                                            <strong>Guest Preview:</strong> You are viewing a watermarked, read-only preview of the template structure and category breakdown. Authenticate to save this structure to your personal dashboard or export to Excel/PDF.
                                        </span>
                                    </div>
                                ) : null}

                                <div className="mt-6 space-y-3">
                                    {budget.categories.map((item) => (
                                        <CategoryRow key={item.category} item={item} />
                                    ))}
                                </div>

                                {!isAuthenticated ? (
                                    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center">
                                        <p className="text-base font-semibold text-[#001a4a]">
                                            Save to My Dashboard or Export this Budget
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            Sign in to track your monthly spending against this template or download as an Excel spreadsheet.
                                        </p>
                                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                                            <Link
                                                href={loginHref}
                                                className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261]"
                                            >
                                                Save to My Dashboard
                                            </Link>
                                            <a
                                                href={excelDownloadHref}
                                                className="inline-flex items-center justify-center rounded-full border border-emerald-600/30 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-slate-100"
                                            >
                                                Export as Excel
                                            </a>
                                            <a
                                                href={pdfDownloadHref}
                                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                                            >
                                                Download PDF
                                            </a>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="mt-8">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">Saving tips</p>
                                    <div className="mt-4 grid gap-3">
                                        {budget.saving_tips.map((tip, index) => (
                                            <div
                                                key={`${template.slug}-tip-${index + 1}`}
                                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
                                            >
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">PRO projection</p>
                            <h2 className="mt-2 text-2xl font-semibold text-[#001a4a]">Inflation-aware next month view</h2>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                PRO mode adds a 10-15% inflation shock layer, next-month projection, and Ask Roza tips for households that need a deeper monthly planning view.
                            </p>

                            <div className="mt-5 rounded-3xl bg-[#fff4cf] p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">Projected next month</p>
                                <p className="mt-2 text-3xl font-semibold text-[#001a4a]">
                                    PKR {formatCurrency(proPreview.next_month_projection)}
                                </p>
                                <p className="mt-2 text-sm text-slate-600">
                                    Assumes a {proPreview.inflation_rate_percent}% survival buffer on the current structure.
                                </p>
                            </div>

                            <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                                <div className={showPremiumLock ? 'blur-sm' : ''}>
                                    <div className="space-y-3">
                                        {proPreview.inflation_categories.map((item) => (
                                            <div
                                                key={`${template.slug}-${item.category}`}
                                                className="rounded-2xl border border-white bg-white px-4 py-3"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#001a4a]">{item.category}</p>
                                                        <p className="text-xs text-slate-500">
                                                            PKR {formatCurrency(item.current_amount)} now
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-[#8c5a00]">
                                                        PKR {formatCurrency(item.inflated_amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">Ask Roza Tips</p>
                                        <div className="mt-4 space-y-3">
                                            {proPreview.ask_roza_tips.map((tip, index) => (
                                                <div
                                                    key={`${template.slug}-roza-${index + 1}`}
                                                    className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-600"
                                                >
                                                    {tip}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {showPremiumLock ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                                        <div className="max-w-sm rounded-3xl border border-yellow-200 bg-white p-6 text-center shadow-xl">
                                            <p className="text-lg font-semibold text-[#001a4a]">PRO access is available on request</p>
                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                Save the template first, then contact Roznamcha if you need the upgraded planning view and PDF for your household.
                                            </p>
                                            {isAuthenticated ? (
                                                <Link
                                                    href={route('public.contact')}
                                                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white"
                                                >
                                                    Contact us for PRO access
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={loginHref}
                                                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white"
                                                >
                                                    Save to My Dashboard
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </section>

                        <section className="rounded-[2rem] border border-slate-200 bg-[#001a4a] p-8 text-white shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-200">Habit formation</p>
                            <h2 className="mt-2 text-2xl font-semibold">This module is built for return visits, not one-time downloads</h2>
                            <p className="mt-3 text-sm leading-6 text-white/80">
                                Save the template now. Next month, open the same template and compare the planned survival split against your real kharcha, ration pressure, and school-fee shocks.
                            </p>
                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={processing}
                                    className="mt-5 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? 'Saving...' : 'Save to My Dashboard'}
                                </button>
                            ) : (
                                <Link
                                    href={loginHref}
                                    className="mt-5 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a]"
                                >
                                    Save to My Dashboard
                                </Link>
                            )}
                        </section>

                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function HighlightCard({ label, value }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
            <p className="mt-2 text-xl font-semibold text-[#001a4a]">{value}</p>
        </div>
    );
}

function CategoryRow({ item }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-[#001a4a]">{item.category}</p>
                    <p className="text-xs text-slate-500">{item.percentage}% of the monthly plan</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">PKR {formatCurrency(item.amount)}</p>
            </div>
        </div>
    );
}
