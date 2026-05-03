import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ChatWidget from '../Components/Chat/ChatWidget';

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
    const { url = '', props } = usePage();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isToolsMenuOpen, setIsToolsMenuOpen] = React.useState(false);
    const [isMobileToolsMenuOpen, setIsMobileToolsMenuOpen] = React.useState(false);
    const path = (url || '').split('?')[0] ?? '';
    const user = props?.auth?.user ?? null;
    const featuresToolsHref = `${route('public.features')}#public-tools`;

    const isLinkActive = (hrefMatch) => path === hrefMatch || path.startsWith(`${hrefMatch}/`);

    const linkClasses = (hrefMatch) =>
        `text-sm font-medium transition-colors ${
            isLinkActive(hrefMatch) ? 'text-yellow-300' : 'text-white/80 hover:text-yellow-200'
        }`;

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/features', label: 'Features' },
        { href: '/templates', label: 'Templates' },
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    const toolMenuLinks = [
        {
            href: featuresToolsHref,
            label: 'All Public Tools',
            description: 'Calculators and public planners',
        },
        {
            href: '/tools/ration-cost-estimator',
            label: 'Ration Cost Estimator',
            description: 'Guest grocery planning tool',
        },
        {
            href: '/tools/school-fees-planner',
            label: 'School Fees Planner',
            description: 'School cost planning page',
        },
        {
            href: '/tools/electricity-bill-estimator',
            label: 'Electricity Bill Estimator',
            description: 'Progressive slab estimator',
        },
        {
            href: '/survival-report',
            label: 'Survival Report',
            description: 'Month-end pressure and budget health view',
        },
        {
            href: '/kharcha-map',
            label: 'Kharcha Map',
            description: 'See where the household budget is leaking',
        },
        {
            href: '/templates/50k-salary-survival-guide',
            label: '50k Salary Guide',
            description: 'A stronger survival-first budget example',
        },
    ];

    const isToolsMenuActive =
        path.startsWith('/tools') ||
        path.startsWith('/petrol-price-') ||
        path.startsWith('/electricity-bill-calculator-') ||
        path.startsWith('/ration-cost-for-');

    const toolsMenuClasses = `text-sm font-medium transition-colors ${
        isToolsMenuActive ? 'text-yellow-300' : 'text-white/80 hover:text-yellow-200'
    }`;

    const toolsSubmenuLinkClasses =
        'block rounded-2xl border border-white/10 px-4 py-3 transition hover:border-yellow-200/40 hover:bg-white/10';
    const isHashLink = (href) => typeof href === 'string' && href.includes('#');

    const ctaClasses = {
        primary:
            'inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200',
        secondary:
            'inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
    };

    const renderActions = (variant = 'desktop') => {
        const extraClasses = variant === 'mobile' ? 'w-full' : '';
        return user ? (
            <>
                <Link href={route('dashboard')} className={`${ctaClasses.primary} ${extraClasses}`}>
                    Open App
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className={`${ctaClasses.secondary} ${extraClasses}`}
                >
                    Logout
                </Link>
            </>
        ) : (
            <>
                <Link href="/register" className={`${ctaClasses.primary} ${extraClasses}`}>
                    Sign up (Free)
                </Link>
                <Link href="/login" className={`${ctaClasses.secondary} ${extraClasses}`}>
                    Login
                </Link>
            </>
        );
    };

    return (
        <div className={styles.wrapper}>
            <header className="bg-[#001a4a] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <a href="/" className="flex items-center gap-3" aria-label="Roznamcha home">
                            <img
                                src="/icons/appicon.png"
                                alt="Roznamcha logo"
                                className="w-11 h-11 rounded-2xl border border-white/20 object-cover bg-white/10"
                            />
                            {styles.label}
                        </a>
                        <button
                            type="button"
                            className="sm:hidden inline-flex items-center rounded-full border border-white/40 px-3 py-2 text-white transition hover:bg-white/10"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            aria-controls="public-nav"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Toggle navigation</span>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                        <div className="hidden sm:flex sm:items-center sm:gap-8">
                            <nav className="flex items-center gap-6 text-sm" aria-label="Primary navigation">
                                {navLinks.map((link) => (
                                    <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                                        {link.label}
                                    </Link>
                                ))}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsToolsMenuOpen(true)}
                                    onMouseLeave={() => setIsToolsMenuOpen(false)}
                                    onFocusCapture={() => setIsToolsMenuOpen(true)}
                                    onBlurCapture={(event) => {
                                        if (!event.currentTarget.contains(event.relatedTarget)) {
                                            setIsToolsMenuOpen(false);
                                        }
                                    }}
                                >
                                    <button
                                        type="button"
                                        className={`${toolsMenuClasses} inline-flex items-center gap-2`}
                                        onClick={() => setIsToolsMenuOpen((prev) => !prev)}
                                        aria-expanded={isToolsMenuOpen}
                                        aria-haspopup="menu"
                                        aria-controls="public-tools-menu"
                                    >
                                        Tools
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isToolsMenuOpen ? (
                                        <div
                                            id="public-tools-menu"
                                            className="absolute left-1/2 top-full z-30 w-[28rem] -translate-x-1/2 pt-4"
                                        >
                                            <div className="rounded-[1.5rem] border border-white/10 bg-[#01265d] p-4 shadow-2xl">
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    {toolMenuLinks.map((item) => (
                                                        isHashLink(item.href) ? (
                                                            <a
                                                                key={item.href}
                                                                href={item.href}
                                                                className={toolsSubmenuLinkClasses}
                                                                onClick={() => setIsToolsMenuOpen(false)}
                                                            >
                                                                <span className="block text-sm font-semibold text-white">{item.label}</span>
                                                                <span className="mt-1 block text-xs text-white/65">{item.description}</span>
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className={toolsSubmenuLinkClasses}
                                                                onClick={() => setIsToolsMenuOpen(false)}
                                                            >
                                                                <span className="block text-sm font-semibold text-white">{item.label}</span>
                                                                <span className="mt-1 block text-xs text-white/65">{item.description}</span>
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </nav>
                            <div className="flex items-center gap-3">{renderActions()}</div>
                        </div>
                    </div>
                    <div
                        id="public-nav"
                        className={`mt-4 sm:hidden ${isMenuOpen ? 'flex flex-col gap-4' : 'hidden'}`}
                    >
                        <nav className="flex flex-col gap-3 text-sm" aria-label="Mobile navigation">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={linkClasses(link.href)}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                <button
                                    type="button"
                                    className={`${toolsMenuClasses} flex w-full items-center justify-between`}
                                    onClick={() => setIsMobileToolsMenuOpen((prev) => !prev)}
                                    aria-expanded={isMobileToolsMenuOpen}
                                >
                                    <span>Tools</span>
                                    <svg className={`h-4 w-4 transition-transform ${isMobileToolsMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isMobileToolsMenuOpen ? (
                                    <div className="mt-3 space-y-2">
                                        {toolMenuLinks.map((item) => (
                                            isHashLink(item.href) ? (
                                                <a
                                                    key={item.href}
                                                    href={item.href}
                                                    className="block rounded-xl border border-white/10 px-3 py-3 text-sm text-white/85 transition hover:bg-white/10"
                                                    onClick={() => {
                                                        setIsMobileToolsMenuOpen(false);
                                                        setIsMenuOpen(false);
                                                    }}
                                                >
                                                    <span className="block font-semibold text-white">{item.label}</span>
                                                    <span className="mt-1 block text-xs text-white/60">{item.description}</span>
                                                </a>
                                            ) : (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="block rounded-xl border border-white/10 px-3 py-3 text-sm text-white/85 transition hover:bg-white/10"
                                                    onClick={() => {
                                                        setIsMobileToolsMenuOpen(false);
                                                        setIsMenuOpen(false);
                                                    }}
                                                >
                                                    <span className="block font-semibold text-white">{item.label}</span>
                                                    <span className="mt-1 block text-xs text-white/60">{item.description}</span>
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </nav>
                        <div className="flex flex-col gap-3">{renderActions('mobile')}</div>
                    </div>
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
                <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-[#001a4a]">
                    <span className="font-medium">Follow us:</span>
                    <a
                        href="https://web.facebook.com/roznamcha.pk/"
                        className="text-[#001a4a] underline decoration-dotted underline-offset-2 hover:decoration-solid"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Facebook
                    </a>
                </div>
                <p>© 2026 Roznamcha. All rights reserved.</p>
            </footer>
            <ChatWidget />
        </div>
    );
}
