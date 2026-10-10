import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ChatWidget from '../Components/Chat/ChatWidget';
import CookieConsent from '../Components/CookieConsent';
import PublicHeader from '../Components/Nav/PublicHeader';

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
            href: '/features/monthly-expense-tracker-pakistan',
            label: 'Monthly Expense Tracker',
            description: 'PKR income & expense tracking guide',
        },
        {
            href: '/tools/ration-cost-estimator',
            label: 'Ration Cost Estimator',
            description: 'Guest grocery planning tool',
        },
        {
            href: '/tools/monthly-household-budget-calculator',
            label: 'Budget Calculator',
            description: 'Monthly income & expense planner',
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
            href: '/tools/solar-net-metering-roi-calculator',
            label: 'Solar ROI Calculator',
            description: 'Net billing, payback & battery TCO',
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
            <PublicHeader
                variant={variant}
                user={user}
                toolMenuLinks={toolMenuLinks}
            />

            <main className="flex-1 w-full">
                {children}
            </main>

            <footer className="bg-transparent text-center px-4 py-8 text-sm text-slate-500 space-y-3">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium">
                    <Link href="/features/monthly-expense-tracker-pakistan" className="text-[#001a4a] hover:underline">
                        Monthly Expense Tracker
                    </Link>
                    <Link href="/about" className="text-[#001a4a] hover:underline">
                        About Us
                    </Link>
                    <Link href="/editorial-policy" className="text-[#001a4a] hover:underline">
                        Editorial Policy
                    </Link>
                    <Link href="/methodology" className="text-[#001a4a] hover:underline">
                        Methodology & Sources
                    </Link>
                    <Link href="/contact" className="text-[#001a4a] hover:underline">
                        Contact Us
                    </Link>
                    <Link href="/privacy-policy" className="text-[#001a4a] hover:underline">
                        Privacy Policy
                    </Link>
                    <Link href="/cookie-policy" className="text-[#001a4a] hover:underline">
                        Cookie Policy
                    </Link>
                    <Link href="/disclaimer" className="text-[#001a4a] hover:underline">
                        Disclaimer
                    </Link>
                    <Link href="/terms" className="text-[#001a4a] hover:underline">
                        Terms of Service
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent('roznamcha:open-consent-modal'))}
                        className="text-[#001a4a] hover:underline cursor-pointer"
                    >
                        Cookie Settings
                    </button>
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
                <p className="text-xs text-slate-400">Developed and managed remotely out of Karachi, Pakistan</p>
                <p>© 2026 Roznamcha. All rights reserved.</p>
            </footer>
            <ChatWidget />
            <CookieConsent />
        </div>
    );
}
