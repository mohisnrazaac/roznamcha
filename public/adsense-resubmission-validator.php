<?php
// Purpose: Read-only AdSense resubmission readiness validator. Delete after final verification.

declare(strict_types=1);

use App\Models\BlogPost;
use App\Models\BudgetTemplate;
use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

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

/** @var HttpKernel $httpKernel */
$httpKernel = $app->make(HttpKernel::class);

$baseUrl = rtrim((string) config('roznamcha_seo.base_url', config('app.url')), '/');
$report = [
    'generated_at' => now()->toIso8601String(),
    'app_env' => config('app.env'),
    'base_url' => $baseUrl,
    'mode' => 'read_only_adsense_resubmission_validator',
    'ready_for_adsense_resubmission' => false,
    'recommended_wait_window' => 'Wait 24-48 hours after this report passes before AdSense resubmission.',
    'summary' => [],
    'checks' => [],
    'failures' => [],
    'warnings' => [],
];

$corePaths = [
    '/',
    '/features',
    '/kharcha-map',
    '/ration-brain',
    '/survival-report',
    '/tools/ration-cost-estimator',
    '/tools/school-fees-planner',
    '/tools/electricity-bill-estimator',
    '/templates',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
];

$templateSlugs = array_values(array_filter(config('roznamcha_seo.search_surface.noindex_template_slugs', []), 'is_string'));
$programmaticPaths = [
    ...array_map(fn (string $city) => "/petrol-price-{$city}-today", config('roznamcha_seo.cities', [])),
    ...array_map(fn (string $disco) => "/electricity-bill-calculator-{$disco}", config('roznamcha_seo.discos', [])),
    ...array_map(fn (int|string $size) => "/ration-cost-for-{$size}-people-pakistan", config('roznamcha_seo.family_sizes', [])),
];
$excludedPaths = [
    ...array_map(fn (string $slug) => "/templates/{$slug}", $templateSlugs),
    ...$programmaticPaths,
];

try {
    $robotsUrl = $baseUrl.'/robots.txt';
    $liveRobots = fetchUrl($robotsUrl);
    $localRobots = is_file($root.'/public/robots.txt') ? (string) file_get_contents($root.'/public/robots.txt') : '';

    $report['checks']['robots_txt'] = [
        'url' => $robotsUrl,
        'live_status' => $liveRobots['status'],
        'live_has_main_sitemap' => str_contains($liveRobots['body'], 'Sitemap: '.$baseUrl.'/sitemap.xml'),
        'live_has_templates_sitemap' => str_contains($liveRobots['body'], 'Sitemap: '.$baseUrl.'/templates-sitemap.xml'),
        'live_blocks_template_or_programmatic_pages' => preg_match('/Disallow:\s*\/(templates|petrol-price|electricity-bill-calculator|ration-cost-for)\b/i', $liveRobots['body']) === 1,
        'local_has_main_sitemap' => str_contains($localRobots, 'Sitemap: https://roznamcha.pk/sitemap.xml'),
        'local_has_templates_sitemap' => str_contains($localRobots, 'Sitemap: https://roznamcha.pk/templates-sitemap.xml'),
    ];

    if ($liveRobots['status'] !== 200) {
        addFailure($report, 'robots_txt_not_200', 'Live robots.txt must return HTTP 200.', $report['checks']['robots_txt']);
    }

    if (! $report['checks']['robots_txt']['live_has_main_sitemap'] || ! $report['checks']['robots_txt']['live_has_templates_sitemap']) {
        addFailure($report, 'robots_txt_missing_sitemap_lines', 'Live robots.txt must advertise both sitemap.xml and templates-sitemap.xml.', $report['checks']['robots_txt']);
    }

    if ($report['checks']['robots_txt']['live_blocks_template_or_programmatic_pages']) {
        addFailure($report, 'robots_txt_blocks_noindex_pages', 'Do not block noindex cleanup pages in robots.txt; let crawlers see noindex,follow.');
    }

    $mainSitemap = dispatchPath($httpKernel, '/sitemap.xml', $baseUrl);
    $templatesSitemap = dispatchPath($httpKernel, '/templates-sitemap.xml', $baseUrl);
    $mainUrls = extractSitemapUrls($mainSitemap['body']);
    $templateUrls = extractSitemapUrls($templatesSitemap['body']);

    $expectedMainCount = expectedMainSitemapCount();
    $report['checks']['sitemaps'] = [
        'main_status' => $mainSitemap['status'],
        'main_url_count' => count($mainUrls),
        'expected_main_url_count' => $expectedMainCount,
        'templates_status' => $templatesSitemap['status'],
        'templates_url_count' => count($templateUrls),
        'expected_templates_url_count' => 1,
        'missing_core_urls' => [],
        'excluded_urls_in_main_sitemap' => [],
        'excluded_urls_in_templates_sitemap' => [],
    ];

    foreach ($corePaths as $path) {
        $url = absoluteUrl($baseUrl, $path);
        if (! in_array($url, $mainUrls, true)) {
            $report['checks']['sitemaps']['missing_core_urls'][] = $url;
        }
    }

    foreach ($excludedPaths as $path) {
        $url = absoluteUrl($baseUrl, $path);
        if (in_array($url, $mainUrls, true)) {
            $report['checks']['sitemaps']['excluded_urls_in_main_sitemap'][] = $url;
        }
        if (in_array($url, $templateUrls, true)) {
            $report['checks']['sitemaps']['excluded_urls_in_templates_sitemap'][] = $url;
        }
    }

    if ($mainSitemap['status'] !== 200 || $templatesSitemap['status'] !== 200) {
        addFailure($report, 'sitemaps_not_200', 'Both sitemap endpoints must return HTTP 200.', $report['checks']['sitemaps']);
    }

    if (count($mainUrls) !== $expectedMainCount || count($templateUrls) !== 1) {
        addFailure($report, 'unexpected_sitemap_counts', 'Sitemap URL counts do not match the expected cleanup state.', $report['checks']['sitemaps']);
    }

    if ($report['checks']['sitemaps']['missing_core_urls'] !== []) {
        addFailure($report, 'core_urls_missing_from_sitemap', 'Core AdSense-safe URLs must remain in sitemap.', $report['checks']['sitemaps']['missing_core_urls']);
    }

    if ($report['checks']['sitemaps']['excluded_urls_in_main_sitemap'] !== [] || $report['checks']['sitemaps']['excluded_urls_in_templates_sitemap'] !== []) {
        addFailure($report, 'excluded_urls_still_in_sitemaps', 'Noindex/template/programmatic URLs must stay out of sitemaps.', [
            'main' => $report['checks']['sitemaps']['excluded_urls_in_main_sitemap'],
            'templates' => $report['checks']['sitemaps']['excluded_urls_in_templates_sitemap'],
        ]);
    }

    foreach ($excludedPaths as $path) {
        $check = checkPage($httpKernel, $baseUrl, $path);
        $report['checks']['excluded_pages'][$path] = $check;

        if ($check['status'] !== 200 || ! $check['has_noindex_follow']) {
            addFailure($report, 'excluded_page_not_noindex_follow', "{$path} must be HTTP 200 and render noindex,follow.", $check);
        }
    }

    foreach ($corePaths as $path) {
        $check = checkPage($httpKernel, $baseUrl, $path);
        $report['checks']['core_pages'][$path] = $check;

        if ($check['status'] !== 200 || $check['has_noindex_follow']) {
            addFailure($report, 'core_page_not_indexable', "{$path} must be HTTP 200 and must not render noindex,follow.", $check);
        }
    }

    $cleanupScripts = [
        '/adsense-production-audit.php' => is_file($root.'/public/adsense-production-audit.php'),
        '/adsense-production-fix.php' => is_file($root.'/public/adsense-production-fix.php'),
    ];

    $report['checks']['cleanup_scripts'] = $cleanupScripts;
    foreach ($cleanupScripts as $script => $exists) {
        if ($exists) {
            $report['warnings'][] = [
                'code' => 'cleanup_script_still_exists',
                'message' => "{$script} still exists. Delete it after final validation.",
            ];
        }
    }

    $report['ready_for_adsense_resubmission'] = $report['failures'] === [];
    $report['summary'] = [
        'status' => $report['ready_for_adsense_resubmission'] ? 'ready_after_24_48_hour_wait' : 'not_ready',
        'failure_count' => count($report['failures']),
        'warning_count' => count($report['warnings']),
        'main_sitemap_url_count' => count($mainUrls),
        'templates_sitemap_url_count' => count($templateUrls),
        'public_blog_archive_visible_count' => Schema::hasTable('blog_posts') ? BlogPost::query()->publicArchiveVisible()->count() : null,
        'indexable_template_detail_count' => Schema::hasTable('budget_templates')
            ? BudgetTemplate::query()->whereNotIn('slug', $templateSlugs)->count()
            : null,
    ];

    echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $throwable) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Validation failed.',
        'message' => $throwable->getMessage(),
        'file' => $throwable->getFile(),
        'line' => $throwable->getLine(),
        'partial_report' => $report,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

function expectedMainSitemapCount(): int
{
    $staticCount = 14;
    $blogCount = Schema::hasTable('blog_posts') ? BlogPost::query()->publicArchiveVisible()->count() : 0;
    $templateSlugs = array_values(array_filter(config('roznamcha_seo.search_surface.noindex_template_slugs', []), 'is_string'));
    $templateCount = Schema::hasTable('budget_templates') ? BudgetTemplate::query()->whereNotIn('slug', $templateSlugs)->count() : 0;

    return $staticCount + $blogCount + $templateCount;
}

function checkPage(HttpKernel $httpKernel, string $baseUrl, string $path): array
{
    $response = dispatchPath($httpKernel, $path, $baseUrl);
    $body = $response['body'];

    return [
        'status' => $response['status'],
        'has_noindex_follow' => preg_match('/<meta\s+name=["\']robots["\']\s+content=["\']noindex,follow["\']/i', $body) === 1,
        'has_canonical' => preg_match('/<link\s+rel=["\']canonical["\']/i', $body) === 1,
        'title' => extractTagValue($body, 'title'),
    ];
}

function dispatchPath(HttpKernel $httpKernel, string $path, string $baseUrl): array
{
    $host = parse_url($baseUrl, PHP_URL_HOST) ?: 'localhost';
    $scheme = parse_url($baseUrl, PHP_URL_SCHEME) ?: 'https';

    $request = Request::create($path, 'GET', [], [], [], [
        'HTTP_HOST' => $host,
        'HTTPS' => $scheme === 'https' ? 'on' : 'off',
    ]);

    $response = $httpKernel->handle($request);
    $payload = [
        'status' => $response->getStatusCode(),
        'body' => (string) $response->getContent(),
    ];
    $httpKernel->terminate($request, $response);

    return $payload;
}

function fetchUrl(string $url): array
{
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10,
            'ignore_errors' => true,
            'header' => "User-Agent: Roznamcha-AdSense-Validator/1.0\r\n",
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    $headers = $http_response_header ?? [];
    $status = 0;

    foreach ($headers as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d+)/', $header, $matches) === 1) {
            $status = (int) $matches[1];
            break;
        }
    }

    return [
        'status' => $status,
        'body' => is_string($body) ? $body : '',
    ];
}

function extractSitemapUrls(string $xml): array
{
    preg_match_all('/<loc>\s*([^<]+)\s*<\/loc>/i', $xml, $matches);

    return array_values(array_unique(array_map('trim', $matches[1] ?? [])));
}

function addFailure(array &$report, string $code, string $message, mixed $context = null): void
{
    $failure = [
        'code' => $code,
        'message' => $message,
    ];

    if ($context !== null) {
        $failure['context'] = $context;
    }

    $report['failures'][] = $failure;
}

function absoluteUrl(string $baseUrl, string $path): string
{
    return rtrim($baseUrl, '/').($path === '/' ? '/' : $path);
}

function extractTagValue(string $html, string $tag): ?string
{
    if (preg_match('/<'.preg_quote($tag, '/').'[^>]*>(.*?)<\/'.preg_quote($tag, '/').'>/is', $html, $matches) !== 1) {
        return null;
    }

    return html_entity_decode(trim(strip_tags($matches[1])), ENT_QUOTES | ENT_HTML5, 'UTF-8');
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
