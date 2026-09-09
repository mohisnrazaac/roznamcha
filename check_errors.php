<?php
echo "--- PHP ERROR LOG ---\n";
echo shell_exec("tail -n 20 ../rozapp/storage/logs/laravel.log");
