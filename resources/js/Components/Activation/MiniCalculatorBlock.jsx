import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const clampNumber = (value, min = 1) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return min;
    return Math.max(min, parsed);
};

export default function MiniCalculatorBlock({ postSlug = 'blog-post' }) {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);

    // ROZNAMCHA-ACTIVATION: tiny blog-side estimator to build save/compare habit before full tool visit.
    const [familySize, setFamilySize] = React.useState(6);
    const [city, setCity] = React.useState('');
    const [previewText, setPreviewText] = React.useState('');
    const [saved, setSaved] = React.useState(false);

    const deepLink = route('public.tools.ration-cost-estimator', {
        family_size: familySize,
        city,
        source: 'blog_mini_calc',
        post_slug: postSlug,
    });

    const handlePreview = () => {
        const pressure = familySize >= 6 ? 'High' : familySize >= 4 ? 'Medium' : 'Controlled';
        setPreviewText(`Your ration pressure looks ${pressure} for a family of ${familySize}. Save this to compare next month.`);
    };

    const handleSaveSnapshot = () => {
        router.post(
            route('tools.snapshots.store'),
            {
                tool_key: 'ration_cost_estimator',
                source: 'blog_mini_calc',
                return_url: window.location.pathname,
                inputs: { familySize, city, source: 'blog_mini_calc', postSlug },
                results: { previewText: previewText || `Ration pressure preview for family size ${familySize}` },
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setSaved(true),
            }
        );
    };

    return (
        <section className="rounded-2xl border border-yellow-300/50 bg-[#001a4a] p-5 text-white shadow-lg sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-200">Mini Check</p>
            <h3 className="mt-2 text-xl font-semibold">Quick ration impact for your home</h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm">
                    <span className="text-yellow-100">Family size</span>
                    <input
                        type="number"
                        min="1"
                        value={familySize}
                        onChange={(event) => setFamilySize(clampNumber(event.target.value, 1))}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-yellow-300 focus:outline-none"
                    />
                </label>

                <label className="space-y-1.5 text-sm">
                    <span className="text-yellow-100">City (optional)</span>
                    <input
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="Karachi"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 focus:border-yellow-300 focus:outline-none"
                    />
                </label>
            </div>

            <button
                type="button"
                onClick={handlePreview}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-white"
            >
                Check my Ration Impact
            </button>

            {previewText ? (
                <div className="mt-4 space-y-3 rounded-xl border border-white/15 bg-white/10 p-4">
                    <p className="text-sm text-white/95">{previewText}</p>

                    <Link
                        href={deepLink}
                        className="inline-flex items-center text-sm font-semibold text-yellow-200 hover:text-white"
                    >
                        Open full Ration Cost Estimator →
                    </Link>

                    {isAuthenticated ? (
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={handleSaveSnapshot}
                                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-yellow-100"
                            >
                                Save this snapshot
                            </button>
                            {saved ? <p className="text-xs text-emerald-200">Saved. Come back next month to compare.</p> : null}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                href={route('register', { return_to: deepLink })}
                                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-yellow-100"
                            >
                                Sign up to save and compare next month
                            </Link>
                        </div>
                    )}
                </div>
            ) : null}
        </section>
    );
}
