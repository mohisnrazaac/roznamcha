<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        if (app()->isProduction()) {
            $response->headers->set('Content-Security-Policy', implode('; ', [
                "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'self'", "form-action 'self'",
                "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: https://*.googlesyndication.com https://*.google.com https://*.googleusercontent.com https://*.gstatic.com https://*.doubleclick.net https://www.google-analytics.com https://www.clarity.ms https://c.clarity.ms",
                "font-src 'self' data:",
                "connect-src 'self' https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://www.google-analytics.com https://*.google-analytics.com https://www.clarity.ms https://*.clarity.ms",
                "frame-src 'self' https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net",
                "worker-src 'self' blob:", 'upgrade-insecure-requests',
            ]));
        }

        return $response;
    }
}
