<?php

namespace App\Http\Controllers;

use App\AI\PromptLibrary;
use App\Models\Expense;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AiKharchaController extends Controller
{
    public function generate(Request $request, AiService $aiService): JsonResponse
    {
        $user = $request->user();
        $dateColumn = $this->dateColumn();
        $noteColumn = $this->noteColumn();

        $expenses = Expense::query()
            ->with('category:id,name')
            ->where('user_id', $user->id)
            ->orderByDesc($dateColumn)
            ->orderByDesc('id')
            ->limit(150)
            ->get()
            ->map(function (Expense $expense) use ($dateColumn, $noteColumn) {
                return [
                    'id' => $expense->id,
                    'amount' => (float) $expense->amount,
                    'date' => optional($expense->{$dateColumn})->toDateString(),
                    'category' => $expense->category?->name,
                    'note' => $noteColumn ? ($expense->{$noteColumn} ?? null) : null,
                ];
            })
            ->values()
            ->toArray();

        $dataset = [
            'currency' => 'PKR',
            'expenses' => $expenses,
        ];

        $prompt = PromptLibrary::getKharchaSummaryPrompt($dataset);
        $aiResult = $aiService->sendPrompt($prompt, $user->id, 'kharcha');

        return response()->json($this->formatResponse($aiResult));
    }

    private function formatResponse(array $aiResult): array
    {
        $payload = $aiResult['decoded'] ?? [];

        return [
            'status' => 'ok',
            'module' => 'kharcha',
            'summary' => (string) ($payload['summary'] ?? $aiResult['raw'] ?? 'AI summary will appear once data syncs.'),
            'top_risks' => $this->stringArray($payload['top_risks'] ?? []),
            'suggestions' => $this->stringArray($payload['suggestions'] ?? []),
        ];
    }

    private function stringArray(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return collect($value)
            ->map(fn ($item) => is_string($item) ? trim($item) : null)
            ->filter()
            ->values()
            ->all();
    }

    private function dateColumn(): string
    {
        return Schema::hasColumn('expenses', 'tx_date')
            ? 'tx_date'
            : (Schema::hasColumn('expenses', 'date') ? 'date' : 'tx_date');
    }

    private function noteColumn(): ?string
    {
        if (Schema::hasColumn('expenses', 'note')) {
            return 'note';
        }

        if (Schema::hasColumn('expenses', 'notes')) {
            return 'notes';
        }

        if (Schema::hasColumn('expenses', 'description')) {
            return 'description';
        }

        return null;
    }
}
