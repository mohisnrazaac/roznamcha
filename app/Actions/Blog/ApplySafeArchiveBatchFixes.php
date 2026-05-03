<?php

namespace App\Actions\Blog;

use App\Models\BlogPost;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ApplySafeArchiveBatchFixes
{
    public function run(bool $dryRun = false): array
    {
        $posts = BlogPost::query()
            ->publiclyVisible()
            ->orderBy('id')
            ->get();

        $stats = [
            'posts_scanned' => $posts->count(),
            'posts_updated' => 0,
            'decorative_bullets_removed' => 0,
            'language_comments_removed' => 0,
            'duplicate_title_blocks_removed' => 0,
            'inline_meta_blocks_removed' => 0,
            'branded_openers_removed' => 0,
            'generic_cta_blocks_removed' => 0,
            'generic_cta_links_removed' => 0,
            'excerpt_repaired' => 0,
            'seo_description_repaired' => 0,
        ];

        $updates = [];

        foreach ($posts as $post) {
            $postStats = [
                'decorative_bullets_removed' => 0,
                'language_comments_removed' => 0,
                'duplicate_title_blocks_removed' => 0,
                'inline_meta_blocks_removed' => 0,
                'branded_openers_removed' => 0,
                'generic_cta_blocks_removed' => 0,
                'generic_cta_links_removed' => 0,
                'excerpt_repaired' => 0,
                'seo_description_repaired' => 0,
            ];

            $originalContent = (string) $post->content;
            $cleanedContent = $this->cleanContent($originalContent, $post, $postStats);
            $plainText = $this->plainText($cleanedContent);

            $cleanedExcerpt = $this->cleanExcerpt($post->excerpt, $plainText, $postStats);
            $cleanedSeoDescription = $this->cleanSeoDescription($post->seo_description, $plainText, $postStats);

            if (
                $cleanedContent === $originalContent
                && $cleanedExcerpt === $post->excerpt
                && $cleanedSeoDescription === $post->seo_description
            ) {
                continue;
            }

            $stats['posts_updated']++;

            foreach ($postStats as $key => $count) {
                $stats[$key] += $count;
            }

            $updates[] = [
                'slug' => $post->slug,
                'stats' => collect($postStats)
                    ->filter(fn (int $count) => $count > 0)
                    ->all(),
            ];

            if ($dryRun) {
                continue;
            }

            $post->forceFill([
                'content' => $cleanedContent,
                'excerpt' => $cleanedExcerpt,
                'seo_description' => $cleanedSeoDescription,
            ])->save();
        }

        return [
            'stats' => $stats,
            'updates' => $updates,
        ];
    }

    protected function cleanContent(string $content, BlogPost $post, array &$stats): string
    {
        $cleaned = preg_replace('/^\xEF\xBB\xBF/u', '', $content) ?? $content;

        $cleaned = preg_replace('/^\s*•\s*(<article\b)/iu', '$1', $cleaned, 1, $bulletCount) ?? $cleaned;
        $stats['decorative_bullets_removed'] += $bulletCount;

        $cleaned = preg_replace('/^\s*<!--\s*ENGLISH VERSION\s*-->\s*/iu', '', $cleaned, 1, $languageCount) ?? $cleaned;
        $stats['language_comments_removed'] += $languageCount;

        $cleaned = $this->removeDuplicateLeadingTitleBlock($cleaned, $post, $stats);
        $cleaned = $this->removeBrandedArticleOpener($cleaned, $post, $stats);
        $cleaned = $this->removeGenericCtaBoilerplate($cleaned, $stats);

        return ltrim($cleaned);
    }

    protected function removeDuplicateLeadingTitleBlock(string $content, BlogPost $post, array &$stats): string
    {
        if (! preg_match('/^\s*<h1\b[^>]*>(.*?)<\/h1>(.*)$/isu', $content, $matches)) {
            return $content;
        }

        if (! $this->headingMatchesPublicTitle($this->normalizeForComparison($matches[1]), $post)) {
            return $content;
        }

        $remainder = $matches[2];
        $stats['duplicate_title_blocks_removed']++;

        $remainder = preg_replace(
            '/^\s*<p>\s*(?:<strong>\s*(?:Published|Updated|Category|Reading Time|Source)\s*:.*?)+<\/p>\s*/isu',
            '',
            $remainder,
            1,
            $metaCount
        ) ?? $remainder;

        $stats['inline_meta_blocks_removed'] += $metaCount;

        $remainder = preg_replace('/^\s*<hr\s*\/?>\s*/isu', '', $remainder, 1) ?? $remainder;

        return ltrim($remainder);
    }

    protected function removeBrandedArticleOpener(string $content, BlogPost $post, array &$stats): string
    {
        if (! preg_match(
            '/^(?<prefix>\s*<article\b[^>]*>\s*<header\b[^>]*>\s*)<p\b[^>]*>\s*Roznamcha\s*[·-].*?<\/p>\s*<h1\b[^>]*>(?<heading>.*?)<\/h1>(?<suffix>\s*<\/header>)/isu',
            $content,
            $matches
        )) {
            return $content;
        }

        if (! $this->headingMatchesPublicTitle($this->normalizeForComparison($matches['heading']), $post)) {
            return $content;
        }

        $stats['branded_openers_removed']++;

        return $matches['prefix'].$matches['suffix'].substr($content, strlen($matches[0]));
    }

    protected function removeGenericCtaBoilerplate(string $content, array &$stats): string
    {
        $blockPatterns = [
            '/\s*<hr>\s*<h2>حل\s*[—-]\s*Roznamcha\.pk سے گھر کا بجٹ کنٹرول کریں<\/h2>.*$/isu',
            '/\s*<hr>\s*<h2>Roznamcha\.pk آپ کی کیسے مدد کرتا ہے\?<\/h2>.*$/isu',
            '/\s*<section>\s*<h2>Why Tools Like [^<]*Ration Brain[^<]*<\/h2>.*?<\/section>\s*/isu',
            '/\s*<section>\s*<h2>Track Prices with Roznamcha Ration Brain<\/h2>.*?<\/section>\s*/isu',
        ];

        foreach ($blockPatterns as $pattern) {
            $content = preg_replace($pattern, '', $content, 1, $count) ?? $content;
            $stats['generic_cta_blocks_removed'] += $count;
        }

        $content = preg_replace(
            '/\s*<p><a href="https:\/\/roznamcha\.pk"><strong>Roznamcha\.pk [^<]*<\/strong><\/a><\/p>\s*/isu',
            '',
            $content,
            1,
            $linkCount
        ) ?? $content;

        $stats['generic_cta_links_removed'] += $linkCount;

        return $content;
    }

    protected function cleanExcerpt(?string $excerpt, string $plainText, array &$stats): ?string
    {
        $value = $excerpt === null ? null : trim($excerpt);

        if (! $this->excerptNeedsRepair($value)) {
            return $excerpt;
        }

        $stats['excerpt_repaired']++;

        return $this->fallbackMetaText($plainText, 220);
    }

    protected function cleanSeoDescription(?string $seoDescription, string $plainText, array &$stats): ?string
    {
        $value = $seoDescription === null ? null : trim($seoDescription);

        if (! $this->seoDescriptionNeedsRepair($value)) {
            return $seoDescription;
        }

        $stats['seo_description_repaired']++;

        return $this->fallbackMetaText($plainText, 155);
    }

    protected function excerptNeedsRepair(?string $excerpt): bool
    {
        if ($excerpt === null || $excerpt === '') {
            return true;
        }

        return $this->looksUrlOnly($excerpt) || $this->looksKeywordList($excerpt);
    }

    protected function seoDescriptionNeedsRepair(?string $seoDescription): bool
    {
        if ($seoDescription === null || $seoDescription === '') {
            return false;
        }

        return $this->looksKeywordList($seoDescription);
    }

    protected function looksUrlOnly(string $value): bool
    {
        return (bool) preg_match('/^https?:\/\/\S+$/i', trim($value));
    }

    protected function looksKeywordList(string $value): bool
    {
        return (bool) preg_match('/^[A-Za-z0-9 ()-]+(?:,\s*[A-Za-z0-9 ()-]+){4,}$/', trim($value));
    }

    protected function fallbackMetaText(string $plainText, int $limit): string
    {
        return Str::limit(trim($plainText), $limit, '');
    }

    protected function plainText(string $content): string
    {
        return Str::of(strip_tags($content))
            ->replaceMatches('/\s+/u', ' ')
            ->trim()
            ->toString();
    }

    protected function headingMatchesPublicTitle(string $heading, BlogPost $post): bool
    {
        $title = $this->normalizeForComparison($post->title);

        if ($heading !== '' && $heading === $title) {
            return true;
        }

        $headlineFromSlug = $this->normalizeForComparison(
            Str::of((string) $post->slug)->replace('-', ' ')->headline()->toString()
        );

        return $heading !== '' && $heading === $headlineFromSlug;
    }

    protected function normalizeForComparison(?string $value): string
    {
        return Str::of(html_entity_decode(strip_tags((string) $value), ENT_QUOTES | ENT_HTML5, 'UTF-8'))
            ->lower()
            ->replaceMatches('/[^[:alnum:]\s]+/u', ' ')
            ->squish()
            ->toString();
    }
}
