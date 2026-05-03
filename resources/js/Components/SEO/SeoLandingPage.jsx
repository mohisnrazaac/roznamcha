// Purpose: Render a reusable public-facing shell for programmatic SEO landing pages with fresh data blocks, links, and FAQ content. Date: 2026-03-29. Author: Mohsin.

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SeoHead from '../SeoHead';

const formatDate = (value) => {
    if (!value) return 'Latest available update';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Latest available update';
    }

    return new Intl.DateTimeFormat('en-PK', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Asia/Karachi',
    }).format(date);
};

const isRelativeHref = (href) => typeof href === 'string' && href.startsWith('/');

function SmartLink({ href, children, className }) {
    if (isRelativeHref(href)) {
        return (
            <Link href={href} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <a href={href} className={className}>
            {children}
        </a>
    );
}

export default function SeoLandingPage({
    title,
    h1,
    metaTitle,
    metaDescription,
    canonicalUrl,
    robots,
    lastUpdated,
    dataPoints = [],
    summaryText,
    comparisonText,
    helperContent = [],
    internalLinks = [],
    faqItems = [],
    ctaText,
    breadcrumbs = [],
    structuredData = [],
    sourceLabel,
    sourceUrl,
    sourceAssetUrl,
    noticeTitle,
    lastCheckedAt,
    theme = {},
}) {
    const { auth } = usePage().props;
    const primarySchema = structuredData[0] ?? null;
    const extraSchemas = structuredData.slice(1);
    const ctaHref = auth?.user ? route('dashboard') : '/register';
    const ctaLabel = auth?.user ? 'Open Roznamcha' : 'Create Free Account';

    const badgeClass = theme.badgeClass ?? 'bg-amber-100 text-amber-900 border-amber-200';
    const heroClass = theme.heroClass ?? 'from-white via-amber-50 to-slate-100';
    const accentClass = theme.accentClass ?? 'text-amber-700';
    const panelClass = theme.panelClass ?? 'bg-white border-slate-200';

    return (
        <PublicLayout variant="inner">
            <SeoHead
                title={metaTitle}
                description={metaDescription}
                canonical={canonicalUrl}
                url={canonicalUrl}
                robots={robots}
                jsonLd={primarySchema}
            />
            <Head>
                {extraSchemas.map((schema, index) => (
                    <script
                        key={`seo-schema-${index}`}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    />
                ))}
            </Head>

            <section className="bg-[#f7f3ea]">
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={`${crumb.label}-${index}`}>
                                <SmartLink href={crumb.href} className="hover:text-[#001a4a]">
                                    {crumb.label}
                                </SmartLink>
                                {index < breadcrumbs.length - 1 ? <span>/</span> : null}
                            </React.Fragment>
                        ))}
                    </nav>

                    <div className={`mt-6 rounded-[2rem] border border-slate-200 bg-gradient-to-br ${heroClass} p-8 shadow-sm`}>
                        <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeClass}`}>
                            Living SEO Page
                        </div>
                        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-4">
                                <h1 className="text-3xl font-semibold tracking-tight text-[#001a4a] sm:text-4xl">
                                    {h1}
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-slate-700">
                                    {summaryText}
                                </p>
                                <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
                                    <p className={`text-sm font-semibold ${accentClass}`}>Latest change</p>
                                    <p className="mt-2 text-lg font-medium text-slate-800">{comparisonText}</p>
                                </div>
                            </div>

                            <div className={`rounded-[1.75rem] border ${panelClass} p-6 shadow-sm`}>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Freshness
                                </p>
                                <div className="mt-4 space-y-3">
                                    <div>
                                        <p className="text-sm text-slate-500">Last updated</p>
                                        <p className="text-lg font-semibold text-[#001a4a]">{formatDate(lastUpdated)}</p>
                                    </div>
                                    {lastCheckedAt ? (
                                        <div>
                                            <p className="text-sm text-slate-500">Last source check</p>
                                            <p className="text-base font-medium text-slate-800">{formatDate(lastCheckedAt)}</p>
                                        </div>
                                    ) : null}
                                    <div>
                                        <p className="text-sm text-slate-500">Source label</p>
                                        <p className="text-base font-medium text-slate-800">{sourceLabel}</p>
                                    </div>
                                    {noticeTitle ? (
                                        <div>
                                            <p className="text-sm text-slate-500">Notice</p>
                                            <p className="text-base font-medium text-slate-800">{noticeTitle}</p>
                                        </div>
                                    ) : null}
                                    {sourceUrl ? (
                                        <div>
                                            <p className="text-sm text-slate-500">Source link</p>
                                            <a
                                                href={sourceUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm font-semibold text-[#001a4a] underline decoration-dotted underline-offset-2 hover:decoration-solid"
                                            >
                                                Open source notice
                                            </a>
                                            {sourceAssetUrl && sourceAssetUrl !== sourceUrl ? (
                                                <a
                                                    href={sourceAssetUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-2 block text-sm font-semibold text-[#001a4a] underline decoration-dotted underline-offset-2 hover:decoration-solid"
                                                >
                                                    Open notice image
                                                </a>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    <p className="text-sm leading-6 text-slate-600">
                                        This page is designed to refresh over time so visitors get updated context instead of a frozen long-tail template.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {dataPoints.map((item) => (
                            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                                <p className="mt-3 text-2xl font-semibold text-[#001a4a]">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-6">
                            {helperContent.map((block) => (
                                <section key={block.heading} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-semibold text-[#001a4a]">{block.heading}</h2>
                                    <p className="mt-3 text-base leading-7 text-slate-700">{block.body}</p>
                                </section>
                            ))}

                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-[#001a4a]">Frequently asked questions</h2>
                                <div className="mt-5 space-y-4">
                                    {faqItems.map((item) => (
                                        <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-semibold text-[#001a4a]">Related pages</h2>
                                <div className="mt-5 space-y-3">
                                    {internalLinks.map((item) => (
                                        <SmartLink
                                            key={`${item.title}-${item.href}`}
                                            href={item.href}
                                            className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#001a4a] transition hover:border-[#001a4a] hover:bg-[#001a4a] hover:text-white"
                                        >
                                            {item.title}
                                        </SmartLink>
                                    ))}
                                </div>
                            </section>

                            <section className="rounded-[2rem] bg-[#001a4a] p-6 text-white shadow-lg">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
                                    Next step
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold">Use the number, then track the rest</h2>
                                <p className="mt-4 text-sm leading-7 text-white/85">{ctaText}</p>
                                <SmartLink
                                    href={ctaHref}
                                    className="mt-6 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-3 text-sm font-semibold text-[#001a4a] transition hover:bg-white"
                                >
                                    {ctaLabel}
                                </SmartLink>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
