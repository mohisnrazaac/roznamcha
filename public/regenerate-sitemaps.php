<?php
// Purpose: Clear sitemap caches and warm sitemap endpoints from a public web endpoint. Date: 2026-03-27. Author: Codex.

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

set_time_limit(0);
header('Content-Type: text/plain; charset=utf-8');

$root = resolveProjectRoot(__DIR__);

if (! file_exists($root.'/vendor/autoload.php') || ! file_exists($root.'/bootstrap/app.php')) {
    http_response_code(500);
    echo "Laravel bootstrap files not found.\n";
    exit;
}

chdir($root);

require $root.'/vendor/autoload.php';

$app = require $root.'/bootstrap/app.php';

/** @var ConsoleKernel $consoleKernel */
$consoleKernel = $app->make(ConsoleKernel::class);
$consoleKernel->bootstrap();

/** @var HttpKernel $httpKernel */
$httpKernel = $app->make(HttpKernel::class);

try {
    $keys = [
        'sitemap:xml',
        'sitemap:templates:xml',
    ];

    foreach ($keys as $key) {
        Cache::forget($key);
        echo "[cleared] {$key}\n";
    }

    foreach (['/sitemap.xml', '/templates-sitemap.xml'] as $uri) {
        $request = Request::create($uri, 'GET', [], [], [], [
            'HTTP_HOST' => parse_url((string) config('app.url'), PHP_URL_HOST) ?: 'localhost',
            'HTTPS' => str_starts_with((string) config('app.url'), 'https://') ? 'on' : 'off',
        ]);

        $response = $httpKernel->handle($request);
        echo "[warmed] {$uri} status=".$response->getStatusCode().' bytes='.strlen((string) $response->getContent())."\n";
        $httpKernel->terminate($request, $response);
    }

    echo "Sitemaps regenerated.\n";
    echo "Delete public/regenerate-sitemaps.php after one successful run.\n";
} catch (\Throwable $throwable) {
    http_response_code(500);
    echo "Sitemap regeneration failed: ".$throwable->getMessage()."\n";
}

function resolveProjectRoot(string $startDir): string
{
    $start = realpath($startDir) ?: $startDir;
    $queue = [[$start, 0]];
    $seen = [];
    $maxDepth = 5;

    while (! empty($queue)) {
        [$current, $depth] = array_shift($queue);

        if (isset($seen[$current])) {
            continue;
        }

        $seen[$current] = true;

        if (looksLikeLaravel($current)) {
            return $current;
        }

        if ($depth >= $maxDepth) {
            continue;
        }

        $parent = dirname($current);
        if ($parent && $parent !== $current) {
            $queue[] = [$parent, $depth + 1];
        }

        foreach (glob($current.'/*', GLOB_ONLYDIR) ?: [] as $child) {
            $queue[] = [$child, $depth + 1];
        }
    }

    return dirname($startDir);
}

function looksLikeLaravel(string $path): bool
{
    return is_file($path.'/artisan') && is_file($path.'/bootstrap/app.php');
}
