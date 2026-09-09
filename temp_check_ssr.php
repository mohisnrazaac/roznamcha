<?php
echo "PS NODE:
";
echo shell_exec('ps aux | grep node');
echo "
INERTIA SSR CHECK:
";
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
try {
    \Artisan::call('inertia:check-ssr');
    echo \Artisan::output();
} catch (\Throwable $e) {
    echo $e->getMessage();
}
unlink(__FILE__);
