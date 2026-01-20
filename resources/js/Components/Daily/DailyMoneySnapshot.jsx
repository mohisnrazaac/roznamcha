import React from 'react';
import PropTypes from 'prop-types';
import { useDailyReturnContent } from '../../hooks/useDailyReturnContent';

// Frontend widget that surfaces the CMS text, cached AI line, and streak to nudge daily visits.
export default function DailyMoneySnapshot({ variant = 'default', className = '' }) {
    const { data, loading, error } = useDailyReturnContent();
    const snapshot = data?.snapshot ?? null;
    const aiInsight = data?.ai_insight ?? null;
    const streak = data?.streak ?? null;

    if (error) {
        return (
            <div className={`rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 ${className}`}>
                {error}
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`animate-pulse rounded-3xl border border-slate-200 bg-white/80 p-5 ${className}`}>
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="h-20 rounded-2xl bg-slate-200" />
                    <div className="h-20 rounded-2xl bg-slate-200" />
                    <div className="h-20 rounded-2xl bg-slate-200" />
                </div>
            </div>
        );
    }

    if (!snapshot) {
        return null;
    }

    const containerStyles =
        variant === 'blog'
            ? 'rounded-3xl border border-slate-200 bg-white shadow-sm'
            : 'rounded-3xl border border-amber-200 bg-white/90 shadow-sm';

    const sections = [
        { title: 'آج کا خرچ خلاصہ', body: snapshot.expense_summary_text },
        { title: 'آج مہنگائی کا حال', body: snapshot.inflation_status_text },
        { title: 'آج کی بچت کا موقع', body: snapshot.saving_tip_text },
    ];

    return (
        <section className={`${containerStyles} ${className}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#001a4a]/80">Daily Money Snapshot</p>
                    <p className="text-base font-semibold text-[#001a4a]">Roznamcha فنانس واچ</p>
                </div>
                {snapshot.last_updated_label && (
                    <p className="text-xs font-semibold text-slate-500">
                        Last updated: {snapshot.last_updated_label}
                    </p>
                )}
            </div>

            <div className="grid gap-4 border-b border-slate-100 px-5 py-4 md:grid-cols-3">
                {sections.map((section) => (
                    <article key={section.title} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{section.title}</p>
                        <p className="mt-2 text-base text-[#001a4a]">{section.body || '—'}</p>
                    </article>
                ))}
            </div>

            <div className="space-y-4 px-5 py-5">
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-right font-semibold text-[#001a4a]">
                    <p className="text-sm text-slate-500">آج کی تازہ صورتحال</p>
                    <p className="text-lg">{snapshot.today_update_line || '—'}</p>
                    <p className="mt-4 text-sm text-slate-500">کل کیا بدلا</p>
                    <p className="text-lg">{snapshot.yesterday_change_line || '—'}</p>
                </div>

                {aiInsight && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-right">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                            {aiInsight.label}
                        </p>
                        <p className="mt-2 text-base text-emerald-900">{aiInsight.text}</p>
                    </div>
                )}

                {streak && (
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 text-right text-cyan-900">
                        {streak.text}
                    </div>
                )}
            </div>
        </section>
    );
}

DailyMoneySnapshot.propTypes = {
    variant: PropTypes.oneOf(['default', 'blog']),
    className: PropTypes.string,
};
