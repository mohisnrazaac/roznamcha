import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function KharchaIndex({ expenses, categories, filters = {}, totals = {} }) {
  const { props } = usePage();
  const translations = props.translations ?? {};
  const kharcha = translations.kharcha ?? {};
  const commons = translations.commons ?? {};
  const actions = translations.actions ?? {};

  const currency = commons.currency ?? '₨';

  const [form, setForm] = useState({
    from: filters.from ?? '',
    to: filters.to ?? '',
    category: filters.category ?? '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    router.get(route('panel.kharcha.index'), form, { preserveState: true, preserveScroll: true });
  };

  const clearFilters = () => {
    setForm({ from: '', to: '', category: '' });
    router.get(route('panel.kharcha.index'), {}, { preserveState: true, preserveScroll: true });
  };

  const rows = expenses?.data ?? [];

  return (
    <ControlRoomLayout active="kharcha" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Panel › Kharcha</p>
            <h1 className="text-2xl font-semibold">{kharcha.title}</h1>
            <p className="text-sm text-slate-400">{kharcha.subtitle}</p>
          </div>
          <Link
            href={route('panel.kharcha.create')}
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200"
          >
            {kharcha.add_expense}
          </Link>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label={kharcha.totals_month} value={totals.month} currency={currency} />
          <StatCard label={kharcha.totals_today} value={totals.today} currency={currency} />
          <StatCard label={kharcha.average_daily} value={totals.average_daily} currency={currency} />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <form onSubmit={applyFilters} className="space-y-4">
            <p className="text-sm font-semibold text-slate-200">{commons.filters}</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-slate-900">
              <input
                type="date"
                name="from"
                value={form.from}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder={commons.date_from}
              />
              <input
                type="date"
                name="to"
                value={form.to}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder={commons.date_to}
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">{commons.category}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#003a8c] px-3 py-2 text-sm font-semibold text-white"
                >
                  {actions.refresh}
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-slate-500 px-3 py-2 text-sm font-semibold text-slate-200"
                >
                  {actions.cancel}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
          <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div>
              <p className="text-sm font-semibold">{kharcha.list_title}</p>
              <p className="text-xs text-slate-500">({commons.currency})</p>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">{kharcha.tx_date}</th>
                  <th className="px-4 py-3 text-left">{commons.category}</th>
                  <th className="px-4 py-3 text-left">{commons.note}</th>
                  <th className="px-4 py-3 text-right">{commons.amount}</th>
                  <th className="px-4 py-3 text-right">{actions.edit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      {kharcha.no_rows}
                    </td>
                  </tr>
                )}
                {rows.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">{expense.tx_date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">{expense.category?.name ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{expense.note ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {currency} {Number(expense.amount ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={route('panel.kharcha.edit', expense.id)}
                        className="text-xs font-semibold text-yellow-300 hover:text-yellow-200"
                      >
                        {actions.edit}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-800 px-6 py-4 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Page {expenses?.current_page} / {expenses?.last_page}
            </span>
            <div className="space-x-2">
              {expenses?.links?.map((link) =>
                link.url ? (
                  <button
                    key={link.label}
                    className={`px-2 py-1 rounded ${
                      link.active ? 'bg-yellow-300 text-slate-900' : 'bg-slate-800 text-slate-200'
                    }`}
                    onClick={() => router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ) : null,
              )}
            </div>
          </div>
        </section>
      </div>
    </ControlRoomLayout>
  );
}

function StatCard({ label, value, currency }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">
        {currency} {Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}
