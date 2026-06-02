<?php
// Purpose: One-time production AdSense cleanup fixer based on the 2026-06-02 audit. Delete after use.

declare(strict_types=1);

use App\Models\BlogPost;
use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;

set_time_limit(0);
header('Content-Type: application/json; charset=utf-8');

$root = resolveProjectRoot(__DIR__);

if (! is_file($root.'/vendor/autoload.php') || ! is_file($root.'/bootstrap/app.php')) {
    http_response_code(500);
    echo json_encode(['error' => 'Laravel bootstrap files not found.'], JSON_PRETTY_PRINT);
    exit;
}

chdir($root);
require $root.'/vendor/autoload.php';

$app = require $root.'/bootstrap/app.php';

/** @var ConsoleKernel $consoleKernel */
$consoleKernel = $app->make(ConsoleKernel::class);
$consoleKernel->bootstrap();

$report = [
    'started_at' => now()->toIso8601String(),
    'mode' => 'one_time_adsense_cleanup_fix',
    'database_writes' => false,
    'files' => [],
    'cache' => [],
    'warnings' => [],
    'next_step' => 'Run /adsense-production-audit.php again. Delete this fixer after one successful run.',
];

try {
    $programmaticPageTypes = ['petrol', 'electricity', 'ration'];
    $templateSlugs = [
        'student-budget',
        '50k-salary-survival-guide',
        '100k-family-budget',
        'joint-family-budget',
    ];

    $thinBlogSlugs = [
        'basant-2026-lahore-kite-prices-household-cost',
        'inflation-household-budget-pakistan-2026',
        'petrol-prices-today-pakistan-2026-monthly-budget-impact',
        'utility-store-vs-open-market-price-comparison-2026-pakistan',
        'new-utility-store-price-list-january-2026-today-subsidized-rates',
        'gold-rates-vs-monthly-savings-household-budget-2026',
        'gold-price-prediction-2026-daily-gold-rate-pakistan',
        'how-to-use-digital-roznamcha-for-business-and-personal-finance-2025',
    ];

    $seoConfig = config('roznamcha_seo', []);
    $seoConfig['search_surface'] = array_replace($seoConfig['search_surface'] ?? [], [
        'noindex_page_types' => $programmaticPageTypes,
        'noindex_template_slugs' => $templateSlugs,
    ]);
    $seoConfig['search_surface']['noindex_blog_category_slugs'] = array_values(array_unique(array_merge(
        array_filter($seoConfig['search_surface']['noindex_blog_category_slugs'] ?? [], 'is_string'),
        [
            'fuel-prices-hike',
            'household-tips',
            'inflation-watch',
            'personal-finance-pakistan',
        ]
    )));

    writeConfigFile($root.'/config/roznamcha_seo.php', $seoConfig, $report, 'roznamcha_seo');
    config()->set('roznamcha_seo', $seoConfig);

    $blogCleanup = config('blog_cleanup', []);
    $blogCleanup['noindex_slugs'] = array_values(array_unique(array_merge(
        array_filter($blogCleanup['noindex_slugs'] ?? [], 'is_string'),
        $thinBlogSlugs
    )));
    $blogCleanup['redirects'] = array_filter($blogCleanup['redirects'] ?? [], fn ($value, $key) => is_string($key) && is_string($value), ARRAY_FILTER_USE_BOTH);
    $blogCleanup['remove_slugs'] = array_values(array_unique(array_filter($blogCleanup['remove_slugs'] ?? [], 'is_string')));
    $blogCleanup['temporary_keep_slugs'] = array_values(array_unique(array_filter($blogCleanup['temporary_keep_slugs'] ?? [], 'is_string')));

    writeConfigFile($root.'/config/blog_cleanup.php', $blogCleanup, $report, 'blog_cleanup');
    config()->set('blog_cleanup', $blogCleanup);

    writeRobotsFile($root.'/public/robots.txt', $report);

    foreach ([
        'config:clear',
        'route:clear',
        'view:clear',
        'cache:clear',
        'optimize:clear',
    ] as $command) {
        try {
            Artisan::call($command);
            $report['cache'][$command] = trim(Artisan::output()) ?: 'ok';
        } catch (Throwable $throwable) {
            $report['cache'][$command] = 'failed: '.$throwable->getMessage();
        }
    }

    foreach ([
        'sitemap:xml',
        'sitemap:xml:v2',
        'sitemap:xml:v3',
        'sitemap:templates:xml',
        'sitemap:templates:xml:v2',
    ] as $key) {
        Cache::forget($key);
        $report['cache']['forgot'][] = $key;
    }

    foreach (config('roznamcha_seo.cities', []) as $city) {
        Cache::forget('seo:page:petrol:'.$city);
        Cache::forget('seo:snapshot:petrol:'.$city);
    }

    foreach (config('roznamcha_seo.discos', []) as $disco) {
        Cache::forget('seo:page:electricity:'.$disco);
        Cache::forget('seo:snapshot:electricity:'.$disco);
    }

    foreach (config('roznamcha_seo.family_sizes', []) as $familySize) {
        Cache::forget('seo:page:ration:'.$familySize);
        Cache::forget('seo:snapshot:ration:'.$familySize);
    }

    if (class_exists(BlogPost::class)) {
        BlogPost::forgetPublicSitemapCache();
    }

    if (! class_exists(\App\Seo\SearchSurfacePolicy::class)) {
        $report['warnings'][] = 'App\\Seo\\SearchSurfacePolicy is missing. Upload the latest app/Seo/SearchSurfacePolicy.php and related controller changes for template detail noindex support.';
    }

    $report['finished_at'] = now()->toIso8601String();
    $report['expected_effect'] = [
        'programmatic_pages' => 'noindex,follow and removed from main sitemap',
        'template_detail_pages' => 'noindex,follow and removed from both sitemaps when latest code is uploaded',
        'thin_blog_posts' => 'noindex,follow and removed from public archive/sitemap without changing post status',
        'robots_txt' => 'keeps user access open and advertises both sitemaps',
    ];

    echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $throwable) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Fix failed.',
        'message' => $throwable->getMessage(),
        'file' => $throwable->getFile(),
        'line' => $throwable->getLine(),
        'partial_report' => $report,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

function writeConfigFile(string $path, array $config, array &$report, string $name): void
{
    if (! is_file($path)) {
        throw new RuntimeException("Config file missing: {$path}");
    }

    $backup = $path.'.adsense-backup-'.date('Ymd-His');
    if (! copy($path, $backup)) {
        throw new RuntimeException("Unable to create backup for {$path}");
    }

    $content = "<?php\n\nreturn ".var_export($config, true).";\n";

    if (file_put_contents($path, $content, LOCK_EX) === false) {
        throw new RuntimeException("Unable to write config file: {$path}");
    }

    $report['files'][$name] = [
        'path' => $path,
        'backup' => $backup,
        'written' => true,
    ];
}

function writeRobotsFile(string $path, array &$report): void
{
    if (is_file($path)) {
        $backup = $path.'.adsense-backup-'.date('Ymd-His');
        if (! copy($path, $backup)) {
            throw new RuntimeException("Unable to create backup for {$path}");
        }
    } else {
        $backup = null;
    }

    $content = implode("\n", [
        'User-agent: *',
        'Allow: /',
        'Disallow: /dashboard',
        'Disallow: /panel',
        'Disallow: /admin',
        'Disallow: /auth',
        'Disallow: /api/internal',
        'Sitemap: https://roznamcha.pk/sitemap.xml',
        'Sitemap: https://roznamcha.pk/templates-sitemap.xml',
        '',
    ]);

    if (file_put_contents($path, $content, LOCK_EX) === false) {
        throw new RuntimeException("Unable to write robots file: {$path}");
    }

    $report['files']['robots_txt'] = [
        'path' => $path,
        'backup' => $backup,
        'written' => true,
    ];
}

function resolveProjectRoot(string $startDir): string
{
    $start = realpath($startDir) ?: $startDir;
    $queue = [[$start, 0]];
    $seen = [];

    while ($queue !== []) {
        [$current, $depth] = array_shift($queue);
        if (isset($seen[$current])) {
            continue;
        }

        $seen[$current] = true;

        if (is_file($current.'/artisan') && is_file($current.'/bootstrap/app.php')) {
            return $current;
        }

        if ($depth >= 5) {
            continue;
        }

        $parent = dirname($current);
        if ($parent && $parent !== $current) {
            $queue[] = [$parent, $depth + 1];
        }

        foreach (glob($current.'/*', GLOB_ONLYDIR) ?: [] as $child) {
            $queue[] = [$child, $depth + 1];
        }
    }

    return dirname($startDir);
}
