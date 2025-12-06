import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';

export default function KharchaMapList({
  expenses,
  filters = {},
  categories = [],
  flash = {},
}) {
  const [form, setForm] = useState({
    category: filters.category ?? '',
    search: filters.search ?? '',
    month: filters.month ?? '',
  });

  const rows = expenses?.data ?? [];
  const summary = expenses?.pagination ?? {};

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const submitFilters = (event) => {
    event.preventDefault();
    router.get(route('kharcha.map'), form, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const resetFilters = () => {
    const cleared = { category: '', search: '', month: '' };
    setForm(cleared);
    router.get(route('kharcha.map'), cleared, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this expense?')) {
      return;
    }

    router.delete(route('kharcha.destroy', id), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {flash?.success && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {flash.success}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Home › Kharcha Map</div>
            <h1 className="text-xl font-bold text-slate-900">Kharcha Map</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={route('kharcha.add')}
              className="bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow inline-flex items-center gap-2"
            >
              <span className="text-lg leading-none">＋</span>
              <span>Add Expense</span>
            </Link>
            <button
              type="button"
              className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white text-sm font-medium px-4 py-2 rounded-md shadow-sm"
              onClick={() => router.visit(route('kharcha.map'))}
            >
              Refresh
            </button>
          </div>
        </div>

        <form
          onSubmit={submitFilters}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm space-y-4"
        >
          <div className="text-slate-900 text-sm font-semibold">Filters</div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="month"
              name="month"
              value={form.month}
              onChange={handleFilterChange}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
              placeholder="Month"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleFilterChange}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="search"
              value={form.search}
              onChange={handleFilterChange}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
              placeholder="Search description"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="border border-slate-300 hover:border-slate-400 text-slate-700 bg-white text-sm font-medium px-4 py-2 rounded-md shadow-sm"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                  <th className="px-4 py-2 font-medium text-right">Amount</th>
                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-xs text-slate-500"
                    >
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}

                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 text-xs text-slate-700">
                    <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: row.category_color ?? '#CBD5F5' }}
                        />
                        {row.category ?? 'Uncategorised'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{row.description ?? '—'}</td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-900">
                      ₨ {row.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="text-[11px] text-red-500 hover:text-red-600 px-2 py-1 border border-red-200 rounded-md shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-[11px] text-slate-500">
            <div>
              Showing {rows.length} of {summary.total ?? rows.length} records
            </div>
            <div className="text-slate-400">
              Page {summary.current_page ?? 1} / {summary.last_page ?? 1}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
