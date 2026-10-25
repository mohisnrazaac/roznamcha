<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use Database\Seeders\ExpansionSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdsenseDbCleanCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roznamcha:adsense-db-clean {--dry-run : Simulate the cleanup without persisting to database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean obsolete YMYL content, purge promotional link spam, expand flagship articles, and enforce the 1,000-word gate.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        $this->info($isDryRun ? '[DRY RUN] Simulating AdSense DB Clean...' : 'Starting AdSense DB Clean...');

        $this->stripPromotionalLinkSpam($isDryRun);
        $this->cleanElectrityTypo($isDryRun);
        $this->expandFlagshipArticles($isDryRun);
        $this->enforceWordCountGate($isDryRun);
        $this->purgeCaches($isDryRun);

        $this->info('AdSense DB cleanup complete.');

        return Command::SUCCESS;
    }

    /**
     * Remove any <p> block containing sarkaritayari.pk or Sarkari Tayari.
     */
    protected function stripPromotionalLinkSpam(bool $isDryRun): void
    {
        $this->comment('Scanning blog posts for sarkaritayari.pk and Sarkari Tayari link spam...');

        try {
            $posts = BlogPost::where('content', 'LIKE', '%sarkaritayari%')
                ->orWhere('content', 'LIKE', '%Sarkari Tayari%')
                ->get();
        } catch (\Throwable $e) {
            $this->warn('Could not query blog_posts: ' . $e->getMessage());
            return;
        }

        $cleanedCount = 0;

        foreach ($posts as $post) {
            $original = $post->content;

            // Remove any <p> tags containing sarkaritayari.pk or Sarkari Tayari
            $cleaned = preg_replace('/<p\b[^>]*>(?:(?!<\/p>).)*?sarkaritayari\.pk.*?<\/p>/is', '', $original);
            $cleaned = preg_replace('/<p\b[^>]*>(?:(?!<\/p>).)*?Sarkari\s*Tayari.*?<\/p>/is', '', $cleaned);

            // Strip any standalone links if outside <p>
            $cleaned = preg_replace('/<a\b[^>]*href=["\']https?:\/\/[^"\']*sarkaritayari\.pk[^"\']*["\'][^>]*>.*?<\/a>/is', '', $cleaned);

            if ($cleaned !== $original) {
                $cleanedCount++;
                $this->line("Stripped promotional spam from: {$post->slug}");

                if (!$isDryRun) {
                    $post->content = $cleaned;
                    $post->save();
                }
            }
        }

        $this->info("Found and stripped spam from {$cleanedCount} posts.");
    }

    /**
     * Clean #electrity typo in tags and hooks.
     */
    protected function cleanElectrityTypo(bool $isDryRun): void
    {
        $this->comment('Checking for electrity typo in blog_posts metadata and content...');

        try {
            $posts = BlogPost::where('content', 'LIKE', '%electrity%')
                ->orWhere('feature_hooks', 'LIKE', '%electrity%')
                ->get();
        } catch (\Throwable) {
            return;
        }

        foreach ($posts as $post) {
            $modified = false;

            if (str_contains((string) $post->content, 'electrity')) {
                $post->content = str_replace(['#electrity', 'electrity'], ['#electricity', 'electricity'], $post->content);
                $modified = true;
            }

            if ($post->feature_hooks) {
                $hooksJson = json_encode($post->feature_hooks);
                if (str_contains($hooksJson, 'electrity')) {
                    $hooksJson = str_replace('electrity', 'electricity', $hooksJson);
                    $post->feature_hooks = json_decode($hooksJson, true);
                    $modified = true;
                }
            }

            if ($modified && !$isDryRun) {
                $post->save();
                $this->line("Fixed electrity typo in: {$post->slug}");
            }
        }
    }

    /**
     * Expand flagship articles (pakistani-family-monthly-expense-control, how-to-use-digital-roznamcha, ghar-ka-monthly-budget)
     * to 1,300+ words with HTML tables and primary Pakistani regulatory citations.
     */
    protected function expandFlagshipArticles(bool $isDryRun): void
    {
        $this->comment('Expanding cornerstone flagship blog guides to 1,300+ words...');

        if ($isDryRun) {
            $this->line('[DRY RUN] Would run ExpansionSeeder to populate expanded articles.');
            return;
        }

        $seeder = new ExpansionSeeder();
        $seeder->run();
    }

    /**
     * Enforce strict word-count gate: any published blog post with < 1000 words
     * must be marked as draft / noindex so thin content is never indexed by AdSense or search engines.
     */
    protected function enforceWordCountGate(bool $isDryRun): void
    {
        $this->comment('Auditing word count across all published posts (minimum threshold: 1,000 words)...');

        try {
            $publishedPosts = BlogPost::where('status', 'published')->get();
        } catch (\Throwable $e) {
            $this->warn('Could not query published posts: ' . $e->getMessage());
            return;
        }

        $thinCount = 0;
        $exemptSlugs = config('blog_cleanup.remove_slugs', []);
        $noindexSlugs = config('blog_cleanup.noindex_slugs', []);

        foreach ($publishedPosts as $post) {
            $cleanText = strip_tags((string) $post->content);
            $wordCount = preg_match_all('/[\p{L}\p{M}\p{N}\-]+/u', $cleanText);

            if ($wordCount < 1000) {
                $thinCount++;
                $this->warn("Thin post detected: [{$post->slug}] has {$wordCount} words (< 1000). Setting to draft and unpublishing from sitemap.");

                if (!$isDryRun) {
                    $post->status = 'draft';
                    $post->published_at = null;
                    $post->save();
                }
            }
        }

        $this->info("Word-count gate audit complete: {$thinCount} thin posts unpublished.");
    }

    /**
     * Invalidate and purge sitemap and public caches.
     */
    protected function purgeCaches(bool $isDryRun): void
    {
        $this->comment('Invalidating sitemap caches and view caches...');

        if ($isDryRun) {
            return;
        }

        BlogPost::forgetPublicSitemapCache();
        Cache::forget('sitemap:xml');
        Cache::forget('sitemap:xml:v5');
        Cache::forget('rss:blog');

        try {
            Artisan::call('view:clear');
        } catch (\Throwable) {
            // view clear in test environment
        }
    }
}
