<?php

$configPath = 'config/blog_cleanup.php';
$content = file_get_contents($configPath);

$slugsToRemove = [
    "'pakistan-fuel-quota-system-petrol-price-april-2026',",
    "'pakistan-petrol-price-april-2026-rs458-budget-guide',",
    "'fuel-price-impact-on-commodity-prices-pakistan-2026',"
];

foreach ($slugsToRemove as $slug) {
    $content = str_replace($slug . "\n", "", $content);
    $content = str_replace($slug . "\r\n", "", $content);
    $content = str_replace($slug, "", $content); // fallback
}

file_put_contents($configPath, $content);
echo "Config patched.\n";
