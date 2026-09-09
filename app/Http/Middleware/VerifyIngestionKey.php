<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyIngestionKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $configuredKey = config('services.agent.secret_key');

        if (empty($configuredKey)) {
            abort(500, 'Ingestion secret not configured');
        }

        $providedKey = (string) $request->header('X-Ingestion-Key');

        if (! hash_equals((string) $configuredKey, $providedKey)) {
            return response()->json(['error' => 'Unauthorized: Invalid ingestion token'], 401);
        }

        return $next($request);
    }
}
