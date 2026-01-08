import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
  const { url } = usePage();
  const safeRoute = (name, fallback) => {
    try {
      if (typeof route === 'function') {
        return route(name);
      }
    } catch (error) {
      // noop
    }
    return fallback;
  };

  const navItems = [
    { href: route('dashboard'), label: 'Dashboard', icon: '📊' },
    { href: safeRoute('panel.kharcha.index', '/panel/kharcha'), label: 'Kharcha Map', icon: '💸' },
    { href: safeRoute('panel.ration.index', '/panel/ration'), label: 'Ration Brain', icon: '🥘' },
    { href: safeRoute('panel.reminders.index', '/panel/reminders'), label: 'Reminders', icon: '⏰' },
    { href: safeRoute('reports.index', '/reports'), label: 'Reports', icon: '📈' },
  ];
  const homeHref = safeRoute('public.home', '/');

  return (
    <div className="min-h-screen flex bg-[#F7F8FA] text-slate-900">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 bg-white border-r border-slate-200">
        <Link
          href={homeHref}
          className="px-4 py-4 flex items-center gap-3 border-b border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003a8c]/40"
        >
          <img
            src="/icons/appicon.png"
            alt="Roznamcha logo"
            className="w-10 h-10 rounded-xl border border-slate-200 object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900 text-sm">
              Roznamcha
            </span>
            <span className="text-yellow-500 text-[11px] font-medium">
              روزنامچہ
            </span>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                'flex items-center gap-2 px-3 py-2 rounded-lg font-medium ' +
                (url === item.href
                  ? 'bg-[#003a8c] text-white'
                  : 'text-slate-700 hover:bg-slate-100')
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-yellow-100 rounded-lg p-3 text-xs text-slate-800">
            <div className="font-semibold mb-1">📄 Survival Report</div>
            <div className="text-[11px] leading-snug">
              Download Monthly PDF
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header / search */}
        <header className="bg-[#003a8c] text-white px-4 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 text-white text-lg">
              ☰
            </button>
            <Link href={homeHref} className="inline-flex items-center gap-2 text-white font-semibold">
              <img
                src="/icons/appicon.png"
                alt="Roznamcha logo"
                className="w-8 h-8 rounded-xl border border-white/20 object-cover"
              />
              <span className="hidden sm:inline">Roznamcha</span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden sm:flex">
            <div className="flex items-center bg-white/10 text-white rounded-md px-3 py-2 text-sm w-full">
              <span className="mr-2 opacity-70">🔍</span>
              <span className="opacity-70">Search expenses, reminders…</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button className="relative">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold rounded-full px-1">
                2
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center border border-black/20">
              U
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-4 md:px-6 py-4 text-[11px] text-slate-500">
          © 2025 Roznamcha • Privacy • Support
        </footer>
      </div>
    </div>
  );
}
