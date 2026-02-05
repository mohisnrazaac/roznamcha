<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * Class RuleBasedChatService
 *
 * Provides deterministic, keyword-driven responses for the Roznamcha
 * activation assistant so the widget can guide users without relying on
 * external providers. Extend by updating config/chat_faq.php.
 */
class RuleBasedChatService
{
    protected array $faq;
    protected string $fallbackMessage;
    protected string $refusalMessage;
    protected array $disallowedKeywords;

    public function __construct()
    {
        $config = config('chat_faq');
        $this->faq = Arr::get($config, 'faq', []);
        $this->fallbackMessage = Arr::get($config, 'fallback_message', '');
        $this->refusalMessage = Arr::get($config, 'refusal_message', $this->fallbackMessage);
        $this->disallowedKeywords = collect(Arr::get($config, 'disallowed_keywords', []))
            ->map(fn ($keyword) => Str::lower($keyword))
            ->all();
    }

    public function getFallbackMessage(): string
    {
        return $this->fallbackMessage;
    }

    public function getRefusalMessage(): string
    {
        return $this->refusalMessage;
    }

    public function containsDisallowedContent(string $message): bool
    {
        $normalized = Str::lower($message);

        foreach ($this->disallowedKeywords as $keyword) {
            if ($keyword !== '' && Str::contains($normalized, $keyword)) {
                return true;
            }
        }

        return false;
    }

    public function findMatch(string $message): ?string
    {
        $normalized = Str::lower($message);

        foreach ($this->faq as $entry) {
            $keywords = Arr::get($entry, 'keywords', []);
            $response = Arr::get($entry, 'response');

            if (!$response || empty($keywords)) {
                continue;
            }

            foreach ($keywords as $keyword) {
                $keyword = Str::lower($keyword);

                if ($keyword !== '' && Str::contains($normalized, $keyword)) {
                    return $response;
                }
            }
        }

        return null;
    }
}
