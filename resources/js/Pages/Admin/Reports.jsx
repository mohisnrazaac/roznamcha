// Purpose: Reports dashboard with admin user filtering support. Date: 2026-02-22. Author: Codex.

import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function Reports({
    authUser,
    subjectUser,
    monthLabel,
    totalSpend,
    rationDaysLeft,
    upcomingFees = [],
    health = {},
    breakdown = [],
    recentActivity = [],
    filters = {},
    users = [],
}) {
    const { props } = usePage();
    const translations = props.translations ?? {};
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [isGenerating, setIsGenerating] = useState(false);
    const downloadUrl = props?.flash?.report_download_url ?? null;
    const [selectedUser, setSelectedUser] = useState(filters.user_id ?? '');
    const role = (authUser?.role ?? '').toLowerCase();
    const isAdmin = role.includes('admin');

    const generateReport = (event) => {
        event.preventDefault();
        setIsGenerating(true);
        router.post(
            route('panel.reports.survival'),
            { month },
            {
                preserveScroll: true,
                onFinish: () => setIsGenerating(false),
            }
        );
    };

    const applyUserFilter = (event) => {
        event.preventDefault();
        router.get(
            route('reports.index'),
            selectedUser ? { user_id: selectedUser } : {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetUserFilter = () => {
        setSelectedUser('');
        router.get(route('reports.index'), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <ControlRoomLayout active="reports" user={authUser}>
            <div className="p-6 md:p-10 text-white space-y-10">
                <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Reports & Signals</h1>
                        <p className="text-sm text-slate-400">
                            Monthly survival report for {monthLabel}. Designed for the household CFO.
                        </p>
                        {isAdmin && subjectUser && (
                            <p className="text-xs text-slate-500">
                                Viewing data for {subjectUser.name} ({subjectUser.email})
                            </p>
                        )}
                    </div>
                    <form onSubmit={generateReport} className="flex items-center gap-2">
                        <input
                            type="month"
                            value={month}
                            onChange={(event) => setMonth(event.target.value)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-white"
                        />
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="inline-flex items-center justify-center rounded-lg border border-yellow-400 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400/10 disabled:opacity-50"
                        >
                            {isGenerating ? 'Generating…' : translations.reports?.survival_cta}
                        </button>
                    </form>
                </header>

                {isAdmin && (
                    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                        <form onSubmit={applyUserFilter} className="flex flex-col gap-3 md:flex-row md:items-center">
                            <label htmlFor="reports-user-filter" className="text-sm font-semibold text-slate-200">
                                Filter by user
                            </label>
                            <select
                                id="reports-user-filter"
                                value={selectedUser}
                                onChange={(event) => setSelectedUser(event.target.value)}
                                className="flex-1 rounded-lg border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-white"
                            >
                                <option value="">My account</option>
                                {users.map((userOption) => (
                                    <option key={userOption.id} value={userOption.id}>
                                        {userOption.name} ({userOption.email})
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                                >
                                    Apply
                                </button>
                                <button
                                    type="button"
                                    onClick={resetUserFilter}
                                    className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {downloadUrl ? (
                    <div className="rounded-xl border border-emerald-400 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {translations.reports?.survival_ready}{' '}
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            {translations.actions?.download ?? 'Download'}
                        </a>
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-300">
                        {translations.reports?.survival_empty}
                    </div>
                )}

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Spend this month</p>
                        <div className="mt-2 text-3xl font-semibold">₨ {Number(totalSpend ?? 0).toLocaleString()}</div>
                    </article>
                    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Ration days left</p>
                        <div className="mt-2 text-3xl font-semibold">{rationDaysLeft ?? '—'}</div>
                    </article>
                    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Health Guard</p>
                        <div className="mt-2 text-lg font-semibold">{health.label ?? 'BP Medicine'}</div>
                        <p className="text-sm text-slate-400">{health.status ?? 'Today'} • Next dose {health.nextCheck ?? '9:00 PM'}</p>
                    </article>
                    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Upcoming fees</p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-300">
                            {upcomingFees.map((fee, index) => (
                                <li key={index} className="flex items-center justify-between">
                                    <span>{fee.label}</span>
                                    <span className="text-slate-400">{fee.due}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                </section>

                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                        <h2 className="text-sm uppercase tracking-wide text-slate-500">Breakdown</h2>
                        <ul className="mt-4 space-y-3">
                            {breakdown.map((item, index) => (
                                <li key={index} className="flex items-center justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span className="text-slate-400">{item.percent}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                        <h2 className="text-sm uppercase tracking-wide text-slate-500">Recent activity</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            {recentActivity.map((activity, index) => (
                                <li key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">{activity.description}</p>
                                        <p className="text-xs text-slate-500">{activity.date} • {activity.category}</p>
                                    </div>
                                    <span className="font-semibold text-white">₨ {Number(activity.amount ?? 0).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </ControlRoomLayout>
    );
}
