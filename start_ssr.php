<?php
header('Content-Type: text/plain');

$node = '/opt/alt/alt-nodejs20/root/usr/bin/node';
$bundle = '/home/roznamch/rozapp/bootstrap/ssr/ssr.js';
$log = '/home/roznamch/rozapp/storage/logs/ssr.log';

$cmd = "nohup $node $bundle > $log 2>&1 &";
echo "Running: $cmd
";
shell_exec($cmd);

sleep(2);

$ch = curl_init('http://127.0.0.1:13714/health');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 3);
$res = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

echo "HEALTH: " . ($res ? $res : 'ERROR: ' . $err) . "
";
echo "LOG:
" . (file_exists($log) ? file_get_contents($log) : 'NO LOG') . "
";

unlink(__FILE__);
