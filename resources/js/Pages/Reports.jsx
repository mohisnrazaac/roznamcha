import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';

export default function Reports({
  selectedMonth,
  report = {},
  history = [],
  spendingByCategory = {},
  flash = {},
}) {
  const [month, setMonth] = useState(selectedMonth ?? new Date().toISOString().slice(0, 7));

  const handleGenerate = (event) => {
    event.preventDefault();
    router.post(route('reports.generate'), { month }, { preserveScroll: true });
  };

  const totalSpend = report.total_spend ?? 0;
  const topCategories = Object.entries(report.top_categories ?? {});

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        {flash?.success && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {flash.success}
          </div>
        )}

        <div className="text-xs text-slate-500 mb-1">Home › Reports</div>
        <h1 className="text-xl font-bold text-slate-900">Reports</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleGenerate}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm space-y-4"
          >
            <div className="text-slate-900 text-sm font-semibold">Month</div>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
            />

            <div className="text-slate-900 text-sm font-semibold">Download</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Regenerate the monthly snapshot to capture the latest kharcha, ration, and reminders.
            </p>

            <button
              type="submit"
              className="bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow w-full"
            >
              Refresh Report
            </button>

            <div className="text-[11px] text-slate-500 leading-snug">
              Premium: Download Survival PDF (PKR 199)
            </div>

            <div className="mt-6">
              <div className="font-semibold text-slate-900 text-sm mb-2">Recent Reports</div>
              <ul className="space-y-2 text-xs text-slate-600">
                {history.length === 0 && <li>No history yet.</li>}
                {history.map((entry) => (
                  <li key={entry.month} className="flex items-center justify-between">
                    <span>{entry.month}</span>
                    <span className="font-semibold text-slate-900">
                      ₨ {entry.total_spend.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </form>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-slate-900 text-sm font-semibold">
                  {month} Household Summary
                </div>
                {report.generated_at && (
                  <div className="text-[11px] text-slate-500">
                    Generated {new Date(report.generated_at).toLocaleString()}
                  </div>
                )}
              </div>
              {report.ration_days_left_snapshot !== null && (
                <div className="text-[11px] font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-md">
                  Ration {report.ration_days_left_snapshot} days
                </div>
              )}
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase font-medium">Total Spend</div>
              <div className="text-2xl font-bold text-slate-900">
                ₨ {Number(totalSpend).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-900 text-sm mb-2">Top Categories</div>
              <div className="flex flex-wrap gap-2">
                {topCategories.length === 0 && (
                  <span className="text-xs text-slate-500">No spending captured.</span>
                )}
                {topCategories.map(([name, amount]) => (
                  <span
                    key={name}
                    className="text-[11px] bg-yellow-100 text-slate-800 rounded-md px-2 py-0.5 font-medium"
                  >
                    {name} • ₨ {Number(amount).toLocaleString()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-900 text-sm mb-2">
                Spending Breakdown
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {Object.entries(spendingByCategory).map(([name, amount]) => (
                  <li key={name} className="flex items-center justify-between">
                    <span>{name}</span>
                    <span className="font-semibold text-slate-900">
                      ₨ {Number(amount).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {report.warnings_text && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {report.warnings_text}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
