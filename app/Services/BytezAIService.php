<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Class BytezAIService
 *
 * Wraps the free Bytez inference API so the chat assistant can optionally
 * enhance answers with AI while treating timeouts/errors as non-blocking.
 * Configure via config/chat_faq.php and environment variables.
 */
class BytezAIService
{
    protected bool $enabled;
    protected ?string $apiUrl;
    protected ?string $apiKey;
    protected int $timeout;

    public function __construct()
    {
        $config = config('chat_faq.bytez', []);

        $this->apiUrl = Arr::get($config, 'api_url');
        $this->apiKey = Arr::get($config, 'api_key');
        $this->timeout = (int) Arr::get($config, 'timeout', 6);
        $this->enabled = (bool) Arr::get($config, 'enabled', false) && $this->apiUrl && $this->apiKey;
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    public function respond(string $message, array $context = []): ?string
    {
        if (!$this->isEnabled()) {
            return null;
        }

        try {
            $payload = [
                'query' => $message,
                'context' => implode("\n", array_slice($context, -5)),
            ];

            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => 'Bearer '.$this->apiKey,
                    'Accept' => 'text/plain',
                ])
                ->post($this->apiUrl, $payload);

            if ($response->failed()) {
                Log::warning('Bytez AI responded with an error status.', [
                    'status' => $response->status(),
                ]);

                return null;
            }

            $body = trim($response->body());

            return $body !== '' ? $body : null;
        } catch (Throwable $exception) {
            Log::warning('Bytez AI request failed.', [
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }
}
