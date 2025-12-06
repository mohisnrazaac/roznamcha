import React from 'react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function Kharcha({ user, entries = [], categories = [], stats = {} }) {
    return (
        <ControlRoomLayout active="kharcha" user={user}>
            <div className="p-6 md:p-10 text-white space-y-10">
                <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Kharcha Map</h1>
                        <p className="text-sm text-slate-400">
                            Track rupee-by-rupee spend across ration, school, fuel and more.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Add Expense
                    </button>
                </header>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Spend this month</p>
                        <div className="mt-2 text-2xl font-semibold">₨ {Number(stats.totalThisMonth ?? 0).toLocaleString()}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Top category</p>
                        <div className="mt-2 text-lg font-semibold">{stats.topCategory ?? '—'}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Categories loaded</p>
                        <div className="mt-2 text-lg font-semibold">{categories.length}</div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 text-sm text-slate-300">
                        <span>Recent expenses</span>
                        <span className="text-xs text-slate-500">Latest 50 entries</span>
                    </header>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                            <thead className="bg-slate-900/80 text-slate-300">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-left font-medium">Category</th>
                                    <th className="px-4 py-3 text-left font-medium">Vendor / Notes</th>
                                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {entries.length ? (
                                    entries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-800/40">
                                            <td className="px-4 py-3 text-slate-300">{entry.date}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-2">
                                                    <span
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: entry.category?.color ?? '#64748b' }}
                                                    />
                                                    <span>{entry.category?.name ?? '—'}</span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-400">
                                                {entry.vendor || entry.notes || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-white">
                                                ₨ {Number(entry.amount ?? 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                                            No expenses recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </ControlRoomLayout>
    );
}
