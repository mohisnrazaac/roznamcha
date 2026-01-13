<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Throwable;

$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocalHost = in_array($host, ['127.0.0.1', 'localhost'], true) || str_starts_with($host, '127.') || str_starts_with($host, 'localhost');

if ($isLocalHost) {
    http_response_code(403);
    echo 'Migrations already managed locally. This endpoint is disabled on 127.0.0.1/localhost.';
    exit;
}

$candidateRoots = [
    dirname(__DIR__),
    dirname(__DIR__).'/rozapp',
    dirname(__DIR__).'/roznamcha',
];

$appRoot = null;
foreach ($candidateRoots as $root) {
    if (file_exists($root.'/vendor/autoload.php') && file_exists($root.'/bootstrap/app.php')) {
        $appRoot = $root;
        break;
    }
}

if (! $appRoot) {
    http_response_code(500);
    echo 'Unable to locate the Laravel application root relative to run-migrations.php.';
    exit;
}

require $appRoot.'/vendor/autoload.php';

$app = require $appRoot.'/bootstrap/app.php';

set_time_limit(120);

/** @var Kernel $kernel */
$kernel = $app->make(Kernel::class);

header('Content-Type: text/plain; charset=utf-8');

try {
    $kernel->call('migrate', ['--force' => true]);
    echo "Migrations executed successfully.\n\n";
    echo $kernel->output();
} catch (Throwable $exception) {
    http_response_code(500);
    echo "Migration failed: ".$exception->getMessage()."\n";
}
