<?php

namespace App\Services\Reports;

use App\Models\Expense;
use App\Models\Household;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class SurvivalReportService
{
    public function generate(User $user, Household $household, Carbon|string $month): string
    {
        $monthDate = $month instanceof Carbon ? $month->copy() : Carbon::parse($month);

        $rangeStart = $monthDate->copy()->startOfMonth();
        $rangeEnd = $monthDate->copy()->endOfMonth();

        $data = $this->aggregate($household, $rangeStart, $rangeEnd);

        $pdf = Pdf::loadView('reports.survival', [
            'user' => $user,
            'household' => $household,
            'monthLabel' => $monthDate->isoFormat('MMMM YYYY'),
            'data' => $data,
        ]);

        $path = sprintf(
            'reports/household-%s/survival-%s.pdf',
            $household->id,
            $rangeStart->format('Ym')
        );

        Storage::disk('public')->put($path, $pdf->output());

        return Storage::disk('public')->url($path);
    }

    protected function aggregate(Household $household, Carbon $start, Carbon $end): array
    {
        $expenses = Expense::query()
            ->forHousehold($household)
            ->whereBetween('tx_date', [$start->toDateString(), $end->toDateString()]);

        $total = (float) $expenses->sum('amount');
        $daysInMonth = $start->daysInMonth;
        $averageDaily = $daysInMonth ? round($total / $daysInMonth, 2) : 0;

        $previousStart = $start->copy()->subMonth()->startOfMonth();
        $previousEnd = $previousStart->copy()->endOfMonth();

        $previousTotal = Expense::query()
            ->forHousehold($household)
            ->whereBetween('tx_date', [$previousStart->toDateString(), $previousEnd->toDateString()])
            ->sum('amount');

        $trend = $previousTotal > 0
            ? round((($total - $previousTotal) / $previousTotal) * 100, 2)
            : null;

        $projection = round($averageDaily * $daysInMonth, 2);

        $breakdown = Expense::query()
            ->forHousehold($household)
            ->selectRaw('category_id, SUM(amount) as total_amount')
            ->whereBetween('tx_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('category_id')
            ->with('category')
            ->orderByDesc('total_amount')
            ->get()
            ->map(fn ($row) => [
                'category' => $row->category?->name ?? 'General',
                'amount' => (float) $row->total_amount,
            ]);

        return [
            'total' => $total,
            'average_daily' => $averageDaily,
            'previous_total' => (float) $previousTotal,
            'trend_percent' => $trend,
            'projection' => $projection,
            'breakdown' => $breakdown,
        ];
    }
}
