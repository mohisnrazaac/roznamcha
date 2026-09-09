<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

\Artisan::call('config:clear');
\Artisan::call('cache:clear');
\Artisan::call('view:clear');
\Artisan::call('route:clear');
if (function_exists('opcache_reset')) {
    @opcache_reset();
}
echo "Cache cleared.";
unlink(__FILE__);
