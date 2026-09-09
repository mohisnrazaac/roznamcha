<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    @unlink(__FILE__);
    exit;
}

$secret = $_SERVER['HTTP_X_DEPLOY_SECRET'] ?? $_POST['secret'] ?? '';
$expectedSecret = 'my-super-secret-token-123';

if ($secret !== $expectedSecret) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    @unlink(__FILE__);
    exit;
}

$baseDir = __DIR__;
$laravelDir = null;

// Paths to try
$paths = [
    $baseDir,
    dirname($baseDir),
    '/home/roznamch/rozapp',
];

foreach ($paths as $path) {
    if (file_exists($path . '/vendor/autoload.php') && file_exists($path . '/bootstrap/app.php')) {
        $laravelDir = $path;
        break;
    }
}

if (!$laravelDir) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not find Laravel bootstrap files']);
    @unlink(__FILE__);
    exit;
}

require $laravelDir . '/vendor/autoload.php';
$app = require_once $laravelDir . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$output1 = [];
$output2 = [];

try {
    $status1 = $kernel->call('db:seed', ['--class' => 'Database\\Seeders\\CustomBlogPostSeeder', '--force' => true]);
    $output1 = ['status' => $status1, 'output' => $kernel->output()];
    
    $status2 = $kernel->call('optimize:clear');
    $output2 = ['status' => $status2, 'output' => $kernel->output()];
    
    echo json_encode([
        'success' => true,
        'seed_result' => $output1,
        'optimize_result' => $output2
    ]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

@unlink(__FILE__);
exit;
