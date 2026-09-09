<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$posts = \App\Models\BlogPost::where('status', 'draft')->limit(5)->get(['slug']);
foreach($posts as $post) {
    echo "- " . $post->slug . "\n";
}
