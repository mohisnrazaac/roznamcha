<?php

namespace App\Http\Controllers;

use App\AI\PromptLibrary;
use App\Models\Expense;
use App\Models\ReportCache;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AiReportController extends Controller
{
    public function generate(Request $request, AiService $aiService): JsonResponse
    {
        $user = $request->user();
        $dateColumn = $this->dateColumn();

        $latestReport = ReportCache::query()
            ->where('user_id', $user->id)
            ->orderByDesc('generated_at')
            ->orderByDesc('id')
            ->first();

        $trend = collect(range(0, 2))
            ->map(function (int $offset) use ($dateColumn, $user) {
                $month = now()->subMonths($offset);
                $start = $month->copy()->startOfMonth();
                $end = $month->copy()->endOfMonth();

                $total = Expense::query()
                    ->where('user_id', $user->id)
                    ->whereBetween($dateColumn, [$start->toDateString(), $end->toDateString()])
                    ->sum('amount');

                return [
                    'label' => $start->format('Y-m'),
                    'total' => (float) $total,
                ];
            })
            ->reverse()
            ->values()
            ->toArray();

        $dataset = [
            'latest_report' => $latestReport ? [
                'period_start' => optional($latestReport->period_start)->toDateString(),
                'period_end' => optional($latestReport->period_end)->toDateString(),
                'total_spend' => (float) $latestReport->total_spend,
                'top_categories' => $latestReport->top_categories_json ?? [],
                'ration_days_left_snapshot' => $latestReport->ration_days_left_snapshot,
                'warnings' => $latestReport->warnings_text,
            ] : null,
            'spend_trend' => $trend,
        ];

        $prompt = PromptLibrary::getSurvivalReportPrompt($dataset);
        $aiResult = $aiService->sendPrompt($prompt, $user->id, 'report');

        return response()->json($this->formatResponse($aiResult));
    }

    private function formatResponse(array $aiResult): array
    {
        $payload = $aiResult['decoded'] ?? [];

        return [
            'status' => 'ok',
            'module' => 'report',
            'story' => (string) ($payload['story'] ?? $aiResult['raw'] ?? 'AI report will load after your first dataset.'),
        ];
    }

    private function dateColumn(): string
    {
        return Schema::hasColumn('expenses', 'tx_date')
            ? 'tx_date'
            : (Schema::hasColumn('expenses', 'date') ? 'date' : 'tx_date');
    }
}
