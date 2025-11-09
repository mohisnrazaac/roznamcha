import React from 'react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function Ration({ user, entries = [] }) {
    return (
        <ControlRoomLayout active="ration" user={user}>
            <div className="p-6 md:p-10 text-white space-y-8">
                <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Ration Brain</h1>
                        <p className="text-sm text-slate-400">
                            Keep kitchen stock and burn rate visible before the month blindsides you.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Log Usage
                    </button>
                </header>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 text-sm text-slate-300">
                        <span>Usage history</span>
                        <span className="text-xs text-slate-500">Latest 50 entries</span>
                    </header>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                            <thead className="bg-slate-900/80 text-slate-300">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Item</th>
                                    <th className="px-4 py-3 text-left font-medium">Quantity</th>
                                    <th className="px-4 py-3 text-left font-medium">Days left</th>
                                    <th className="px-4 py-3 text-left font-medium">Notes</th>
                                    <th className="px-4 py-3 text-right font-medium">Logged at</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {entries.length ? (
                                    entries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-800/40">
                                            <td className="px-4 py-3 font-medium text-white">{entry.item_name}</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {Number(entry.qty_used ?? 0).toLocaleString()} {entry.unit}
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">{entry.days_left_estimate ?? '—'}</td>
                                            <td className="px-4 py-3 text-slate-400">{entry.notes ?? '—'}</td>
                                            <td className="px-4 py-3 text-right text-slate-400">{entry.created_at}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                                            No ration usage logged yet.
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
