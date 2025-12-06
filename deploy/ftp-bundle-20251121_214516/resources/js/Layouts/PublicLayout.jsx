import React from 'react';

const variantStyles = {
    landing: {
        wrapper: 'min-h-screen flex flex-col bg-[#fff9ef] text-slate-900',
        icon: (
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-yellow-300 flex items-center justify-center text-[#001a4a] font-bold text-xl shadow">
                    <span className="-mt-1">🧾</span>
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-white font-semibold text-base">Roznamcha</span>
                    <span className="text-yellow-300 text-xs font-medium">روزنامچہ</span>
                </div>
            </div>
        ),
    },
    inner: {
        wrapper: 'min-h-screen flex flex-col bg-gray-50 text-slate-900',
        icon: (
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-yellow-300 flex items-center justify-center text-[#001a4a] font-bold text-lg shadow">
                    <span className="-mt-0.5">📈</span>
                </div>
                <span className="text-white font-semibold text-base tracking-[0.2em] uppercase">
                    Roznamcha
                </span>
            </div>
        ),
    },
};

export default function PublicLayout({ children, variant = 'landing' }) {
    const styles = variantStyles[variant] ?? variantStyles.landing;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';

    const linkClasses = (hrefMatch) =>
        `text-sm font-medium transition-colors ${
            path === hrefMatch ? 'text-yellow-300' : 'text-white hover:text-yellow-200'
        }`;

    const loginClasses =
        variant === 'landing'
            ? 'text-sm font-semibold text-yellow-300 hover:text-white transition-colors'
            : linkClasses('/login');

    return (
        <div className={styles.wrapper}>
            <header className="bg-[#001a4a] text-white">
                <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
                    {styles.icon}
                    <nav className="flex items-center gap-6">
                        <a href="/" className={linkClasses('/')}>
                            Home
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

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-transparent text-center py-8 text-sm text-slate-500">
                © 2025 Roznamcha. All rights reserved.
            </footer>
        </div>
    );
}
