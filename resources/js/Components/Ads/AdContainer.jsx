import React, { useRef, useEffect } from 'react';

const ADSENSE_CLIENT_ID = 'ca-pub-8709269992599634';

const sizePresets = {
    leaderboard: { width: '728px', height: '90px', format: 'horizontal' },
    rectangle: { width: '300px', height: '250px', format: 'rectangle' },
    responsive: { width: '100%', height: 'auto', format: 'auto' }
};

export default function AdContainer({
    slot = '',
    variant = 'responsive',
    className = '',
}) {
    const adRef = useRef(null);
    const preset = sizePresets[variant] || sizePresets.responsive;

    useEffect(() => {
        if (!slot || !adRef.current || adRef.current.dataset.initialized === 'true') {
            return;
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            adRef.current.dataset.initialized = 'true';
        } catch (error) {
            console.error('AdSense failed to load inside container', error);
        }
    }, [slot]);

    if (!slot) {
        return null;
    }

    const containerStyle = {
        minWidth: preset.width !== '100%' ? preset.width : 'auto',
        minHeight: preset.height !== 'auto' ? preset.height : 'auto',
        width: preset.width,
        height: preset.height,
    };

    return (
        <div
            className={`no-ad-zone overflow-hidden flex flex-col items-center justify-center border border-slate-100 bg-slate-50/50 p-2 rounded-xl my-4 ${className}`}
            style={{ minHeight: preset.height !== 'auto' ? `calc(${preset.height} + 2rem)` : 'auto' }}
        >
            <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-semibold tracking-wider uppercase mb-1.5 px-1 select-none">
                <span>Advertisement</span>
                <span>AdSense</span>
            </div>

            <div style={containerStyle} className="w-full overflow-hidden flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-100">
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{
                        display: 'block',
                        width: preset.width,
                        height: preset.height,
                    }}
                    data-ad-client={ADSENSE_CLIENT_ID}
                    data-ad-slot={slot}
                    data-ad-format={preset.format}
                    data-full-width-responsive={preset.format === 'auto' ? 'true' : 'false'}
                />
            </div>
        </div>
    );
}
