<?php

namespace App\Actions\Blog;

use App\Models\BlogPost;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ApplyAdsenseArticleRewrites
{
    public function run(bool $dryRun = false): array
    {
        $rewrites = config('adsense_article_rewrites.posts', []);

        if (! is_array($rewrites) || count($rewrites) !== 5) {
            throw new RuntimeException('Expected exactly five reviewed article rewrites.');
        }

        $posts = BlogPost::query()
            ->whereIn('slug', array_keys($rewrites))
            ->get()
            ->keyBy('slug');

        $missing = array_values(array_diff(array_keys($rewrites), $posts->keys()->all()));

        if ($missing !== []) {
            throw new RuntimeException('Missing target blog posts: '.implode(', ', $missing));
        }

        $updates = [];

        foreach ($rewrites as $slug => $rewrite) {
            $post = $posts->get($slug);
            $attributes = [
                'title' => $rewrite['title'],
                'excerpt' => $rewrite['excerpt'],
                'content' => $rewrite['content'],
                'content_format' => 'html',
                'seo_title' => $rewrite['seo_title'],
                'seo_description' => $rewrite['seo_description'],
                'seo_keywords' => $rewrite['seo_keywords'],
                'language' => $rewrite['language'] ?? 'en',
                'canonical_url' => 'https://roznamcha.pk/blog/'.$slug,
                'status' => 'published',
            ];

            $changed = collect($attributes)
                ->filter(fn ($value, string $key): bool => $post->getAttribute($key) !== $value)
                ->keys()
                ->all();

            $updates[] = [
                'slug' => $slug,
                'changed_fields' => $changed,
            ];
        }

        if (! $dryRun) {
            DB::transaction(function () use ($rewrites, $posts): void {
                foreach ($rewrites as $slug => $rewrite) {
                    $posts->get($slug)->forceFill([
                        'title' => $rewrite['title'],
                        'excerpt' => $rewrite['excerpt'],
                        'content' => $rewrite['content'],
                        'content_format' => 'html',
                        'seo_title' => $rewrite['seo_title'],
                        'seo_description' => $rewrite['seo_description'],
                        'seo_keywords' => $rewrite['seo_keywords'],
                        'language' => $rewrite['language'] ?? 'en',
                        'canonical_url' => 'https://roznamcha.pk/blog/'.$slug,
                        'status' => 'published',
                    ])->save();
                }
            });

            BlogPost::forgetPublicSitemapCache();
        }

        return [
            'dry_run' => $dryRun,
            'reviewed_at' => config('adsense_article_rewrites.reviewed_at'),
            'updates' => $updates,
        ];
    }
}
