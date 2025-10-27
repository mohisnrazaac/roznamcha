import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const baseLinks = [
  { name: 'Dashboard', href: '/dashboard', slug: 'dashboard' },
  { name: 'Users', href: '/admin/users', slug: 'users', adminOnly: true },
  { name: 'Categories', href: '/admin/categories', slug: 'categories', adminOnly: true },
];

export default function AdminLayout({ children }) {
  const { url, props } = usePage();
  const user = props.auth?.user;

  const links = baseLinks.filter((link) => {
    if (link.adminOnly) {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="hidden w-60 flex-col border-r border-slate-800 bg-slate-900/60 p-6 shadow-2xl md:flex">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Roznamcha</span>
          <div className="mt-2 text-lg font-semibold">Control Room</div>
          {user && (
            <p className="mt-1 text-xs text-slate-500">
              {user.name} · {user.role}
            </p>
          )}
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.slug}
              href={link.href}
              className={`flex items-center rounded-lg px-3 py-2 text-sm transition hover:bg-slate-800 ${
                url.startsWith(link.href) ? 'bg-slate-800 text-white' : 'text-slate-300'
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

      <div className="flex-1">
        <header className="border-b border-slate-800 bg-slate-900/70 px-6 py-4 text-sm text-slate-300 md:hidden">
          {user ? `Welcome, ${user.name} (${user.role})` : 'Roznamcha'}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
