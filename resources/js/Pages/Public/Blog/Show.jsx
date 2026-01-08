import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import SeoHead from '../../../Components/SeoHead';

export default function BlogShow({ post, seo, jsonLd }) {
    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <header className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#001a4a]/70">Roznamcha Blog</p>
                    <h1 className="text-4xl font-bold text-[#001a4a]">{post?.title}</h1>
                    <p className="text-sm text-slate-500">{post?.published_label}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-[#001a4a]">
                        {post?.categories?.map((category) => (
                            <Link
                                key={category.id}
                                href={route('public.blog.category', { slug: category.slug })}
                                className="rounded-full border border-[#001a4a]/30 px-3 py-1 font-semibold hover:bg-[#001a4a]/5"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </header>

                {post?.og_image_url && (
                    <img
                        src={post.og_image_url}
                        alt=""
                        className="w-full rounded-2xl border border-slate-200 object-cover"
                        loading="lazy"
                    />
                )}

                <section
                    className="prose prose-lg max-w-none prose-headings:text-[#001a4a] prose-a:text-[#001a4a]"
                    dangerouslySetInnerHTML={{ __html: post?.content ?? '' }}
                />

                <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500">
                    <Link href={route('public.blog.index')} className="font-semibold text-[#001a4a] hover:underline">
                        ← Back to blog
                    </Link>
                    <a href={route('public.blog.rss')} className="inline-flex items-center gap-2 font-semibold text-[#001a4a]">
                        Subscribe via RSS →
                    </a>
                </footer>
            </article>
        </PublicLayout>
    );
}
