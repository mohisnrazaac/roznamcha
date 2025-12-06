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
    const isSuperAdmin = authUser?.role === 'admin' || authUser?.email === 'admin@roznamcha.local';

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
