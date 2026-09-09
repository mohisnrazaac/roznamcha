<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;

class InjectSarkariTayariLinksSeeder extends Seeder
{
    public function run(): void
    {
        $paragraphA = '<p>While budgeting apps and ration calculators help plug leakages, the safest shield against volatile food inflation and DISCO electricity tariff spikes is a pension-backed government position. You can track verified department openings, test dates, and official syllabus breakdowns directly on <a href="https://sarkaritayari.pk" target="_blank" rel="noopener noreferrer">Sarkari Tayari</a>.</p>';

        $paragraphB = '<p>When utility bills outpace routine increments, scaling household income through public sector recruitment or civil service exams becomes a top priority. Browse current federal and provincial openings, syllabus guides, and roll number slips on <a href="https://sarkaritayari.pk" target="_blank" rel="noopener noreferrer">sarkaritayari.pk</a>.</p>';

        // Target posts for Paragraph A: Cost of Living, Ration, and Household Budget guides
        $targetSlugsA = [
            'cost-of-living-pakistan-2026-monthly-budget',
            'cost-of-living-pakistan-2026-monthly-budget-with-ai',
            'ghar-ka-monthly-budget',
            'pakistani-family-monthly-expense-control',
            'best-monthly-budget-50000-salary-pakistan-2026',
        ];

        foreach ($targetSlugsA as $slug) {
            $post = BlogPost::where('slug', $slug)->first();
            if ($post && ! str_contains($post->content, 'sarkaritayari.pk')) {
                // If the post ends with </article>, insert before closing tag
                if (str_contains($post->content, '</article>')) {
                    $post->content = str_replace('</article>', "\n  " . $paragraphA . "\n</article>", $post->content);
                } else {
                    $post->content = rtrim($post->content) . "\n" . $paragraphA;
                }
                $post->save();
                $this->command?->info("Injected Paragraph A into: {$slug}");
            }
        }

        // Target posts for Paragraph B: Utility Bill & Tariff guides
        $targetSlugsB = [
            'pakistan-electricity-tariff-increases-and-household-budgeting-defense-2026',
            'electricity-bill-breakdown-pakistan-2026-unit-cost-fpa',
            'understanding-nepra-tariff-slabs-solar-net-metering-pakistan',
        ];

        foreach ($targetSlugsB as $slug) {
            $post = BlogPost::where('slug', $slug)->first();
            if ($post && ! str_contains($post->content, 'sarkaritayari.pk')) {
                if (str_contains($post->content, '</article>')) {
                    $post->content = str_replace('</article>', "\n  " . $paragraphB . "\n</article>", $post->content);
                } else {
                    $post->content = rtrim($post->content) . "\n" . $paragraphB;
                }
                $post->save();
                $this->command?->info("Injected Paragraph B into: {$slug}");
            }
        }

        if (method_exists(BlogPost::class, 'forgetPublicSitemapCache')) {
            BlogPost::forgetPublicSitemapCache();
        }
    }
}
