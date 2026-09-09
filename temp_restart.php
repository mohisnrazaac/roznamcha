<?php
header('Content-Type: text/plain');

// Let's find PID on port 13714
$pid = trim(shell_exec('fuser 13714/tcp 2>/dev/null'));
if (!$pid) {
    // Try lsof
    $lsof = shell_exec('lsof -t -i:13714 2>/dev/null');
    $pid = trim($lsof);
}

echo "PID on 13714: {$pid}
";
if ($pid) {
    echo "Killing {$pid}...
";
    posix_kill((int)$pid, SIGTERM);
    sleep(1);
}

// Check watchdog or start new
echo "Starting node ssr.js...
";
$cmd = 'nohup node /home/roznamch/rozapp/bootstrap/ssr/ssr.js > /home/roznamch/rozapp/storage/logs/ssr.log 2>&1 &';
shell_exec($cmd);
sleep(1);

$newPid = trim(shell_exec('fuser 13714/tcp 2>/dev/null'));
echo "New PID on 13714: {$newPid}
";

unlink(__FILE__);
