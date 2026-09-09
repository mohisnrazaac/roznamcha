<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BlogPost;
use App\Services\AiService;
use Illuminate\Support\Str;

$aiService = new AiService();
$posts = BlogPost::where('status', 'draft')
    ->whereNotIn('slug', [
        'fuel-price-impact-on-commodity-prices-pakistan-2026', 
        'pakistan-petrol-price-april-2026-rs458-budget-guide'
    ])
    ->limit(2)
    ->get();

echo "Found " . $posts->count() . " posts to rewrite in this batch.\n<br>";

foreach ($posts as $post) {
    $wordCount = str_word_count(strip_tags($post->content ?? ''));
    if ($wordCount >= 800) {
        continue;
    }

    echo "Rewriting: {$post->slug} (Currently {$wordCount} words)\n<br>";

    $prompt = "You are an expert Pakistani financial copywriter. Write a comprehensive, 1000+ word SEO-optimized article about '{$post->title}'. 
Original excerpt: '" . Str::limit(strip_tags($post->content), 300) . "'.
Make it highly detailed, using proper HTML tags (<h2>, <ul>, <li>). Include real-world Pakistani context (Rs, inflation, utility stores). Output strictly as a JSON object with a single key 'content' containing the HTML string.";

    $response = $aiService->sendPrompt($prompt, 1, 'blog_rewrite');
    
    if ($response['error']) {
        echo "AI Error for {$post->slug}: {$response['error']}\n<br>";
        continue;
    }

    $decoded = $response['decoded'];
    if (isset($decoded['content']) && strlen($decoded['content']) > 500) {
        $post->content = $decoded['content'];
        $post->status = 'published';
        $post->save();
        echo "Success! Expanded {$post->slug} to " . str_word_count(strip_tags($post->content)) . " words.\n<br>";
    } else {
        echo "Failed to extract valid content for {$post->slug}.\n<br>";
    }
}

if (method_exists(BlogPost::class, 'forgetPublicSitemapCache')) {
    BlogPost::forgetPublicSitemapCache();
}
echo "Batch complete.\n";
