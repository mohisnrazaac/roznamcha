import React from 'react';
import { Link } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

const moduleCards = [
    {
        title: 'Kharcha Map',
        description: 'Track monthly expenses and burn',
        href: '/kharcha',
        slug: 'kharcha',
    },
    {
        title: 'Ration Brain',
        description: 'Grocery price watch / inflation',
        href: '/ration',
        slug: 'ration',
    },
    {
        title: 'Reminders / Health Guard',
        description: 'BP meds, school fees, petrol refill, etc.',
        href: '/reminders',
        slug: 'reminders',
    },
];

const adminCards = [
    {
        title: 'Users',
        description: 'Create and manage users',
        href: '/admin/users',
        slug: 'users',
    },
    {
        title: 'Categories',
        description: 'Budget / spend tags',
        href: '/admin/categories',
        slug: 'categories',
    },
];

export default function Dashboard({ authUser }) {
    const isSuperAdmin = authUser?.role === 'admin';

    return (
        <ControlRoomLayout active="dashboard" user={authUser}>
            <div className="p-6 md:p-10 text-white space-y-10">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold leading-tight">
                        Welcome, {authUser?.name} ({authUser?.role})
                    </h1>
                    <p className="text-sm text-slate-400">
                        Household cockpit overview — get to the modules you need in one click.
                    </p>
                </header>

                {isSuperAdmin && (
                    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-yellow-300">AI Insights Activated</p>
                            <h2 className="text-lg font-semibold text-white">Your users now get monthly budget advice powered by AI.</h2>
                            <p className="text-sm text-slate-400">
                                Track quota usage per module and plan when to upgrade to the paid tier.
                            </p>
                        </div>
                        <Link
                            href="/admin/ai-logs"
                            className="inline-flex items-center justify-center rounded-xl bg-yellow-300 px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200"
                        >
                            Monitor usage →
                        </Link>
                    </section>
                )}

                <section className="space-y-4">
                    <h2 className="text-sm uppercase tracking-wide text-slate-400">Household modules</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {moduleCards.map((card) => (
                            <Link
                                key={card.slug}
                                href={card.href}
                                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-600 hover:bg-slate-900"
                            >
                                <div className="text-lg font-semibold text-white">{card.title}</div>
                                <p className="mt-2 text-sm text-slate-300">{card.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {isSuperAdmin && (
                    <section className="space-y-4">
                        <h2 className="text-sm uppercase tracking-wide text-slate-400">Admin tools</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {adminCards.map((card) => (
                                <Link
                                    key={card.slug}
                                    href={card.href}
                                    className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-600 hover:bg-slate-900"
                                >
                                    <div className="text-lg font-semibold text-white">{card.title}</div>
                                    <p className="mt-2 text-sm text-slate-300">{card.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </ControlRoomLayout>
    );
}
