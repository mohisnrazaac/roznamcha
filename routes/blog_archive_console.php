<?php

use App\Actions\Blog\ApplySafeArchiveBatchFixes;
use App\Actions\Blog\ApplyPhase25CleanupDecisions;
use App\Actions\Blog\ApplyAdsenseArticleRewrites;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Artisan;

Artisan::command('blog:apply-safe-batch-fixes {--dry-run : Preview changes without saving them}', function (ApplySafeArchiveBatchFixes $action): void {
    $result = $action->run((bool) $this->option('dry-run'));

    collect($result['updates'])
        ->each(function (array $update): void {
            $this->line(sprintf(
                '%s [%s]',
                $update['slug'],
                Collection::make($update['stats'])
                    ->map(fn (int $count, string $key) => "{$key}={$count}")
                    ->implode(', ')
            ));
        });

    $this->newLine();
    $this->table(
        ['Metric', 'Count'],
        collect($result['stats'])
            ->map(fn (int $count, string $metric) => [$metric, (string) $count])
            ->values()
            ->all()
    );

    $this->info($this->option('dry-run') ? 'Dry run complete.' : 'Safe blog archive batch fixes applied.');
})->purpose('Apply low-risk opener, CTA, and metadata fixes across the public blog archive.');

Artisan::command('blog:apply-phase25-cleanup {--dry-run : Preview changes without saving them}', function (ApplyPhase25CleanupDecisions $action): void {
    $result = $action->run((bool) $this->option('dry-run'));

    foreach ($result['retired'] as $slug) {
        $this->line("retired={$slug}");
    }

    $this->newLine();
    $this->table(
        ['Metric', 'Count'],
        [
            ['retire_slugs', (string) count($result['retire_slugs'])],
            ['retired_now', (string) count($result['retired'])],
        ]
    );

    $this->info($this->option('dry-run') ? 'Dry run complete.' : 'Phase 25 cleanup decisions applied.');
})->purpose('Apply the approved blog cleanup status changes from Phase 25.');

Artisan::command('blog:apply-adsense-article-rewrites {--dry-run : Preview changes without saving them}', function (ApplyAdsenseArticleRewrites $action): void {
    $result = $action->run((bool) $this->option('dry-run'));

    foreach ($result['updates'] as $update) {
        $this->line($update['slug'].' ['.implode(', ', $update['changed_fields']).']');
    }

    $this->newLine();
    $this->info($this->option('dry-run')
        ? 'Article rewrite dry run complete.'
        : 'Five reviewed AdSense article rewrites applied.');
})->purpose('Replace five high-risk articles with reviewed, source-led versions dated 19 August 2026.');
