import React from 'react';

export default function AiInsightCard({ title, description, status, children, variant = 'dark' }) {
  const wrapperClass =
    variant === 'light'
      ? 'rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm'
      : 'rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4';

  const titleClass = variant === 'light' ? 'text-slate-900' : 'text-white';
  const descriptionClass = variant === 'light' ? 'text-slate-500' : 'text-slate-400';
  const statusClass = variant === 'light' ? 'text-xs text-slate-400' : 'text-xs text-slate-500';
  const bodyTextClass = variant === 'light' ? 'text-slate-800' : 'text-slate-200';

  return (
    <section className={wrapperClass}>
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wide text-slate-400">AI Insight</p>
        <h2 className={`text-lg font-semibold ${titleClass}`}>{title}</h2>
        {description && <p className={`text-sm ${descriptionClass}`}>{description}</p>}
        {status && <p className={statusClass}>{status}</p>}
      </div>
      <div className={`space-y-2 text-sm ${bodyTextClass}`}>{children}</div>
    </section>
  );
}
