import React from 'react';

const variantStyles = {
    landing: {
        wrapper: 'min-h-screen flex flex-col bg-[#fff9ef] text-slate-900',
        label: (
            <div className="flex flex-col leading-tight">
                <span className="text-white font-semibold text-base">Roznamcha</span>
                <span className="text-yellow-300 text-xs font-medium">روزنامچہ</span>
            </div>
        ),
    },
    inner: {
        wrapper: 'min-h-screen flex flex-col bg-gray-50 text-slate-900',
        label: (
            <span className="text-white font-semibold text-base tracking-[0.2em] uppercase">
                Roznamcha
            </span>
        ),
    },
};

export default function PublicLayout({ children, variant = 'landing' }) {
    const styles = variantStyles[variant] ?? variantStyles.landing;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';

    const isLinkActive = (hrefMatch) => path === hrefMatch || path.startsWith(`${hrefMatch}/`);

    const linkClasses = (hrefMatch) =>
        `text-sm font-medium transition-colors ${
            isLinkActive(hrefMatch) ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
        }`;

    const loginClasses =
        variant === 'landing'
            ? 'text-sm font-semibold text-yellow-300 hover:text-white transition-colors'
            : linkClasses('/login');

    return (
        <div className={styles.wrapper}>
            <header className="bg-[#001a4a] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <a href="/" className="flex items-center gap-3" aria-label="Roznamcha home">
                        <img
                            src="/icons/appicon.png"
                            alt="Roznamcha logo"
                            className="w-11 h-11 rounded-2xl border border-white/20 object-cover bg-white/10"
                        />
                        {styles.label}
                    </a>
                    <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm">
                        <a href="/" className={linkClasses('/')}>
                            Home
                        </a>
                        <a href="/blog" className={linkClasses('/blog')}>
                            Blog
                        </a>
                        <a href="/about" className={linkClasses('/about')}>
                            About
                        </a>
                        <a href="/contact" className={linkClasses('/contact')}>
                            Contact
                        </a>
                        <a href="/login" className={loginClasses}>
                            Login
                        </a>
                    </nav>
                </div>
            </header>

            <main className="flex-1 w-full">
                {children}
            </main>

            <footer className="bg-transparent text-center px-4 py-8 text-sm text-slate-500 space-y-2">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium">
                    <a href="/privacy-policy" className="text-[#001a4a] hover:underline">
                        Privacy Policy
                    </a>
                    <a href="/terms" className="text-[#001a4a] hover:underline">
                        Terms of Service
                    </a>
                    <a href="/sitemap.xml" className="text-[#001a4a] hover:underline">
                        Sitemap
                    </a>
                </div>
                <p>© 2025 Roznamcha. All rights reserved.</p>
            </footer>
        </div>
    );
}
