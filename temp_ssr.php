<?php
header('Content-Type: text/plain');

function check_health() {
    $ch = curl_init('http://127.0.0.1:13714/health');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);
    $res = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);
    return $res ? $res : 'ERROR: ' . $err;
}

echo "1. HEALTH BEFORE: " . check_health() . "
";

// Send shutdown
$ch = curl_init('http://127.0.0.1:13714/shutdown');
curl_setopt($ch, CURLOPT_TIMEOUT, 2);
curl_exec($ch);
curl_close($ch);

sleep(2);
echo "2. HEALTH AFTER SHUTDOWN: " . check_health() . "
";

// If down, start it using check-ssr.sh or node
if (strpos(check_health(), 'ERROR') !== false) {
    echo "Attempting restart...
";
    shell_exec('/bin/bash /home/roznamch/rozapp/check-ssr.sh > /dev/null 2>&1 &');
    sleep(2);
    echo "3. HEALTH AFTER RESTART: " . check_health() . "
";
}

unlink(__FILE__);
