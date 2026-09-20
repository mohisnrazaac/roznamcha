import React, { useRef, useEffect } from 'react';

const ADSENSE_CLIENT_ID = 'ca-pub-8709269992599634';

const sizePresets = {
    leaderboard: {
        maxWidth: '728px',
        width: '100%',
        minHeight: '90px',
        format: 'horizontal',
    },
    rectangle: {
        maxWidth: '300px',
        width: '300px',
        minHeight: '250px',
        format: 'rectangle',
    },
    responsive: {
        maxWidth: '100%',
        width: '100%',
        minHeight: '280px',
        format: 'auto',
    },
};

export default function AdContainer({
    slot = '',
    variant = 'responsive',
    className = '',
}) {
    const adRef = useRef(null);
    const preset = sizePresets[variant] || sizePresets.responsive;

    useEffect(() => {
        if (!slot || !adRef.current) {
            return;
        }

        // Guard against duplicate pushes on already-populated ad containers in Inertia SPAs
        if (adRef.current.dataset.initialized === 'true' || adRef.current.children.length > 0) {
            return;
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            adRef.current.dataset.initialized = 'true';
        } catch (error) {
            console.warn('AdSense slot initialization deferred or already populated.', error);
        }
    }, [slot]);

    if (!slot) {
        return null;
    }

    return (
        <aside
            aria-label="Advertisement"
            className={`ad-container-wrapper my-6 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/70 p-3 shadow-sm ${className}`}
            style={{
                minHeight: `calc(${preset.minHeight} + 2.5rem)`,
                width: '100%',
                maxWidth: preset.maxWidth,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}
        >
            <div className="mb-2 flex w-full select-none items-center justify-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                <span>Advertisement</span>
            </div>

            <div
                className="flex w-full items-center justify-center overflow-hidden rounded-xl bg-white shadow-inner"
                style={{
                    minHeight: preset.minHeight,
                    width: preset.width,
                    maxWidth: '100%',
                }}
            >
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{
                        display: 'block',
                        minHeight: preset.minHeight,
                        width: '100%',
                    }}
                    data-ad-client={ADSENSE_CLIENT_ID}
                    data-ad-slot={slot}
                    data-ad-format={preset.format}
                    data-full-width-responsive={preset.format === 'auto' ? 'true' : 'false'}
                />
            </div>
        </aside>
    );
}
