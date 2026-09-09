<?php
header('Content-Type: text/plain');
echo 'DISABLE FUNCTIONS: ' . ini_get('disable_functions') . "
";
unlink(__FILE__);
