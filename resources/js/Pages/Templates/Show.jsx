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

export default function Show({ template, budget, proPreview, guestReturnTo, seo: seoProp, jsonLd: jsonLdProp }) {
    const { auth, flash } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const { post, processing } = useForm({
        slug: template.slug,
        source: 'template_show',
    });

    const seo = seoProp ?? {
        title: `${template.title} | Smart Budget Templates | Roznamcha`,
        description:
            'Preview a Pakistan-specific survival budget template, save it to your household, and download the free PDF after login.',
        canonical: `https://roznamcha.pk${template.show_url}`,
        url: `https://roznamcha.pk${template.show_url}`,
        image: 'https://roznamcha.pk/favicon.ico',
        type: 'article',
        schemaName: template.title,
    };

    const registerHref = `/register?return_to=${encodeURIComponent(guestReturnTo)}`;
    const loginHref = `/login?return_to=${encodeURIComponent(guestReturnTo)}`;
    const visibleGuestCategories = budget.categories.slice(0, 4);
    const lockedGuestCategories = budget.categories.slice(4);
    const showPremiumLock = template.is_premium && !template.has_pro_access;

    const handleSave = () => {
        post('/templates/save', {
            preserveScroll: true,
        });
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
                                <HighlightCard label="Download" value={isAuthenticated ? 'Free PDF ready' : 'Login required'} />
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
                                            {processing ? 'Saving...' : 'Save for my household'}
                                        </button>
                                        <a
                                            href={`${template.download_url}?mode=free`}
                                            className="inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-[#001a4a]/5"
                                        >
                                            Download free PDF
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
                                            href={registerHref}
                                            className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261]"
                                        >
                                            Save this for my household
                                        </Link>
                                        <Link
                                            href={loginHref}
                                            className="inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-[#001a4a]/5"
                                        >
                                            Login to download
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">Free breakdown</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-[#001a4a]">Category allocation</h2>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    Cached after first generation
                                </span>
                            </div>

                            <div className="mt-6 space-y-3">
                                {(isAuthenticated ? budget.categories : visibleGuestCategories).map((item) => (
                                    <CategoryRow key={item.category} item={item} />
                                ))}
                            </div>

                            {!isAuthenticated && lockedGuestCategories.length > 0 ? (
                                <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                                    <div className="space-y-3 blur-sm">
                                        {lockedGuestCategories.slice(0, 3).map((item) => (
                                            <CategoryRow key={item.category} item={item} />
                                        ))}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                                        <div className="max-w-sm rounded-3xl bg-[#001a4a] p-6 text-center text-white shadow-xl">
                                            <p className="text-lg font-semibold">Save this for my household</p>
                                            <p className="mt-2 text-sm text-white/80">
                                                Preview is open. Download and returning access start after signup.
                                            </p>
                                            <Link
                                                href={registerHref}
                                                className="mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a]"
                                            >
                                                Save to continue
                                            </Link>
                                        </div>
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
                                                    href={registerHref}
                                                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white"
                                                >
                                                    Save first
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
                                    {processing ? 'Saving...' : 'Save for my household'}
                                </button>
                            ) : (
                                <Link
                                    href={registerHref}
                                    className="mt-5 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a]"
                                >
                                    Save for my household
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
