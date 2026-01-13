<?php

namespace App\Http\Controllers;

use App\AI\PromptLibrary;
use App\Models\RationItem;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AiRationController extends Controller
{
    public function generate(Request $request, AiService $aiService): JsonResponse
    {
        $user = $request->user();
        $nameColumn = $this->nameColumn();

        $items = RationItem::query()
            ->with(['prices' => fn ($query) => $query->orderByDesc('priced_at')->limit(6)])
            ->where('user_id', $user->id)
            ->orderBy($nameColumn)
            ->limit(50)
            ->get()
            ->map(function (RationItem $item) use ($nameColumn) {
                return [
                    'id' => $item->id,
                    'name' => $item->{$nameColumn} ?? $item->item_name,
                    'unit' => $item->unit,
                    'prices' => $item->prices
                        ->map(fn ($price) => [
                            'price' => (float) $price->price,
                            'priced_at' => optional($price->priced_at)->toDateString(),
                        ])
                        ->values()
                        ->toArray(),
                ];
            })
            ->values()
            ->toArray();

        $dataset = [
            'items' => $items,
            'lookback_days' => 30,
        ];

        $prompt = PromptLibrary::getRationShockPrompt($dataset);
        $aiResult = $aiService->sendPrompt($prompt, $user->id, 'ration');

        return response()->json($this->formatResponse($aiResult));
    }

    private function formatResponse(array $aiResult): array
    {
        $payload = $aiResult['decoded'] ?? [];
        $alerts = $payload['alerts'] ?? [];

        if (! is_array($alerts)) {
            $alerts = [];
        }

        $normalized = collect($alerts)
            ->map(function ($alert) {
                if (! is_array($alert)) {
                    return null;
                }

                return [
                    'item' => (string) ($alert['item'] ?? 'Grocery item'),
                    'trend' => (string) ($alert['trend'] ?? 'stable'),
                    'risk' => (string) ($alert['risk'] ?? 'Medium'),
                ];
            })
            ->filter()
            ->values()
            ->all();

        return [
            'status' => 'ok',
            'module' => 'ration',
            'alerts' => $normalized,
        ];
    }

    private function nameColumn(): string
    {
        return Schema::hasColumn('ration_items', 'name') ? 'name' : 'item_name';
    }
}
