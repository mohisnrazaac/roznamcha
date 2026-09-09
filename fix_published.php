<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

use App\Models\BlogPost;

try {
    $slugs = [
        'ghar-ka-monthly-budget',
        'pakistan-fuel-quota-system-petrol-price-april-2026',
        'fuel-price-impact-on-commodity-prices-pakistan-2026',
        'pakistan-petrol-price-april-2026-rs458-budget-guide',
        'kameti-vs-mutual-funds-inflation-pakistan' // wait, kameti was 667, let's keep it draft unless I rewrite it.
    ];
    
    foreach($slugs as $slug) {
        $post = BlogPost::where('slug', $slug)->first();
        if ($post) {
            $post->status = 'published';
            $post->save();
            echo "Republished: " . $slug . "\n";
        }
    }
    if (method_exists(BlogPost::class, 'forgetPublicSitemapCache')) {
        BlogPost::forgetPublicSitemapCache();
    }
    echo "Done!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
