<?php
$urls = [
    'https://roznamcha.pk/',
    'https://roznamcha.pk/about',
    'https://roznamcha.pk/contact',
    'https://roznamcha.pk/privacy-policy',
    'https://roznamcha.pk/terms',
    'https://roznamcha.pk/cookie-policy',
    'https://roznamcha.pk/blog',
    'https://roznamcha.pk/sitemap.xml',
    'https://roznamcha.pk/ads.txt',
    'https://roznamcha.pk/tools/monthly-household-budget-calculator',
    'https://roznamcha.pk/tools/school-fees-planner',
    'https://roznamcha.pk/tools/electricity-bill-estimator',
    'https://roznamcha.pk/tools/ration-cost-estimator',
    // The two posts the user asked about
    'https://roznamcha.pk/blog/how-to-use-digital-roznamcha-for-business-and-personal-finance-2025',
    'https://roznamcha.pk/blog/pakistani-household-essential-expenses-2026',
    // Some published posts
    'https://roznamcha.pk/blog/pakistani-family-monthly-expense-control',
    'https://roznamcha.pk/blog/current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan',
    'https://roznamcha.pk/blog/roznamcha-with-ai'
];

$results = [];
foreach ($urls as $url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true); // just HEAD
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $results[] = sprintf("| %s | %s |", $status, $url);
}

file_put_contents('/Users/shadowwalker/.gemini/antigravity/brain/c9cb21d8-9887-419b-8149-516a8d5f3272/production_web_report.md', 
"# Production Live Link Report\n\n| HTTP Status | URL |\n| --- | --- |\n" . implode("\n", $results));
