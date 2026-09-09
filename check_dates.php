<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$posts = \App\Models\BlogPost::limit(3)->get(['slug', 'updated_at']);
foreach($posts as $post) {
    echo "- " . $post->slug . " (" . $post->updated_at . ")\n";
}
