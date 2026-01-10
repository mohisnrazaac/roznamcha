import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { triggerBlogCta } from '../../lib/blogCta';

export default function BlogCTA({ post, featureHooks = {}, returnPath }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);

        const prefill = featureHooks?.prefill ?? null;
        const ctaRoute = featureHooks?.ctaRoute ?? 'register';

        await triggerBlogCta({
            postId: post?.id,
            slug: post?.slug,
            returnTo: returnPath,
            ctaRoute,
            prefill,
        });

        setLoading(false);
    };

    return (
        <div className="rounded-2xl border border-[#001a4a]/10 bg-[#f6f4ff] p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm font-semibold text-[#001a4a]">Start your Roznamcha</p>
                    <p className="text-sm text-slate-600">
                        We will guide you through household setup, monthly budget, and your first expense.
                    </p>
                </div>
                <button
                    onClick={handleClick}
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-[#001a4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#001a4a]/90 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? 'Sending you to signup…' : 'Start tracking my expenses'}
                </button>
            </div>
        </div>
    );
}

BlogCTA.propTypes = {
    post: PropTypes.object.isRequired,
    featureHooks: PropTypes.object,
    returnPath: PropTypes.string.isRequired,
};
