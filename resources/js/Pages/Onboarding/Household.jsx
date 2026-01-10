import React from 'react';
import { useForm } from '@inertiajs/react';
import OnboardingLayout from '../../Layouts/OnboardingLayout';

export default function Household({ householdName = '', progress = {} }) {
    const form = useForm({
        name: householdName ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post(route('onboarding.household.store'));
    };

    return (
        <OnboardingLayout title="Name your household" progress={progress}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="text-sm font-semibold text-slate-200">Household name</label>
                    <p className="text-xs text-slate-400">
                        Example: &ldquo;Imran &amp; Sara Family&rdquo; or &ldquo;Karachi Home&rdquo;
                    </p>
                    <input
                        type="text"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-lg text-white"
                        required
                    />
                    {form.errors.name && <p className="mt-2 text-sm text-red-400">{form.errors.name}</p>}
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-60"
                >
                    {form.processing ? 'Saving…' : 'Continue to budget'}
                </button>
            </form>
        </OnboardingLayout>
    );
}
