<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PublicCacheHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        if ($request->isMethod('GET') && $response->isSuccessful()) {
            $response->headers->set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        }
        return $response;
    }
}
