// Purpose: Reminders admin ownership UI + filters. Date: 2026-02-22. Author: Codex.

import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import { deleteResource } from '@/lib/inertia';
import AiInsightCard from '@/Components/AiInsightCard';
import { fetchAiInsight } from '@/ai';

export default function RemindersIndex({ reminders = [], meta = {}, filters = {}, users = [] }) {
  const { props } = usePage();
  const translations = props.translations ?? {};
  const rem = translations.reminders ?? {};
  const actions = translations.actions ?? {};
  const role = (props.auth?.user?.role ?? '').toLowerCase();
  const isAdmin = role.includes('admin');

  const [aiState, setAiState] = useState({ loading: true, data: null, error: '' });
  const [selectedUser, setSelectedUser] = useState(filters.user_id ?? '');

  useEffect(() => {
    let mounted = true;

    const loadAi = async () => {
      try {
        const response = await fetchAiInsight('reminder');
        if (mounted) {
          setAiState({ loading: false, data: response, error: '' });
        }
      } catch (error) {
        if (mounted) {
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
      mounted = false;
    };
  }, []);

  const toggle = (id) => {
    router.post(route('panel.reminders.toggle', id), {}, { preserveScroll: true });
  };

  const destroy = (id) => {
    if (confirm('Delete reminder?')) {
      deleteResource(route('panel.reminders.destroy', id), { preserveScroll: true });
    }
  };

  const applyFilter = (event) => {
    event.preventDefault();
    router.get(
      route('panel.reminders.index'),
      selectedUser ? { user_id: selectedUser } : {},
      { preserveState: true, preserveScroll: true },
    );
  };

  const resetFilter = () => {
    setSelectedUser('');
    router.get(route('panel.reminders.index'), {}, { preserveState: true, preserveScroll: true });
  };

  return (
    <ControlRoomLayout active="reminders" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-8">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400">Panel › Reminders</p>
            <h1 className="text-2xl font-semibold">{rem.title}</h1>
            <p className="text-sm text-slate-400">{rem.subtitle}</p>
          </div>
          <Link
            href={route('panel.reminders.create')}
            className="inline-flex items-center rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200"
          >
            {rem.new_reminder}
          </Link>
        </header>

        {isAdmin && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <form onSubmit={applyFilter} className="flex flex-col gap-3 md:flex-row md:items-center">
              <label htmlFor="reminder-user-filter" className="text-sm font-semibold text-slate-200">
                Filter by user
              </label>
              <select
                id="reminder-user-filter"
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
                className="flex-1 rounded-lg border border-slate-400 px-3 py-2 text-sm text-slate-900"
              >
                <option value="">All users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white">
                  Apply
                </button>
                <button
                  type="button"
                  onClick={resetFilter}
                  className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>
        )}

        <AiInsightCard
          title="Reminder Coach"
          description="Recurring kharcha the AI thinks deserves gentle nudges."
          status={
            aiState.loading
              ? 'Scanning reminders...'
              : aiState.error
                ? aiState.error
                : ''
          }
        >
          {(aiState.data?.suggestions ?? []).length === 0 && !aiState.loading && !aiState.error && (
            <p className="text-slate-200">Add reminders or record more kharcha to get AI suggestions.</p>
          )}

          {aiState.data?.suggestions?.length > 0 && (
            <ul className="space-y-2">
              {aiState.data.suggestions.map((suggestion, index) => (
                <li key={`${suggestion.title}-${index}`} className="rounded-lg bg-slate-800/70 px-3 py-2">
                  <p className="font-semibold text-white">{suggestion.title}</p>
                  <p className="text-xs text-slate-400">{suggestion.schedule}</p>
                </li>
              ))}
            </ul>
          )}
        </AiInsightCard>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="divide-y divide-slate-800">
            {reminders.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-500 text-sm">
                {rem.empty}
              </div>
            )}

            {reminders.map((reminder) => (
              <article key={reminder.id} className="px-6 py-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold">{reminder.title}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {labelForType(reminder.type, translations)} • {reminder.schedule_cron}
                  </p>
                  <p className="text-xs text-slate-500">
                    {translations.reminders?.next_email_label ?? 'Next email'}:{' '}
                    {reminder.next_run_display ?? 'calculating…'} ({reminder.timezone})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {reminder.starts_on ?? 'Start?'} → {reminder.ends_on ?? 'Open'}
                  </p>
                  {isAdmin && reminder.owner && (
                    <p className="text-[11px] text-slate-500">
                      Owner: {reminder.owner.name} ({reminder.owner.email})
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => toggle(reminder.id)}
                    className={`rounded-lg px-3 py-1 font-semibold ${
                      reminder.is_active ? 'bg-emerald-400/20 text-emerald-200' : 'bg-slate-800 text-slate-300'
                    } ${reminder.can_manage ? '' : 'pointer-events-none opacity-40'}`}
                    disabled={!reminder.can_manage}
                  >
                    {reminder.is_active ? actions.disable : actions.enable}
                  </button>
                  <Link
                    href={route('panel.reminders.edit', reminder.id)}
                    className={`rounded-lg bg-[#003a8c] px-3 py-1 font-semibold text-white ${
                      reminder.can_manage ? '' : 'pointer-events-none opacity-40'
                    }`}
                    >
                    {actions.edit}
                  </Link>
                  <button
                    type="button"
                    onClick={() => destroy(reminder.id)}
                    className={`rounded-lg border border-red-400 px-3 py-1 font-semibold text-red-300 ${
                      reminder.can_manage ? '' : 'pointer-events-none opacity-40'
                    }`}
                    disabled={!reminder.can_manage}
                  >
                    {actions.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ControlRoomLayout>
  );
}

function labelForType(type, translations) {
  const rem = translations.reminders ?? {};
  switch (type) {
    case 'finance':
      return rem.type_finance;
    case 'health':
      return rem.type_health;
    case 'faith':
      return rem.type_faith;
    default:
      return rem.type_other;
  }
}
