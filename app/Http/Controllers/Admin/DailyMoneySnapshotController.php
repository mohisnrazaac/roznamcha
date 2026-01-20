<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyMoneySnapshot;
use App\Services\DailyReturnHookService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Simple CMS surface for editing the copy that powers the daily hooks.
 */
class DailyMoneySnapshotController extends Controller
{
    public function index(DailyReturnHookService $service): Response
    {
        $today = now()->toDateString();

        $snapshot = DailyMoneySnapshot::query()
            ->where('snapshot_date', $today)
            ->first();

        $history = DailyMoneySnapshot::query()
            ->orderByDesc('snapshot_date')
            ->limit(30)
            ->get()
            ->map(fn (DailyMoneySnapshot $record) => [
                'id' => $record->id,
                'snapshot_date' => optional($record->snapshot_date)->toDateString(),
                'expense_summary_text' => $record->expense_summary_text,
                'inflation_status_text' => $record->inflation_status_text,
                'saving_tip_text' => $record->saving_tip_text,
                'today_update_line' => $record->today_update_line,
                'yesterday_change_line' => $record->yesterday_change_line,
                'last_updated_at' => optional($record->last_updated_at ?? $record->updated_at)->toDateTimeString(),
            ]);

        return Inertia::render('Admin/DailyReturn/Index', [
            'snapshot' => [
                'snapshot_date' => $snapshot?->snapshot_date?->toDateString() ?? $today,
                'expense_summary_text' => $snapshot?->expense_summary_text,
                'inflation_status_text' => $snapshot?->inflation_status_text,
                'saving_tip_text' => $snapshot?->saving_tip_text,
                'today_update_line' => $snapshot?->today_update_line,
                'yesterday_change_line' => $snapshot?->yesterday_change_line,
                'kharcha_cta_label' => $snapshot?->kharcha_cta_label,
                'kharcha_cta_url' => $snapshot?->kharcha_cta_url,
                'ration_cta_label' => $snapshot?->ration_cta_label,
                'ration_cta_url' => $snapshot?->ration_cta_url,
            ],
            'history' => $history,
            'preview' => $service->buildPayload(),
            'status' => session('status'),
        ]);
    }

    /**
     * Upsert keeps exactly one snapshot per date as per the CMS requirement.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'snapshot_date' => ['required', 'date'],
            'expense_summary_text' => ['nullable', 'string'],
            'inflation_status_text' => ['nullable', 'string'],
            'saving_tip_text' => ['nullable', 'string'],
            'today_update_line' => ['nullable', 'string'],
            'yesterday_change_line' => ['nullable', 'string'],
            'kharcha_cta_label' => ['nullable', 'string'],
            'kharcha_cta_url' => ['nullable', 'string'],
            'ration_cta_label' => ['nullable', 'string'],
            'ration_cta_url' => ['nullable', 'string'],
        ]);

        DailyMoneySnapshot::updateOrCreate(
            ['snapshot_date' => $data['snapshot_date']],
            array_merge(
                collect($data)->except('snapshot_date')->toArray(),
                ['last_updated_at' => now()]
            )
        );

        return back()->with('status', 'Daily snapshot updated.');
    }
}
