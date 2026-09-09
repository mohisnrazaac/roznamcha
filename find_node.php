<?php
header('Content-Type: text/plain');

$candidates = [
    '/usr/bin/node',
    '/usr/local/bin/node',
    '/bin/node',
    '/opt/cpanel/ea-nodejs18/bin/node',
    '/opt/cpanel/ea-nodejs20/bin/node',
    '/opt/cpanel/ea-nodejs22/bin/node',
    '/opt/alt/alt-nodejs18/root/usr/bin/node',
    '/opt/alt/alt-nodejs20/root/usr/bin/node',
    '/home/roznamch/.nvm/versions/node/*/bin/node',
];

foreach ($candidates as $c) {
    $matches = glob($c);
    if (!empty($matches)) {
        foreach ($matches as $m) {
            echo "FOUND: $m (" . trim(shell_exec("$m -v 2>&1")) . ")
";
        }
    }
}

echo "
PATH: " . getenv('PATH') . "
";
echo "WHICH: " . trim(shell_exec('which node 2>&1')) . "
";
unlink(__FILE__);
