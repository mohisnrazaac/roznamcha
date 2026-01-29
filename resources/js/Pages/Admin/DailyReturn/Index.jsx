import React from 'react';
import { useForm } from '@inertiajs/react';
import ControlRoomLayout from '../../../Layouts/ControlRoomLayout';

// Cron builds Urdu copy at 12 AM while this admin surface offers a safe manual rerun for the Daily Return hook.
export default function DailyReturnIndex({ snapshot = {}, history = [], preview = {}, flash = null, next_run_at: nextRunAt = null }) {
    const form = useForm({});

    const handleManualFetch = (event) => {
        event.preventDefault();
        form.post(route('admin.daily-return.snapshots.store'), {
            preserveScroll: true,
        });
    };

    const fields = [
        { label: 'آج کا خرچ خلاصہ', value: snapshot.expense_summary_text },
        { label: 'آج مہنگائی کا حال', value: snapshot.inflation_status_text },
        { label: 'آج کی بچت کا موقع', value: snapshot.saving_tip_text },
        { label: 'آج کی تازہ صورتحال', value: snapshot.today_update_line },
        { label: 'کل کیا بدلا', value: snapshot.yesterday_change_line },
    ];

    const metadataEntries = Object.entries(snapshot.source_metadata ?? {});

    return (
        <ControlRoomLayout active="daily-hooks">
            <div className="p-6 md:p-10 space-y-8">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin · Daily Hooks</p>
                    <h1 className="text-3xl font-semibold text-white">Daily Money Snapshot Automation</h1>
                    <p className="text-sm text-slate-400">
                        رات ۱۲ بجے کا خودکار اسنیپ شاٹ returning users کو تازہ پاکستان ڈیٹا دیتا ہے، اور یہی صفحہ دستی رن کیلئے سیفٹی وال ہے۔
                    </p>
                </header>

                {flash && (
                    <div
                        className={`rounded-xl border px-4 py-3 text-sm ${
                            flash.type === 'error'
                                ? 'border-red-400/40 bg-red-500/10 text-red-200'
                                : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                        }`}
                    >
                        {flash.message}
                    </div>
                )}

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                    <p className="text-sm text-slate-400">
                        کرون ہر رات 12:05 AM (PKT) پر یہی سروس چلاتا ہے تاکہ صبح کا Daily Return کارڈ تازہ ڈیٹا دکھائے۔
                    </p>
                    <form onSubmit={handleManualFetch}>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
                        >
                            {form.processing ? 'Fetching…' : 'Fetch Today’s Snapshot Now'}
                        </button>
                    </form>
                    {nextRunAt && <p className="text-xs text-slate-500">Next auto run: {nextRunAt} (platform TZ)</p>}
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-white">Latest Snapshot</h2>
                        <p className="text-sm text-slate-400">
                            یہی لائنیں ہوم پیج پر جاتی ہیں؛ ہم انہیں ہاؤس ہولڈ اردو میں رکھتے ہیں تاکہ روزانہ واپسی آسان رہے۔
                        </p>
                        <div className="space-y-4">
                            {fields.map((field) => (
                                <article key={field.label} className="rounded-xl border border-slate-800/70 p-4">
                                    <p className="text-xs text-slate-500">{field.label}</p>
                                    <p className="mt-1 text-sm text-slate-100">{field.value ?? '—'}</p>
                                </article>
                            ))}
                        </div>
                        <div className="rounded-xl border border-slate-800/60 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Source metadata</p>
                            {metadataEntries.length === 0 && <p className="mt-1 text-sm text-slate-400">No data captured yet.</p>}
                            {metadataEntries.length > 0 && (
                                <dl className="mt-2 space-y-1 text-xs text-slate-400">
                                    {metadataEntries.map(([key, value]) => (
                                        <div key={key} className="flex justify-between gap-4">
                                            <dt className="uppercase tracking-wide text-slate-500">{key}</dt>
                                            <dd className="text-right text-slate-300">
                                                {typeof value === 'object' ? JSON.stringify(value) : value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-white">Live Preview</h2>
                        <p className="text-sm text-slate-400">یہی کارڈ عوامی Daily Return widget میں رینڈر ہوتا ہے۔</p>
                        <PreviewCard preview={preview} />
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h2 className="text-xl font-semibold text-white">Recent History</h2>
                    <p className="text-sm text-slate-400">کرون روزانہ ایک ہی ریکارڈ اپ ڈیٹ کرتا ہے لہٰذا یہ فہرست ڈپلیکیشن سے محفوظ رہتی ہے۔</p>
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
                        {history.length === 0 && <p className="text-sm text-slate-500">No automation runs captured yet.</p>}
                    </div>
                </section>
            </div>
        </ControlRoomLayout>
    );
}

function PreviewCard({ preview }) {
    const snapshot = preview?.snapshot ?? {};
    return (
        <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-b from-slate-900 to-slate-950 p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Daily Return</p>
            <h3 className="text-2xl font-semibold text-white">{snapshot.expense_summary_text ?? '—'}</h3>
            <p className="text-sm text-slate-400">{snapshot.inflation_status_text ?? '—'}</p>
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-300">
                <p>{snapshot.saving_tip_text ?? '—'}</p>
                <p className="mt-2 text-slate-400">{snapshot.today_update_line ?? '—'}</p>
                <p className="text-slate-500">{snapshot.yesterday_change_line ?? '—'}</p>
            </div>
        </div>
    );
}
