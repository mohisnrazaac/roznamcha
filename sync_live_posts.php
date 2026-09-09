<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

use App\Models\BlogPost;

try {
    echo "Starting sync...\n";
    
    // 1. Sync local long posts
    $json = file_get_contents(__DIR__.'/local_long_posts.json');
    $local_posts = json_decode($json, true);
    
    $synced = 0;
    foreach($local_posts as $local_post) {
        $post = BlogPost::where('slug', $local_post['slug'])->first();
        if (!$post) {
            $post = new BlogPost();
            $post->slug = $local_post['slug'];
            $post->author_id = 1; // Fallback
        }
        
        $post->title = $local_post['title'];
        $post->excerpt = $local_post['excerpt'];
        $post->content = $local_post['content'];
        $post->status = 'published';
        $post->seo_title = $local_post['seo_title'] ?? $local_post['title'];
        $post->seo_description = $local_post['seo_description'] ?? $local_post['excerpt'];
        $post->seo_keywords = $local_post['seo_keywords'] ?? '';
        $post->published_at = $local_post['published_at'] ?? now();
        $post->save();
        $synced++;
    }
    echo "Synced $synced high-quality posts from local.\n";
    
    // 2. Draft thin content
    $all_posts = BlogPost::where('status', 'published')->get();
    $drafted = 0;
    
    foreach($all_posts as $post) {
        $wordCount = str_word_count(strip_tags($post->content));
        if ($wordCount < 800) {
            $post->status = 'draft';
            $post->save();
            $drafted++;
            echo "Drafted: " . $post->title . " (Words: $wordCount)\n";
        }
    }
    echo "Drafted $drafted thin content posts.\n";
    
    // 3. Clear Sitemap Cache
    if (method_exists(BlogPost::class, 'forgetPublicSitemapCache')) {
        BlogPost::forgetPublicSitemapCache();
        echo "Sitemap cache cleared.\n";
    }
    
    echo "Done!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
