<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Total: " . \App\Models\BlogPost::count() . "\n";
echo "Published: " . \App\Models\BlogPost::where('status', 'published')->count() . "\n";
echo "Oldest updated_at: " . \App\Models\BlogPost::orderBy('updated_at')->first()->updated_at . "\n";
