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
                    className="post-content space-y-6 text-lg leading-relaxed text-slate-800 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-slate-200 [&_a]:text-[#001a4a] [&_a]:underline-offset-2 [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:marker:text-[#001a4a] [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-2xl [&_th]:text-left [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_td]:border [&_td]:border-slate-200 [&_thead]:border-b [&_tbody_tr:nth-child(odd)]:bg-slate-50"
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
