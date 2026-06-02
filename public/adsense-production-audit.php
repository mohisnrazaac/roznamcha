<?php
// Purpose: Read-only production AdSense risk audit for sitemap, robots, public pages, and blog database content. Delete after use.

declare(strict_types=1);

use App\Models\BlogPost;
use App\Models\BudgetTemplate;
use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    'mode' => 'read_only_audit_no_database_writes',
    'summary' => [],
    'findings' => [],
    'sitemap' => [],
    'robots' => [],
    'page_checks' => [],
    'database' => [],
    'next_step' => 'Share this JSON report back with Codex. The next script should only make fixes based on these findings.',
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
    $robotsResponse = dispatchPath($httpKernel, '/robots.txt', $baseUrl);
    $robotsBody = $robotsResponse['body'];
    $report['robots'] = [
        'status' => $robotsResponse['status'],
        'has_main_sitemap' => str_contains($robotsBody, 'Sitemap: '.$baseUrl.'/sitemap.xml'),
        'has_templates_sitemap' => str_contains($robotsBody, 'Sitemap: '.$baseUrl.'/templates-sitemap.xml'),
        'blocks_templates' => preg_match('/Disallow:\s*\/templates\b/i', $robotsBody) === 1,
        'blocks_programmatic_patterns' => preg_match('/Disallow:\s*\/(petrol-price|electricity-bill-calculator|ration-cost-for)/i', $robotsBody) === 1,
    ];

    if ($report['robots']['blocks_templates'] || $report['robots']['blocks_programmatic_patterns']) {
        addFinding($report, 'critical', 'robots_txt_blocks_cleanup_pages', 'robots.txt appears to block pages that should stay accessible with noindex instead.');
    }

    $sitemapResponse = dispatchPath($httpKernel, '/sitemap.xml', $baseUrl);
    $templateSitemapResponse = dispatchPath($httpKernel, '/templates-sitemap.xml', $baseUrl);
    $sitemapUrls = extractSitemapUrls($sitemapResponse['body']);
    $templateSitemapUrls = extractSitemapUrls($templateSitemapResponse['body']);

    $report['sitemap'] = [
        'main_status' => $sitemapResponse['status'],
        'main_url_count' => count($sitemapUrls),
        'templates_status' => $templateSitemapResponse['status'],
        'templates_url_count' => count($templateSitemapUrls),
        'missing_core_urls' => [],
        'excluded_urls_still_in_main_sitemap' => [],
        'excluded_urls_still_in_templates_sitemap' => [],
    ];

    foreach ($corePaths as $path) {
        $url = absoluteUrl($baseUrl, $path);
        if (! in_array($url, $sitemapUrls, true)) {
            $report['sitemap']['missing_core_urls'][] = $url;
        }
    }

    foreach ($excludedPaths as $path) {
        $url = absoluteUrl($baseUrl, $path);
        if (in_array($url, $sitemapUrls, true)) {
            $report['sitemap']['excluded_urls_still_in_main_sitemap'][] = $url;
        }
        if (in_array($url, $templateSitemapUrls, true)) {
            $report['sitemap']['excluded_urls_still_in_templates_sitemap'][] = $url;
        }
    }

    if ($report['sitemap']['missing_core_urls'] !== []) {
        addFinding($report, 'high', 'sitemap_missing_core_urls', 'Core AdSense-safe URLs are missing from the main sitemap.', $report['sitemap']['missing_core_urls']);
    }

    if ($report['sitemap']['excluded_urls_still_in_main_sitemap'] !== [] || $report['sitemap']['excluded_urls_still_in_templates_sitemap'] !== []) {
        addFinding($report, 'critical', 'excluded_urls_still_in_sitemap', 'Temporary noindex/template/programmatic URLs are still present in sitemap output.', [
            'main' => $report['sitemap']['excluded_urls_still_in_main_sitemap'],
            'templates' => $report['sitemap']['excluded_urls_still_in_templates_sitemap'],
        ]);
    }

    foreach ($excludedPaths as $path) {
        $check = checkPage($httpKernel, $baseUrl, $path);
        $report['page_checks']['excluded'][$path] = $check;

        if ($check['status'] !== 200) {
            addFinding($report, 'high', 'excluded_page_not_accessible', "{$path} should remain directly accessible with HTTP 200.", $check);
        } elseif (! $check['has_noindex_follow']) {
            addFinding($report, 'critical', 'excluded_page_missing_noindex', "{$path} is excluded from search cleanup but does not render noindex,follow.", $check);
        }
    }

    foreach ($corePaths as $path) {
        $check = checkPage($httpKernel, $baseUrl, $path);
        $report['page_checks']['core'][$path] = $check;

        if ($check['status'] !== 200) {
            addFinding($report, 'high', 'core_page_not_accessible', "{$path} should render HTTP 200.", $check);
        } elseif ($check['has_noindex_follow']) {
            addFinding($report, 'critical', 'core_page_has_noindex', "{$path} is a core AdSense-safe page but renders noindex,follow.", $check);
        }
    }

    $report['database'] = databaseAudit($baseUrl, $sitemapUrls);
    foreach ($report['database']['findings'] as $finding) {
        addFinding($report, $finding['severity'], $finding['code'], $finding['message'], $finding['context'] ?? null);
    }

    $criticalCount = count(array_filter($report['findings'], fn (array $finding) => $finding['severity'] === 'critical'));
    $highCount = count(array_filter($report['findings'], fn (array $finding) => $finding['severity'] === 'high'));
    $mediumCount = count(array_filter($report['findings'], fn (array $finding) => $finding['severity'] === 'medium'));

    $report['summary'] = [
        'status' => $criticalCount > 0 ? 'needs_fix_before_adsense' : ($highCount > 0 ? 'review_before_adsense' : 'cleanup_contract_passed'),
        'critical_findings' => $criticalCount,
        'high_findings' => $highCount,
        'medium_findings' => $mediumCount,
        'total_findings' => count($report['findings']),
        'expected_main_sitemap_url_count' => $report['sitemap']['main_url_count'],
    ];

    echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
} catch (Throwable $throwable) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Audit failed.',
        'message' => $throwable->getMessage(),
        'file' => $throwable->getFile(),
        'line' => $throwable->getLine(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

function databaseAudit(string $baseUrl, array $sitemapUrls): array
{
    $result = [
        'tables' => [],
        'blog' => [],
        'templates' => [],
        'findings' => [],
    ];

    $hasBlogPosts = Schema::hasTable('blog_posts');
    $hasBudgetTemplates = Schema::hasTable('budget_templates');
    $result['tables'] = [
        'blog_posts' => $hasBlogPosts,
        'budget_templates' => $hasBudgetTemplates,
    ];

    if ($hasBlogPosts) {
        $statusCounts = BlogPost::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->all();

        $publicPosts = BlogPost::query()
            ->publicArchiveVisible()
            ->with('categories')
            ->orderByDesc('published_at')
            ->get();

        $thinPosts = [];
        $missingMetadata = [];
        $noindexPostsInSitemap = [];
        $duplicateTitleMap = [];
        $duplicateDescriptionMap = [];

        foreach ($publicPosts as $post) {
            $text = normalizeText(strip_tags((string) $post->rendered_content));
            $wordCount = countWords($text);
            $description = trim((string) ($post->seo_description ?: $post->excerpt));
            $titleKey = mb_strtolower(trim((string) ($post->seo_title ?: $post->title)));
            $descriptionKey = mb_strtolower($description);

            $duplicateTitleMap[$titleKey][] = $post->slug;
            if ($descriptionKey !== '') {
                $duplicateDescriptionMap[$descriptionKey][] = $post->slug;
            }

            if ($wordCount < 650) {
                $thinPosts[] = [
                    'slug' => $post->slug,
                    'title' => $post->title,
                    'word_count' => $wordCount,
                    'url' => absoluteUrl($baseUrl, '/blog/'.$post->slug),
                ];
            }

            if ($description === '' || mb_strlen($description) < 90 || looksPlaceholder($description)) {
                $missingMetadata[] = [
                    'slug' => $post->slug,
                    'description_length' => mb_strlen($description),
                    'url' => absoluteUrl($baseUrl, '/blog/'.$post->slug),
                ];
            }

            if (BlogPost::shouldNoindexPublicSlug($post->slug) && in_array(absoluteUrl($baseUrl, '/blog/'.$post->slug), $sitemapUrls, true)) {
                $noindexPostsInSitemap[] = $post->slug;
            }
        }

        $duplicateTitles = duplicatesOnly($duplicateTitleMap);
        $duplicateDescriptions = duplicatesOnly($duplicateDescriptionMap);

        $result['blog'] = [
            'status_counts' => $statusCounts,
            'public_archive_visible_count' => $publicPosts->count(),
            'configured_noindex_slugs' => BlogPost::noindexPublicSlugs(),
            'configured_redirects' => BlogPost::redirectMap(),
            'thin_public_posts_under_650_words' => array_slice($thinPosts, 0, 50),
            'thin_public_posts_under_650_words_count' => count($thinPosts),
            'missing_or_weak_metadata' => array_slice($missingMetadata, 0, 50),
            'missing_or_weak_metadata_count' => count($missingMetadata),
            'duplicate_titles' => array_slice($duplicateTitles, 0, 25),
            'duplicate_descriptions' => array_slice($duplicateDescriptions, 0, 25),
            'noindex_posts_in_sitemap' => $noindexPostsInSitemap,
        ];

        if ($thinPosts !== []) {
            $result['findings'][] = [
                'severity' => 'high',
                'code' => 'thin_public_blog_posts',
                'message' => 'Published sitemap-eligible blog posts under 650 words may increase AdSense low-value-content risk.',
                'context' => array_slice($thinPosts, 0, 20),
            ];
        }

        if ($missingMetadata !== []) {
            $result['findings'][] = [
                'severity' => 'medium',
                'code' => 'weak_blog_metadata',
                'message' => 'Some public blog posts have missing, short, or placeholder descriptions.',
                'context' => array_slice($missingMetadata, 0, 20),
            ];
        }

        if ($duplicateTitles !== [] || $duplicateDescriptions !== []) {
            $result['findings'][] = [
                'severity' => 'medium',
                'code' => 'duplicate_blog_metadata',
                'message' => 'Duplicate blog titles or descriptions reduce perceived content uniqueness.',
                'context' => [
                    'titles' => array_slice($duplicateTitles, 0, 10),
                    'descriptions' => array_slice($duplicateDescriptions, 0, 10),
                ],
            ];
        }

        if ($noindexPostsInSitemap !== []) {
            $result['findings'][] = [
                'severity' => 'critical',
                'code' => 'noindex_blog_posts_in_sitemap',
                'message' => 'Blog posts configured as noindex are still present in sitemap output.',
                'context' => $noindexPostsInSitemap,
            ];
        }
    }

    if ($hasBudgetTemplates) {
        $noindexSlugs = array_values(array_filter(config('roznamcha_seo.search_surface.noindex_template_slugs', []), 'is_string'));
        $total = BudgetTemplate::query()->count();
        $noindexed = BudgetTemplate::query()->whereIn('slug', $noindexSlugs)->count();

        $result['templates'] = [
            'total' => $total,
            'configured_noindex_slugs' => $noindexSlugs,
            'configured_noindex_existing_count' => $noindexed,
            'indexable_detail_count' => max(0, $total - $noindexed),
        ];

        if ($total > $noindexed) {
            $result['findings'][] = [
                'severity' => 'medium',
                'code' => 'indexable_template_details_remain',
                'message' => 'Some template detail pages are still indexable. Confirm they have enough unique content for AdSense.',
                'context' => BudgetTemplate::query()
                    ->whereNotIn('slug', $noindexSlugs)
                    ->pluck('slug')
                    ->all(),
            ];
        }
    }

    return $result;
}

function checkPage(HttpKernel $httpKernel, string $baseUrl, string $path): array
{
    $response = dispatchPath($httpKernel, $path, $baseUrl);
    $body = $response['body'];

    return [
        'status' => $response['status'],
        'has_noindex_follow' => preg_match('/<meta\s+name=["\']robots["\']\s+content=["\']noindex,follow["\']/i', $body) === 1,
        'has_index_follow' => preg_match('/<meta\s+name=["\']robots["\']\s+content=["\']index,follow["\']/i', $body) === 1,
        'has_canonical' => preg_match('/<link\s+rel=["\']canonical["\']/i', $body) === 1,
        'title' => extractTagValue($body, 'title'),
        'description_length' => descriptionLength($body),
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

function extractSitemapUrls(string $xml): array
{
    preg_match_all('/<loc>\s*([^<]+)\s*<\/loc>/i', $xml, $matches);

    return array_values(array_unique(array_map('trim', $matches[1] ?? [])));
}

function addFinding(array &$report, string $severity, string $code, string $message, mixed $context = null): void
{
    $finding = [
        'severity' => $severity,
        'code' => $code,
        'message' => $message,
    ];

    if ($context !== null) {
        $finding['context'] = $context;
    }

    $report['findings'][] = $finding;
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

function descriptionLength(string $html): int
{
    if (preg_match('/<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\']/i', $html, $matches) !== 1) {
        return 0;
    }

    return mb_strlen(html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

function normalizeText(string $text): string
{
    return trim((string) preg_replace('/\s+/u', ' ', html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
}

function countWords(string $text): int
{
    if ($text === '') {
        return 0;
    }

    preg_match_all('/[\p{L}\p{N}]+/u', $text, $matches);

    return count($matches[0] ?? []);
}

function looksPlaceholder(string $text): bool
{
    $lower = mb_strtolower($text);

    foreach (['lorem ipsum', 'coming soon', 'placeholder', 'est et', 'seo description'] as $needle) {
        if (str_contains($lower, $needle)) {
            return true;
        }
    }

    return false;
}

function duplicatesOnly(array $map): array
{
    $duplicates = [];

    foreach ($map as $value => $slugs) {
        $slugs = array_values(array_unique($slugs));
        if ($value !== '' && count($slugs) > 1) {
            $duplicates[] = [
                'value' => $value,
                'slugs' => $slugs,
            ];
        }
    }

    return $duplicates;
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
