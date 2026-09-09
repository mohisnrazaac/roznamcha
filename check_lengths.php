<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$posts = \App\Models\BlogPost::where('status', 'published')->get();
foreach ($posts as $post) {
    $wordCount = str_word_count(strip_tags($post->content));
    echo "Slug: {$post->slug} | Words: {$wordCount}\n";
}
