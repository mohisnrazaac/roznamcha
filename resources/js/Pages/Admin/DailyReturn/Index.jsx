import React from 'react';
import { useForm } from '@inertiajs/react';
import ControlRoomLayout from '../../../Layouts/ControlRoomLayout';

// Admin surface for editing the CMS copy behind the daily return hooks.
export default function DailyReturnIndex({ snapshot = {}, history = [], preview = {}, status = null }) {
    const form = useForm({
        snapshot_date: snapshot.snapshot_date ?? '',
        expense_summary_text: snapshot.expense_summary_text ?? '',
        inflation_status_text: snapshot.inflation_status_text ?? '',
        saving_tip_text: snapshot.saving_tip_text ?? '',
        today_update_line: snapshot.today_update_line ?? '',
        yesterday_change_line: snapshot.yesterday_change_line ?? '',
        kharcha_cta_label: snapshot.kharcha_cta_label ?? 'اپنا خرچ یہاں دیکھیں',
        kharcha_cta_url: snapshot.kharcha_cta_url ?? route('public.kharcha-map'),
        ration_cta_label: snapshot.ration_cta_label ?? 'اپنا ماہانہ بجٹ بنائیں',
        ration_cta_url: snapshot.ration_cta_url ?? route('public.ration-brain'),
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        form.post(route('admin.daily-return.snapshots.store'), {
            preserveScroll: true,
        });
    };

    return (
        <ControlRoomLayout active="daily-hooks">
            <div className="p-6 md:p-10 space-y-8">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin · Daily Hooks</p>
                    <h1 className="text-3xl font-semibold text-white">Daily Money Snapshot</h1>
                    <p className="text-sm text-slate-400">
                        Update the card copy that keeps visitors coming back—each field maps directly to the new homepage/blog hooks.
                    </p>
                </header>

                {status && (
                    <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {status}
                    </div>
                )}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-3">
                            <label className="text-sm text-slate-300">
                                Snapshot Date
                                <input
                                    type="date"
                                    value={form.data.snapshot_date}
                                    onChange={(event) => form.setData('snapshot_date', event.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                />
                                {form.errors.snapshot_date && (
                                    <p className="mt-1 text-xs text-red-300">{form.errors.snapshot_date}</p>
                                )}
                            </label>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Textarea
                                label="آج کا خرچ خلاصہ"
                                value={form.data.expense_summary_text}
                                onChange={(event) => form.setData('expense_summary_text', event.target.value)}
                                error={form.errors.expense_summary_text}
                            />
                            <Textarea
                                label="آج مہنگائی کا حال"
                                value={form.data.inflation_status_text}
                                onChange={(event) => form.setData('inflation_status_text', event.target.value)}
                                error={form.errors.inflation_status_text}
                            />
                            <Textarea
                                label="آج کی بچت کا موقع"
                                value={form.data.saving_tip_text}
                                onChange={(event) => form.setData('saving_tip_text', event.target.value)}
                                error={form.errors.saving_tip_text}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Textarea
                                label="آج کی تازہ صورتحال"
                                value={form.data.today_update_line}
                                onChange={(event) => form.setData('today_update_line', event.target.value)}
                                error={form.errors.today_update_line}
                            />
                            <Textarea
                                label="کل کیا بدلا"
                                value={form.data.yesterday_change_line}
                                onChange={(event) => form.setData('yesterday_change_line', event.target.value)}
                                error={form.errors.yesterday_change_line}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="CTA 1 label"
                                value={form.data.kharcha_cta_label}
                                onChange={(event) => form.setData('kharcha_cta_label', event.target.value)}
                                error={form.errors.kharcha_cta_label}
                            />
                            <Input
                                label="CTA 1 URL"
                                value={form.data.kharcha_cta_url}
                                onChange={(event) => form.setData('kharcha_cta_url', event.target.value)}
                                error={form.errors.kharcha_cta_url}
                            />
                            <Input
                                label="CTA 2 label"
                                value={form.data.ration_cta_label}
                                onChange={(event) => form.setData('ration_cta_label', event.target.value)}
                                error={form.errors.ration_cta_label}
                            />
                            <Input
                                label="CTA 2 URL"
                                value={form.data.ration_cta_url}
                                onChange={(event) => form.setData('ration_cta_url', event.target.value)}
                                error={form.errors.ration_cta_url}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex items-center rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
                            >
                                {form.processing ? 'Saving…' : 'Save snapshot'}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                        <h2 className="text-xl font-semibold text-white">Live Preview</h2>
                        <p className="text-sm text-slate-400">
                            This mirrors what the homepage/blog widget renders once the API responds.
                        </p>
                        <PreviewCard preview={preview} />
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                        <h2 className="text-xl font-semibold text-white">Recent History</h2>
                        <p className="text-sm text-slate-400">Review the last 30 entries for quick copy reuse.</p>
                        <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-2">
                            {history.map((item) => (
                                <article key={item.id} className="rounded-xl border border-slate-800/70 p-4 text-sm text-slate-200">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        {item.snapshot_date} · Updated {item.last_updated_at ?? '—'}
                                    </p>
                                    <p className="mt-2 font-semibold text-white">{item.expense_summary_text}</p>
                                    <p className="mt-1 text-slate-400">{item.inflation_status_text}</p>
                                    <p className="mt-1 text-slate-400">{item.saving_tip_text}</p>
                                    <p className="mt-2 text-slate-300">{item.today_update_line}</p>
                                    <p className="text-slate-500">{item.yesterday_change_line}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </ControlRoomLayout>
    );
}

function Textarea({ label, value, onChange, error }) {
    return (
        <label className="text-sm text-slate-300">
            {label}
            <textarea
                value={value}
                onChange={onChange}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
            {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
        </label>
    );
}

function Input({ label, value, onChange, error }) {
    return (
        <label className="text-sm text-slate-300">
            {label}
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
            {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
        </label>
    );
}

function PreviewCard({ preview }) {
    const snapshot = preview?.snapshot ?? {};
    const aiInsight = preview?.ai_insight;
    const streak = preview?.streak;
    const ctas = preview?.cta_links ?? [];

    return (
        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-slate-50 space-y-4">
            <div className="flex flex-wrap justify-between gap-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                <span>Daily Money Snapshot</span>
                <span>{snapshot.last_updated_label ? `Last updated: ${snapshot.last_updated_label}` : 'Draft'}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
                <CardLine title="آج کا خرچ خلاصہ" body={snapshot.expense_summary_text} />
                <CardLine title="آج مہنگائی کا حال" body={snapshot.inflation_status_text} />
                <CardLine title="آج کی بچت کا موقع" body={snapshot.saving_tip_text} />
            </div>
            <div className="rounded-xl border border-white/10 p-3 text-sm">
                <p className="font-semibold text-yellow-200">آج کی تازہ صورتحال</p>
                <p className="text-slate-200">{snapshot.today_update_line || '—'}</p>
                <p className="mt-2 font-semibold text-yellow-200">کل کیا بدلا</p>
                <p className="text-slate-200">{snapshot.yesterday_change_line || '—'}</p>
            </div>
            {aiInsight && (
                <p className="text-sm text-emerald-200">
                    <span className="font-semibold">{aiInsight.label}:</span> {aiInsight.text}
                </p>
            )}
            {streak && <p className="text-sm text-cyan-200">{streak.text}</p>}
            {ctas.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {ctas.map((cta) => (
                        <span key={cta.href} className="rounded-full border border-white/20 px-4 py-1 text-xs">
                            {cta.label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function CardLine({ title, body }) {
    return (
        <div className="rounded-xl border border-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{title}</p>
            <p className="mt-2 text-sm text-white">{body || '—'}</p>
        </div>
    );
}
