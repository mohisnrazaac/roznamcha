// Purpose: Render styled in-page AdSense blocks that blend with Roznamcha without disguising sponsored content. Date: 2026-03-28. Author: Codex.

import React from 'react';
import { usePage } from '@inertiajs/react';
import useAdCodeLoaded from './useAdCodeLoaded';

const ADSENSE_CLIENT_ID = 'ca-pub-8709269992599634';

export default function InlineAd({
    slot = '',
    className = '',
    title = 'Sponsored support',
    description = 'Relevant offers can appear here without interrupting the main budgeting flow.',
    minHeight = 280,
}) {
    const pageProps = usePage()?.props || {};
    const pagePolicies = pageProps.pagePolicies;
    const adsAllowed = pagePolicies?.adsAllowed === true;
    const adCodeLoaded = useAdCodeLoaded(adsAllowed);
    const adRef = React.useRef(null);

    React.useEffect(() => {
        if (!adsAllowed || !adCodeLoaded || !slot || !adRef.current || adRef.current.dataset.initialized === 'true') {
            return;
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            adRef.current.dataset.initialized = 'true';
        } catch (error) {
            console.error('AdSense block failed to initialize.', error);
        }
    }, [adsAllowed, adCodeLoaded, slot]);

    if (!adsAllowed || !adCodeLoaded || !slot) {
        return null;
    }

    return (
        <aside
            aria-label="Sponsored content"
            className={[
                'overflow-hidden rounded-[1.75rem] border border-[#001a4a]/10 bg-[linear-gradient(135deg,_#fffaf0_0%,_#ffffff_58%,_#eef4ff_100%)] p-5 shadow-sm min-h-[280px]',
                className,
            ].join(' ')}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8c5a00]">
                        Sponsored
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#001a4a]">{title}</h3>
                </div>
                <span className="rounded-full border border-[#001a4a]/10 bg-white/80 px-3 py-1 text-xs font-medium text-slate-500">
                    AdSense
                </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>

            <div className="mt-5 rounded-[1.25rem] border border-white bg-white/90 p-3 min-h-[280px]">
                <ins
                    ref={adRef}
                    className="adsbygoogle block w-full min-h-[280px] overflow-hidden rounded-xl"
                    style={{ display: 'block', minHeight: `${minHeight}px` }}
                    data-ad-client={ADSENSE_CLIENT_ID}
                    data-ad-slot={slot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </aside>
    );
}
