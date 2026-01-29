<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyMoneySnapshot;
use App\Services\DailyMoneySnapshotService;
use App\Services\DailyReturnHookService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Admin surface that lets staff rerun the midnight Daily Money Snapshot automation without touching cron.
 * The same Urdu copy keeps the Daily Return widget sticky, so we only expose a manual override for operational safety.
 */
class DailyMoneySnapshotController extends Controller
{
    public function index(DailyReturnHookService $service): Response
    {
        $timezone = config('daily_snapshot.timezone', config('app.timezone'));

        $snapshot = DailyMoneySnapshot::query()
            ->orderByDesc('snapshot_date')
            ->first();

        $history = DailyMoneySnapshot::query()
            ->orderByDesc('snapshot_date')
            ->limit(14)
            ->get()
            ->map(fn (DailyMoneySnapshot $record) => [
                'id' => $record->id,
                'snapshot_date' => optional($record->snapshot_date)->toDateString(),
                'expense_summary_text' => $record->expense_summary_text,
                'inflation_status_text' => $record->inflation_status_text,
                'saving_tip_text' => $record->saving_tip_text,
                'today_update_line' => $record->today_update_line,
                'yesterday_change_line' => $record->yesterday_change_line,
                'source_metadata' => $record->source_metadata,
                'last_updated_at' => optional($record->last_updated_at ?? $record->updated_at)->toDateTimeString(),
            ]);

        $nextRun = now($timezone)
            ->startOfDay()
            ->addDay()
            ->setTime(0, (int) config('daily_snapshot.cron_minute', 5))
            ->setTimezone(config('app.timezone'));

        return Inertia::render('Admin/DailyReturn/Index', [
            'snapshot' => [
                'snapshot_date' => $snapshot?->snapshot_date?->toDateString(),
                'expense_summary_text' => $snapshot?->expense_summary_text,
                'inflation_status_text' => $snapshot?->inflation_status_text,
                'saving_tip_text' => $snapshot?->saving_tip_text,
                'today_update_line' => $snapshot?->today_update_line,
                'yesterday_change_line' => $snapshot?->yesterday_change_line,
                'source_metadata' => $snapshot?->source_metadata,
            ],
            'history' => $history,
            'preview' => $service->buildPayload(),
            'flash' => session('flash'),
            'next_run_at' => $nextRun->toDateTimeString(),
        ]);
    }

    /**
     * Manual trigger shares logic with cron so operators can recover failed 12 AM runs without duplicating effort.
     */
    public function store(DailyMoneySnapshotService $snapshotService): RedirectResponse
    {
        try {
            $snapshot = $snapshotService->generate();

            return back()->with('flash', [
                'type' => 'success',
                'message' => "آج کا اسنیپ شاٹ خودکار طور پر {$snapshot->snapshot_date?->toDateString()} کیلئے محفوظ ہو گیا۔",
            ]);
        } catch (Throwable $exception) {
            Log::error('Manual snapshot generation failed', ['error' => $exception->getMessage()]);

            return back()->with('flash', [
                'type' => 'error',
                'message' => 'API سے ڈیٹا نہیں ملا، براہ کرم لاگز چیک کریں۔',
            ]);
        }
    }
}
