import React from 'react';

const KPI_DEFS = [
  {
    key: 'total_spend',
    label: 'Monthly Spend',
    className: 'text-yellow-400',
    format: (value) => `₨ ${value?.toLocaleString?.() ?? value ?? '—'}`,
  },
  {
    key: 'top_category',
    label: 'Top Burn',
    className: 'text-white',
  },
  {
    key: 'alerts_due',
    label: 'Alerts Due',
    className: 'text-white',
  },
  {
    key: 'inflation_items',
    label: 'Items Got Costly',
    className: 'text-red-400',
  },
];

const BADGE_STYLE = {
  kharcha: { backgroundColor: '#1E3A8A', color: '#ffffff' }, // deep blue
  ration: { backgroundColor: '#FACC15', color: '#000000' }, // yellow
  reminder: { backgroundColor: '#000000', color: '#ffffff' }, // black
  reports: { backgroundColor: '#0EA5E9', color: '#022C4B' }, // electric blue
};

export default function Dashboard({ summary = {}, modules = [] }) {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold md:text-2xl">
            Roznamcha Dashboard
          </h1>
          <p className="text-xs text-slate-400 md:text-sm">
            Household cockpit · {summary.month}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:justify-end">
          {KPI_DEFS.map(({ key, label, className, format }) => (
            <div
              key={key}
              className="rounded-xl bg-slate-800/80 border border-slate-700/60 px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
            >
              <div className="text-[11px] uppercase tracking-wide text-slate-400 leading-none">
                {label}
              </div>
              <div className={`mt-2 text-sm font-semibold md:text-base ${className}`}>
                {format ? format(summary[key]) : summary[key] ?? '—'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 md:mt-10">
        <h2 className="mb-3 text-[11px] uppercase tracking-wide text-slate-400">
          Your Tools
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => {
            const badge = BADGE_STYLE[module.slug] ?? BADGE_STYLE.kharcha;

            return (
              <a
                key={module.slug}
                href={module.route || '#'}
                className="relative flex min-h-[150px] flex-col rounded-xl border border-slate-700/60 bg-slate-800/80 p-4 shadow-[0_16px_32px_rgba(0,0,0,0.6)] transition hover:border-slate-600 hover:bg-slate-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[15px] font-semibold leading-tight">
                      {module.name}
                    </div>
                    <div className="mt-1 text-[13px] leading-snug text-slate-400">
                      {module.desc}
                    </div>
                  </div>

                  <div
                    className="rounded-lg px-2 py-1 text-[11px] font-bold leading-none"
                    style={badge}
                  >
                    {(module.slug ?? '').toUpperCase().slice(0, 2)}
                  </div>
                </div>

                <div className="mt-auto pt-6 text-[12px] font-medium text-slate-300 transition group-hover:text-white">
                  <span className="inline-flex items-center gap-1">
                    Open <span aria-hidden>→</span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
