<?php
// Purpose: Run the seo_page_snapshots migration and optional snapshot refresh from a public web endpoint. Date: 2026-03-29. Author: Mohsin.

declare(strict_types=1);

use App\Models\City;
use App\Models\PetrolPrice;
use App\Seo\FuelPriceAuditService;
use App\Seo\OfficialPetrolNoticeService;
use App\Seo\PakFuelCityPriceScraperService;
use App\Seo\SeoSnapshotService;
use Illuminate\Contracts\Console\Kernel;

header('Content-Type: text/plain; charset=utf-8');
set_time_limit(0);

$useToken = false;
$token = 'SET_A_TEMP_SECRET';
$runRefresh = isset($_GET['refresh']) && $_GET['refresh'] === '1';
$runAudit = isset($_GET['audit']) && $_GET['audit'] === '1';
$clearConfigCache = isset($_GET['clear']) && $_GET['clear'] === '1';

if ($useToken) {
    if ($token === 'SET_A_TEMP_SECRET') {
        safeHttpResponseCode(500);
        echo "Configure \$token inside public/run-seo-page-snapshots-migration.php before running.\n";
        exit;
    }

    $provided = $_GET['token'] ?? null;

    if (! is_string($provided) || ! hash_equals($token, $provided)) {
        safeHttpResponseCode(403);
        echo "Invalid token.\n";
        exit;
    }
}

$root = resolveProjectRoot(__DIR__);

if (! file_exists($root.'/vendor/autoload.php') || ! file_exists($root.'/bootstrap/app.php')) {
    safeHttpResponseCode(500);
    echo "Laravel bootstrap files not found.\n";
    exit;
}

if ($clearConfigCache) {
    $clearedFiles = clearBootstrapConfigCache($root);
    echo "[clear] removed ".(empty($clearedFiles) ? 'no bootstrap cache files' : implode(', ', $clearedFiles))."\n";
}

chdir($root);

require $root.'/vendor/autoload.php';

$app = require $root.'/bootstrap/app.php';

/** @var Kernel $kernel */
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

$migrationPaths = [
    'database/migrations/2026_03_29_000000_create_seo_page_snapshots_table.php',
    'database/migrations/2026_03_29_000100_create_cities_table.php',
    'database/migrations/2026_03_29_000200_create_petrol_prices_table.php',
    'database/migrations/2026_03_29_000300_create_price_audit_logs_table.php',
];

debugConfigValue('official_listing_url', (string) config('roznamcha_seo.petrol.official_listing_url'));
debugConfigValue('backup_city_source_url', (string) config('roznamcha_seo.petrol.backup_city_source_url'));
debugConfigValue('cross_validation_source_url', (string) config('roznamcha_seo.petrol.cross_validation_source_url'));

try {
    foreach ($migrationPaths as $migrationPath) {
        echo "[run] php artisan migrate --force --path={$migrationPath}\n";

        $exitCode = $kernel->call('migrate', [
            '--force' => true,
            '--path' => $migrationPath,
        ]);

        echo $kernel->output()."\n";

        if ((int) $exitCode !== 0) {
            throw new RuntimeException("Migration failed for {$migrationPath} with exit code {$exitCode}.");
        }
    }

    if ($runRefresh) {
        echo "[run] direct SEO snapshot refresh\n";

        $snapshots = $app->make(SeoSnapshotService::class)->refreshAll();

        echo 'Stored '.count($snapshots)." SEO snapshots.\n\n";
        printSnapshotSummary($snapshots, $app);
    }

    if ($runAudit) {
        echo "[run] direct PakWheels audit\n";

        $audit = $app->make(FuelPriceAuditService::class)->auditPakwheelsAgainstStoredPrices();

        echo 'Logged '.$audit['checked_count'].' PakWheels comparisons and found '.count($audit['discrepancies'])." discrepancies.\n\n";
    }

    echo "SEO snapshot migration completed.\n";
    echo "Delete public/run-seo-page-snapshots-migration.php after one successful run.\n";
} catch (Throwable $throwable) {
    report($throwable);
    safeHttpResponseCode(500);
    echo "Migration runner failed: ".$throwable->getMessage()."\n";
}

function resolveProjectRoot(string $startDir): string
{
    $start = realpath($startDir) ?: $startDir;
    $queue = [[$start, 0]];
    $seen = [];
    $maxDepth = 5;

    while (! empty($queue)) {
        [$current, $depth] = array_shift($queue);

        if (isset($seen[$current])) {
            continue;
        }

        $seen[$current] = true;

        if (looksLikeLaravel($current)) {
            return $current;
        }

        if ($depth >= $maxDepth) {
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

function looksLikeLaravel(string $path): bool
{
    return is_file($path.'/artisan') && is_file($path.'/bootstrap/app.php');
}

function safeHttpResponseCode(int $status): void
{
    if (! headers_sent()) {
        http_response_code($status);
    }
}

function debugConfigValue(string $label, string $value): void
{
    echo "[config] {$label}=".json_encode($value, JSON_UNESCAPED_SLASHES)."\n";
    echo "[config] {$label}_length=".strlen($value)."\n";
}

function clearBootstrapConfigCache(string $root): array
{
    $targets = [
        'bootstrap/cache/config.php',
        'bootstrap/cache/packages.php',
        'bootstrap/cache/services.php',
    ];

    $cleared = [];

    foreach ($targets as $relativePath) {
        $fullPath = $root.'/'.$relativePath;

        if (! is_file($fullPath)) {
            continue;
        }

        if (@unlink($fullPath)) {
            $cleared[] = $relativePath;
        }
    }

    return $cleared;
}

function printSnapshotSummary(array $snapshots, $app): void
{
    $counts = [];

    foreach ($snapshots as $snapshot) {
        $pageType = is_object($snapshot) ? ($snapshot->page_type ?? null) : ($snapshot['page_type'] ?? null);

        if (! is_string($pageType) || $pageType === '') {
            continue;
        }

        $counts[$pageType] = ($counts[$pageType] ?? 0) + 1;
    }

    echo '[summary] petrol='.($counts['petrol'] ?? 0)
        .', electricity='.($counts['electricity'] ?? 0)
        .', ration='.($counts['ration'] ?? 0)."\n";

    if (($counts['petrol'] ?? 0) > 0) {
        return;
    }

    echo "[summary] petrol snapshots were not created during this refresh.\n";
    printOfficialSourceDebug($app);

    if (class_exists(City::class)) {
        echo '[summary] cities_table_rows='.City::query()->count()."\n";
    }

    if (class_exists(PetrolPrice::class)) {
        echo '[summary] petrol_prices_rows='.PetrolPrice::query()->count()."\n";
    }

    $scraper = $app->make(PakFuelCityPriceScraperService::class);

    foreach (config('roznamcha_seo.cities', []) as $city) {
        $latest = $scraper->latestCityFuel((string) $city, 'petrol');

        if (! $latest) {
            echo "[city] {$city}=missing\n";
            continue;
        }

        echo '[city] '.$city.'='
            .number_format((float) $latest['current_price'], 2)
            .' @ '.$latest['effective_date']->toDateString()
            .' from '.$latest['source_url']
            ."\n";
    }

    printPakFuelScrapeDebug($app);
}

function printOfficialSourceDebug($app): void
{
    try {
        $notice = $app->make(OfficialPetrolNoticeService::class)->latestVerifiedNotice();

        if (! $notice) {
            echo "[debug] official_notice=missing\n";

            return;
        }

        echo '[debug] official_notice='
            .$notice['effective_date']->toDateString()
            .' | '.$notice['notice_title']
            ."\n";
    } catch (Throwable $throwable) {
        echo '[debug] official_notice_error='.$throwable->getMessage()."\n";
    }
}

function printPakFuelScrapeDebug($app): void
{
    try {
        $result = $app->make(PakFuelCityPriceScraperService::class)->scrape();
        $prices = $result['prices'] ?? [];
        $sample = array_slice($prices, 0, 5);

        echo '[debug] pakfuel_scrape_rows='.count($prices)."\n";
        echo '[debug] pakfuel_effective_date='
            .($result['effective_date']?->toDateString() ?? 'missing')
            ."\n";

        foreach ($sample as $row) {
            $city = $row['city_slug'] ?? ($row['city_name'] ?? 'unknown');
            $petrol = isset($row['petrol']) ? number_format((float) $row['petrol'], 2) : 'null';
            $diesel = isset($row['diesel']) && $row['diesel'] !== null ? number_format((float) $row['diesel'], 2) : 'null';

            echo "[debug] pakfuel_row {$city} petrol={$petrol} diesel={$diesel}\n";
        }
    } catch (Throwable $throwable) {
        echo '[debug] pakfuel_scrape_error='.$throwable->getMessage()."\n";
    }
}
