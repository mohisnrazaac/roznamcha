import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/react';

const steps = [
    { key: 'household', label: 'Household' },
    { key: 'budget', label: 'Budget' },
    { key: 'expense', label: 'First expense' },
];

export default function OnboardingLayout({ title, children, progress = {} }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Roznamcha Onboarding</p>
                        <h1 className="text-3xl font-bold">{title}</h1>
                    </div>
                    <Link
                        href={route('dashboard')}
                        className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                    >
                        Skip to dashboard →
                    </Link>
                </header>

                <nav className="mb-6 flex flex-wrap gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    {steps.map((step) => (
                        <div
                            key={step.key}
                            className="flex items-center gap-2 text-sm font-semibold text-slate-300"
                        >
                            <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                                    progress[step.key]
                                        ? 'bg-emerald-400/90 text-emerald-950'
                                        : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                {progress[step.key] ? '✓' : steps.findIndex((s) => s.key === step.key) + 1}
                            </span>
                            {step.label}
                        </div>
                    ))}
                </nav>

                <main className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
                    {children}
                </main>
            </div>
        </div>
    );
}

OnboardingLayout.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    progress: PropTypes.object,
};
