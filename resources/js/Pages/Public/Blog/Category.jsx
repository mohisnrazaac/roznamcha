import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import SeoHead from '../../../Components/SeoHead';

export default function BlogCategoryPage({ category, posts, seo }) {
    const items = posts?.data ?? [];

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} />

            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
                <header className="space-y-1 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#001a4a]/70">Blog Category</p>
                    <h1 className="text-3xl font-bold text-[#001a4a]">{category?.name}</h1>
                    <p className="text-base text-slate-600">Articles tagged under {category?.name}.</p>
                </header>

                <div className="space-y-6">
                    {items.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
                            Nothing published in this category yet.
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

                <div className="text-center">
                    <Link href={route('public.blog.index')} className="text-sm font-semibold text-[#001a4a] hover:underline">
                        ← Back to all posts
                    </Link>
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
                const isDisabled = !link.url;

                const className = [
                    'rounded-full px-4 py-2 text-sm',
                    link.active ? 'bg-[#001a4a] text-white' : 'border border-slate-200 text-[#001a4a]',
                    isDisabled && 'text-slate-400',
                ]
                    .filter(Boolean)
                    .join(' ');

                if (isDisabled) {
                    return (
                        <span
                            key={link.label}
                            className={className}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={link.label}
                        href={link.url}
                        className={className}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
