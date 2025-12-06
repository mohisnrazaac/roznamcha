import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router } from '@inertiajs/react';

export default function AddExpenseForm({ categories = [] }) {
  const form = useForm({
    date: new Date().toISOString().slice(0, 10),
    category_id: '',
    description: '',
    amount: '',
    receipt_path: '',
  });

  const submit = (event) => {
    event.preventDefault();
    form.post(route('kharcha.store'));
  };

  const cancel = () => {
    router.visit(route('kharcha.map'));
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Add Expense</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Track where money went so end of month is not a shock.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.data.date}
                onChange={(event) => form.setData('date', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
              />
              {form.errors.date && (
                <p className="mt-1 text-[11px] text-red-500">{form.errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={form.data.category_id}
                onChange={(event) => form.setData('category_id', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {form.errors.category_id && (
                <p className="mt-1 text-[11px] text-red-500">
                  {form.errors.category_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Amount (PKR)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.data.amount}
                onChange={(event) => form.setData('amount', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="0.00"
              />
              {form.errors.amount && (
                <p className="mt-1 text-[11px] text-red-500">{form.errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Notes / Shop Name
              </label>
              <input
                type="text"
                value={form.data.description}
                onChange={(event) => form.setData('description', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="Enter notes or shop"
              />
              {form.errors.description && (
                <p className="mt-1 text-[11px] text-red-500">
                  {form.errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Receipt (URL)
              </label>
              <input
                type="text"
                value={form.data.receipt_path}
                onChange={(event) => form.setData('receipt_path', event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                placeholder="Optional file path or link"
              />
              {form.errors.receipt_path && (
                <p className="mt-1 text-[11px] text-red-500">
                  {form.errors.receipt_path}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={form.processing}
                className="bg-[#003a8c] hover:bg-[#002a66] disabled:bg-[#003a8c]/60 text-white font-semibold text-sm px-4 py-2 rounded-md shadow"
              >
                {form.processing ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white text-sm font-medium px-4 py-2 rounded-md shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
