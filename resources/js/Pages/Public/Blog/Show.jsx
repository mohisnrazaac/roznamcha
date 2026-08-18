import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '../../../Layouts/PublicLayout';
import SeoHead from '../../../Components/SeoHead';
import BlogCTA from '../../../Components/Blog/BlogCTA';
import UseInRoznamchaWidget from '../../../Components/Blog/UseInRoznamchaWidget';
import SchoolFeeIncreaseCalculator from '../../../Components/Calculators/SchoolFeeIncreaseCalculator';
import ArticleNextSteps from '../../../Components/Blog/ArticleNextSteps';

const getReturnPath = (url, slug) => {
    if (!url && slug) {
        return `/blog/${slug}`;
    }

    try {
        const parsed = new URL(url);
        return parsed.pathname || `/blog/${slug}`;
    } catch {
        if (typeof url === 'string' && url.startsWith('/')) {
            return url;
        }

        return `/blog/${slug}`;
    }
};

const articleUseCards = [
    {
        title: 'Planning aid, not a fixed rule',
        body: 'Use the article to clarify tradeoffs and next steps. Do not treat one guide as a universal price list or a one-size-fits-all answer.',
    },
    {
        title: 'Adjust for your own household',
        body: 'City, rent, school timing, transport needs, and family size can change the real monthly picture quickly.',
    },
    {
        title: 'Turn it into a real action',
        body: 'The best next move is usually to track the cost, pressure-test the category, or compare it against a stronger Roznamcha tool.',
    },
];

export default function BlogShow({ post, seo, jsonLd, relatedLinks = {} }) {
    const featureHooks = post?.feature_hooks ?? {};
    const returnPath = getReturnPath(post?.url, post?.slug);
    const showCalculator = featureHooks?.calculator === 'school_fee_increase';
    const hasActivationWidget = showCalculator || Boolean(featureHooks?.prefill?.category);
    const metaItems = [
        { label: 'Published', value: post?.published_label },
        post?.updated_label ? { label: 'Updated', value: post.updated_label } : null,
        post?.reading_time_label ? { label: 'Reading time', value: post.reading_time_label } : null,
    ].filter(Boolean);

    return (
        <PublicLayout variant="inner">
            <SeoHead {...seo} jsonLd={jsonLd} />

            <article className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                <header className="overflow-hidden rounded-[2rem] border border-[#001a4a]/10 bg-[linear-gradient(135deg,_#f6fbff_0%,_#ffffff_58%,_#fff6df_100%)] p-6 shadow-sm lg:p-8">
                    <div className="space-y-5">
                        <p className="text-xs uppercase tracking-[0.4em] text-[#001a4a]/70">Roznamcha Blog</p>
                        <div className="flex flex-wrap gap-2 text-xs text-[#001a4a]">
                            {post?.categories?.map((category) => (
                                <Link
                                    key={category.id}
                                    href={route('public.blog.category', { slug: category.slug })}
                                    className="rounded-full border border-[#001a4a]/20 bg-white/80 px-3 py-1 font-semibold hover:bg-[#001a4a]/5"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[#001a4a] sm:text-4xl">{post?.title}</h1>
                        {post?.excerpt ? (
                            <p className="max-w-3xl text-base leading-7 text-slate-700">{post.excerpt}</p>
                        ) : null}

                        <div className="flex flex-wrap gap-3">
                            {metaItems.map((item) => (
                                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                                    <p className="mt-1 text-sm font-semibold text-[#001a4a]">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                {post?.og_image_url ? (
                    <img
                        src={post.og_image_url}
                        alt={post.title || "Blog post cover image"}
                        className="w-full rounded-[2rem] border border-slate-200 object-cover shadow-sm"
                        loading="lazy"
                    />
                ) : null}

                <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">How To Use This Guide</p>
                        <h2 className="text-3xl font-semibold text-[#001a4a]">A stronger shared baseline for every article</h2>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {articleUseCards.map((item) => (
                            <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <h3 className="text-lg font-semibold text-[#001a4a]">{item.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {hasActivationWidget ? (
                    <section className="space-y-4 rounded-[2rem] border border-[#001a4a]/12 bg-white p-6 shadow-sm lg:p-8">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Use This Inside Roznamcha</p>
                            <h2 className="text-2xl font-semibold text-[#001a4a]">Turn this article into a tracked household action</h2>
                        </div>
                        {showCalculator ? <SchoolFeeIncreaseCalculator post={post} returnPath={returnPath} /> : null}
                        <UseInRoznamchaWidget post={post} featureHooks={featureHooks} returnPath={returnPath} />
                        <BlogCTA post={post} featureHooks={featureHooks} returnPath={returnPath} />
                    </section>
                ) : null}

                <section
                    className="post-content rounded-[2rem] border border-slate-200 bg-white p-6 text-[1.05rem] leading-8 text-slate-800 shadow-sm lg:p-8 [&_a]:font-medium [&_a]:text-[#001a4a] [&_a]:underline-offset-2 [&_a:hover]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#8c5a00]/35 [&_blockquote]:bg-amber-50/70 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:hidden [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-[#001a4a] [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-[#001a4a] [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-[#001a4a] [&_hr]:my-8 [&_hr]:border-slate-200 [&_img]:my-8 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-slate-200 [&_li]:marker:text-[#001a4a] [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-5 [&_strong]:font-semibold [&_strong]:text-[#001a4a] [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-[#001a4a] [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
                    dangerouslySetInnerHTML={{ __html: post?.content ?? '' }}
                />

                <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm lg:p-8">
                    <div className="grid gap-5 md:grid-cols-[minmax(0,0.8fr),minmax(0,1.2fr)] md:items-start">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">Author And Editorial Note</p>
                            <h2 className="mt-2 text-2xl font-semibold text-[#001a4a]">{post?.author?.name}</h2>
                            <p className="mt-2 text-sm font-semibold text-slate-600">{post?.author?.role}</p>
                        </div>
                        <div className="space-y-4 text-sm leading-7 text-slate-700">
                            <p>
                                <Link href={post?.author?.url ?? route('public.about')} className="font-semibold text-[#001a4a] hover:underline">
                                    {post?.author?.name ?? 'Mohsin'}
                                </Link>{' '}
                                writes practical guides to help Pakistani households think more clearly about monthly spending, ration pressure, and everyday financial tradeoffs.
                            </p>
                            <p>
                                These articles are planning aids. They are meant to help readers compare, question, and act on costs more carefully, not replace their own local prices or family circumstances.
                            </p>
                        </div>
                    </div>
                </section>

                <ArticleNextSteps relatedTools={relatedLinks?.tools ?? []} relatedBlogs={relatedLinks?.blogs ?? []} />

                <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-2 text-sm text-slate-500">
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
