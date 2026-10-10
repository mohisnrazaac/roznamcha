<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PurgePublicCacheCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_dry_run_prints_planned_purge_actions_without_clearing_cache(): void
    {
        Cache::put('sitemap:xml:v5', 'dummy-sitemap-content', 3600);

        $this->artisan('cache:purge-public', ['--dry-run' => true])
            ->expectsOutputToContain('[DRY RUN] Simulating public cache purge plan:')
            ->expectsOutputToContain('Public Sitemaps & RSS')
            ->expectsOutputToContain('Compiled Views')
            ->expectsOutputToContain('Sitemap Pre-Warming')
            ->expectsOutputToContain('[DRY RUN] No caches were modified.')
            ->assertExitCode(0);

        $this->assertEquals('dummy-sitemap-content', Cache::get('sitemap:xml:v5'));
    }

    public function test_command_clears_public_caches_and_regenerates_sitemaps(): void
    {
        Cache::put('sitemap:xml:v5', 'stale-sitemap', 3600);
        Cache::put('sitemap:templates:xml:v5', 'stale-templates', 3600);

        $this->artisan('cache:purge-public')
            ->expectsOutputToContain('Starting public cache purge...')
            ->expectsOutputToContain('Cleared sitemap and RSS cache keys.')
            ->expectsOutputToContain('Cleared compiled Blade view cache.')
            ->expectsOutputToContain('Cleared configuration cache.')
            ->expectsOutputToContain('Cleared route cache.')
            ->expectsOutputToContain('Public cache purge completed successfully.')
            ->assertExitCode(0);

        // Verify fresh sitemap was pre-warmed
        $this->assertNotNull(Cache::get('sitemap:xml:v5'));
        $this->assertNotEquals('stale-sitemap', Cache::get('sitemap:xml:v5'));
    }
}
