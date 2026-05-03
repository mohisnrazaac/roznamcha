import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import SeoHead from '../../../Components/SeoHead';
import AskRozaGuestWidget from '../../../Components/Activation/AskRozaGuestWidget';

export default function BlogIndex({ posts, categories, seo }) {
    const items = posts?.data ?? [];

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} />

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                <header className="space-y-4 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#001a4a]/70">Roznamcha Blog</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">Daily survival notes for Pakistani households</h1>
                    <p className="text-base text-slate-700">
                        Practical guides on household budgeting, ration planning, and month-end pressure for Pakistani families.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/tools/ration-cost-estimator"
                            className="inline-flex items-center rounded-full border border-[#001a4a]/20 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5"
                        >
                            Try Ration Cost Estimator
                        </Link>
                    </div>
                </header>

                {/* ROZNAMCHA-ACTIVATION: Ask Roza guest prompt near first fold on blog index. */}
                <AskRozaGuestWidget sourceUrl={typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/blog'} />

                <div className="grid gap-10 lg:grid-cols-[2fr,1fr]">
                    <div className="space-y-6">
                        {items.length === 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
                                No published posts yet. Check back soon.
                            </div>
                        )}

                        {items.map((post) => (
                            <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">{post.published_label}</p>
                                <h2 className="text-2xl font-semibold text-[#001a4a]">
                                    <Link href={post.url} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-base text-slate-700">{post.excerpt}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-[#001a4a]">
                                    {post.categories?.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={route('public.blog.category', { slug: category.slug })}
                                            className="rounded-full border border-[#001a4a]/30 px-3 py-1 font-semibold hover:bg-[#001a4a]/5"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    href={post.url}
                                    className="inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline"
                                >
                                    Read article →
                                </Link>
                            </article>
                        ))}

                        <Pagination links={posts?.links ?? []} />
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-[#001a4a] p-6 text-white space-y-3">
                            <p className="text-xs uppercase tracking-[0.3em] text-yellow-200">Public Tool</p>
                            <h2 className="text-lg font-semibold">Ration Cost Estimator</h2>
                            <p className="text-sm text-white/80">
                                Estimate your monthly ration spend in Pakistan. No login required.
                            </p>
                            <Link
                                href="/tools/ration-cost-estimator"
                                className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a]"
                            >
                                Open the tool
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
                            <h2 className="text-lg font-semibold text-[#001a4a]">Categories</h2>
                            <ul className="space-y-2 text-sm">
                                {categories?.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={route('public.blog.category', { slug: category.slug })}
                                            className="text-slate-700 hover:text-[#001a4a]"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 text-sm text-slate-600">
                            <p>Subscribe for automatic updates:</p>
                            <a
                                href={route('public.blog.rss')}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#001a4a] px-3 py-2 text-[#001a4a] font-semibold"
                            >
                                RSS Feed
                            </a>
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
}

function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
                if (!link.url) {
                    return (
                        <span
                            key={link.label}
                            className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={link.label}
                        href={link.url}
                        className={`rounded-full px-4 py-2 text-sm ${
                            link.active
                                ? 'bg-[#001a4a] text-white'
                                : 'border border-slate-200 text-[#001a4a] hover:bg-[#001a4a]/5'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
