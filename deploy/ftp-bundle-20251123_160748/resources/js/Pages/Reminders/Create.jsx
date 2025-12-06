import React from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import CronPresetPicker from '@/Components/CronPresetPicker';

export default function ReminderCreate({ types = [], reminder = null }) {
  const { props } = usePage();
  const translations = props.translations ?? {};
  const rem = translations.reminders ?? {};
  const commons = translations.commons ?? {};

  const form = useForm({
    title: reminder?.title ?? '',
    type: reminder?.type ?? types[0] ?? 'finance',
    schedule_cron: reminder?.schedule_cron ?? '0 20 * * *',
    starts_on: reminder?.starts_on ?? '',
    ends_on: reminder?.ends_on ?? '',
    timezone: reminder?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    is_active: reminder?.is_active ?? true,
    notes: reminder?.notes ?? '',
  });

  const submit = (event) => {
    event.preventDefault();
    const routeName = reminder ? 'panel.reminders.update' : 'panel.reminders.store';
    const method = reminder ? form.put : form.post;
    method(route(routeName, reminder?.id), { preserveScroll: true });
  };

  return (
    <ControlRoomLayout active="reminders" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-6 max-w-3xl">
        <header>
          <p className="text-xs uppercase tracking-wide text-slate-400">Panel › Reminders</p>
          <h1 className="text-2xl font-semibold">
            {reminder ? rem.edit_reminder ?? 'Edit reminder' : rem.new_reminder}
          </h1>
          <p className="text-sm text-slate-400">{rem.subtitle}</p>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <form onSubmit={submit} className="space-y-4">
            <Field
              label={commons.title}
              value={form.data.title}
              onChange={(event) => form.setData('title', event.target.value)}
              error={form.errors.title}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{commons.type}</label>
                <select
                  value={form.data.type}
                  onChange={(event) => form.setData('type', event.target.value)}
                  className="w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {form.errors.type && <p className="text-xs text-red-400 mt-1">{form.errors.type}</p>}
              </div>
              <Field
                label={commons.timezone}
                value={form.data.timezone}
                onChange={(event) => form.setData('timezone', event.target.value)}
                error={form.errors.timezone}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{commons.cron}</label>
              <CronPresetPicker
                value={form.data.schedule_cron}
                onChange={(cron) => form.setData('schedule_cron', cron)}
                error={form.errors.schedule_cron}
                hint={rem.schedule_hint}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label={commons.starts_on}
                type="date"
                value={form.data.starts_on}
                onChange={(event) => form.setData('starts_on', event.target.value)}
                error={form.errors.starts_on}
              />
              <Field
                label={commons.ends_on}
                type="date"
                value={form.data.ends_on}
                onChange={(event) => form.setData('ends_on', event.target.value)}
                error={form.errors.ends_on}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{commons.note}</label>
              <textarea
                rows={3}
                value={form.data.notes}
                onChange={(event) => form.setData('notes', event.target.value)}
                className="w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
              />
              {form.errors.notes && <p className="text-xs text-red-400 mt-1">{form.errors.notes}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={form.data.is_active}
                onChange={(event) => form.setData('is_active', event.target.checked)}
                className="rounded border-slate-400 text-[#003a8c] focus:ring-0"
              />
              {form.data.is_active ? translations.commons?.status_active : translations.commons?.status_inactive}
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={form.processing}
                className="rounded-xl bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
              >
                {form.processing ? '…' : translations.actions?.save}
              </button>
              <button
                type="button"
                className="text-sm text-slate-400 hover:text-white"
                onClick={() => router.visit(route('panel.reminders.index'))}
              >
                {translations.actions?.cancel}
              </button>
            </div>
          </form>
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
        className="w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
        {...rest}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
