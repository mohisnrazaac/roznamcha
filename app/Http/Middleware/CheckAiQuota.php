<?php

namespace App\Http\Middleware;

use App\Models\AiUsageLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class CheckAiQuota
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $dailyLimit = (int) config('ai.daily_limit', 20);

        if (! $user || $dailyLimit <= 0) {
            return $next($request);
        }

        if (! Schema::hasTable('ai_usage_logs')) {
            return $next($request);
        }

        $today = now()->toDateString();

        $requestCount = AiUsageLog::query()
            ->where('user_id', $user->id)
            ->whereDate('used_on_date', $today)
            ->sum('request_count');

        if ($requestCount >= $dailyLimit) {
            return response()->json([
                'status' => 'quota_exceeded',
                'message' => 'Daily AI limit reached. Try again tomorrow or contact support.',
            ], 429);
        }

        return $next($request);
    }
}
