import React from 'react';
import { Link } from '@inertiajs/react';

const sectionStyle =
    'rounded-2xl border border-[#001a4a]/15 bg-white p-5 shadow-sm space-y-3';

function LinksList({ links }) {
    return (
        <div className="flex flex-wrap gap-2">
            {links.map((item) => (
                <Link
                    key={`${item.href}-${item.title}`}
                    href={item.href}
                    className="inline-flex items-center rounded-full border border-[#001a4a]/20 px-3 py-1.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5"
                >
                    {item.title}
                </Link>
            ))}
        </div>
    );
}

export default function RelatedLinksBlock({ relatedTools = [], relatedBlogs = [] }) {
    const hasTools = relatedTools.length > 0;
    const hasBlogs = relatedBlogs.length > 0;

    if (!hasTools && !hasBlogs) {
        return null;
    }

    return (
        <section className="mt-10 space-y-4" aria-label="Related links">
            <h2 className="text-lg font-semibold text-[#001a4a]">Related links</h2>

            {hasTools && (
                <div className={sectionStyle}>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-[#001a4a]/70">Related tools</h3>
                    <LinksList links={relatedTools} />
                </div>
            )}

            {hasBlogs && (
                <div className={sectionStyle}>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-[#001a4a]/70">Related blog posts</h3>
                    <LinksList links={relatedBlogs} />
                </div>
            )}
        </section>
    );
}
