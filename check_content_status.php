<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BlogPost;

$posts = BlogPost::all();
echo "Total Blog Posts: " . $posts->count() . "\n";
echo "====================================\n";

foreach($posts as $post) {
    $wordCount = str_word_count(strip_tags($post->content));
    $status = $wordCount > 800 ? '✅ GOOD' : '⚠️ THIN CONTENT';
    echo "- " . $post->title . "\n";
    echo "  Status: " . $post->status . "\n";
    echo "  Word Count: " . $wordCount . " (" . $status . ")\n";
    echo "  Slug: " . $post->slug . "\n\n";
}
