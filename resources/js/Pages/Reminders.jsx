import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm, router } from '@inertiajs/react';

export default function Reminders({ reminders = [], meta = {}, flash = {} }) {
  const form = useForm({
    type: 'bill',
    title: '',
    description: '',
    next_due: '',
    frequency: 'monthly',
  });

  const submit = (event) => {
    event.preventDefault();
    form.post(route('reminders.store'), {
      onSuccess: () => form.reset('title', 'description', 'next_due'),
    });
  };

  const toggleStatus = (reminder) => {
    router.put(
      route('reminders.update', reminder.id),
      {
        type: reminder.type,
        title: reminder.title,
        description: reminder.description ?? '',
        next_due: reminder.next_due ?? '',
        frequency: reminder.frequency,
        status: reminder.status === 'done' ? 'pending' : 'done',
      },
      { preserveScroll: true },
    );
  };

  const deleteReminder = (id) => {
    if (!window.confirm('Delete this reminder?')) {
      return;
    }

    router.delete(route('reminders.destroy', id), { preserveScroll: true });
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
            <div className="text-xs text-slate-500 mb-1">Home › Reminders</div>
            <h1 className="text-xl font-bold text-slate-900">Reminders</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {reminders.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
                No reminders yet. Add KE bill, school fee or medicine alerts.
              </div>
            )}

            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {reminder.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {meta.types?.[reminder.type] ?? reminder.type} •{' '}
                      {reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStatus(reminder)}
                      className={`text-[11px] px-2 py-1 rounded-md border ${
                        reminder.status === 'done'
                          ? 'border-emerald-200 text-emerald-600'
                          : 'border-slate-300 text-slate-600'
                      }`}
                    >
                      {reminder.status === 'done' ? 'Mark pending' : 'Mark done'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-[11px] text-red-500 border border-red-200 px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {reminder.description && (
                  <div className="text-xs text-slate-600">{reminder.description}</div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div>
                    Next due:{' '}
                    {reminder.next_due
                      ? new Date(reminder.next_due).toLocaleString()
                      : 'not set'}
                  </div>
                  <div className="font-semibold text-slate-900">
                    Status: {reminder.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm">
            <div className="font-semibold text-slate-900 mb-3">Add reminder</div>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Type
                </label>
                <select
                  value={form.data.type}
                  onChange={(event) => form.setData('type', event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                >
                  {Object.entries(meta.types ?? {}).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {form.errors.type && (
                  <p className="mt-1 text-[11px] text-red-500">{form.errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form.data.title}
                  onChange={(event) => form.setData('title', event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                  placeholder="KE Bill"
                />
                {form.errors.title && (
                  <p className="mt-1 text-[11px] text-red-500">{form.errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.data.description}
                  onChange={(event) => form.setData('description', event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                  placeholder="Short note"
                />
                {form.errors.description && (
                  <p className="mt-1 text-[11px] text-red-500">
                    {form.errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Next due
                </label>
                <input
                  type="datetime-local"
                  value={form.data.next_due}
                  onChange={(event) => form.setData('next_due', event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                />
                {form.errors.next_due && (
                  <p className="mt-1 text-[11px] text-red-500">{form.errors.next_due}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Frequency
                </label>
                <select
                  value={form.data.frequency}
                  onChange={(event) => form.setData('frequency', event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                >
                  {(meta.frequencies ?? []).map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                    </option>
                  ))}
                </select>
                {form.errors.frequency && (
                  <p className="mt-1 text-[11px] text-red-500">{form.errors.frequency}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={form.processing}
                className="w-full bg-[#003a8c] hover:bg-[#002a66] disabled:bg-[#003a8c]/60 text-white font-semibold text-sm px-4 py-2 rounded-md shadow"
              >
                {form.processing ? 'Saving…' : 'Add Reminder'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
