<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Run the seeder
try {
    \Artisan::call('db:seed', ['--class' => 'InflationBlogPostSeeder', '--force' => true]);
    echo "Seeder run successfully: " . \Artisan::output();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
