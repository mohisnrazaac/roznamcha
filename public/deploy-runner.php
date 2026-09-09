<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'POST required.']);
    exit;
}

$projectRoot = null;

foreach ([__DIR__, dirname(__DIR__)] as $candidate) {
    if (is_file($candidate.'/vendor/autoload.php') && is_file($candidate.'/bootstrap/app.php')) {
        $projectRoot = $candidate;
        break;
    }
}

if ($projectRoot === null) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Laravel bootstrap files were not found in either supported deployment layout.',
    ]);
    exit;
}

require $projectRoot.'/vendor/autoload.php';
$app = require_once $projectRoot.'/bootstrap/app.php';

/** @var Kernel $kernel */
$kernel = $app->make(Kernel::class);
$commands = [
    [
        'name' => 'blog:apply-adsense-article-rewrites',
        'arguments' => ['--dry-run' => true],
        'display' => 'php artisan blog:apply-adsense-article-rewrites --dry-run',
    ],
    [
        'name' => 'blog:apply-adsense-article-rewrites',
        'arguments' => [],
        'display' => 'php artisan blog:apply-adsense-article-rewrites',
    ],
    [
        'name' => 'optimize:clear',
        'arguments' => [],
        'display' => 'php artisan optimize:clear',
    ],
];

$results = [];

try {
    foreach ($commands as $command) {
        $exitCode = $kernel->call($command['name'], $command['arguments']);
        $results[] = [
            'command' => $command['display'],
            'exit_code' => $exitCode,
            'output' => trim($kernel->output()),
        ];

        if ($exitCode !== 0) {
            http_response_code(500);
            echo json_encode([
                'ok' => false,
                'message' => 'Runner stopped after a failed command.',
                'results' => $results,
            ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }
    }
} catch (Throwable $exception) {
    report($exception);
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Runner failed: '.$exception->getMessage(),
        'results' => $results,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$deleted = @unlink(__FILE__);

echo json_encode([
    'ok' => true,
    'message' => 'Article rewrites applied and Laravel caches cleared.',
    'completed_at' => date(DATE_ATOM),
    'runner_deleted' => $deleted,
    'warning' => $deleted ? null : 'Delete public/deploy-runner.php immediately.',
    'results' => $results,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
