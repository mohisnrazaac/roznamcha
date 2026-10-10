import { useState, useEffect } from 'react';

/**
 * Check if the Google AdSense script has actually loaded and executed in the browser.
 */
export function isAdCodeLoaded() {
    if (typeof window === 'undefined') {
        return false;
    }

    return Boolean(
        window.roznamchaAdsLoaded === true ||
        (window.adsbygoogle && window.adsbygoogle.loaded === true)
    );
}

/**
 * Hook to reactively determine when AdSense code has loaded on eligible pages.
 * Ensures ad containers never render empty placeholders or cause CLS before ad code is ready.
 */
export default function useAdCodeLoaded(adsAllowed = true) {
    const [adCodeLoaded, setAdCodeLoaded] = useState(() => isAdCodeLoaded());

    useEffect(() => {
        if (!adsAllowed || typeof window === 'undefined') {
            setAdCodeLoaded(false);
            return;
        }

        if (isAdCodeLoaded()) {
            setAdCodeLoaded(true);
            return;
        }

        const handleAdsLoaded = () => {
            setAdCodeLoaded(true);
        };

        window.addEventListener('roznamcha:ads-loaded', handleAdsLoaded);

        const script = document.querySelector('script[src*="adsbygoogle.js"]');
        if (script) {
            script.addEventListener('load', handleAdsLoaded);
        }

        // Periodic poll to catch when AdSense initializes window.adsbygoogle.loaded directly
        const interval = setInterval(() => {
            if (isAdCodeLoaded()) {
                setAdCodeLoaded(true);
                clearInterval(interval);
            }
        }, 300);

        const timeout = setTimeout(() => {
            clearInterval(interval);
        }, 12000);

        return () => {
            window.removeEventListener('roznamcha:ads-loaded', handleAdsLoaded);
            if (script) {
                script.removeEventListener('load', handleAdsLoaded);
            }
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [adsAllowed]);

    return adCodeLoaded;
}
