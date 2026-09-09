<?php
header('Content-Type: text/plain');

echo "disable_functions: " . ini_get('disable_functions') . "
";
echo "whoami: " . exec('whoami') . "
";
echo "node: " . exec('/opt/alt/alt-nodejs20/root/usr/bin/node -v 2>&1') . "
";

unlink(__FILE__);
