<?php

/**
 * Temporary deployment helper for Daily Return Hooks.
 * Upload to production public_html, hit via browser once with ?token=YOUR_SECRET, and delete immediately after it reports success.
 */

// WARNING: Running without a token means anyone who discovers this URL could execute migrations.
// If you truly want zero protection, leave $useToken false and delete the file right after use.
$useToken = false;
$token = 'SET_A_TEMP_SECRET';

if ($useToken) {
    if ($token === 'SET_A_TEMP_SECRET') {
        http_response_code(500);
        echo 'Please edit deploy_daily_return_hooks.php and set $token before uploading.';
        exit;
    }

    $provided = $_GET['token'] ?? null;

    if (! $provided || ! hash_equals($token, $provided)) {
        http_response_code(403);
        echo 'Missing or invalid deploy token.';
        exit;
    }
}

chdir(__DIR__.'/..');

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

try {
    $kernel->call('migrate', ['--force' => true]);
    $kernel->call('config:clear');
    $kernel->call('route:clear');
    $kernel->call('view:clear');
} catch (Throwable $e) {
    report($e);
    http_response_code(500);
    echo 'Deployment failed: '.$e->getMessage();
    exit;
}

echo 'Daily Return Hooks deployed at '.now()->toDateTimeString().'. Remove this file now.';
