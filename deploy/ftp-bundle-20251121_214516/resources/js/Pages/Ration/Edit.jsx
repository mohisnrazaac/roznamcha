import React from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function RationEdit({ item, priceHistory = [] }) {
  const { props } = usePage();
  const translations = props.translations ?? {};
  const ration = translations.ration ?? {};
  const commons = translations.commons ?? {};

  const form = useForm({
    name: item?.name ?? '',
    unit: item?.unit ?? 'kg',
    is_active: item?.is_active ?? true,
    initial_price: '',
    priced_at: new Date().toISOString().slice(0, 10),
  });

  const priceForm = useForm({
    price: '',
    priced_at: new Date().toISOString().slice(0, 10),
  });

  const isEditing = Boolean(item);

  const submit = (event) => {
    event.preventDefault();
    if (isEditing) {
      form.put(route('panel.ration.update', item.id), {
        preserveScroll: true,
      });
    } else {
      form.post(route('panel.ration.store'));
    }
  };

  const addPrice = (event) => {
    event.preventDefault();
    priceForm.post(route('panel.ration.prices.store', item.id), {
      preserveScroll: true,
      onSuccess: () => priceForm.reset('price'),
    });
  };

  return (
    <ControlRoomLayout active="ration" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-8">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Panel › Ration</p>
            <h1 className="text-2xl font-semibold">
              {isEditing ? ration.edit_item : ration.new_item}
            </h1>
            <p className="text-sm text-slate-400">{ration.subtitle}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-2">
            <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-4">
              {ration.edit_item}
            </h2>
            <form onSubmit={submit} className="space-y-4">
              <Field
                label={commons.item}
                value={form.data.name}
                onChange={(event) => form.setData('name', event.target.value)}
                error={form.errors.name}
              />
              <Field
                label={commons.unit}
                value={form.data.unit}
                onChange={(event) => form.setData('unit', event.target.value)}
                error={form.errors.unit}
              />
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.data.is_active}
                  onChange={(event) => form.setData('is_active', event.target.checked)}
                  className="rounded border-slate-400 text-[#003a8c] focus:ring-0"
                />
                {form.data.is_active ? translations.commons?.status_active : translations.commons?.status_inactive}
              </label>
              {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label={ration.latest_price}
                    type="number"
                    step="0.01"
                    value={form.data.initial_price}
                    onChange={(event) => form.setData('initial_price', event.target.value)}
                    error={form.errors.initial_price}
                  />
                  <Field
                    label={ration.last_updated}
                    type="date"
                    value={form.data.priced_at}
                    onChange={(event) => form.setData('priced_at', event.target.value)}
                    error={form.errors.priced_at}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={form.processing}
                className="rounded-xl bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
              >
                {form.processing ? '…' : translations.actions?.save}
              </button>
            </form>
          </section>

          {isEditing && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <h2 className="text-sm uppercase tracking-wide text-slate-400">
                {ration.add_price}
              </h2>
              <form onSubmit={addPrice} className="space-y-3">
                <Field
                  label={ration.latest_price}
                  type="number"
                  step="0.01"
                  value={priceForm.data.price}
                  onChange={(event) => priceForm.setData('price', event.target.value)}
                  error={priceForm.errors.price}
                />
                <Field
                  label={ration.last_updated}
                  type="date"
                  value={priceForm.data.priced_at}
                  onChange={(event) => priceForm.setData('priced_at', event.target.value)}
                  error={priceForm.errors.priced_at}
                />
                <button
                  type="submit"
                  disabled={priceForm.processing}
                  className="w-full rounded-xl border border-yellow-300 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-300/10 disabled:opacity-50"
                >
                  {priceForm.processing ? '…' : ration.add_price}
                </button>
              </form>

              <div>
                <h3 className="text-sm font-semibold text-slate-200 mb-2">{commons.history}</h3>
                <ul className="space-y-2 text-sm text-slate-300 max-h-64 overflow-y-auto">
                  {priceHistory.length === 0 && (
                    <li className="text-slate-500 text-xs">{ration.history_empty}</li>
                  )}
                  {priceHistory.map((price) => (
                    <li key={price.id} className="flex items-center justify-between">
                      <span>{price.priced_at}</span>
                      <span>{translations.commons?.currency ?? '₨'} {Number(price.price).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>
    </ControlRoomLayout>
  );
}

function Field({ label, error, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <input
        className="w-full rounded-lg border border-slate-500 bg-slate-950/30 px-3 py-2 text-sm text-white"
        {...rest}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
