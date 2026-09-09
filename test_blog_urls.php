<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$urls = [];
foreach(\App\Models\BlogPost::where('status', 'published')->get() as $post) {
    $urls[] = "https://roznamcha.pk/blog/" . $post->slug;
}
foreach(\App\Models\BlogCategory::all() as $cat) {
    $urls[] = "https://roznamcha.pk/blog/category/" . $cat->slug;
}
echo implode("\n", $urls);
