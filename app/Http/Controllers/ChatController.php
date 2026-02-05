<?php

namespace App\Http\Controllers;

use App\Services\BytezAIService;
use App\Services\RuleBasedChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Class ChatController
 *
 * Lightweight endpoint for the Roznamcha activation chat widget. It validates
 * user prompts, loads prior context from the session, routes the message to
 * the rule-based knowledge base, and only consults Bytez AI when enabled.
 */
class ChatController extends Controller
{
    public function __construct(
        protected RuleBasedChatService $ruleBasedChatService,
        protected BytezAIService $bytezAIService
    ) {
    }

    public function sendMessage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:500'],
        ]);

        $message = trim($data['message']);

        if ($message === '') {
            return response()->json([
                'reply' => $this->ruleBasedChatService->getFallbackMessage(),
                'source' => 'fallback',
            ]);
        }

        $conversation = session()->get('chat.conversation', []);
        $conversation[] = [
            'role' => 'user',
            'text' => $message,
            'timestamp' => now()->toIso8601String(),
        ];

        [$reply, $source] = $this->generateReply($message, $conversation);

        $conversation[] = [
            'role' => 'assistant',
            'text' => $reply,
            'source' => $source,
            'timestamp' => now()->toIso8601String(),
        ];

        session()->put('chat.conversation', array_slice($conversation, -10));

        return response()->json([
            'reply' => $reply,
            'source' => $source,
        ]);
    }

    protected function generateReply(string $message, array $conversation): array
    {
        if ($this->ruleBasedChatService->containsDisallowedContent($message)) {
            return [$this->ruleBasedChatService->getRefusalMessage(), 'safety'];
        }

        $ruleResponse = $this->ruleBasedChatService->findMatch($message);

        if ($ruleResponse) {
            return [$ruleResponse, 'rule'];
        }

        $aiResponse = $this->bytezAIService->respond($message, $this->formatContext($conversation));

        if ($aiResponse) {
            if ($this->ruleBasedChatService->containsDisallowedContent($aiResponse)) {
                return [$this->ruleBasedChatService->getFallbackMessage(), 'fallback'];
            }

            return [$aiResponse, 'ai'];
        }

        return [$this->ruleBasedChatService->getFallbackMessage(), 'fallback'];
    }

    protected function formatContext(array $conversation): array
    {
        $limit = (int) config('chat_faq.max_context_messages', 6);
        $recent = array_slice($conversation, -$limit);

        return array_map(function ($entry) {
            return strtoupper($entry['role'] ?? 'USER').': '.($entry['text'] ?? '');
        }, $recent);
    }
}
