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
            if ($request->user()) {
                $response->headers->set('Cache-Control', 'no-cache, private, no-store, must-revalidate');

                return $response;
            }

            $response->headers->set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
            $response->headers->remove('Set-Cookie');

            $vary = (string) $response->headers->get('Vary', '');
            $varyDirectives = array_filter(array_map('trim', explode(',', $vary)));
            if (! in_array('Cookie', $varyDirectives, true)) {
                $varyDirectives[] = 'Cookie';
            }
            if (! in_array('X-Inertia', $varyDirectives, true)) {
                $varyDirectives[] = 'X-Inertia';
            }
            $response->headers->set('Vary', implode(', ', $varyDirectives));
        }

        return $response;
    }
}
