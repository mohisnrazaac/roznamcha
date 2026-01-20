<?php

namespace App\Http\Controllers;

use App\Services\DailyReturnHookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Public endpoint that feeds the DailyMoneySnapshot React widget on home/blog pages.
 */
class DailyReturnSnapshotController extends Controller
{
    public function __construct(private readonly DailyReturnHookService $service)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $payload = $this->service->buildPayload($request->user());

        return response()->json([
            'status' => 'ok',
            'data' => $payload,
        ]);
    }
}
