<?php

declare(strict_types=1);

$configFile = $argv[1] ?? 'config/adsense_article_rewrites.php';
$configPath = __DIR__.'/'.ltrim($configFile, '/');

if (! is_file($configPath)) {
    fwrite(STDERR, "Rewrite config not found: {$configFile}\n");
    exit(1);
}

$config = require $configPath;
$posts = $config['posts'] ?? [];

if (count($posts) !== 5) {
    fwrite(STDERR, "Expected exactly five article rewrites.\n");
    exit(1);
}

$quote = static function (?string $value): string {
    if ($value === null) {
        return 'NULL';
    }

    return "'".str_replace(["\\", "'"], ["\\\\", "''"], $value)."'";
};

$slugs = array_keys($posts);
$slugList = implode(",\n    ", array_map($quote, $slugs));

echo <<<'SQL'
-- Roznamcha: five reviewed AdSense article rewrites
-- Generated from a reviewed rewrite configuration file
-- Take a database backup first. These statements update existing rows only.

SET NAMES utf8mb4;

-- PRE-FLIGHT: this result must be exactly 5 before continuing.
SELECT COUNT(*) AS matching_posts
FROM blog_posts
WHERE slug IN (
SQL;
echo "    {$slugList}\n);\n\n";
echo "START TRANSACTION;\n\n";

foreach ($posts as $slug => $post) {
    $values = [
        'title' => $post['title'],
        'excerpt' => $post['excerpt'],
        'content' => $post['content'],
        'content_format' => 'html',
        'seo_title' => $post['seo_title'],
        'seo_description' => $post['seo_description'],
        'seo_keywords' => $post['seo_keywords'],
        'language' => $post['language'] ?? 'en',
        'canonical_url' => 'https://roznamcha.pk/blog/'.$slug,
        'status' => 'published',
    ];

    echo "UPDATE blog_posts\nSET\n";
    $assignments = [];
    foreach ($values as $column => $value) {
        $assignments[] = "    `{$column}` = ".$quote($value);
    }
    $assignments[] = '    `updated_at` = CURRENT_TIMESTAMP';
    echo implode(",\n", $assignments);
    echo "\nWHERE `slug` = ".$quote($slug).";\n";
    echo "SELECT ROW_COUNT() AS rows_updated, ".$quote($slug)." AS slug;\n\n";
}

echo <<<'SQL'
-- VERIFY BEFORE COMMIT: inspect these five rows.
SELECT slug, title, status, content_format, canonical_url, updated_at
FROM blog_posts
WHERE slug IN (
SQL;
echo "    {$slugList}\n)\nORDER BY slug;\n\n";
echo "COMMIT;\n";
