<?php

namespace App\Actions\Blog;

use App\Models\BlogPost;
use Illuminate\Support\Facades\Cache;

class ApplyPhase25CleanupDecisions
{
    public function run(bool $dryRun = false): array
    {
        $removeSlugs = array_values(array_filter(config('blog_cleanup.remove_slugs', []), 'is_string'));
        $mergeSourceSlugs = array_keys(BlogPost::redirectMap());
        $retireSlugs = array_values(array_unique([...$removeSlugs, ...$mergeSourceSlugs]));

        $posts = BlogPost::query()
            ->whereIn('slug', $retireSlugs)
            ->get(['id', 'slug', 'status']);

        $retired = [];

        foreach ($posts as $post) {
            if ($post->status === 'draft') {
                continue;
            }

            $retired[] = $post->slug;

            if ($dryRun) {
                continue;
            }

            $post->forceFill(['status' => 'draft'])->save();
        }

        if (! $dryRun && $retired !== []) {
            BlogPost::forgetPublicSitemapCache();
            Cache::forget('rss:blog');
        }

        return [
            'retire_slugs' => $retireSlugs,
            'retired' => $retired,
        ];
    }
}
