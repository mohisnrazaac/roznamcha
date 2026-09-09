<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$posts = \App\Models\BlogPost::query()->publicArchiveVisible()->get(['slug', 'status']);
foreach($posts as $post) {
    echo $post->slug . " (" . $post->status . ")\n";
}
