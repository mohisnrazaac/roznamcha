<?php
header('Content-Type: text/plain');
echo "=== PS NODE ===
";
echo shell_exec('ps aux | grep -i node') . "
";
echo "=== PM2 ===
";
echo shell_exec('pm2 list 2>&1') . "
";
unlink(__FILE__);
