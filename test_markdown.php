<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
use Illuminate\Support\Str;
$input = <<<'EOT'
If you are running a household in Pakistan today, you already know the truth. Income stays mostly the same while expenses quietly grow every month. Grocery bills jump without warning. Electricity units cost more than last year. School fees increase once or twice a year. Fuel prices change faster than salaries. This is not poor planning. This is the economic reality most Pakistani families are living in.

The mistake many households make is believing that expense control means suffering. It does not. Smart expense control is about visibility, discipline, and small consistent decisions. It is not about removing comfort or dignity from life.

Let’s break this down in a way that actually works in Pakistan.

First, understand where money is actually going
Most families think they know their expenses. They do not. Ask anyone how much they spend on groceries every month and you will get a rough guess. That guess is usually wrong.
EOT;
echo Str::markdown($input);
