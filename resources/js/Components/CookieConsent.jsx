import React, { useEffect, useState } from 'react';

const CONSENT_KEY = 'roznamcha_cookie_consent';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

const persistConsent = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(value)}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax; Secure`;
    window.dispatchEvent(new CustomEvent('roznamcha:consent-updated', {
        detail: { consent: value },
    }));
};

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        persistConsent('accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        persistConsent('declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#001a4a] text-white border-t border-white/10 px-4 py-4 sm:px-6 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-white/90 text-center md:text-left">
                    Roznamcha uses essential cookies to keep the site working. Optional Google advertising and analytics only load after you allow them.
                    If you stay with essential-only settings, we keep ads and non-essential measurement turned off on this device. Read our{' '}
                    <a href="/cookie-policy" className="underline text-yellow-300 hover:text-yellow-200">
                        Cookie Policy
                    </a>{' '}
                    for details on how we use cookies.
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleDecline}
                        className="rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                        Essential only
                    </button>
                    <button
                        type="button"
                        onClick={handleAccept}
                        className="rounded-full bg-yellow-300 px-5 py-2 text-xs font-semibold text-[#001a4a] transition hover:bg-white"
                    >
                        Allow ads & analytics
                    </button>
                </div>
            </div>
        </div>
    );
}
