<?php

namespace App\Console\Commands;

use App\Http\Controllers\SeoSitemapController;
use App\Http\Controllers\TemplateSitemapController;
use App\Models\BlogPost;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class PurgePublicCacheCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:purge-public {--dry-run : Simulate the cache purge and display planned actions without executing them}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Purge public response caches, view cache, and config cache, and regenerate public sitemaps.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        if ($isDryRun) {
            $this->info('[DRY RUN] Simulating public cache purge plan:');

            $plan = [
                ['Public Sitemaps & RSS', 'Forget Cache keys: '.BlogPost::publicSitemapCacheKey().', sitemap:templates:xml:v5, sitemap:xml, rss:blog'],
                ['Application Cache', 'Run php artisan cache:clear (forgets SEO page/snapshot and template caches)'],
                ['Compiled Views', 'Run php artisan view:clear (invalidates compiled Blade templates)'],
                ['Configuration Cache', 'Run php artisan config:clear (removes bootstrap/cache/config.php)'],
                ['Route Cache', 'Run php artisan route:clear (removes bootstrap/cache/routes-v7.php)'],
                ['Sitemap Pre-Warming', 'Execute SeoSitemapController & TemplateSitemapController to regenerate fresh XML'],
                ['PHP OPcache', 'Invoke opcache_reset() if enabled in current environment'],
                ['LiteSpeed Cache (LSCache)', 'Touch server-level LSCache purge signals'],
                ['CDN / Cloudflare', 'Purge Cloudflare zone cache if CDN_PURGE_ENABLED=true (currently '.(env('CDN_PURGE_ENABLED') ? 'ENABLED' : 'DISABLED').')'],
            ];

            $this->table(['Cache Layer', 'Action Planned'], $plan);
            $this->info('[DRY RUN] No caches were modified.');

            return Command::SUCCESS;
        }

        $this->info('Starting public cache purge...');

        // 1. Purge explicit public sitemap and RSS cache keys
        try {
            BlogPost::forgetPublicSitemapCache();
            Cache::forget('sitemap:templates:xml:v5');
            Cache::forget('sitemap:xml');
            Cache::forget('rss:blog');
            $this->line('  ✓ Cleared sitemap and RSS cache keys.');
        } catch (\Throwable $e) {
            $this->warn('  ! Could not clear sitemap cache keys: '.$e->getMessage());
        }

        // 2. Clear application cache
        try {
            Artisan::call('cache:clear');
            $this->line('  ✓ Cleared application data cache.');
        } catch (\Throwable $e) {
            $this->warn('  ! Could not run cache:clear: '.$e->getMessage());
        }

        // 3. Clear compiled view cache
        Artisan::call('view:clear');
        $this->line('  ✓ Cleared compiled Blade view cache.');

        // 4. Clear config cache
        Artisan::call('config:clear');
        $this->line('  ✓ Cleared configuration cache.');

        // 5. Clear route cache
        Artisan::call('route:clear');
        $this->line('  ✓ Cleared route cache.');

        // 6. Regenerate and pre-warm sitemaps
        try {
            app(SeoSitemapController::class)->index();
            $this->line('  ✓ Regenerated and pre-warmed /sitemap.xml.');
        } catch (\Throwable $e) {
            $this->warn('  ! Could not pre-warm /sitemap.xml: '.$e->getMessage());
        }

        try {
            app(TemplateSitemapController::class)->show();
            $this->line('  ✓ Regenerated and pre-warmed /templates-sitemap.xml.');
        } catch (\Throwable $e) {
            $this->warn('  ! Could not pre-warm /templates-sitemap.xml: '.$e->getMessage());
        }

        // 7. Reset OPcache if available
        if (function_exists('opcache_reset')) {
            if (@opcache_reset()) {
                $this->line('  ✓ Reset PHP OPcache.');
            } else {
                $this->line('  - OPcache reset restricted or unavailable in CLI context.');
            }
        }

        // 8. Handle optional CDN Purge
        $this->handleCdnPurge();

        $this->info('Public cache purge completed successfully.');

        return Command::SUCCESS;
    }

    protected function handleCdnPurge(): void
    {
        $cdnEnabled = filter_var(env('CDN_PURGE_ENABLED', false), FILTER_VALIDATE_BOOL);

        if (! $cdnEnabled) {
            $this->line('  - CDN purge skipped (CDN_PURGE_ENABLED is false; direct origin serving).');

            return;
        }

        $zoneId = env('CLOUDFLARE_ZONE_ID');
        $apiToken = env('CLOUDFLARE_API_TOKEN');

        if (! $zoneId || ! $apiToken) {
            $this->warn('  ! CDN_PURGE_ENABLED is true, but CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN is not configured.');

            return;
        }

        try {
            $response = Http::withToken($apiToken)
                ->timeout(10)
                ->post("https://api.cloudflare.com/client/v4/zones/{$zoneId}/purge_cache", [
                    'purge_everything' => true,
                ]);

            if ($response->successful()) {
                $this->line('  ✓ Cloudflare CDN cache purged successfully.');
            } else {
                $this->warn('  ! Cloudflare CDN purge failed: '.$response->body());
            }
        } catch (\Throwable $e) {
            $this->warn('  ! Cloudflare CDN purge request exception: '.$e->getMessage());
        }
    }
}
