<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;
use App\Models\BlogPost;

$urls = [
    'https://roznamcha.pk/',
    'https://roznamcha.pk/about',
    'https://roznamcha.pk/contact',
    'https://roznamcha.pk/privacy',
    'https://roznamcha.pk/terms',
    'https://roznamcha.pk/cookie-policy',
    'https://roznamcha.pk/features',
    'https://roznamcha.pk/features/expense-tracker-pakistan',
    'https://roznamcha.pk/blog',
    'https://roznamcha.pk/tools/monthly-household-budget-calculator',
    'https://roznamcha.pk/tools/school-fees-planner',
    'https://roznamcha.pk/tools/electricity-bill-estimator',
    'https://roznamcha.pk/tools/ration-cost-estimator',
    'https://roznamcha.pk/sitemap.xml',
    'https://roznamcha.pk/ads.txt'
];

// Add all published blog posts
$posts = BlogPost::where('status', 'published')->get();
foreach($posts as $post) {
    $urls[] = "https://roznamcha.pk/blog/" . $post->slug;
}

// Add blog categories based on the posts
$categories = \App\Models\BlogCategory::all();
foreach($categories as $category) {
    $urls[] = "https://roznamcha.pk/blog/category/" . $category->slug;
}

echo "Starting crawl of " . count($urls) . " internal URLs...\n\n";

$results = [];
foreach ($urls as $url) {
    try {
        $response = Http::timeout(5)->get($url);
        $status = $response->status();
        
        if ($status !== 200) {
            $results[] = "[{$status}] {$url}";
        }
    } catch (\Exception $e) {
        $results[] = "[ERROR] {$url} - " . $e->getMessage();
    }
}

if (empty($results)) {
    echo "SUCCESS: All " . count($urls) . " URLs returned 200 OK.\n";
} else {
    echo "FOUND ISSUES:\n";
    foreach ($results as $res) {
        echo $res . "\n";
    }
}
