<?php

namespace App\Http\Middleware;

use App\Support\AppRelease;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddReleaseMarkerHeader
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $release = AppRelease::get();

        // 1. Set X-App-Release on every web response
        $response->headers->set('X-App-Release', $release);

        // 2. Inject HTML comment just before </body> on public HTML pages if not already present
        if ($this->shouldInjectHtmlComment($request, $response)) {
            $content = $response->getContent();
            if (is_string($content) && str_contains($content, '</body>') && ! str_contains($content, '<!-- release:')) {
                $replacement = "<!-- release: {$release} -->\n</body>";
                $newContent = preg_replace('/<\/body>/i', $replacement, $content, 1);
                if (is_string($newContent)) {
                    $response->setContent($newContent);
                }
            }
        }

        return $response;
    }

    protected function shouldInjectHtmlComment(Request $request, Response $response): bool
    {
        $contentType = (string) $response->headers->get('Content-Type', '');

        return str_starts_with($contentType, 'text/html') || str_contains($contentType, 'text/html');
    }
}
