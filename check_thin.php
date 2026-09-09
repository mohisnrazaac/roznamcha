<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$post = \App\Models\BlogPost::where('slug', 'smart-household-budgeting-tips')->first();
echo "Words: " . str_word_count(strip_tags($post->content)) . "\n";
echo "Content: \n" . substr(strip_tags($post->content), 0, 200) . "...\n";
