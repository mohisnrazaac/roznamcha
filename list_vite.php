<?php
echo shell_exec("ls -la ../public_html/build/.vite");
echo "\n\n";
echo file_get_contents("../public_html/build/.vite/manifest.json");
