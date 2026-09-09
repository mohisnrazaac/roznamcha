<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$posts = \App\Models\BlogPost::all();
foreach($posts as $post) {
    $wc = str_word_count(strip_tags($post->content));
    if ($wc < 350) {
        echo "- THIN: " . $post->slug . " (" . $wc . " words)\n";
    }
}
echo "Done checking all posts.\n";
