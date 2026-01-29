<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Artisan;
use Throwable;

set_time_limit(0);
header('Content-Type: text/plain; charset=utf-8');

// Mirrors deploy-runner path detection so we can drop this file anywhere in public_html.
$rootPath = resolveProjectRoot(__DIR__);
chdir($rootPath);

require $rootPath.'/vendor/autoload.php';
$app = require $rootPath.'/bootstrap/app.php';

$console = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$console->bootstrap();

try {
    Artisan::call('migrate', ['--force' => true]);
    echo 'Migrations completed: '.Artisan::output();
} catch (Throwable $exception) {
    http_response_code(500);
    echo 'Migration failed: '.$exception->getMessage();
}

function resolveProjectRoot(string $startDir): string
{
    $envOverride = getenv('DEPLOY_PROJECT_ROOT') ?: getenv('DPLY_RUNNER_BASE_PATH');
    if ($envOverride && is_dir($envOverride)) {
        return realpath($envOverride) ?: $envOverride;
    }

    $start = realpath($startDir) ?: $startDir;
    $maxDepth = 4;
    $queue = [[$start, 0]];
    $visited = [];

    while (! empty($queue)) {
        [$current, $depth] = array_shift($queue);
        if (isset($visited[$current])) {
            continue;
        }
        $visited[$current] = true;

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

    return $start;
}

function looksLikeLaravel(string $path): bool
{
    return is_file($path.'/artisan') && is_file($path.'/.env') && is_dir($path.'/vendor');
}
