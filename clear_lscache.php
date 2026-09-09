<?php
echo shell_exec("rm -rf ../lscache/*");
echo "lscache folder emptied.";
unlink(__FILE__);
