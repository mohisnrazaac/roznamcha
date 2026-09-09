<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $response = Illuminate\Support\Facades\Http::withToken(config('services.ai.api_key'))
        ->post(config('ai.base_url'), [
            'model' => config('ai.model'),
            'messages' => [['role' => 'user', 'content' => 'hi']]
        ]);
    echo $response->status() . " " . $response->body();
} catch (Exception $e) {
    echo $e->getMessage();
}
