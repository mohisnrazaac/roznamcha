<?php
header('Content-Type: text/plain');

echo "Current processes before kill:\n";
echo shell_exec("ps aux | grep ssr.js") . "\n";

// Kill any running ssr.js processes
shell_exec("pkill -9 -f 'bootstrap/ssr/ssr.js'");
sleep(1);

echo "Starting new SSR process...\n";
$cmd = 'nohup /opt/alt/alt-nodejs20/root/usr/bin/node /home/roznamch/rozapp/bootstrap/ssr/ssr.js > /home/roznamch/rozapp/storage/logs/ssr.log 2>&1 &';
shell_exec($cmd);
sleep(2);

echo "Processes after start:\n";
echo shell_exec("ps aux | grep ssr.js") . "\n";
unlink(__FILE__);
