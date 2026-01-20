<?php

/**
 * Helper script to run only the new Daily Return Hook migrations on production.
 * Place in public/ (same folder as index.php), hit via browser once, then delete it.
 */

use Illuminate\Contracts\Console\Kernel;

// WARNING: set to true + provide a token if you need to protect this endpoint.
$useToken = false;
$token = 'SET_A_TEMP_SECRET';

if ($useToken) {
    if ($token === 'SET_A_TEMP_SECRET') {
        http_response_code(500);
        echo 'Configure $token inside public/run-migration.php before running.';
        exit;
    }

    $provided = $_GET['token'] ?? null;

    if (! $provided || ! hash_equals($token, $provided)) {
        http_response_code(403);
        echo 'Invalid token.';
        exit;
    }
}

chdir(__DIR__.'/..');

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
/** @var Kernel $kernel */
$kernel = $app->make(Kernel::class);

$migrationsToRun = [
    '2026_02_20_000000_create_daily_money_snapshots_table',
    '2026_02_20_000100_create_daily_ai_insights_table',
    '2026_02_20_000200_create_daily_visit_streaks_table',
];

try {
    foreach ($migrationsToRun as $migration) {
        $kernel->call('migrate', [
            '--force' => true,
            '--path' => "database/migrations/{$migration}.php",
        ]);
    }

    echo 'Specified migrations executed. Remove public/run-migration.php now.';
} catch (Throwable $throwable) {
    report($throwable);
    http_response_code(500);
    echo 'Migration failed: '.$throwable->getMessage();
}
