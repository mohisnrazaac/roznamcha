<?php
// Purpose: Validate SEO page keys and assemble rich page props from snapshot data, defaults, and internal links. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class SeoPageDataService
{
    public function __construct(
        private readonly SeoSnapshotService $snapshotService,
        private readonly SeoPageMetaService $metaService,
        private readonly SeoPageUrlGenerator $urlGenerator,
    ) {
    }

    public function petrol(string $city): array
    {
        $cityKey = Str::lower($city);

        try {
            $this->snapshotService->refreshPetrolCityFromPakWheels($cityKey);
        } catch (Throwable $throwable) {
            report($throwable);
            Log::warning('SEO petrol live PakWheels refresh failed during page render.', [
                'city' => $cityKey,
                'error' => $throwable->getMessage(),
            ]);
        }

        $this->snapshotService->forgetPetrolCaches($cityKey);

        return $this->build('petrol', $cityKey);
    }

    public function electricity(string $disco): array
    {
        return $this->build('electricity', Str::lower($disco));
    }

    public function ration(int|string $size): array
    {
        return $this->build('ration', (string) (int) $size);
    }

    public function build(string $pageType, string $pageKey): array
    {
        $normalizedKey = $this->normalizeKey($pageType, $pageKey);

        if (! $this->isAllowed($pageType, $normalizedKey)) {
            throw new NotFoundHttpException();
        }

        return Cache::remember(
            $this->snapshotService->pageCacheKey($pageType, $normalizedKey),
            now()->addHours((int) config('roznamcha_seo.cache.page_ttl_hours', 24)),
            function () use ($pageType, $normalizedKey) {
                $snapshot = $this->snapshotService->latestOrFallback($pageType, $normalizedKey);
                $isSearchIndexable = $this->snapshotService->isSearchIndexable($pageType, $normalizedKey);

                if ($pageType === 'petrol') {
                    Log::info('SEO petrol page resolved.', [
                        'page_key' => $normalizedKey,
                        'source_type' => $snapshot['source_type'] ?? 'pending',
                        'has_live_data' => $snapshot['has_live_data'] ?? false,
                        'is_indexable' => $snapshot['is_indexable'] ?? false,
                        'source_label' => $snapshot['source_label'] ?? null,
                        'source_url' => $snapshot['source_url'] ?? null,
                        'effective_date' => optional($snapshot['effective_date'] ?? null)?->toDateString(),
                        'last_updated' => $snapshot['last_updated'] ?? null,
                    ]);
                }

                $title = $this->pageTitle($pageType, $normalizedKey);
                $breadcrumbs = [
                    ['label' => 'Home', 'href' => $this->urlGenerator->homeUrl()],
                    ['label' => $title, 'href' => $this->urlGenerator->url($pageType, $normalizedKey)],
                ];
                $faqItems = $this->faqItems($pageType, $snapshot);
                $meta = $this->metaService->build(
                    $pageType,
                    $normalizedKey,
                    $title,
                    $snapshot['summary_text'],
                    $faqItems,
                    $breadcrumbs,
                    $snapshot['last_updated']
                );
                $pageSchema = $meta['structuredData'][0] ?? null;

                return [
                    'pageType' => $pageType,
                    'pageKey' => $normalizedKey,
                    'title' => $title,
                    'h1' => $title,
                    'seo' => [
                        'title' => $meta['metaTitle'],
                        'description' => $meta['metaDescription'],
                        'url' => $meta['canonicalUrl'],
                        'canonical' => $meta['canonicalUrl'],
                        'type' => 'article',
                        'robots' => $isSearchIndexable ? 'index,follow' : 'noindex,follow',
                    ],
                    'jsonLd' => $pageSchema,
                    'metaTitle' => $meta['metaTitle'],
                    'metaDescription' => $meta['metaDescription'],
                    'canonicalUrl' => $meta['canonicalUrl'],
                    'lastUpdated' => $snapshot['last_updated'],
                    'dataPoints' => $this->dataPoints($pageType, $snapshot),
                    'summaryText' => $snapshot['summary_text'],
                    'comparisonText' => $snapshot['comparison_text'],
                    'helperContent' => $this->helperContent($pageType, $normalizedKey, $snapshot),
                    'internalLinks' => $this->internalLinks($pageType, $normalizedKey),
                    'faqItems' => $faqItems,
                    'ctaText' => $this->ctaText($pageType),
                    'breadcrumbs' => $breadcrumbs,
                    'structuredData' => $meta['structuredData'],
                    'robots' => $isSearchIndexable ? 'index,follow' : 'noindex,follow',
                    'isIndexable' => $isSearchIndexable,
                    'sourceLabel' => $snapshot['source_label'],
                    'sourceUrl' => $snapshot['source_url'],
                    'sourceAssetUrl' => $snapshot['source_asset_url'],
                    'noticeTitle' => $snapshot['notice_title'],
                    'lastCheckedAt' => data_get($snapshot, 'extra_json.last_checked_at'),
                ];
            }
        );
    }

    private function isAllowed(string $pageType, string $pageKey): bool
    {
        return in_array($pageKey, $this->allowedKeys($pageType), true);
    }

    private function allowedKeys(string $pageType): array
    {
        return match ($pageType) {
            'petrol' => config('roznamcha_seo.cities', []),
            'electricity' => config('roznamcha_seo.discos', []),
            'ration' => array_map('strval', config('roznamcha_seo.family_sizes', [])),
            default => [],
        };
    }

    private function normalizeKey(string $pageType, string $pageKey): string
    {
        return $pageType === 'ration'
            ? (string) (int) $pageKey
            : Str::lower(trim($pageKey));
    }

    private function pageTitle(string $pageType, string $pageKey): string
    {
        return match ($pageType) {
            'petrol' => 'Petrol Price in '.$this->urlGenerator->cityLabel($pageKey).' Today',
            'electricity' => 'Electricity Bill Calculator for '.$this->urlGenerator->discoLabel($pageKey),
            'ration' => 'Ration Cost for '.(int) $pageKey.' People in Pakistan',
            default => 'Roznamcha Pakistan',
        };
    }

    private function dataPoints(string $pageType, array $snapshot): array
    {
        return match ($pageType) {
            'petrol' => $this->petrolDataPoints($snapshot),
            'electricity' => [
                ['label' => 'Average unit rate', 'value' => 'PKR '.number_format($snapshot['value_1'], 2).' per unit'],
                ['label' => '100-unit estimate', 'value' => 'PKR '.number_format(data_get($snapshot, 'extra_json.unit_examples.100', 0), 0)],
                ['label' => '200-unit estimate', 'value' => 'PKR '.number_format(data_get($snapshot, 'extra_json.unit_examples.200', 0), 0)],
                ['label' => '300-unit estimate', 'value' => 'PKR '.number_format(data_get($snapshot, 'extra_json.unit_examples.300', 0), 0)],
            ],
            'ration' => [
                ['label' => 'Latest estimate', 'value' => 'PKR '.number_format($snapshot['value_1'], 0).' / month'],
                ['label' => 'Previous estimate', 'value' => 'PKR '.number_format($snapshot['value_2'], 0).' / month'],
                ['label' => 'Budget range', 'value' => 'PKR '.number_format(data_get($snapshot, 'extra_json.range.low', 0), 0).' - '.number_format(data_get($snapshot, 'extra_json.range.high', 0), 0)],
                ['label' => 'Inflation buffer', 'value' => number_format((float) data_get($snapshot, 'extra_json.inflation_buffer_percent', 0), 0).'%'],
            ],
            default => [],
        };
    }

    private function helperContent(string $pageType, string $pageKey, array $snapshot): array
    {
        return match ($pageType) {
            'petrol' => $this->petrolHelperContent($pageKey, $snapshot),
            'electricity' => $this->electricityHelperContent($pageKey, $snapshot),
            'ration' => $this->rationHelperContent($pageKey, $snapshot),
            default => [],
        };
    }

    private function petrolHelperContent(string $city, array $snapshot): array
    {
        $cityLabel = $this->urlGenerator->cityLabel($city);
        $coverageNote = (string) data_get($snapshot, 'extra_json.coverage_note', '');
        $sourceType = (string) ($snapshot['source_type'] ?? 'pending');

        if (! $snapshot['has_live_data']) {
            return [
                [
                    'heading' => "Why {$cityLabel} is still waiting for fuel data",
                    'body' => "Roznamcha does not want to publish a made-up petrol number for {$cityLabel}. The official Petroleum Division source could not be synced and there is no usable PakFuel city snapshot stored yet, so the page stays out of Google instead of pretending a number exists.",
                ],
                [
                    'heading' => 'What will unlock indexing',
                    'body' => 'As soon as either the latest government notice is verified or a real PakFuel city snapshot is stored, the page gets a real price, a dated source reference, and can safely appear in the sitemap.',
                ],
                [
                    'heading' => 'Why this is stricter than a generic template',
                    'body' => 'Fuel price pages lose trust immediately when the number is wrong. Roznamcha now treats missing official data as a noindex state instead of filling the page with synthetic prices.',
                ],
            ];
        }

        if ($sourceType === 'backup') {
            return [
                [
                    'heading' => "Why {$cityLabel} is using a backup fuel source",
                    'body' => "Roznamcha could not sync the latest official Petroleum Division notice for {$cityLabel} during this refresh, so the page is using the latest stored PakFuel city snapshot instead. The source label stays visible so visitors can see this is a fallback, not an official government notice.",
                ],
                [
                    'heading' => 'How to read the backup number',
                    'body' => "Treat the current price of PKR ".number_format($snapshot['value_1'], 2)." per litre as the latest available city-level budgeting reference for {$cityLabel}. It is useful for day-to-day planning, but it should not be mistaken for an official nationwide notification.",
                ],
                [
                    'heading' => 'What happens when the official source returns',
                    'body' => 'The next successful Petroleum Division sync will replace the fallback snapshot with the official source automatically. Until then, this page keeps showing the latest stored real city value instead of going blank.',
                ],
            ];
        }

        if ($sourceType === 'backup-national') {
            return [
                [
                    'heading' => "Why {$cityLabel} is showing a nationwide petrol reference",
                    'body' => "Roznamcha could not sync either the latest official Petroleum Division notice or a usable PakFuel city snapshot for {$cityLabel}. Instead of showing a made-up city number, the page is temporarily showing the latest real PakWheels nationwide petrol price with a clear label.",
                ],
                [
                    'heading' => 'Why this page stays out of Google for now',
                    'body' => "The nationwide price of PKR ".number_format($snapshot['value_1'], 2)." per litre is real and useful for budgeting, but it is not a city-specific verified figure for {$cityLabel}. Roznamcha now keeps the source label visible so search visitors can still see that this page is using a nationwide fallback reference, not an official city-specific notice.",
                ],
                [
                    'heading' => 'What will replace this temporary reference',
                    'body' => 'The next successful Petroleum Division sync or PakFuel city sync will automatically replace this nationwide fallback with the stronger source. Until then, visitors still get a real fuel benchmark instead of a blank or synthetic page.',
                ],
            ];
        }

        return [
            [
                'heading' => "Why {$cityLabel} petrol prices matter",
                'body' => "{$cityLabel} households feel fuel changes quickly through commuting, school runs, and delivery costs. A visible official price check helps families understand whether transport pressure is rising before the rest of the monthly budget starts slipping.",
            ],
            [
                'heading' => 'How the freshness layer works',
                'body' => 'This page now reads a verified Petroleum Division snapshot instead of an invented placeholder. '.$coverageNote,
            ],
            [
                'heading' => 'How to use this number in budgeting',
                'body' => "Use the current price of PKR ".number_format($snapshot['value_1'], 2).' per litre as a planning input for weekly transport spend, then compare it against the previous update before committing to discretionary travel.',
            ],
        ];
    }

    private function electricityHelperContent(string $disco, array $snapshot): array
    {
        $discoLabel = $this->urlGenerator->discoLabel($disco);

        return [
            [
                'heading' => "What the {$discoLabel} estimate covers",
                'body' => 'The examples on this page use an internal average rate and household-style monthly usage examples for 100, 200, and 300 units. That keeps the page practical for families who want a fast pre-bill check instead of a raw tariff table.',
            ],
            [
                'heading' => 'Why the page changes over time',
                'body' => 'Snapshot refreshes can update the average rate, the sample bill amounts, and the comparison line. That gives Google and visitors a genuine reason to revisit the page instead of landing on a frozen template.',
            ],
            [
                'heading' => 'How to use the examples',
                'body' => "If your home usually lands near 200 units, compare the current estimate of PKR ".number_format(data_get($snapshot, 'extra_json.unit_examples.200', 0), 0).' with the previous range to decide whether you need to trim appliance use before the next billing cycle.',
            ],
        ];
    }

    private function rationHelperContent(string $familySize, array $snapshot): array
    {
        $size = (int) $familySize;

        return [
            [
                'heading' => "What a {$size}-person ration estimate means",
                'body' => 'This page translates a household-sized grocery basket into a monthly planning figure. It is not pretending to be an official CPI release. It is a practical budgeting estimate that gives families a quick number to work from.',
            ],
            [
                'heading' => 'How the planning margin is used',
                'body' => 'Roznamcha applies a visible planning margin so ration planning does not rely on unrealistically neat numbers. That matters when staples move quickly and a family wants a safer range instead of a single fragile total.',
            ],
            [
                'heading' => 'How to turn this into action',
                'body' => "Use the current estimate of PKR ".number_format($snapshot['value_1'], 0).' as your working ceiling, then compare it with the previous update before deciding whether to reduce impulse grocery spend or rebalance other monthly categories.',
            ],
        ];
    }

    private function internalLinks(string $pageType, string $pageKey): array
    {
        $familyLinks = array_slice($this->urlGenerator->siblings($pageType, $pageKey), 0, 4);

        $supplemental = collect([
            Route::has('public.kharcha-map') ? ['title' => 'Kharcha Map', 'href' => route('public.kharcha-map', [], false)] : null,
            Route::has('public.tools.ration-cost-estimator') ? ['title' => 'Ration Cost Estimator', 'href' => route('public.tools.ration-cost-estimator', [], false)] : null,
            Route::has('public.tools.electricity-bill-estimator') ? ['title' => 'Electricity Bill Estimator', 'href' => route('public.tools.electricity-bill-estimator', [], false)] : null,
            Route::has('public.survival-report') ? ['title' => 'Survival Report', 'href' => route('public.survival-report', [], false)] : null,
        ])
            ->filter()
            ->all();

        return array_values(array_unique(array_merge($familyLinks, $supplemental), SORT_REGULAR));
    }

    private function faqItems(string $pageType, array $snapshot = []): array
    {
        return match ($pageType) {
            'petrol' => [
                [
                    'question' => 'Is this an official petrol notification?',
                    'answer' => 'When a verified Petroleum Division notice is available, Roznamcha shows it directly. If the official source is unavailable, the page can fall back to a clearly labeled PakFuel city snapshot or a temporary PakWheels nationwide reference instead of pretending the number is official.',
                ],
                [
                    'question' => 'Why does the page mention the previous update?',
                    'answer' => 'Comparison text helps visitors see direction, not just a single price. That keeps the page more useful for repeat checking and monthly transport planning.',
                ],
                [
                    'question' => 'Will more cities be added later?',
                    'answer' => 'Yes. The page family is config-driven, so new city slugs can be added without changing the template structure.',
                ],
            ],
            'electricity' => [
                [
                    'question' => 'Does this replace my actual DISCO bill?',
                    'answer' => 'No. It is a planning calculator page with monthly usage examples. Your actual bill can include line items or timing effects that are outside this simplified estimate.',
                ],
                [
                    'question' => 'Why are 100, 200, and 300 units shown?',
                    'answer' => 'Those reference points let households quickly compare light, average, and heavier residential use without entering data first.',
                ],
                [
                    'question' => 'Can real tariff feeds be connected later?',
                    'answer' => 'Yes. Snapshot storage and refresh logic are already separated so a real upstream source can replace the fallback calculation later.',
                ],
            ],
            'ration' => [
                [
                    'question' => 'Is this the exact grocery bill for every household?',
                    'answer' => 'No. It is an internal planning estimate built for a typical household basket and includes a planning margin so families get a safer budget number.',
                ],
                [
                    'question' => 'Why is there a range instead of one strict price?',
                    'answer' => 'Staple prices move between neighborhoods, timing windows, and purchase quality. A range is more practical than pretending one price fits every basket.',
                ],
                [
                    'question' => 'Can more family sizes be added later?',
                    'answer' => 'Yes. Family-size pages are generated from config values, so extending the coverage is straightforward.',
                ],
            ],
            default => [],
        };
    }

    private function ctaText(string $pageType): string
    {
        return match ($pageType) {
            'petrol' => 'Track fuel, ration, and utility pressure together inside Roznamcha so transport spikes do not disappear inside a vague monthly total.',
            'electricity' => 'Use Roznamcha to pair your utility estimate with the rest of the household budget instead of treating bijli as an isolated shock.',
            'ration' => 'Save a cleaner monthly grocery plan inside Roznamcha so ration spikes can be compared against rent, utilities, and school costs in one place.',
            default => 'Use Roznamcha to keep household budgeting decisions in one place.',
        };
    }

    private function signedAmount(float $value): string
    {
        if (abs($value) < 0.01) {
            return 'PKR 0.00';
        }

        $prefix = $value > 0 ? '+' : '-';

        return $prefix.'PKR '.number_format(abs($value), 2);
    }

    private function petrolDataPoints(array $snapshot): array
    {
        if (! $snapshot['has_live_data']) {
            return [
                ['label' => 'Fuel price status', 'value' => 'Pending sync'],
                ['label' => 'Search indexing', 'value' => 'Noindex until verified'],
                ['label' => 'Source label', 'value' => $snapshot['source_label']],
                ['label' => 'Coverage', 'value' => 'City page withheld from sitemap'],
            ];
        }

        if (($snapshot['source_type'] ?? 'official') === 'backup') {
            return [
                ['label' => 'Latest city petrol price', 'value' => 'PKR '.number_format($snapshot['value_1'], 2).' per litre'],
                ['label' => 'Previous stored city price', 'value' => 'PKR '.number_format($snapshot['value_2'], 2).' per litre'],
                ['label' => 'Change vs previous update', 'value' => $this->signedAmount((float) $snapshot['value_3'])],
                ['label' => 'Source label', 'value' => $snapshot['source_label']],
            ];
        }

        if (($snapshot['source_type'] ?? 'official') === 'backup-national') {
            return [
                ['label' => 'Latest nationwide petrol price', 'value' => 'PKR '.number_format($snapshot['value_1'], 2).' per litre'],
                ['label' => 'Source scope', 'value' => 'Nationwide reference only'],
                ['label' => 'Change vs previous update', 'value' => $this->signedAmount((float) $snapshot['value_3'])],
                ['label' => 'Source label', 'value' => $snapshot['source_label']],
            ];
        }

        if (($snapshot['source_type'] ?? 'official') === 'pakwheels-live') {
            $latest = (float) data_get($snapshot, 'extra_json.recent_prices.0.price', $snapshot['value_1']);
            $previous = (float) data_get($snapshot, 'extra_json.recent_prices.1.price', $snapshot['value_2']);
            $third = (float) data_get($snapshot, 'extra_json.recent_prices.2.price', $previous);
            $latestVsPrevious = (float) data_get($snapshot, 'extra_json.recent_changes.0.change', $latest - $previous);
            $previousVsThird = (float) data_get($snapshot, 'extra_json.recent_changes.1.change', $previous - $third);

            return [
                ['label' => 'Latest PakWheels petrol price', 'value' => 'PKR '.number_format($latest, 2).' per litre'],
                ['label' => 'Previous price', 'value' => 'PKR '.number_format($previous, 2).' per litre'],
                ['label' => '2 updates ago', 'value' => 'PKR '.number_format($third, 2).' per litre'],
                ['label' => 'Latest vs previous', 'value' => $this->signedAmount($latestVsPrevious)],
                ['label' => 'Previous vs 2 updates ago', 'value' => $this->signedAmount($previousVsThird)],
                ['label' => 'Source label', 'value' => $snapshot['source_label']],
            ];
        }

        return [
            ['label' => 'Official petrol price (MS)', 'value' => 'PKR '.number_format($snapshot['value_1'], 2).' per litre'],
            ['label' => 'Previous official update', 'value' => 'PKR '.number_format($snapshot['value_2'], 2).' per litre'],
            ['label' => 'Change', 'value' => $this->signedAmount((float) $snapshot['value_3'])],
            ['label' => 'Source label', 'value' => $snapshot['source_label']],
        ];
    }
}
