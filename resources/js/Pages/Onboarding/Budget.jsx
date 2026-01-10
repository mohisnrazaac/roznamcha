import React from 'react';
import { useForm } from '@inertiajs/react';
import OnboardingLayout from '../../Layouts/OnboardingLayout';

export default function Budget({ monthlyBudget = '', progress = {} }) {
    const form = useForm({
        monthly_budget: monthlyBudget ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('onboarding.budget.store'));
    };

    return (
        <OnboardingLayout title="Set your monthly budget" progress={progress}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="text-sm font-semibold text-slate-200">Monthly budget (PKR)</label>
                    <input
                        type="number"
                        min="0"
                        value={form.data.monthly_budget}
                        onChange={(event) => form.setData('monthly_budget', event.target.value)}
                        className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-lg text-white"
                        required
                    />
                    {form.errors.monthly_budget && (
                        <p className="mt-2 text-sm text-red-400">{form.errors.monthly_budget}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-60"
                >
                    {form.processing ? 'Saving…' : 'Continue to first expense'}
                </button>
            </form>
        </OnboardingLayout>
    );
}
