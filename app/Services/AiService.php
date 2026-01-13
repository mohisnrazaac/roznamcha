<?php

namespace App\Services;

use App\Models\AiUsageLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Throwable;

// Roznamcha AI Service – Created 2026-01-11 16:15 PKT
class AiService
{
    public function sendPrompt(string $prompt, int $userId, string $module): array
    {
        $apiKey = config('services.ai.api_key');

        if (! $apiKey) {
            return [
                'raw' => 'AI service unavailable. Add AI_API_KEY to the environment to enable responses.',
                'decoded' => null,
                'error' => 'missing_api_key',
            ];
        }

        $baseUrl = rtrim((string) config('ai.base_url'), '/');
        $payload = [
            'model' => config('ai.model'),
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are Roznamcha, a Pakistani household finance copilot. Always respond with compliant JSON output.',
                ],
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
            'response_format' => ['type' => 'json_object'],
        ];

        $raw = null;
        $decoded = null;
        $error = null;

        $headers = [
            'X-Title' => config('app.name', 'Roznamcha'),
        ];

        if ($referer = config('app.url')) {
            $headers['HTTP-Referer'] = $referer;
        }

        try {
            $response = Http::withToken($apiKey)
                ->withHeaders($headers)
                ->acceptJson()
                ->post($baseUrl, $payload);

            $response->throw();

            $raw = $response->json('choices.0.message.content');
            $decoded = $raw ? json_decode($raw, true) : null;
        } catch (Throwable $throwable) {
            report($throwable);
            $error = 'request_failed';
            $raw ??= 'AI request failed. Please try again shortly.';
        } finally {
            $this->logUsage($userId, $module);
        }

        if (! is_array($decoded)) {
            $decoded = null;
        }

        return [
            'raw' => $raw,
            'decoded' => $decoded,
            'error' => $error,
        ];
    }

    protected function logUsage(int $userId, string $module): void
    {
        if (! Schema::hasTable('ai_usage_logs')) {
            return;
        }

        $record = AiUsageLog::query()->firstOrNew([
            'user_id' => $userId,
            'module' => $module,
            'used_on_date' => now()->toDateString(),
        ]);

        $record->request_count = ($record->request_count ?? 0) + 1;
        $record->save();
    }
}
