// Purpose: List smart budget templates with saved-state hooks for returning households. Date: 2026-03-27. Author: Codex.

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../../Components/SeoHead';
import { buildWebPageSchema, seoContent } from '../../lib/seo';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0));

const formatDate = (value) => {
    if (!value) return 'Not viewed yet';

    return new Intl.DateTimeFormat('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

export default function Index({ categories = [], templates = [], savedTemplates = [], seo: seoProp, jsonLd: jsonLdProp }) {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const [activeCategory, setActiveCategory] = React.useState('all');

    const seo = seoProp ?? seoContent.smartBudgetTemplates;

    const visibleTemplates = activeCategory === 'all'
        ? templates
        : templates.filter((template) => template.category === activeCategory);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLdProp ?? buildWebPageSchema(seo)} />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[2rem] border border-[#001a4a]/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,224,102,0.45),_transparent_30%),linear-gradient(135deg,_#fff8ea_0%,_#ffffff_55%,_#eef4ff_100%)] p-8 shadow-sm">
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Survival-first templates</p>
                            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[#001a4a]">
                                Smart Budget Templates built for Pakistani household reality
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-slate-600">
                                Guests can preview. Logged-in households can save, download the free PDF, and come back next month to compare what was planned against what actually happened.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261]"
                                >
                                    Save for my household
                                </Link>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-white"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                            <StatCard label="Templates live" value={templates.length} />
                            <StatCard label="Saved by you" value={savedTemplates.length} />
                            <StatCard label="Guest preview" value="On" />
                        </div>
                    </div>
                </div>

                {isAuthenticated && savedTemplates.length > 0 ? (
                    <section className="mt-10 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Return loop</p>
                                <h2 className="mt-1 text-2xl font-semibold text-[#001a4a]">Saved for your household</h2>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Returning users start here
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {savedTemplates.map((template) => (
                                <article
                                    key={template.slug}
                                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <p className="text-sm font-semibold text-[#001a4a]">{template.title}</p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Saved on {formatDate(template.saved_at)}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Last viewed: {formatDate(template.last_viewed_at)}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Household: {template.household_label ?? 'Default household'}
                                    </p>
                                    <Link
                                        href={template.show_url}
                                        className="mt-4 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline"
                                    >
                                        Open saved template
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>
                ) : null}

                <section className="mt-10">
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setActiveCategory('all')}
                            className={[
                                'rounded-full px-4 py-2 text-sm font-semibold transition',
                                activeCategory === 'all'
                                    ? 'bg-[#001a4a] text-white'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[#001a4a]/30',
                            ].join(' ')}
                        >
                            All Templates
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                type="button"
                                onClick={() => setActiveCategory(category.key)}
                                className={[
                                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                                    activeCategory === category.key
                                        ? 'bg-[#001a4a] text-white'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-[#001a4a]/30',
                                ].join(' ')}
                            >
                                {category.label} · {category.count}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {visibleTemplates.map((template) => (
                            <article
                                key={template.slug}
                                className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">
                                            {template.category_label}
                                        </p>
                                        <h3 className="mt-3 text-2xl font-semibold text-[#001a4a]">
                                            {template.title}
                                        </h3>
                                    </div>
                                    {template.is_premium ? (
                                        <span className="rounded-full bg-[#001a4a] px-3 py-1 text-xs font-semibold text-yellow-200">
                                            PRO
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            FREE
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 rounded-3xl bg-[#fff4cf] p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">Monthly target</p>
                                    <p className="mt-2 text-3xl font-semibold text-[#001a4a]">
                                        PKR {formatCurrency(template.base_salary_target)}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {template.is_premium && template.price
                                            ? `PRO plan price: PKR ${formatCurrency(template.price)}`
                                            : 'Free PDF becomes available after login.'}
                                    </p>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium">
                                    {template.saved_at ? (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                                            Saved to household
                                        </span>
                                    ) : null}
                                    {template.has_pro_access ? (
                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-[#8c5a00]">
                                            PRO unlocked
                                        </span>
                                    ) : null}
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                                        Preview first, save later
                                    </span>
                                </div>

                                <Link
                                    href={template.show_url}
                                    className="mt-6 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline"
                                >
                                    Preview template
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </PublicLayout>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#001a4a]">{value}</p>
        </div>
    );
}
