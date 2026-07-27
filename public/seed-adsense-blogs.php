<?php

/**
 * Helper script to seed the 6 new AdSense compliance blog posts on production.
 * Place in public/ (same folder as index.php), hit via browser once, then delete it.
 */

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

// Simple security token to prevent unauthorized access
$useToken = false;
$token = 'adsense2026';

if ($useToken) {
    $provided = $_GET['token'] ?? null;
    if (!$provided || !hash_equals($token, $provided)) {
        http_response_code(403);
        echo 'Invalid or missing token.';
        exit;
    }
}

chdir(__DIR__ . '/..');

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

/** @var Kernel $kernel */
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$sqlPath = __DIR__ . '/../database/seed_adsense_compliance_blogs.sql';
if (!file_exists($sqlPath)) {
    http_response_code(500);
    echo "SQL seed file not found at: $sqlPath";
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
