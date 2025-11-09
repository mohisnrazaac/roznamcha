import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router } from '@inertiajs/react';

export default function Ration({ items = [], flash = {} }) {
  const form = useForm({
    item_name: '',
    unit: '',
    stock_quantity: '',
    daily_usage: '',
    price_per_unit: '',
  });

  const submit = (event) => {
    event.preventDefault();
    form.post(route('ration.store'), {
      onSuccess: () =>
        form.reset('item_name', 'unit', 'stock_quantity', 'daily_usage', 'price_per_unit'),
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Remove this ration item?')) {
      return;
    }

    router.delete(route('ration.destroy', id), { preserveScroll: true });
  };

  const handleAdjust = (item) => {
    const updatedQuantity = window.prompt(
      `Update stock quantity for ${item.item_name}`,
      item.stock_quantity,
    );

    if (updatedQuantity === null) {
      return;
    }

    router.put(
      route('ration.update', item.id),
      {
        item_name: item.item_name,
        unit: item.unit ?? '',
        stock_quantity: updatedQuantity,
        daily_usage: item.daily_usage,
        price_per_unit: item.price_per_unit ?? '',
        notes: 'Adjusted via cockpit',
      },
      { preserveScroll: true },
    );
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
            <div className="text-xs text-slate-500 mb-1">Home › Ration Brain</div>
            <h1 className="text-xl font-bold text-slate-900">Ration Inventory</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
                No ration items yet. Add atta, sugar, oil to track days left.
              </div>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-slate-900 font-semibold text-sm">
                      {item.item_name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Stock {item.stock_quantity} {item.unit || ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjust(item)}
                      className="text-[11px] text-[#003a8c] border border-[#003a8c]/40 px-2 py-1 rounded-md"
                    >
                      Adjust
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-[11px] text-red-500 border border-red-200 px-2 py-1 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {item.daily_usage} {item.unit || ''}
                    </div>
                    <div className="text-slate-500">Daily usage</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {item.days_left ?? '∞'}
                    </div>
                    <div className="text-slate-500">Days left</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {item.price_per_unit ? `₨ ${item.price_per_unit}` : '—'}
                    </div>
                    <div className="text-slate-500">Price / unit</div>
                  </div>
                </div>

                {item.history?.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-2">
                    <div className="font-medium text-slate-900">Recent updates</div>
                    <ul className="space-y-1">
                      {item.history.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span>
                            {entry.change_date} • {entry.change_type.replace('_', ' ')}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {entry.change_type === 'consume' ? '-' : '+'}
                            {entry.quantity_change} {item.unit || ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm">
            <div className="font-semibold text-slate-900 mb-3">Add Item</div>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Item name
                </label>
                <input
                  type="text"
                  value={form.data.item_name}
                  onChange={(event) => form.setData('item_name', event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                />
                {form.errors.item_name && (
                  <p className="mt-1 text-[11px] text-red-500">{form.errors.item_name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={form.data.unit}
                    onChange={(event) => form.setData('unit', event.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                    placeholder="kg / litre"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Price per unit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.data.price_per_unit}
                    onChange={(event) => form.setData('price_per_unit', event.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                    placeholder="PKR"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Stock quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.data.stock_quantity}
                    onChange={(event) => form.setData('stock_quantity', event.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                  />
                  {form.errors.stock_quantity && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {form.errors.stock_quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Daily usage
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.data.daily_usage}
                    onChange={(event) => form.setData('daily_usage', event.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                  />
                  {form.errors.daily_usage && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {form.errors.daily_usage}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={form.processing}
                className="w-full bg-[#003a8c] hover:bg-[#002a66] disabled:bg-[#003a8c]/60 text-white font-semibold text-sm px-4 py-2 rounded-md shadow"
              >
                {form.processing ? 'Saving…' : 'Save Item'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
