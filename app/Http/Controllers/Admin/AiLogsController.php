<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiUsageLog;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class AiLogsController extends Controller
{
    public function index(): Response
    {
        if (! Schema::hasTable('ai_usage_logs')) {
            return Inertia::render('Admin/AiLogs', [
                'logs' => [
                    'data' => [],
                    'links' => [],
                ],
                'dailyTotals' => [],
                'dailyLimit' => config('ai.daily_limit', 20),
            ]);
        }

        $logs = AiUsageLog::query()
            ->with('user:id,name,email')
            ->orderByDesc('used_on_date')
            ->orderByDesc('id')
            ->paginate(20)
            ->through(fn (AiUsageLog $log) => [
                'id' => $log->id,
                'module' => $log->module,
                'used_on_date' => optional($log->used_on_date)->toDateString(),
                'request_count' => $log->request_count,
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
            ]);

        $dailyTotals = AiUsageLog::query()
            ->selectRaw('used_on_date, SUM(request_count) as total')
            ->groupBy('used_on_date')
            ->orderByDesc('used_on_date')
            ->limit(7)
            ->get()
            ->map(function ($row) {
                $dateValue = $row->used_on_date;
                $date = $dateValue instanceof Carbon ? $dateValue->toDateString() : (string) $dateValue;

                return [
                    'date' => $date,
                    'total' => (int) $row->total,
                ];
            });

        return Inertia::render('Admin/AiLogs', [
            'logs' => $logs,
            'dailyTotals' => $dailyTotals,
            'dailyLimit' => config('ai.daily_limit', 20),
        ]);
    }
}
