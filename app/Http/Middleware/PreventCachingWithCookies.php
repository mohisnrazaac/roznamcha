<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventCachingWithCookies
{
    /**
     * Ensure no response that sets a session cookie is ever cached by the app or CDN,
     * and strip session cookies and attach Vary: Cookie for publicly cached responses.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $cacheControl = (string) $response->headers->get('Cache-Control', '');
        $isPublic = str_contains($cacheControl, 'public');

        if ($isPublic) {
            // Authenticated requests must NEVER be served or cached publicly
            if ($request->user()) {
                $response->headers->set('Cache-Control', 'no-cache, private, no-store, must-revalidate');

                return $response;
            }

            // Ensure no response that sets a session cookie is ever cached by the app or the CDN
            $response->headers->remove('Set-Cookie');

            // Add Vary: Cookie where relevant
            $vary = (string) $response->headers->get('Vary', '');
            $varyDirectives = array_filter(array_map('trim', explode(',', $vary)));
            if (! in_array('Cookie', $varyDirectives, true)) {
                $varyDirectives[] = 'Cookie';
            }
            if (! in_array('X-Inertia', $varyDirectives, true)) {
                $varyDirectives[] = 'X-Inertia';
            }
            $response->headers->set('Vary', implode(', ', $varyDirectives));
        } elseif ($response->headers->has('Set-Cookie') && $isPublic) {
            // If Set-Cookie is somehow present, revoke public caching immediately
            $response->headers->set('Cache-Control', 'no-cache, private, no-store, must-revalidate');
        }

        return $response;
    }
}
