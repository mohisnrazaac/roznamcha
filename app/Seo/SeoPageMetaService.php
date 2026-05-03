<?php
// Purpose: Build page-specific meta tags and structured data for programmatic SEO landing pages. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

class SeoPageMetaService
{
    public function __construct(private readonly SeoPageUrlGenerator $urlGenerator)
    {
    }

    public function build(
        string $pageType,
        string|int $pageKey,
        string $title,
        string $summaryText,
        array $faqItems,
        array $breadcrumbs,
        string $lastUpdated
    ): array {
        $meta = $this->metaFor($pageType, $pageKey);
        $canonicalUrl = $this->urlGenerator->url($pageType, $pageKey);

        return [
            'metaTitle' => $meta['metaTitle'],
            'metaDescription' => $meta['metaDescription'],
            'canonicalUrl' => $canonicalUrl,
            'structuredData' => [
                $this->webPageSchema($title, $summaryText, $canonicalUrl, $lastUpdated),
                $this->breadcrumbSchema($breadcrumbs),
                $this->faqSchema($faqItems),
            ],
        ];
    }

    private function metaFor(string $pageType, string|int $pageKey): array
    {
        return match ($pageType) {
            'petrol' => [
                'metaTitle' => 'Petrol Price in '.$this->urlGenerator->cityLabel((string) $pageKey).' Today | Roznamcha Pakistan',
                'metaDescription' => 'Check the latest petrol price update for '.$this->urlGenerator->cityLabel((string) $pageKey).' today with comparison insight and related city price pages on Roznamcha.',
            ],
            'electricity' => [
                'metaTitle' => 'Electricity Bill Calculator for '.$this->urlGenerator->discoLabel((string) $pageKey).' | Roznamcha',
                'metaDescription' => 'Estimate your '.$this->urlGenerator->discoLabel((string) $pageKey).' electricity bill using Roznamcha monthly usage examples and comparison context.',
            ],
            'ration' => [
                'metaTitle' => 'Ration Cost for '.(int) $pageKey.' People in Pakistan | Roznamcha',
                'metaDescription' => 'See the estimated monthly ration cost for a '.(int) $pageKey.'-person family in Pakistan with practical budgeting guidance on Roznamcha.',
            ],
            default => [
                'metaTitle' => 'Roznamcha Pakistan',
                'metaDescription' => 'Fresh household budgeting pages for Pakistan.',
            ],
        };
    }

    private function webPageSchema(string $title, string $summaryText, string $canonicalUrl, string $lastUpdated): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebPage',
            'name' => $title,
            'url' => $canonicalUrl,
            'description' => $summaryText,
            'dateModified' => $lastUpdated,
            'isPartOf' => [
                '@type' => 'WebSite',
                'name' => 'Roznamcha',
                'url' => $this->urlGenerator->homeUrl(),
            ],
        ];
    }

    private function breadcrumbSchema(array $breadcrumbs): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($breadcrumbs)
                ->values()
                ->map(fn (array $item, int $index) => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $item['label'],
                    'item' => $item['href'],
                ])
                ->all(),
        ];
    }

    private function faqSchema(array $faqItems): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => collect($faqItems)
                ->map(fn (array $item) => [
                    '@type' => 'Question',
                    'name' => $item['question'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $item['answer'],
                    ],
                ])
                ->all(),
        ];
    }
}
