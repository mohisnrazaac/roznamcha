<?php
header('Content-Type: text/plain');
echo 'PATH: ' . getenv('PATH') . "
";
echo 'WHICH NODE: ' . shell_exec('which node 2>&1') . "
";
echo 'FIND NODE: ' . shell_exec('find / -name node 2>/dev/null | head -n 5') . "
";
unlink(__FILE__);
