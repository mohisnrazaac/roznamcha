<?php

/**
 * Helper script to seed the 6 new AdSense compliance blog posts on production.
 * Place in public/ (same folder as index.php), hit via browser once, then delete it.
 */

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

header('Content-Type: text/plain; charset=utf-8');
set_time_limit(0);

$useToken = false;
$token = 'adsense2026';

if ($useToken) {
    $provided = $_GET['token'] ?? null;
    if (!$provided || !hash_equals($token, $provided)) {
        http_response_code(403);
        echo "Invalid or missing token.\n";
        exit;
    }
}

// Dynamically resolve the project root to handle cPanel/shared hosting symlink mappings
$root = resolveProjectRoot(__DIR__);

if (!file_exists($root . '/vendor/autoload.php') || !file_exists($root . '/bootstrap/app.php')) {
    http_response_code(500);
    echo "Laravel bootstrap files not found at resolved root: $root\n";
    exit;
}

chdir($root);

require $root . '/vendor/autoload.php';
$app = require_once $root . '/bootstrap/app.php';

/** @var Kernel $kernel */
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$sqlPath = $root . '/database/seed_adsense_compliance_blogs.sql';
if (!file_exists($sqlPath)) {
    http_response_code(500);
    echo "SQL seed file not found at: $sqlPath\n";
    exit;
}

try {
    echo "Starting database seeding...\n";
    
    $sql = file_get_contents($sqlPath);
    
    // Execute the raw queries
    DB::unprepared($sql);
    
    echo "SUCCESS: 6 new high-quality personal finance blog posts have been successfully seeded into the database!\n";
    echo "Please delete public/seed-adsense-blogs.php now for security.\n";
} catch (\Throwable $throwable) {
    http_response_code(500);
    echo "Seeding failed: " . $throwable->getMessage() . "\n";
}

function resolveProjectRoot(string $startDir): string
{
    $start = realpath($startDir) ?: $startDir;
    $queue = [[$start, 0]];
    $seen = [];
    $maxDepth = 5;

    while (!empty($queue)) {
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

        foreach (glob($current . '/*', GLOB_ONLYDIR) ?: [] as $child) {
            $queue[] = [$child, $depth + 1];
        }
    }

    return dirname($startDir);
}

function looksLikeLaravel(string $path): bool
{
    return is_file($path . '/artisan') && is_file($path . '/bootstrap/app.php');
}
