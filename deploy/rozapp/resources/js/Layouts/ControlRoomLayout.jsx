import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const defaultLinks = [
    { name: 'Dashboard', href: '/dashboard', slug: 'dashboard' },
    { name: 'Kharcha Map', href: '/kharcha', slug: 'kharcha' },
    { name: 'Ration Brain', href: '/ration', slug: 'ration' },
    { name: 'Reminders', href: '/reminders', slug: 'reminders' },
    { name: 'Reports', href: '/reports', slug: 'reports' },
    { name: 'Users', href: '/admin/users', slug: 'users', adminOnly: true },
    { name: 'Categories', href: '/admin/categories', slug: 'categories', adminOnly: true },
];

export default function ControlRoomLayout({ children, active, links = defaultLinks, user: providedUser }) {
    const { url, props } = usePage();
    const sharedAuthUser = props?.auth?.user ?? props?.authUser;
    const user = providedUser ?? sharedAuthUser;

    const isSuperAdmin = user?.role === 'admin' || user?.email === 'admin@roznamcha.local';

    const filteredLinks = links.filter((link) => {
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

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900/60 p-6 shadow-2xl md:flex">
                <div className="mb-8">
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Roznamcha</span>
                    <div className="mt-2 text-lg font-semibold">Control Room</div>
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

            <div className="flex-1 flex flex-col">
                <header className="border-b border-slate-800 bg-slate-900/70 px-6 py-4 text-sm text-slate-300 md:hidden">
                    {user ? `Welcome, ${user.name} (${user.role})` : 'Roznamcha'}
                </header>

                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
