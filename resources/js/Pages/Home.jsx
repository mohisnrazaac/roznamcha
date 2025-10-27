import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Link } from '@inertiajs/react';

export default function Home() {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left pitch */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black text-[11px] font-semibold px-2 py-1 rounded-md w-max mb-4 shadow">
            <span>Coming Soon</span>
            <span className="text-[10px]">جلد آ رہا ہے</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-4">
            Roznamcha — Your Household Survival Cockpit
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
            Track kharcha, ration, school fees, reminders and medicine in one
            simple place. Know if you’ll survive till month-end or not — in
            Urdu, in plain numbers you actually understand.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={route('login.custom')}
              className="bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow"
            >
              Login (Early Access)
            </Link>
            <a
              href="#contact"
              className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white text-sm font-medium px-4 py-2 rounded-md shadow-sm"
            >
              Stay in touch
            </a>
          </div>
        </div>

        {/* Right: Preview mock */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-lg p-4">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              Preview
            </div>
            <div className="bg-[#003a8c] text-white rounded-lg p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-yellow-400 text-black font-bold flex items-center justify-center text-xs">
                ₹↑
              </div>
              <div>
                <div className="font-semibold text-white text-sm">
                  This Month Spend
                </div>
                <div className="text-lg font-bold">₨ 82,450</div>
                <div className="text-[11px] text-yellow-300 font-medium">
                  +12% vs last month
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              Your dashboard will show ration days left, upcoming school fees,
              petrol situation, and medicine reminders.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900 mb-1">
            Kharcha Map
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            See exactly where rupees went every day, so end of month isn’t a surprise.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900 mb-1">
            Ration Brain
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Atta, oil, sugar tracking. Know how many days are left before kitchen panic.
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900 mb-1">
            Survival Report
          </div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Month-end forecast + downloadable PDF report to plan next month.
          </div>
        </div>
      </section>

      {/* bottom CTA */}
      <section className="bg-[#003a8c] text-yellow-300">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm font-semibold leading-relaxed text-yellow-300">
            Want early access to the panel?
            <div className="text-white text-xs font-normal">
              Log in and start tracking.
            </div>
          </div>
          <Link
            href={route('login.custom')}
            className="bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-300"
          >
            Login
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
