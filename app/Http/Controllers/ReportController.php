<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ReportCache;
use App\Models\RationItem;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display summary reports for the requested month.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $month = $request->input('month', now()->format('Y-m'));

        [$periodStart, $periodEnd] = $this->resolvePeriodBounds($month);

        $report = ReportCache::where('user_id', $user->id)
            ->where('period_start', $periodStart->toDateString())
            ->where('period_end', $periodEnd->toDateString())
            ->first();

        if (! $report) {
            $reportData = $this->buildReportPayload($user->id, $periodStart, $periodEnd);
        } else {
            $reportData = [
                'total_spend' => (float) $report->total_spend,
                'top_categories' => $report->top_categories_json ?? [],
                'ration_days_left_snapshot' => $report->ration_days_left_snapshot,
                'warnings_text' => $report->warnings_text,
                'generated_at' => optional($report->generated_at)->toDateTimeString(),
            ];
        }

        $history = ReportCache::where('user_id', $user->id)
            ->orderByDesc('period_start')
            ->limit(6)
            ->get()
            ->map(fn (ReportCache $cached) => [
                'month' => Carbon::parse($cached->period_start)->format('Y-m'),
                'total_spend' => (float) $cached->total_spend,
            ]);

        $spendingByCategory = $this->categoryBreakdown($user->id, $periodStart, $periodEnd);

        return Inertia::render('Reports', [
            'selectedMonth' => $month,
            'report' => $reportData,
            'history' => $history,
            'spendingByCategory' => $spendingByCategory,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Regenerate the cached report for a given month.
     */
    public function generate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
        ]);

        $user = $request->user();
        [$periodStart, $periodEnd] = $this->resolvePeriodBounds($validated['month']);

        $payload = $this->buildReportPayload($user->id, $periodStart, $periodEnd);

        ReportCache::updateOrCreate(
            [
                'user_id' => $user->id,
                'period_start' => $periodStart->toDateString(),
                'period_end' => $periodEnd->toDateString(),
            ],
            [
                'total_spend' => $payload['total_spend'],
                'top_categories_json' => $payload['top_categories'],
                'ration_days_left_snapshot' => $payload['ration_days_left_snapshot'],
                'warnings_text' => $payload['warnings_text'],
                'generated_at' => now(),
            ]
        );

        return redirect()
            ->route('reports.main', ['month' => $validated['month']])
            ->with('success', 'Report refreshed.');
    }

    /**
     * Collect dynamic report data from live tables.
     */
    protected function buildReportPayload(int $userId, Carbon $start, Carbon $end): array
    {
        $expenses = Expense::with('category')
            ->where('user_id', $userId)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get();

        $totalSpend = $expenses->sum('amount');

        $topCategories = $expenses
            ->groupBy(fn (Expense $expense) => optional($expense->category)->name ?? 'Uncategorised')
            ->map(fn ($group) => $group->sum('amount'))
            ->sortDesc()
            ->take(5)
            ->map(fn ($amount) => (float) $amount)
            ->all();

        $daysLeft = RationItem::where('user_id', $userId)
            ->get()
            ->map(function (RationItem $item) {
                if ($item->daily_usage <= 0) {
                    return null;
                }

                return (int) floor($item->stock_quantity / max($item->daily_usage, 0.0001));
            })
            ->filter()
            ->min();

        $warnings = $daysLeft && $daysLeft < 7
            ? 'Ration stock will finish in under a week.'
            : null;

        return [
            'total_spend' => (float) $totalSpend,
            'top_categories' => $topCategories,
            'ration_days_left_snapshot' => $daysLeft,
            'warnings_text' => $warnings,
            'generated_at' => now()->toDateTimeString(),
        ];
    }

    /**
     * Return category totals for the period.
     */
    protected function categoryBreakdown(int $userId, Carbon $start, Carbon $end): array
    {
        $expenses = Expense::with('category')
            ->where('user_id', $userId)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get();

        return $expenses
            ->groupBy(fn (Expense $expense) => optional($expense->category)->name ?? 'Uncategorised')
            ->map(fn ($group) => (float) $group->sum('amount'))
            ->toArray();
    }

    /**
     * Resolve Carbon period bounds from YYYY-MM format.
     */
    protected function resolvePeriodBounds(string $month): array
    {
        $periodStart = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $periodEnd = (clone $periodStart)->endOfMonth();

        return [$periodStart, $periodEnd];
    }
}
