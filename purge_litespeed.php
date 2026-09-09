<?php
// Try to send LiteSpeed purge header
header("X-LiteSpeed-Purge: *");
echo "Purge header sent.";
