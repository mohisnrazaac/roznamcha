<?php

namespace App\Http\Controllers;

use App\Models\KharchaEntry;
use App\Models\Reminder;
use App\Models\RationEntry;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $recentActivity = $this->recentKharcha($user);
        $rationDaysLeft = $this->rationDaysLeft($user);
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

    protected function baseKharchaQuery($user)
    {
        $query = KharchaEntry::with('category');

        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    protected function spendTotals($user): array
    {
        $monthStart = Carbon::now()->startOfMonth()->toDateString();
        $monthEnd = Carbon::now()->endOfMonth()->toDateString();

        $total = (clone $this->baseKharchaQuery($user))
            ->whereBetween('date', [$monthStart, $monthEnd])
            ->sum('amount');

        return ['total_spend' => $total];
    }

    protected function categoryBreakdown($user): array
    {
        $monthStart = Carbon::now()->startOfMonth()->toDateString();
        $monthEnd = Carbon::now()->endOfMonth()->toDateString();

        $rows = (clone $this->baseKharchaQuery($user))
            ->select('category_id', DB::raw('SUM(amount) as total_amount'))
            ->whereBetween('date', [$monthStart, $monthEnd])
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

    protected function recentKharcha($user): array
    {
        return $this->baseKharchaQuery($user)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(function (KharchaEntry $entry) {
                return [
                    'date' => optional($entry->date)->format('d M'),
                    'category' => $entry->category?->name ?? 'Other',
                    'description' => $entry->vendor ?? $entry->notes ?? 'Expense',
                    'amount' => (float) $entry->amount,
                ];
            })
            ->toArray() ?: [
                ['date' => '26 Oct', 'category' => 'Ration', 'description' => 'Utility Store', 'amount' => 2150],
                ['date' => '25 Oct', 'category' => 'Fuel', 'description' => 'Refill', 'amount' => 3000],
                ['date' => '25 Oct', 'category' => 'School', 'description' => 'Fee Advance', 'amount' => 15000],
            ];
    }

    protected function rationDaysLeft($user): ?int
    {
        $query = RationEntry::query();
        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $days = $query
            ->whereNotNull('days_left_estimate')
            ->orderBy('days_left_estimate')
            ->value('days_left_estimate');

        return $days ?? 9;
    }

    protected function upcomingReminders($user): array
    {
        $query = Reminder::query();
        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $now = Carbon::now();

        $reminders = $query
            ->where('is_done', false)
            ->orderBy('due_date')
            ->limit(3)
            ->get()
            ->map(function (Reminder $reminder) {
                return [
                    'label' => $reminder->title,
                    'due' => optional($reminder->due_date)->format('j M') ?? 'Soon',
                ];
            })
            ->toArray();

        if (empty($reminders)) {
            $reminders = [
                ['label' => 'School Fee', 'due' => $now->copy()->addDays(7)->format('j M')],
                ['label' => 'HE Bill', 'due' => $now->copy()->addDays(8)->format('j M')],
            ];
        }

        return $reminders;
    }

    protected function healthReminderSnapshot($user): array
    {
        $query = Reminder::query();
        if (! $user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }

        $health = $query
            ->where('reminder_type', 'health')
            ->orderBy('due_date')
            ->first();

        if (! $health) {
            return [
                'label' => 'BP Medicine',
                'status' => 'Today',
                'nextCheck' => '9:00 PM',
            ];
        }

        return [
            'label' => $health->title,
            'status' => $health->due_date
                ? ($health->due_date->isToday() ? 'Today' : $health->due_date->diffForHumans())
                : 'Scheduled',
            'nextCheck' => $health->due_date ? $health->due_date->format('g:i A') : '—',
        ];
    }
}
