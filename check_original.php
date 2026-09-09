<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$slugs = [
    'pakistani-family-monthly-expense-control',
    'current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan',
    'best-monthly-budget-50000-salary-pakistan-2026',
    'kameti-vs-mutual-funds-inflation-pakistan',
    'pakistan-inflation-9-2-percent-july-2026-household-budget'
];

foreach($slugs as $slug) {
    $post = \App\Models\BlogPost::where('slug', $slug)->first();
    if($post) {
        $wc = str_word_count(strip_tags($post->content));
        echo "- " . $slug . " (" . $wc . " words)\n";
    }
}
