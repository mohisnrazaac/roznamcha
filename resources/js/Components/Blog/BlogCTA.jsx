import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { triggerBlogCta } from '../../lib/blogCta';
import { useDailyReturnContent } from '../../hooks/useDailyReturnContent';

// CTA widget now supports two variants: signup flow + end-of-blog tool links that stay CMS-driven.
export default function BlogCTA({
    post = null,
    featureHooks = {},
    returnPath = '/blog',
    variant = 'signup',
    ctaLinks = null,
}) {
    const [loading, setLoading] = useState(false);
    const { data } = useDailyReturnContent();
    const resolvedCtas = ctaLinks ?? data?.cta_links ?? defaultCtaLinks();

    if (variant === 'tool-links') {
        return (
            <div className="rounded-3xl border border-[#001a4a]/15 bg-[#f4f7ff] p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-[#001a4a]/70">Roznamcha Tools</p>
                <h3 className="mt-1 text-2xl font-semibold text-[#001a4a]">اپنا خرچ اب کنٹرول کریں</h3>
                <p className="mt-2 text-sm text-slate-600">
                    ہر بلاگ کے آخر میں یہ دو راستے یاد دلاتے ہیں کہ بات ختم نہیں ہوتی—ابھی Kharcha Map یا Ration Brain کھولیں۔
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {resolvedCtas.map((cta) => (
                        <a
                            key={cta.href}
                            href={cta.href}
                            className="rounded-2xl border border-[#001a4a]/15 bg-white px-4 py-3 text-right text-[#001a4a] transition hover:border-[#001a4a]/40"
                        >
                            <p className="text-sm font-semibold">{cta.label}</p>
                            <p className="text-xs text-slate-500">Roznamcha tools سے فائدہ اٹھائیں</p>
                        </a>
                    ))}
                </div>
            </div>
        );
    }

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
    post: PropTypes.object,
    featureHooks: PropTypes.object,
    returnPath: PropTypes.string,
    variant: PropTypes.oneOf(['signup', 'tool-links']),
    ctaLinks: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired,
        })
    ),
};

function defaultCtaLinks() {
    const kharchaUrl = safeRoute('public.kharcha-map');
    const rationUrl = safeRoute('public.ration-brain');
    const rationEstimatorUrl = safeRoute('public.tools.ration-cost-estimator');

    return [
        { label: 'اپنا خرچ یہاں دیکھیں', href: kharchaUrl ?? '/kharcha-map' },
        { label: 'اپنا ماہانہ بجٹ بنائیں', href: rationUrl ?? '/ration-brain' },
        { label: 'راشن لاگت کا اندازہ لگائیں', href: rationEstimatorUrl ?? '/tools/ration-cost-estimator' },
    ];
}

function safeRoute(name) {
    if (typeof route === 'function') {
        try {
            return route(name);
        } catch (error) {
            return null;
        }
    }

    return null;
}
