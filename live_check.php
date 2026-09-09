<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

use App\Models\BlogPost;
try {
    $posts = BlogPost::all();
    echo "Total Blog Posts: " . $posts->count() . "\n";
    echo "====================================\n";

    $good = 0;
    $thin = 0;
    foreach($posts as $post) {
        $wordCount = str_word_count(strip_tags($post->content));
        if ($wordCount > 800) {
            $good++;
            $status = '✅ GOOD';
        } else {
            $thin++;
            $status = '⚠️ THIN CONTENT';
        }
        echo "- " . $post->title . "\n";
        echo "  Status: " . $post->status . "\n";
        echo "  Word Count: " . $wordCount . " (" . $status . ")\n";
        echo "  Slug: " . $post->slug . "\n\n";
    }
    echo "Summary: $good GOOD, $thin THIN CONTENT.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
