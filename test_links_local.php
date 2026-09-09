<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;
use App\Models\BlogPost;
use App\Models\BlogCategory;

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

$posts = BlogPost::where('status', 'published')->get();
foreach($posts as $post) {
    $urls[] = "https://roznamcha.pk/blog/" . $post->slug;
}

$categories = BlogCategory::all();
foreach($categories as $category) {
    $urls[] = "https://roznamcha.pk/blog/category/" . $category->slug;
}

$issues = [];
foreach ($urls as $url) {
    try {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($status !== 200) {
            $issues[] = "[{$status}] {$url}";
        }
    } catch (\Exception $e) {
        $issues[] = "[ERROR] {$url} - " . $e->getMessage();
    }
}

if (empty($issues)) {
    echo "SUCCESS: All " . count($urls) . " URLs returned 200 OK.\n";
} else {
    echo "FOUND ISSUES:\n";
    foreach ($issues as $issue) {
        echo $issue . "\n";
    }
}
