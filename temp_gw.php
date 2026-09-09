<?php
header('Content-Type: text/plain');
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo 'SSR ENABLED: ' . var_export(config('inertia.ssr.enabled'), true) . "
";
echo 'SSR URL: ' . config('inertia.ssr.url') . "
";
echo 'SSR BUNDLE: ' . config('inertia.ssr.bundle') . " (exists: " . var_export(file_exists(config('inertia.ssr.bundle')), true) . ")
";

// Test gateway directly
$gateway = app(\Inertia\Ssr\Gateway::class);
$page = [
    'component' => 'Public/Features',
    'props' => ['seo' => [], 'jsonLd' => []],
    'url' => '/features',
    'version' => ''
];
$res = $gateway->dispatch($page);
echo 'GATEWAY DISPATCH: ' . var_export($res !== null, true) . "
";
if ($res) {
    echo 'BODY PREVIEW: ' . substr($res->body, 0, 300) . "
";
}
unlink(__FILE__);
