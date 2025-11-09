import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function RemindersIndex({ reminders = [], meta = {} }) {
  const { props } = usePage();
  const translations = props.translations ?? {};
  const rem = translations.reminders ?? {};
  const actions = translations.actions ?? {};

  const toggle = (id) => {
    router.post(route('panel.reminders.toggle', id), {}, { preserveScroll: true });
  };

  const destroy = (id) => {
    if (confirm('Delete reminder?')) {
      router.delete(route('panel.reminders.destroy', id), { preserveScroll: true });
    }
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
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => toggle(reminder.id)}
                    className={`rounded-lg px-3 py-1 font-semibold ${
                      reminder.is_active ? 'bg-emerald-400/20 text-emerald-200' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {reminder.is_active ? actions.disable : actions.enable}
                  </button>
                  <Link
                    href={route('panel.reminders.edit', reminder.id)}
                    className="rounded-lg bg-[#003a8c] px-3 py-1 font-semibold text-white"
                  >
                    {actions.edit}
                  </Link>
                  <button
                    type="button"
                    onClick={() => destroy(reminder.id)}
                    className="rounded-lg border border-red-400 px-3 py-1 font-semibold text-red-300"
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
