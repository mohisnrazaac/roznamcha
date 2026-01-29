// Purpose: Ration panel UX updates for multi-tenant scoping. Date: 2026-02-22. Author: Codex.

import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import { deleteResource } from '@/lib/inertia';
import AiInsightCard from '@/Components/AiInsightCard';
import { fetchAiInsight } from '@/ai';

export default function RationIndex({ items = [], users = [], filters = {} }) {
  const { props } = usePage();
  const translations = props.translations ?? {};
  const ration = translations.ration ?? {};
  const commons = translations.commons ?? {};
  const actions = translations.actions ?? {};
  const currency = commons?.currency ?? '₨';
  const editLabel = actions.edit ?? 'Edit';
  const deleteLabel = actions.delete ?? 'Delete';
  const deleteConfirm = actions.confirm_delete ?? 'Delete this ration item?';
  const actionsLabel = commons?.actions_label ?? editLabel ?? 'Actions';

  const role = (props.auth?.user?.role ?? '').toLowerCase();
  const isAdmin = role.includes('admin');

  const [aiState, setAiState] = useState({ loading: true, data: null, error: '' });
  const [selectedUser, setSelectedUser] = useState(filters.user_id ?? '');

  useEffect(() => {
    let active = true;

    const loadAi = async () => {
      try {
        const response = await fetchAiInsight('ration');
        if (active) {
          setAiState({ loading: false, data: response, error: '' });
        }
      } catch (error) {
        if (active) {
          setAiState({
            loading: false,
            data: error?.data ?? null,
            error: error?.data?.message ?? error.message ?? 'Unable to load AI insight.',
          });
        }
      }
    };

    loadAi();

    return () => {
      active = false;
    };
  }, []);

  const confirmDelete = (itemId) => {
    if (!window.confirm(deleteConfirm)) {
      return;
    }

    deleteResource(route('panel.ration.destroy', { ration: itemId }), {
      preserveScroll: true,
    });
  };

  const onFilterSubmit = (event) => {
    event.preventDefault();
    router.get(
      route('panel.ration.index'),
      selectedUser ? { user_id: selectedUser } : {},
      { preserveState: true, preserveScroll: true },
    );
  };

  const resetFilters = () => {
    setSelectedUser('');
    router.get(route('panel.ration.index'), {}, { preserveState: true, preserveScroll: true });
  };

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

        <AiInsightCard
          title="Ration Brain Alerts"
          description="Price spikes and grocery items to watch next."
          status={
            aiState.loading
              ? 'Checking ration prices...'
              : aiState.error
                ? aiState.error
                : ''
          }
        >
          {(aiState.data?.alerts ?? []).length === 0 && !aiState.loading && !aiState.error && (
            <p className="text-slate-200">No recent AI alerts. Keep logging ration prices for smarter trends.</p>
          )}

          {aiState.data?.alerts?.length > 0 && (
            <ul className="space-y-2">
              {aiState.data.alerts.map((alert, index) => (
                <li key={`${alert.item}-${index}`} className="rounded-lg bg-slate-800/70 px-3 py-2">
                  <p className="text-sm font-semibold text-white">{alert.item}</p>
                  <p className="text-xs text-slate-400">
                    Trend: {alert.trend} • Risk: {alert.risk}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AiInsightCard>

        {isAdmin && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <form onSubmit={onFilterSubmit} className="flex flex-col gap-3 text-slate-900 md:flex-row md:items-center">
              <label className="text-sm font-semibold text-slate-200" htmlFor="user_id">
                Filter by user
              </label>
              <select
                id="user_id"
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
                className="rounded-lg border border-slate-400 px-3 py-2 text-sm flex-1"
              >
                <option value="">All users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">{ration.title}</th>
                {isAdmin && <th className="px-4 py-3 text-left">User</th>}
                <th className="px-4 py-3 text-left">{ration.latest_price}</th>
                <th className="px-4 py-3 text-left">{ration.last_month_price}</th>
                <th className="px-4 py-3 text-left">{ration.delta}</th>
                <th className="px-4 py-3 text-left">{ration.last_updated}</th>
                <th className="px-4 py-3 text-right">{actionsLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-100">
              {items.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-4 py-6 text-center text-slate-500">
                    {ration.empty}
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      {item.unit}
                      {item.is_default && <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase">Default</span>}
                    </p>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-slate-300">
                      {item.owner ? (
                        <div>
                          <p className="font-semibold text-white">{item.owner.name}</p>
                          <p className="text-xs text-slate-400">{item.owner.email}</p>
                        </div>
                      ) : (
                        <span className="text-xs uppercase tracking-wide text-slate-500">Global</span>
                      )}
                    </td>
                  )}
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
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4 text-xs font-semibold">
                      <Link
                        href={route('panel.ration.edit', item.id)}
                        className={`text-yellow-300 hover:text-yellow-200 ${item.can_manage ? '' : 'pointer-events-none opacity-40'}`}
                        aria-disabled={!item.can_manage}
                      >
                        {editLabel}
                      </Link>
                      <button
                        type="button"
                        onClick={() => confirmDelete(item.id)}
                        className={`text-red-300 hover:text-red-200 ${item.can_manage ? '' : 'pointer-events-none opacity-40'}`}
                        disabled={!item.can_manage}
                      >
                        {deleteLabel}
                      </button>
                    </div>
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
