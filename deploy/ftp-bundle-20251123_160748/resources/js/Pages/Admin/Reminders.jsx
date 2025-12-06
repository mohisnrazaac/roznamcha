import React from 'react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function Reminders({ user, reminders = [] }) {
    return (
        <ControlRoomLayout active="reminders" user={user}>
            <div className="p-6 md:p-10 text-white space-y-8">
                <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Reminders / Health Guard</h1>
                        <p className="text-sm text-slate-400">
                            Keep medicine, school fees, utilities, and vehicle reminders in one cockpit.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Add Reminder
                    </button>
                </header>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 text-sm text-slate-300">
                        <span>Upcoming reminders</span>
                        <span className="text-xs text-slate-500">Health, school, bills, petrol</span>
                    </header>
                    <div className="divide-y divide-slate-800">
                        {reminders.length ? (
                            reminders.map((reminder) => (
                                <article key={reminder.id} className="flex items-center justify-between px-6 py-4">
                                    <div>
                                        <h3 className="font-semibold text-white">{reminder.title}</h3>
                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            {reminder.reminder_type}
                                        </p>
                                        <p className="text-sm text-slate-400">{reminder.notes ?? '—'}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div className="font-medium text-slate-200">{reminder.due_date ?? 'No due date'}</div>
                                        <div className="text-xs text-slate-500">{reminder.is_done ? 'Completed' : 'Pending'}</div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="px-6 py-10 text-center text-slate-400">
                                No reminders yet. Add a BP medicine dose, school fee, or petrol refill reminder.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </ControlRoomLayout>
    );
}
