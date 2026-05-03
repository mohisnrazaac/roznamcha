<?php
// Purpose: Run Smart Budget Template migrations from a public web endpoint. Date: 2026-03-27. Author: Codex.

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Throwable;

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

/** @var Kernel $kernel */
$kernel = $app->make(Kernel::class);

$migrations = [
    'database/migrations/2026_03_27_000000_create_budget_templates_table.php',
    'database/migrations/2026_03_27_000100_create_budget_template_user_table.php',
];

try {
    foreach ($migrations as $path) {
        echo "[run] php artisan migrate --force --path={$path}\n";

        $exitCode = $kernel->call('migrate', [
            '--force' => true,
            '--path' => $path,
        ]);

        echo $kernel->output()."\n";

        if ((int) $exitCode !== 0) {
            throw new RuntimeException("Migration failed for {$path} with exit code {$exitCode}.");
        }
    }

    echo "Smart Budget Template migrations completed.\n";
    echo "Delete public/run-smart-budget-template-migrations.php after one successful run.\n";
} catch (Throwable $throwable) {
    http_response_code(500);
    echo "Migration runner failed: ".$throwable->getMessage()."\n";
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
