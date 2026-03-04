<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ToolSnapshotController extends Controller
{
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        // ROZNAMCHA-ACTIVATION: snapshot save uses existing events table to avoid schema churn.
        $validated = $request->validate([
            'tool_key' => ['required', 'string', 'max:80'],
            'inputs' => ['required', 'array'],
            'results' => ['required', 'array'],
            'source' => ['nullable', 'string', 'max:80'],
            'return_url' => ['nullable', 'string', 'max:500'],
        ]);

        $payloadSize = strlen(json_encode([
            'inputs' => $validated['inputs'],
            'results' => $validated['results'],
        ]));
        abort_if($payloadSize > 12000, 422, 'Snapshot payload is too large.');

        Event::query()->create([
            'user_id' => $request->user()?->id,
            'session_id' => $request->session()->getId(),
            'name' => 'tool_snapshot_saved',
            'meta' => [
                'tool_key' => $validated['tool_key'],
                'source' => $validated['source'] ?? 'tool_save_wall',
                'return_url' => $validated['return_url'] ?? $request->headers->get('referer'),
                'inputs' => $validated['inputs'],
                'results' => $validated['results'],
            ],
            'created_at' => now(),
        ]);

        $payload = [
            'message' => 'Saved. Come back next month to compare.',
        ];

        if ($request->header('X-Inertia')) {
            return back()->with('status', $payload['message']);
        }

        return response()->json($payload);
    }
}
