import React from 'react';
import { Link } from '@inertiajs/react';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#003a8c] to-[#002766] text-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center text-black font-bold text-xs leading-tight shadow">
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px]">₹↑</span>
                <span className="text-[9px]">📒</span>
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-white text-sm sm:text-base">
                Roznamcha
              </span>
              <span className="text-yellow-300 text-[11px] sm:text-[12px] font-medium">
                روزنامچہ
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link href={route('home')} className="hover:text-yellow-300 transition-colors">
              Home
            </Link>
            <Link href={route('about')} className="hover:text-yellow-300 transition-colors">
              About
            </Link>
            <Link href={route('contact')} className="hover:text-yellow-300 transition-colors">
              Contact
            </Link>
            <Link
              href={route('login.custom')}
              className="bg-yellow-400 text-black font-semibold px-3 py-1.5 rounded-md text-xs sm:text-sm hover:bg-yellow-300 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 text-sm text-slate-600">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="font-semibold text-slate-900 mb-1">Roznamcha</div>
            <div className="text-slate-500 text-xs">
              Household Survival Cockpit
            </div>
          </div>
          <div className="flex flex-col text-xs gap-1">
            <Link href={route('about')} className="hover:text-slate-900">About</Link>
            <Link href={route('contact')} className="hover:text-slate-900">Contact</Link>
            <div className="text-slate-400 cursor-default">Terms (coming soon)</div>
          </div>
          <div className="text-xs text-slate-400 flex items-end">
            © 2025 Roznamcha. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
