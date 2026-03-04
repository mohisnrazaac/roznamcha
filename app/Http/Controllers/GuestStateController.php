<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class GuestStateController extends Controller
{
    public function stash(Request $request): JsonResponse
    {
        // ROZNAMCHA-ACTIVATION: preserve guest tool state for post-signup return without DB migrations.
        $validated = $request->validate([
            'tool_key' => ['required', 'string', 'max:80'],
            'state' => ['required', 'array'],
            'return_url' => ['nullable', 'string', 'max:500'],
        ]);

        $jsonSize = strlen(json_encode($validated['state'] ?? []));
        abort_if($jsonSize > 6000, 422, 'Tool state payload is too large.');

        $stashId = Str::random(24);

        Cache::put(
            $this->cacheKey($stashId),
            [
                'tool_key' => $validated['tool_key'],
                'state' => $validated['state'],
                'return_url' => $validated['return_url'] ?? null,
                'session_id' => $request->session()->getId(),
                'created_at' => now()->toIso8601String(),
            ],
            now()->addHours(2)
        );

        return response()->json([
            'stash_id' => $stashId,
            'expires_in_seconds' => 7200,
        ]);
    }

    protected function cacheKey(string $stashId): string
    {
        return 'tool_state_stash:'.$stashId;
    }
}
