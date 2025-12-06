import React from 'react';

export default function ExpenseForm({ form, categories = [], onSubmit, onCancel, translations }) {
  const t = translations ?? {};
  const commons = t.commons ?? {};
  const actions = t.actions ?? {};
  const kharcha = t.kharcha ?? {};

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          {commons.amount}
        </label>
        <input
          type="number"
          step="0.01"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
          value={form.data.amount}
          onChange={(event) => form.setData('amount', event.target.value)}
          placeholder="0.00"
        />
        {form.errors.amount && (
          <p className="text-xs text-red-500 mt-1">{form.errors.amount}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          {kharcha.tx_date}
        </label>
        <input
          type="date"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          value={form.data.tx_date}
          onChange={(event) => form.setData('tx_date', event.target.value)}
        />
        {form.errors.tx_date && (
          <p className="text-xs text-red-500 mt-1">{form.errors.tx_date}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          {commons.category}
        </label>
        <select
          value={form.data.category_id}
          onChange={(event) => form.setData('category_id', event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        >
          <option value="">—</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {form.errors.category_id && (
          <p className="text-xs text-red-500 mt-1">{form.errors.category_id}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          {commons.note}
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
          value={form.data.note}
          onChange={(event) => form.setData('note', event.target.value)}
          placeholder="Utility Store, BP tablets…"
        />
        {form.errors.note && (
          <p className="text-xs text-red-500 mt-1">{form.errors.note}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={form.processing}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#002b5b] disabled:opacity-50"
        >
          {form.processing ? '…' : actions.save}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          {actions.cancel}
        </button>
      </div>
    </form>
  );
}
