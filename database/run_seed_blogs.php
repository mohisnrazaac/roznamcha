<?php
// Simple script to run the blog seed file using Laravel DB connection

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;

$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$sqlPath = __DIR__ . '/seed_adsense_compliance_blogs.sql';
if (!file_exists($sqlPath)) {
    echo "SQL seed file not found at: $sqlPath\n";
    exit(1);
}

echo "Running SQL seed queries...\n";
try {
    $sql = file_get_contents($sqlPath);
    // Execute the SQL unprepared
    DB::unprepared($sql);
    echo "Seeding completed successfully! 6 new blog posts have been added to the database.\n";
} catch (\Exception $e) {
    echo "Error during seeding: " . $e->getMessage() . "\n";
    exit(1);
}
