import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('roznamcha_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('roznamcha_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('roznamcha_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#001a4a] text-white border-t border-white/10 px-4 py-4 sm:px-6 shadow-2xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-white/90 text-center md:text-left">
                    We use cookies to personalize content, analyze our traffic, and serve relevant advertisements through Google AdSense.
                    By clicking "Accept", you consent to our use of cookies. Read our{' '}
                    <a href="/privacy-policy" className="underline text-yellow-300 hover:text-yellow-200">
                        Privacy Policy
                    </a>{' '}
                    to learn more.
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleDecline}
                        className="rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                        Decline
                    </button>
                    <button
                        type="button"
                        onClick={handleAccept}
                        className="rounded-full bg-yellow-300 px-5 py-2 text-xs font-semibold text-[#001a4a] transition hover:bg-white"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
