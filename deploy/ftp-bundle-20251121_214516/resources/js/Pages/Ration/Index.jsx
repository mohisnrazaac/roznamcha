import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function RationIndex({ items = [] }) {
  const { props } = usePage();
  const translations = props.translations ?? {};
  const ration = translations.ration ?? {};
  const currency = translations.commons?.currency ?? '₨';

  return (
    <ControlRoomLayout active="ration" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Panel › Ration</p>
            <h1 className="text-2xl font-semibold">{ration.title}</h1>
            <p className="text-sm text-slate-400">{ration.subtitle}</p>
          </div>
          <Link
            href={route('panel.ration.create')}
            className="inline-flex items-center rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200"
          >
            {ration.new_item}
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">{ration.title}</th>
                <th className="px-4 py-3 text-left">{ration.latest_price}</th>
                <th className="px-4 py-3 text-left">{ration.last_month_price}</th>
                <th className="px-4 py-3 text-left">{ration.delta}</th>
                <th className="px-4 py-3 text-left">{ration.last_updated}</th>
                <th className="px-4 py-3 text-right">{translations.commons?.actions_label}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-100">
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                    {ration.empty}
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.unit}</p>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(item.latest_price, currency)}</td>
                  <td className="px-4 py-3 text-slate-300">{formatCurrency(item.last_month_price, currency)}</td>
                  <td className="px-4 py-3">
                    {item.delta_percent === null ? (
                      '—'
                    ) : (
                      <span className={item.delta_percent > 0 ? 'text-red-300' : 'text-emerald-300'}>
                        {item.delta_percent > 0 ? '+' : ''}
                        {item.delta_percent}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.latest_at ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                    <Link
                      href={route('panel.ration.edit', item.id)}
                      className="text-xs font-semibold text-yellow-300 hover:text-yellow-200"
                    >
                      {translations.actions?.edit}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </ControlRoomLayout>
  );
}

function formatCurrency(value, currency) {
  if (!value) return '—';
  return `${currency} ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}
