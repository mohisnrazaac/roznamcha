<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use App\Models\Reminder;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $month = Carbon::now();

        $totals = $this->spendTotals($user);
        $breakdown = $this->categoryBreakdown($user);
        $recentActivity = $this->recentExpenses($user);
        $rationDaysLeft = null;
        $upcomingFees = $this->upcomingReminders($user);
        $health = $this->healthReminderSnapshot($user);

        return Inertia::render('Admin/Reports', [
            'user' => $user,
            'monthLabel' => $month->format('F Y'),
            'totalSpend' => (float) $totals['total_spend'],
            'rationDaysLeft' => $rationDaysLeft,
            'upcomingFees' => $upcomingFees,
            'health' => $health,
            'breakdown' => $breakdown,
            'recentActivity' => $recentActivity,
        ]);
    }

    protected function baseExpenseQuery($user)
    {
        $query = Expense::with('category');

        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    protected function spendTotals($user): array
    {
        $monthStart = Carbon::now()->startOfMonth()->toDateString();
        $monthEnd = Carbon::now()->endOfMonth()->toDateString();

        $dateColumn = $this->expenseDateColumn();

        $total = (clone $this->baseExpenseQuery($user))
            ->whereBetween($dateColumn, [$monthStart, $monthEnd])
            ->sum('amount');

        return ['total_spend' => $total];
    }

    protected function categoryBreakdown($user): array
    {
        $monthStart = Carbon::now()->startOfMonth()->toDateString();
        $monthEnd = Carbon::now()->endOfMonth()->toDateString();

        $dateColumn = $this->expenseDateColumn();

        $rows = (clone $this->baseExpenseQuery($user))
            ->select('category_id', DB::raw('SUM(amount) as total_amount'))
            ->whereBetween($dateColumn, [$monthStart, $monthEnd])
            ->groupBy('category_id')
            ->orderByDesc('total_amount')
            ->limit(5)
            ->get();

        if ($rows->isEmpty()) {
            return [
                ['name' => 'Ration', 'percent' => 38],
                ['name' => 'Fuel', 'percent' => 22],
                ['name' => 'School', 'percent' => 18],
                ['name' => 'Utilities', 'percent' => 14],
                ['name' => 'Other', 'percent' => 8],
            ];
        }

        $total = $rows->sum('total_amount') ?: 1;

        return $rows->map(function ($row) use ($total) {
            $category = $row->category_id ? Category::find($row->category_id) : null;
            return [
                'name' => $category?->name ?? 'Uncategorised',
                'percent' => (int) round(($row->total_amount / $total) * 100),
            ];
        })->toArray();
    }

    protected function recentExpenses($user): array
    {
        $dateColumn = $this->expenseDateColumn();

        return $this->baseExpenseQuery($user)
            ->orderByDesc($dateColumn)
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(function (Expense $entry) use ($dateColumn) {
                return [
                    'date' => optional($entry->{$dateColumn})->format('d M'),
                    'category' => $entry->category?->name ?? 'Other',
                    'description' => $entry->note ?? 'Expense',
                    'amount' => (float) $entry->amount,
                ];
            })
            ->toArray() ?: [
                ['date' => '26 Oct', 'category' => 'Ration', 'description' => 'Utility Store', 'amount' => 2150],
                ['date' => '25 Oct', 'category' => 'Fuel', 'description' => 'Refill', 'amount' => 3000],
                ['date' => '25 Oct', 'category' => 'School', 'description' => 'Fee Advance', 'amount' => 15000],
            ];
    }

    protected function upcomingReminders($user): array
    {
        $query = Reminder::query()->where('is_active', true);
        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $reminders = $query
            ->orderBy('starts_on')
            ->limit(3)
            ->get()
            ->map(function (Reminder $reminder) {
                return [
                    'label' => $reminder->title,
                    'due' => optional($reminder->starts_on)->format('j M') ?? 'Cron',
                ];
            })
            ->toArray();

        if (empty($reminders)) {
            $now = Carbon::now();
            $reminders = [
                ['label' => 'School Fee', 'due' => $now->copy()->addDays(7)->format('j M')],
                ['label' => 'Utility Bill', 'due' => $now->copy()->addDays(8)->format('j M')],
            ];
        }

        return $reminders;
    }

    protected function healthReminderSnapshot($user): array
    {
        $query = Reminder::query()->where('type', 'health');
        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $health = $query->orderBy('starts_on')->first();

        if (! $health) {
            return [
                'label' => 'BP Medicine',
                'status' => 'Today',
                'nextCheck' => '9:00 PM',
            ];
        }

        return [
            'label' => $health->title,
            'status' => $health->starts_on
                ? ($health->starts_on->isToday() ? 'Today' : $health->starts_on->diffForHumans())
                : 'Scheduled',
            'nextCheck' => $health->schedule_cron,
        ];
    }

    protected function expenseDateColumn(): string
    {
        static $column = null;

        if ($column === null) {
            $column = Schema::hasColumn('expenses', 'tx_date')
                ? 'tx_date'
                : (Schema::hasColumn('expenses', 'expense_date')
                    ? 'expense_date'
                    : (Schema::hasColumn('expenses', 'date') ? 'date' : 'tx_date'));
        }

        return $column;
    }
}
