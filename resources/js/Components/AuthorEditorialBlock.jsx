import React from 'react';
import { Link } from '@inertiajs/react';

export default function AuthorEditorialBlock({
    authorName = 'Mohsin Raza',
    authorRole = 'Founder & Software Architect, Roznamcha.pk',
    publishedDate = null,
    reviewedDate = null,
    showGovernanceLinks = true,
    className = '',
}) {
    return (
        <section
            className={`rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm lg:p-8 ${className}`}
            aria-labelledby="author-editorial-heading"
        >
            <div className="grid gap-6 md:grid-cols-[minmax(0,0.85fr),minmax(0,1.15fr)] md:items-start">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#001a4a] text-base font-bold text-yellow-300 shadow-sm">
                            MR
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">
                                Author
                            </p>
                            <h3 id="author-editorial-heading" className="text-xl font-bold text-[#001a4a]">
                                <Link href="/about" className="hover:underline">
                                    {authorName}
                                </Link>
                            </h3>
                            <p className="text-xs font-medium text-slate-500">{authorRole}</p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                        Mohsin Raza is the Founder &amp; Software Architect of Roznamcha.pk. With over 16 years of software architecture experience, he builds practical budgeting tools and guides tailored to Pakistani household realities and localized utility tariffs.
                    </p>
                    {publishedDate && (
                        <p className="text-xs text-slate-500">Published: {publishedDate}</p>
                    )}
                    {reviewedDate && (
                        <p className="text-xs text-slate-500">Content reviewed: {reviewedDate}</p>
                    )}
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#001a4a]">
                                Editorial Standards
                            </p>
                        </div>
                        <p className="text-xs text-slate-500">Written by the founder, with sources listed at the end of each guide.</p>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
                        Sources are listed at the end of each guide. This is general information, not financial, tax or legal advice.
                    </p>

                    {showGovernanceLinks ? (
                        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-[#001a4a]">
                            <Link href="/editorial-policy" className="hover:underline">
                                Editorial Policy →
                            </Link>
                            <Link href="/methodology" className="hover:underline">
                                Methodology &amp; Sources →
                            </Link>
                            <Link href={route('public.about')} className="hover:underline">
                                About Roznamcha →
                            </Link>
                            <Link href={route('public.contact')} className="hover:underline">
                                Report Calculation Error →
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
