import React from 'react';
import { usePage, router } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function AiLogs({ logs, dailyTotals = [], dailyLimit = 20 }) {
  const { props } = usePage();
  const user = props.auth?.user;
  const entries = logs?.data ?? [];

  return (
    <ControlRoomLayout active="ai-logs" user={user}>
      <div className="p-6 md:p-10 text-white space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">Admin › AI Logs</p>
          <h1 className="text-2xl font-semibold">AI Usage Monitor</h1>
          <p className="text-sm text-slate-400">
            Free tier allows {dailyLimit} calls per user per day. Watch for quota spikes before upgrading.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Last 7 days total calls</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            {dailyTotals.length === 0 && <p className="text-slate-400">No AI activity recorded yet.</p>}
            {dailyTotals.map((entry) => (
              <div key={entry.date} className="rounded-xl bg-slate-800/60 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{entry.date}</p>
                <p className="text-xl font-semibold text-white">{entry.total}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Module</th>
                <th className="px-4 py-3 text-left">Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    No usage recorded yet.
                  </td>
                </tr>
              )}
              {entries.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-200">{log.used_on_date}</td>
                  <td className="px-4 py-3 text-slate-200">
                    {log.user ? (
                      <>
                        <div className="font-semibold text-white">{log.user.name}</div>
                        <div className="text-xs text-slate-400">{log.user.email}</div>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">{log.module}</td>
                  <td className="px-4 py-3 font-semibold text-white">{log.request_count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {logs?.links && logs.links.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 py-4 text-xs">
              {logs.links.map((link) =>
                link.url ? (
                  <button
                    key={link.label}
                    className={`px-3 py-1 rounded-lg ${
                      link.active ? 'bg-yellow-300 text-slate-900' : 'bg-slate-800 text-slate-200'
                    }`}
                    onClick={() => router.get(link.url, {}, { preserveScroll: true })}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ) : null
              )}
            </div>
          )}
        </section>
      </div>
    </ControlRoomLayout>
  );
}
