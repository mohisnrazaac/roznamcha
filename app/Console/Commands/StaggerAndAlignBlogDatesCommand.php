<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class StaggerAndAlignBlogDatesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roznamcha:stagger-blog-dates {--dry-run : Simulate without updating DB}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Stagger publication dates across live blog posts and unpublish or clean off-topic posts';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');

        // Target dates to distribute posts evenly across Sep/Oct 2026
        $staggerSchedule = [
            'gold-investment-vs-national-savings-certificates-protecting-wealth-against-pkr-devaluation-2026' => '2026-09-13 14:00:00',
            'electric-bikes-vs-70cc-petrol-motorcycles-in-pakistan-total-cost-of-ownership-and-payback-2026' => '2026-09-15 11:30:00',
            'pakistani-freelancer-tax-slabs-pseb-registration-and-foreign-remittance-withholding-guide-2026' => '2026-09-17 12:31:00',
            'automobile-fuel-efficiency-and-cng-retrofitting-economics-in-pakistan-2026' => '2026-09-20 16:45:00',
            'solar-battery-storage-economics-in-pakistan-lifepo4-vs-tubular-battery-roi-2026' => '2026-09-24 10:15:00',
        ];

        $this->info($isDryRun ? '[DRY RUN] Staggering publication dates...' : 'Staggering publication dates in DB...');

        foreach ($staggerSchedule as $slug => $newDate) {
            try {
                $post = BlogPost::where('slug', $slug)->first();
                if ($post) {
                    $this->line("Updating [{$slug}] from {$post->published_at} -> {$newDate}");
                    if (!$isDryRun) {
                        $post->published_at = Carbon::parse($newDate);
                        $post->save();
                    }
                } else {
                    $this->warn("Post not found locally: {$slug}");
                }
            } catch (\Throwable $e) {
                $this->warn("Database query skipped for [{$slug}]: " . $e->getMessage());
            }
        }

        if (!$isDryRun) {
            BlogPost::forgetPublicSitemapCache();
        }

        $this->info('Blog dates staggering complete.');

        return Command::SUCCESS;
    }
}
