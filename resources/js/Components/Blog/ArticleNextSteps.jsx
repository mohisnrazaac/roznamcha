import React from 'react';
import { Link } from '@inertiajs/react';

function LinkCard({ item, label }) {
    return (
        <article className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]">{label}</p>
            <h3 className="mt-3 text-xl font-semibold text-[#001a4a]">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description ?? 'Open the next practical page in the same household planning flow.'}
            </p>
            <Link href={item.href} className="mt-5 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline">
                Open page →
            </Link>
        </article>
    );
}

export default function ArticleNextSteps({ relatedTools = [], relatedBlogs = [] }) {
    // Keep max 1 relevant tool and 3-4 contextual blog links
    const tools = relatedTools.slice(0, 1);
    const blogs = relatedBlogs.slice(0, 4);

    const hasTools = tools.length > 0;
    const hasBlogs = blogs.length > 0;

    if (!hasTools && !hasBlogs) {
        return null;
    }

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8" aria-labelledby="article-next-steps-heading">
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">What To Do Next</p>
                <h2 id="article-next-steps-heading" className="text-2xl font-semibold text-[#001a4a]">
                    Related Planning Tools & Contextual Guides
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    Apply the numbers from this guide directly into our free calculators or continue reading practical household finance benchmarks.
                </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {tools.map((item) => (
                    <LinkCard key={`tool-${item.href}`} item={item} label="Free Calculator" />
                ))}
                {blogs.map((item) => (
                    <LinkCard key={`blog-${item.href}`} item={item} label="Related Guide" />
                ))}
            </div>
        </section>
    );
}
