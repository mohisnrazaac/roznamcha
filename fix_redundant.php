<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle($request = Illuminate\Http\Request::capture());

use App\Models\BlogPost;

try {
    $slugs = [
        'fuel-price-impact-on-commodity-prices-pakistan-2026',
        'pakistan-petrol-price-april-2026-rs458-budget-guide'
    ];
    
    foreach($slugs as $slug) {
        $post = BlogPost::where('slug', $slug)->first();
        if ($post) {
            $post->status = 'draft';
            $post->save();
            echo "Drafted: " . $slug . "\n";
        }
    }
    if (method_exists(BlogPost::class, 'forgetPublicSitemapCache')) {
        BlogPost::forgetPublicSitemapCache();
    }
    echo "Done!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
