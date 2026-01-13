<?php

namespace App\Http\Controllers;

use App\AI\PromptLibrary;
use App\Models\Expense;
use App\Models\Reminder;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AiReminderController extends Controller
{
    public function generate(Request $request, AiService $aiService): JsonResponse
    {
        $user = $request->user();
        $dateColumn = $this->dateColumn();

        $reminders = Reminder::query()
            ->where('user_id', $user->id)
            ->orderByDesc('is_active')
            ->orderBy('next_run_at')
            ->limit(40)
            ->get([
                'id',
                'title',
                'type',
                'reminder_type',
                'schedule_cron',
                'next_run_at',
                'due_date',
                'timezone',
                'is_active',
            ])
            ->map(fn (Reminder $reminder) => [
                'title' => $reminder->title,
                'type' => $reminder->type,
                'schedule' => $reminder->schedule_cron,
                'next_run_at' => optional($reminder->next_run_at)->toDateTimeString(),
                'due_date' => optional($reminder->due_date)->toDateString(),
                'timezone' => $reminder->timezone,
                'is_active' => (bool) $reminder->is_active,
            ])
            ->values()
            ->toArray();

        $recentExpenses = Expense::query()
            ->where('user_id', $user->id)
            ->whereDate($dateColumn, '>=', now()->subDays(90)->toDateString())
            ->orderByDesc($dateColumn)
            ->orderByDesc('id')
            ->limit(120)
            ->get(['id', 'amount', $dateColumn, 'category_id'])
            ->map(fn (Expense $expense) => [
                'amount' => (float) $expense->amount,
                'date' => optional($expense->{$dateColumn})->toDateString(),
                'category_id' => $expense->category_id,
            ])
            ->values()
            ->toArray();

        $dataset = [
            'reminders' => $reminders,
            'recent_expenses' => $recentExpenses,
        ];

        $prompt = PromptLibrary::getReminderSuggestionPrompt($dataset);
        $aiResult = $aiService->sendPrompt($prompt, $user->id, 'reminder');

        return response()->json($this->formatResponse($aiResult));
    }

    private function formatResponse(array $aiResult): array
    {
        $payload = $aiResult['decoded'] ?? [];
        $suggestions = $payload['suggestions'] ?? [];

        if (! is_array($suggestions)) {
            $suggestions = [];
        }

        $normalized = collect($suggestions)
            ->map(function ($suggestion) {
                if (! is_array($suggestion)) {
                    return null;
                }

                return [
                    'title' => (string) ($suggestion['title'] ?? 'Reminder'),
                    'schedule' => (string) ($suggestion['schedule'] ?? 'Monthly'),
                ];
            })
            ->filter()
            ->values()
            ->all();

        return [
            'status' => 'ok',
            'module' => 'reminder',
            'suggestions' => $normalized,
        ];
    }

    private function dateColumn(): string
    {
        return Schema::hasColumn('expenses', 'tx_date')
            ? 'tx_date'
            : (Schema::hasColumn('expenses', 'date') ? 'date' : 'tx_date');
    }
}
