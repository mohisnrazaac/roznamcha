import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import OnboardingLayout from '../../Layouts/OnboardingLayout';

export default function FirstExpense({ categories = [], prefill = {}, progress = {}, defaultDate }) {
    const initialCategory = prefill?.category_id ?? categories[0]?.id ?? '';

    const form = useForm({
        category_id: initialCategory,
        amount: prefill?.amount ?? '',
        date: defaultDate,
        note: prefill?.note ?? '',
    });

    useEffect(() => {
        if (prefill?.category_id) {
            form.setData('category_id', prefill.category_id);
        }

        if (prefill?.amount) {
            form.setData('amount', prefill.amount);
        }

        if (prefill?.note) {
            form.setData('note', prefill.note);
        }
    }, [prefill, form]);

    const submit = (event) => {
        event.preventDefault();
        form.post(route('onboarding.first-expense.store'));
    };

    return (
        <OnboardingLayout title="Add your first expense" progress={progress}>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-semibold text-slate-200">Category</label>
                        <select
                            value={form.data.category_id}
                            onChange={(event) => form.setData('category_id', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-white"
                            required
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {form.errors.category_id && <p className="mt-2 text-sm text-red-400">{form.errors.category_id}</p>}
                        {prefill?.category_name && !prefill?.category_id && (
                            <p className="mt-2 text-xs text-yellow-400">
                                Tip: add a &ldquo;{prefill.category_name}&rdquo; category in Control Room later.
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-200">Amount (PKR)</label>
                        <input
                            type="number"
                            min="0"
                            value={form.data.amount}
                            onChange={(event) => form.setData('amount', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-lg text-white"
                            required
                        />
                        {form.errors.amount && <p className="mt-2 text-sm text-red-400">{form.errors.amount}</p>}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-semibold text-slate-200">Date</label>
                        <input
                            type="date"
                            value={form.data.date}
                            onChange={(event) => form.setData('date', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-white"
                            required
                        />
                        {form.errors.date && <p className="mt-2 text-sm text-red-400">{form.errors.date}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-200">Note (optional)</label>
                        <input
                            type="text"
                            value={form.data.note}
                            onChange={(event) => form.setData('note', event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-white"
                        />
                        {form.errors.note && <p className="mt-2 text-sm text-red-400">{form.errors.note}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-60"
                >
                    {form.processing ? 'Saving expense…' : 'Finish onboarding'}
                </button>
            </form>
        </OnboardingLayout>
    );
}
