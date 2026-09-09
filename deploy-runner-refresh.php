<?php
// A clean script to refresh the Laravel cache on the production server
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<html><head><title>Server Refresh</title><style>body { font-family: sans-serif; padding: 20px; line-height: 1.6; background-color: #f4f4f9; } .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); } h2 { color: #001a4a; } .success { color: green; font-weight: bold; } pre { background: #eee; padding: 10px; border-radius: 4px; overflow-x: auto; }</style></head><body><div class='container'>";
echo "<h2>Roznamcha Server Refresh Utility</h2>";

try {
    echo "<strong>1. Optimizing Application...</strong><br>";
    \Artisan::call('optimize:clear');
    echo "<pre>" . \Artisan::output() . "</pre>";
    
    echo "<strong>2. Clearing Config...</strong><br>";
    \Artisan::call('config:clear');
    echo "<pre>" . \Artisan::output() . "</pre>";
    
    echo "<strong>3. Clearing Views...</strong><br>";
    \Artisan::call('view:clear');
    echo "<pre>" . \Artisan::output() . "</pre>";
    
    echo "<strong>4. Clearing Cache...</strong><br>";
    \Artisan::call('cache:clear');
    echo "<pre>" . \Artisan::output() . "</pre>";
    
    echo "<p class='success'>✅ Server cache has been successfully refreshed!</p>";
} catch (\Exception $e) {
    echo "<p style='color: red;'><strong>Error:</strong> " . $e->getMessage() . "</p>";
}

echo "</div></body></html>";
