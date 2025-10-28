import React from 'react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Home() {
    return (
        <PublicLayout variant="landing">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="space-y-6">
                        <span className="inline-block rounded-full bg-yellow-200 text-gray-800 text-xs font-medium px-3 py-1 uppercase tracking-wide">
                            Coming Soon
                        </span>

                        <h2 className="text-3xl sm:text-4xl font-bold text-[#001a4a] leading-tight">
                            Roznamcha — Your Household Survival Cockpit
                        </h2>

                        <p className="text-base sm:text-lg leading-relaxed text-slate-700 max-w-xl">
                            Your household survival cockpit: track daily kharcha, grocery inflation, reminders for BP meds / chool fees / petrol, and get month-end survival report.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg bg-[#001a4a] text-yellow-300 px-6 py-2 text-sm font-semibold shadow hover:bg-[#112e66] transition"
                                onClick={() => {
                                    window.location.href = '/login';
                                }}
                            >
                                Login (Early Access)
                            </button>

                            <a
                                href="/contact"
                                className="text-sm font-semibold text-[#001a4a] hover:underline"
                            >
                                Stay in touch
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
                                <span>Preview</span>
                                <span className="text-xs uppercase tracking-wide text-slate-400">Panel</span>
                            </div>

                            <div className="bg-[#001a4a] text-white rounded-xl p-5 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-yellow-300 text-[#001a4a] font-bold text-xl flex items-center justify-center">
                                    ₹↑
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">This Month Spend</div>
                                    <div className="text-2xl font-bold">₹ 82,450</div>
                                    <div className="text-xs text-yellow-200 font-medium mt-1">
                                        +12% vs last month
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                Your dashboard will show ration days left, upcoming school fees, petrol situation, and medicine reminders.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="text-base font-semibold text-[#001a4a] mb-2">Kharcha Map</div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            See exactly where rupees went every day, so month-end isn’t a shock.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="text-base font-semibold text-[#001a4a] mb-2">Ration Brain</div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Atta, oil, sugar tracking. Know how many days before the kitchen panic.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="text-base font-semibold text-[#001a4a] mb-2">Survival Report</div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Month-end forecast + downloadable snapshot to plan next month calmly.
                        </p>
                    </div>
                </div>

                <div className="mt-16 bg-[#001a4a] text-yellow-300 rounded-2xl px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="text-lg font-semibold">Want early access to the panel!?</div>
                        <div className="text-sm text-yellow-200">Log in and start tracking.</div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-xl bg-yellow-300 text-[#001a4a] px-6 py-2 text-sm font-semibold hover:bg-yellow-200 transition"
                        onClick={() => {
                            window.location.href = '/login';
                        }}
                    >
                        Login
                    </button>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600 gap-2">
                    <div className="flex items-center gap-4">
                        <a href="/about" className="hover:text-[#001a4a]">About</a>
                        <a href="/contact" className="hover:text-[#001a4a]">Contact</a>
                    </div>
                    <div>© 2025 Roznamcha.</div>
                </div>
            </section>
        </PublicLayout>
    );
}
