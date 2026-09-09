<?php
echo shell_exec("rm -rf ../rozapp/public/build");
echo shell_exec("cp -r ../public_html/build ../rozapp/public/build");
echo "Build copied to rozapp/public/build.";
