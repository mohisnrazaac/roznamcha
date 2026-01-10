import React from 'react';
import PropTypes from 'prop-types';
import { usePage } from '@inertiajs/react';
import { triggerBlogCta } from '../../lib/blogCta';

export default function UseInRoznamchaWidget({ post, featureHooks = {}, returnPath }) {
    const { props } = usePage();
    const isAuthenticated = Boolean(props?.auth?.user);
    const prefill = featureHooks?.prefill ?? {};
    const categoryLabel = prefill?.category;

    const goToOnboarding = (amount = null) => {
        const params = new URLSearchParams();
        if (categoryLabel) {
            params.set('prefillCategory', categoryLabel);
        }
        if (amount) {
            params.set('prefillAmount', amount);
        }
        if (prefill?.note) {
            params.set('prefillNote', prefill.note);
        }

        window.location.href = `${route('onboarding.first-expense')}?${params.toString()}`;
    };

    const handleClick = async () => {
        if (isAuthenticated) {
            goToOnboarding(prefill?.amount);
            return;
        }

        await triggerBlogCta({
            postId: post?.id,
            slug: post?.slug,
            returnTo: returnPath,
            prefill: {
                category: categoryLabel,
                amount: prefill?.amount ?? null,
                note: prefill?.note ?? 'Blog expense idea',
                tags: prefill?.tags ?? [],
            },
        });
    };

    if (!categoryLabel) {
        return null;
    }

    return (
        <div className="rounded-2xl border border-[#001a4a]/10 bg-white/80 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#001a4a]">Use this insight inside Roznamcha</p>
            <p className="mt-1 text-sm text-slate-600">
                We will pre-select the <strong className="text-[#001a4a]">{categoryLabel}</strong> category for your next
                tracked expense.
            </p>
            {prefill?.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {prefill.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
            <button
                type="button"
                onClick={handleClick}
                className="mt-4 inline-flex items-center rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
                {isAuthenticated ? 'Add expense now' : 'Save in Roznamcha'}
            </button>
        </div>
    );
}

UseInRoznamchaWidget.propTypes = {
    post: PropTypes.object.isRequired,
    featureHooks: PropTypes.object,
    returnPath: PropTypes.string.isRequired,
};
