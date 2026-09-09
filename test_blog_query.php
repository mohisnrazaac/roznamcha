<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

use App\Models\BlogPost;

try {
    $posts = BlogPost::query()
        ->publicArchiveVisible()
        ->orderByDesc('published_at')
        ->orderByDesc('id')
        ->get();

    echo "Posts returned by publicArchiveVisible: " . $posts->count() . "\n";
    foreach($posts as $post) {
        echo "- " . $post->slug . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
