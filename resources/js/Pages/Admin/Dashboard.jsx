import React from 'react';
import { Link, useForm } from '@inertiajs/react';
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
    const { data, setData, post, processing, errors, reset } = useForm({
        old_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordUpdate = (event) => {
        event.preventDefault();

        post('/admin/update-password', {
            preserveScroll: true,
            onSuccess: () => {
                reset('old_password', 'password', 'password_confirmation');
            },
        });
    };

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

                <section className="space-y-4 rounded-2xl border border-slate-900 bg-slate-900/60 p-6">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-yellow-300">Security</p>
                        <h2 className="mt-1 text-lg font-semibold text-white">Update admin password</h2>
                        <p className="text-sm text-slate-400">
                            Enter your current password and choose a new one (min 8 characters). Saving logs out other sessions.
                        </p>
                    </div>
                    <form className="space-y-5" onSubmit={handlePasswordUpdate}>
                        <div>
                            <label htmlFor="old_password" className="text-sm font-medium text-slate-200">
                                Old Password
                            </label>
                            <input
                                id="old_password"
                                type="password"
                                value={data.old_password}
                                onChange={(event) => setData('old_password', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white focus:border-yellow-300 focus:outline-none focus:ring-0"
                                autoComplete="current-password"
                                required
                            />
                            {errors.old_password && <p className="mt-2 text-sm text-red-400">{errors.old_password}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-slate-200">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white focus:border-yellow-300 focus:outline-none focus:ring-0"
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="text-sm font-medium text-slate-200">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(event) => setData('password_confirmation', event.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white focus:border-yellow-300 focus:outline-none focus:ring-0"
                                autoComplete="new-password"
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="mt-2 text-sm text-red-400">{errors.password_confirmation}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                            <p>Submitting will sign you out to confirm the change.</p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-xl bg-yellow-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-200 disabled:opacity-70"
                            >
                                {processing ? 'Updating…' : 'Update password'}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </ControlRoomLayout>
    );
}
