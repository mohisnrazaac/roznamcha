<?php
header('Content-Type: text/plain');

 = [];
 = 0;
// Test running node on the ssr.js bundle for 1 second or checking syntax
exec('/opt/alt/alt-nodejs20/root/usr/bin/node -c /home/roznamch/rozapp/bootstrap/ssr/ssr.js 2>&1', , );
echo "check syntax ret: 
" . implode("
", ) . "
";

unlink(__FILE__);
