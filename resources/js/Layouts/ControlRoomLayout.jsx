import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const baseLinks = (translations) => [
    { name: translations?.app?.brand ?? 'Dashboard', routeName: 'dashboard', slug: 'dashboard' },
    { name: translations?.kharcha?.title ?? 'Kharcha Map', routeName: 'panel.kharcha.index', slug: 'kharcha' },
    { name: translations?.ration?.title ?? 'Ration Brain', routeName: 'panel.ration.index', slug: 'ration' },
    { name: translations?.reminders?.title ?? 'Reminders', routeName: 'panel.reminders.index', slug: 'reminders' },
    { name: translations?.reports?.title ?? 'Reports', routeName: 'reports.index', slug: 'reports' },
    { name: 'Users', routeName: 'admin.users.index', slug: 'users', adminOnly: true },
    { name: 'Categories', routeName: 'admin.categories.index', slug: 'categories', adminOnly: true },
    { name: 'AI Logs', routeName: 'admin.ai-logs.index', slug: 'ai-logs', adminOnly: true },
    { name: 'Blog Posts', routeName: 'admin.blog.posts.index', slug: 'blog-posts', adminOnly: true },
    { name: 'Blog Categories', routeName: 'admin.blog.categories.index', slug: 'blog-categories', adminOnly: true },
    { name: 'Daily Hooks', routeName: 'admin.daily-return.index', slug: 'daily-hooks', adminOnly: true },
];

const resolveHref = (link) => {
    if (link.routeName) {
        try {
            return route(link.routeName);
        } catch (error) {
            return link.href ?? '#';
        }
    }

    return link.href ?? '#';
};

export default function ControlRoomLayout({ children, active, user: providedUser }) {
    const { url, props } = usePage();
    const translations = props.translations ?? {};
    const sharedAuthUser = props?.auth?.user ?? props?.authUser;
    const user = providedUser ?? sharedAuthUser;
    const links = baseLinks(translations);

    const isSuperAdmin = user?.role === 'admin';

    const filteredLinks = links
        .map((link) => ({
            ...link,
            href: resolveHref(link),
        }))
        .filter((link) => {
        if (link.adminOnly) {
            return isSuperAdmin;
        }
        return true;
    });

    const isActive = (link) => {
        if (active) {
            return active === link.slug;
        }

        if (link.href === '/') {
            return url === '/';
        }

        return url.startsWith(link.href);
    };

    const activeLink = filteredLinks.find((link) => isActive(link));
    const mobileTitle = activeLink?.name ?? translations?.app?.brand ?? 'Roznamcha';

    const panelHomeHref = (() => {
        try {
            return route('panel.home');
        } catch (error) {
            return '/panel';
        }
    })();

    const handleBackClick = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();

            return;
        }

        router.visit(panelHomeHref, { replace: true });
    };

    return (
        <div className="control-room min-h-screen bg-slate-950 text-white flex">
            <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/60 p-6 shadow-2xl md:flex">
                <div className="mb-8">
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        {translations?.app?.brand ?? 'Roznamcha'}
                    </span>
                    <div className="mt-2 text-lg font-semibold">{translations?.app?.tagline ?? 'Control Room'}</div>
                    {user && (
                        <p className="mt-1 text-xs text-slate-500">
                            {user.name} · {user.role}
                        </p>
                    )}
                </div>

                <nav className="space-y-2">
                    {filteredLinks.map((link) => (
                        <Link
                            key={link.slug}
                            href={link.href}
                            className={`flex items-center rounded-lg px-3 py-2 text-sm transition hover:bg-slate-800 ${
                                isActive(link) ? 'bg-slate-800 text-white' : 'text-slate-300'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-6">
                    <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-400">
                        {Object.entries(props.availableLocales ?? {}).map(([key, label]) => (
                            <span
                                key={key}
                                className={`rounded-full border px-2 py-1 ${
                                    key === props.appLocale ? 'border-yellow-300 text-yellow-300' : 'border-slate-700'
                                }`}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full rounded-lg bg-red-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                    >
                        Logout
                    </Link>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 backdrop-blur md:hidden">
                    <div className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={handleBackClick}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-white transition hover:bg-slate-800"
                            aria-label="Go back"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                            >
                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div className="flex-1 text-center leading-tight">
                            <p className="text-sm font-semibold">{mobileTitle}</p>
                            {user && <p className="text-xs text-slate-400">{user.name}</p>}
                        </div>
                        <Link
                            href={panelHomeHref}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-white transition hover:bg-slate-800"
                            aria-label="Panel home"
                        >
                            <span className="text-lg">◎</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
