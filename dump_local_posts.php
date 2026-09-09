<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BlogPost;

$posts = BlogPost::all();
$long_posts = [];

foreach($posts as $post) {
    $wordCount = str_word_count(strip_tags($post->content));
    if ($wordCount >= 800) {
        $long_posts[] = $post->toArray();
    }
}

file_put_contents('local_long_posts.json', json_encode($long_posts));
echo "Dumped " . count($long_posts) . " long posts to local_long_posts.json\n";
