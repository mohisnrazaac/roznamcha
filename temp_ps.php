<?php
echo '<pre>';
echo "WHOAMI: " . exec('whoami') . "
";
echo "PS NODE:
" . shell_exec('ps aux | grep node') . "
";
echo "PORT 13714 LISTEN:
" . shell_exec('netstat -tlpn 2>&1 | grep 13714') . "
";
unlink(__FILE__);
