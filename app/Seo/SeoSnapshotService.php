<?php
// Purpose: Resolve, generate, and cache freshness snapshots for programmatic SEO landing pages. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use App\Models\BlogPost;
use App\Models\SeoPageSnapshot;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Throwable;

class SeoSnapshotService
{
    public function __construct(
        private readonly OfficialPetrolNoticeService $officialPetrolNoticeService,
        private readonly PakFuelCityPriceScraperService $pakFuelCityPriceScraperService,
        private readonly PakWheelsFuelPriceScraperService $pakWheelsFuelPriceScraperService,
    ) {
    }

    public function latest(string $pageType, string|int $pageKey): ?SeoPageSnapshot
    {
        if (! Schema::hasTable('seo_page_snapshots')) {
            return null;
        }

        $normalizedKey = (string) $pageKey;

        return Cache::remember(
            $this->snapshotCacheKey($pageType, $normalizedKey),
            now()->addHours((int) config('roznamcha_seo.cache.snapshot_ttl_hours', 24)),
            fn () => SeoPageSnapshot::query()
                ->forPage($pageType, $normalizedKey)
                ->orderByDesc('effective_date')
                ->orderByDesc('id')
                ->first()
        );
    }

    public function latestOrFallback(string $pageType, string|int $pageKey, ?CarbonInterface $date = null): array
    {
        $normalizedKey = (string) $pageKey;
        $fallback = $this->fallbackSnapshot($pageType, $normalizedKey, $date);
        $snapshot = $this->latest($pageType, $normalizedKey);

        if (! $snapshot) {
            $fallbackExtraJson = $fallback['extra_json'];

            return array_merge($fallback, [
                'is_fallback' => true,
                'last_updated' => $fallback['effective_date']->copy()->startOfDay()->toIso8601String(),
                'is_indexable' => (bool) data_get($fallbackExtraJson, 'is_indexable', true),
                'has_verified_data' => (bool) data_get($fallbackExtraJson, 'has_verified_data', false),
                'has_live_data' => (bool) data_get($fallbackExtraJson, 'has_live_data', data_get($fallbackExtraJson, 'has_verified_data', false)),
                'is_official_source' => (bool) data_get($fallbackExtraJson, 'is_official_source', false),
                'source_type' => (string) data_get($fallbackExtraJson, 'source_type', data_get($fallbackExtraJson, 'has_verified_data', false) ? 'official' : 'pending'),
                'source_url' => data_get($fallbackExtraJson, 'source_url'),
                'source_asset_url' => data_get($fallbackExtraJson, 'source_asset_url'),
                'notice_title' => data_get($fallbackExtraJson, 'notice_title'),
            ]);
        }

        $extraJson = array_merge($fallback['extra_json'], $snapshot->extra_json ?? []);
        $isIndexable = (bool) data_get($extraJson, 'is_indexable', true);
        $hasVerifiedData = (bool) data_get($snapshot->extra_json ?? [], 'has_verified_data', data_get($extraJson, 'has_verified_data', false));
        $hasLiveData = (bool) data_get(
            $snapshot->extra_json ?? [],
            'has_live_data',
            $hasVerifiedData || $snapshot->value_1 !== null || $isIndexable
        );
        $isOfficialSource = (bool) data_get($snapshot->extra_json ?? [], 'is_official_source', $hasVerifiedData);
        $sourceType = (string) data_get(
            $snapshot->extra_json ?? [],
            'source_type',
            $hasVerifiedData ? 'official' : ($hasLiveData ? 'internal-estimate' : 'pending')
        );

        return array_merge($fallback, [
            'title' => $snapshot->title ?: $fallback['title'],
            'value_1' => $snapshot->value_1 !== null ? (float) $snapshot->value_1 : $fallback['value_1'],
            'value_2' => $snapshot->value_2 !== null ? (float) $snapshot->value_2 : $fallback['value_2'],
            'value_3' => $snapshot->value_3 !== null ? (float) $snapshot->value_3 : $fallback['value_3'],
            'summary_text' => $snapshot->summary_text ?: $fallback['summary_text'],
            'comparison_text' => $snapshot->comparison_text ?: $fallback['comparison_text'],
            'effective_date' => $snapshot->effective_date ?: $fallback['effective_date'],
            'source_label' => $snapshot->source_label ?: $fallback['source_label'],
            'extra_json' => $extraJson,
            'is_fallback' => false,
            'last_updated' => optional($snapshot->updated_at ?: $snapshot->effective_date)->toIso8601String()
                ?: $fallback['effective_date']->copy()->startOfDay()->toIso8601String(),
            'is_indexable' => $isIndexable,
            'has_verified_data' => $hasVerifiedData,
            'has_live_data' => $hasLiveData,
            'is_official_source' => $isOfficialSource,
            'source_type' => $sourceType,
            'source_url' => data_get($extraJson, 'source_url'),
            'source_asset_url' => data_get($extraJson, 'source_asset_url'),
            'notice_title' => data_get($extraJson, 'notice_title'),
        ]);
    }

    public function refreshPetrolCityFromPakWheels(string $city): ?SeoPageSnapshot
    {
        if (! Schema::hasTable('seo_page_snapshots')) {
            return null;
        }

        $cityKey = str($city)->lower()->trim()->value();
        $nationwideFuel = $this->latestNationwideFuel('petrol');

        if (! $nationwideFuel) {
            return null;
        }

        $currentPrice = (float) $nationwideFuel['price'];
        $historyRows = SeoPageSnapshot::query()
            ->forPage('petrol', $cityKey)
            ->whereNotNull('value_1')
            ->orderByDesc('effective_date')
            ->orderByDesc('id')
            ->limit(2)
            ->get();

        $previousPrice = $historyRows->isNotEmpty()
            ? (float) $historyRows->first()->value_1
            : $currentPrice;
        $thirdPrice = $historyRows->count() > 1
            ? (float) $historyRows->get(1)->value_1
            : $previousPrice;
        $change = round($currentPrice - $previousPrice, 2);

        $latestExisting = $historyRows->first();
        $latestEffectiveDate = $latestExisting?->effective_date?->toDateString();
        $incomingEffectiveDate = $nationwideFuel['effective_date']->toDateString();

        if (
            $latestExisting
            && abs(((float) $latestExisting->value_1) - $currentPrice) < 0.01
            && $latestEffectiveDate === $incomingEffectiveDate
            && (string) data_get($latestExisting->extra_json ?? [], 'source_type') === 'pakwheels-live'
        ) {
            $this->forgetPetrolCaches($cityKey);

            return $latestExisting;
        }

        $cityLabel = str($cityKey)->replace('-', ' ')->title()->value();
        $created = SeoPageSnapshot::query()->create($this->toDatabasePayload([
            'page_type' => 'petrol',
            'page_key' => $cityKey,
            'title' => "Petrol price in {$cityLabel} today",
            'value_1' => $currentPrice,
            'value_2' => $previousPrice,
            'value_3' => $change,
            'summary_text' => "Latest available PakWheels petroleum listing places petrol at PKR ".number_format($currentPrice, 2)." per litre. This page runs a live source check on load and updates automatically when a newer rate is available.",
            'comparison_text' => $this->backupPetrolSentence($cityLabel, $change),
            'effective_date' => Carbon::instance($nationwideFuel['effective_date']->toDateTime()),
            'source_label' => 'PakWheels live petrol feed',
            'extra_json' => [
                'coverage_note' => 'This page performs a live PakWheels petrol check during page load and updates the stored snapshot when a newer value is detected.',
                'has_verified_data' => false,
                'has_live_data' => true,
                'is_official_source' => false,
                'is_indexable' => true,
                'source_type' => 'pakwheels-live',
                'source_scope' => 'nationwide-reference',
                'source_url' => $nationwideFuel['source_url'] ?? (string) config('roznamcha_seo.petrol.cross_validation_source_url'),
                'last_checked_at' => now(config('app.timezone', 'Asia/Karachi'))->toIso8601String(),
                'recent_prices' => [
                    ['label' => 'Latest', 'price' => $currentPrice],
                    ['label' => 'Previous', 'price' => $previousPrice],
                    ['label' => '2 updates ago', 'price' => $thirdPrice],
                ],
                'recent_changes' => [
                    ['label' => 'Latest vs previous', 'change' => $change],
                    ['label' => 'Previous vs 2 updates ago', 'change' => round($previousPrice - $thirdPrice, 2)],
                ],
            ],
        ]));

        $this->forgetPetrolCaches($cityKey);

        return $created;
    }

    public function refreshAll(?CarbonInterface $date = null): array
    {
        if (! Schema::hasTable('seo_page_snapshots')) {
            throw new RuntimeException('seo_page_snapshots table is missing.');
        }

        $effectiveDate = $this->resolveDate($date);
        $created = [];
        $petrolNotice = $this->officialPetrolNoticeService->latestVerifiedNotice();

        if ($petrolNotice) {
            Log::info('SEO petrol refresh is using the official Petroleum Division source.', [
                'effective_date' => $petrolNotice['effective_date']->toDateString(),
                'notice_title' => $petrolNotice['notice_title'],
            ]);

            foreach (config('roznamcha_seo.cities', []) as $city) {
                $created[] = SeoPageSnapshot::query()->create(
                    $this->toDatabasePayload($this->petrolOfficialSnapshot((string) $city, $petrolNotice))
                );
            }
        } else {
            $backupRefresh = $this->refreshBackupCityFuel();
            $nationwideFuel = $this->latestNationwideFuel('petrol');

            Log::warning('SEO petrol refresh is falling back from the official source.', [
                'backup_status' => $backupRefresh['status'] ?? 'unknown',
                'backup_error' => $backupRefresh['error'] ?? null,
                'stored_count' => $backupRefresh['stored_count'] ?? 0,
                'nationwide_status' => $nationwideFuel ? 'available' : 'missing',
            ]);

            foreach (config('roznamcha_seo.cities', []) as $city) {
                $latestCityFuel = $this->pakFuelCityPriceScraperService->latestCityFuel((string) $city, 'petrol');

                if ($latestCityFuel) {
                    Log::info('SEO petrol refresh created a fallback city snapshot.', [
                        'city' => (string) $city,
                        'effective_date' => $latestCityFuel['effective_date']->toDateString(),
                        'source_url' => $latestCityFuel['source_url'] ?? null,
                    ]);

                    $created[] = SeoPageSnapshot::query()->create(
                        $this->toDatabasePayload($this->petrolBackupSnapshot((string) $city, $latestCityFuel, $backupRefresh))
                    );

                    continue;
                }

                if ($nationwideFuel) {
                    Log::info('SEO petrol refresh created a nationwide backup snapshot.', [
                        'city' => (string) $city,
                        'effective_date' => $nationwideFuel['effective_date']->toDateString(),
                        'source_url' => $nationwideFuel['source_url'] ?? null,
                    ]);

                    $created[] = SeoPageSnapshot::query()->create(
                        $this->toDatabasePayload($this->petrolNationwideBackupSnapshot((string) $city, $nationwideFuel, $backupRefresh))
                    );

                    continue;
                }

                if (! $latestCityFuel) {
                    Log::warning('SEO petrol refresh could not find a stored backup city snapshot.', [
                        'city' => (string) $city,
                    ]);

                    continue;
                }
            }
        }

        foreach (config('roznamcha_seo.discos', []) as $disco) {
            $created[] = SeoPageSnapshot::query()->create($this->toDatabasePayload(
                $this->fallbackSnapshot('electricity', (string) $disco, $effectiveDate)
            ));
        }

        foreach (config('roznamcha_seo.family_sizes', []) as $familySize) {
            $created[] = SeoPageSnapshot::query()->create($this->toDatabasePayload(
                $this->fallbackSnapshot('ration', (string) $familySize, $effectiveDate)
            ));
        }

        $this->forgetCaches();

        return $created;
    }

    public function lastModified(string $pageType, string|int $pageKey): string
    {
        $snapshot = $this->latest($pageType, $pageKey);

        if ($snapshot?->updated_at) {
            return $snapshot->updated_at->toAtomString();
        }

        $fallback = $this->fallbackSnapshot($pageType, (string) $pageKey);

        return $fallback['effective_date']->copy()->startOfDay()->toAtomString();
    }

    public function isIndexable(string $pageType, string|int $pageKey): bool
    {
        return (bool) $this->latestOrFallback($pageType, $pageKey)['is_indexable'];
    }

    public function isSearchIndexable(string $pageType, string|int $pageKey): bool
    {
        if ($this->isPageTypeForcedNoindex($pageType)) {
            return false;
        }

        return $this->isIndexable($pageType, $pageKey);
    }

    public function pageCacheKey(string $pageType, string $pageKey): string
    {
        return "seo:page:{$pageType}:{$pageKey}";
    }

    public function forgetPetrolCaches(string $city): void
    {
        $cityKey = str($city)->lower()->trim()->value();

        Cache::forget($this->snapshotCacheKey('petrol', $cityKey));
        Cache::forget($this->pageCacheKey('petrol', $cityKey));
        BlogPost::forgetPublicSitemapCache();
    }

    public function forgetCaches(): void
    {
        foreach (config('roznamcha_seo.cities', []) as $city) {
            Cache::forget($this->snapshotCacheKey('petrol', (string) $city));
            Cache::forget($this->pageCacheKey('petrol', (string) $city));
        }

        foreach (config('roznamcha_seo.discos', []) as $disco) {
            Cache::forget($this->snapshotCacheKey('electricity', (string) $disco));
            Cache::forget($this->pageCacheKey('electricity', (string) $disco));
        }

        foreach (config('roznamcha_seo.family_sizes', []) as $familySize) {
            Cache::forget($this->snapshotCacheKey('ration', (string) $familySize));
            Cache::forget($this->pageCacheKey('ration', (string) $familySize));
        }

        BlogPost::forgetPublicSitemapCache();
    }

    private function snapshotCacheKey(string $pageType, string $pageKey): string
    {
        return "seo:snapshot:{$pageType}:{$pageKey}";
    }

    private function isPageTypeForcedNoindex(string $pageType): bool
    {
        return in_array(
            $pageType,
            config('roznamcha_seo.search_surface.noindex_page_types', []),
            true
        );
    }

    private function toDatabasePayload(array $snapshot): array
    {
        return [
            'page_type' => $snapshot['page_type'],
            'page_key' => $snapshot['page_key'],
            'title' => $snapshot['title'],
            'value_1' => $snapshot['value_1'],
            'value_2' => $snapshot['value_2'],
            'value_3' => $snapshot['value_3'],
            'summary_text' => $snapshot['summary_text'],
            'comparison_text' => $snapshot['comparison_text'],
            'effective_date' => $snapshot['effective_date']->toDateString(),
            'source_label' => $snapshot['source_label'],
            'extra_json' => $snapshot['extra_json'],
        ];
    }

    private function fallbackSnapshot(string $pageType, string $pageKey, ?CarbonInterface $date = null): array
    {
        $effectiveDate = $this->resolveDate($date);

        return match ($pageType) {
            'petrol' => $this->petrolFallback($pageKey, $effectiveDate),
            'electricity' => $this->electricityFallback($pageKey, $effectiveDate),
            'ration' => $this->rationFallback($pageKey, $effectiveDate),
            default => throw new RuntimeException("Unsupported SEO snapshot type [{$pageType}]."),
        };
    }

    private function petrolFallback(string $city, CarbonInterface $date): array
    {
        $cityLabel = str($city)->replace('-', ' ')->title()->value();

        return [
            'page_type' => 'petrol',
            'page_key' => $city,
            'title' => "Petrol price in {$cityLabel} today",
            'value_1' => null,
            'value_2' => null,
            'value_3' => null,
            'summary_text' => "Roznamcha could not sync the official Petroleum Division notice for {$cityLabel}, and there is no usable PakFuel city snapshot stored yet. This page stays out of Google until a real fuel source is available.",
            'comparison_text' => 'Official source and backup city feed are both pending sync.',
            'effective_date' => Carbon::instance($date->toDateTime()),
            'source_label' => (string) config('roznamcha_seo.petrol.pending_source_label', 'Official Petroleum Division notice pending sync'),
            'extra_json' => [
                'coverage_note' => 'Petrol city pages stay noindex until either the official notice or a stored backup city snapshot is available.',
                'has_verified_data' => false,
                'has_live_data' => false,
                'is_official_source' => false,
                'is_indexable' => false,
                'source_type' => 'pending',
            ],
        ];
    }

    private function petrolOfficialSnapshot(string $city, array $notice): array
    {
        $cityLabel = str($city)->replace('-', ' ')->title()->value();
        $current = (float) $notice['motor_spirit_price'];
        $previous = (float) $notice['motor_spirit_previous_price'];
        $change = (float) $notice['motor_spirit_change'];

        return [
            'page_type' => 'petrol',
            'page_key' => $city,
            'title' => "Petrol price in {$cityLabel} today",
            'value_1' => $current,
            'value_2' => $previous,
            'value_3' => $change,
            'summary_text' => "Official Petroleum Division petrol pricing places Motor Spirit (MS) at PKR ".number_format($current, 2)." per litre for Pakistan, which is the same notified rate households in {$cityLabel} can use as today's planning benchmark.",
            'comparison_text' => $this->officialPetrolSentence($cityLabel, $change),
            'effective_date' => Carbon::instance($notice['effective_date']->toDateTime()),
            'source_label' => (string) $notice['source_label'],
            'extra_json' => [
                'coverage_note' => 'Official nationwide notified petrol price used on city pages for local budgeting context.',
                'has_verified_data' => true,
                'has_live_data' => true,
                'is_official_source' => true,
                'is_indexable' => true,
                'notice_title' => $notice['notice_title'],
                'price_type' => 'Motor Spirit (MS)',
                'source_type' => 'official',
                'source_url' => $notice['notice_url'],
                'source_asset_url' => $notice['notice_asset_url'],
                'high_speed_diesel_price' => (float) $notice['high_speed_diesel_price'],
                'high_speed_diesel_previous_price' => (float) $notice['high_speed_diesel_previous_price'],
                'high_speed_diesel_change' => (float) $notice['high_speed_diesel_change'],
            ],
        ];
    }

    private function petrolBackupSnapshot(string $city, array $latestCityFuel, array $backupRefresh): array
    {
        $cityLabel = str($city)->replace('-', ' ')->title()->value();
        $current = (float) $latestCityFuel['current_price'];
        $previous = (float) $latestCityFuel['previous_price'];
        $change = round($current - $previous, 2);

        return [
            'page_type' => 'petrol',
            'page_key' => $city,
            'title' => "Petrol price in {$cityLabel} today",
            'value_1' => $current,
            'value_2' => $previous,
            'value_3' => $change,
            'summary_text' => "Latest available PakFuel city snapshot places petrol in {$cityLabel} at PKR ".number_format($current, 2).' per litre. Roznamcha is using this clearly labeled fallback because the official Petroleum Division notice was not available during the latest refresh.',
            'comparison_text' => $this->backupPetrolSentence($cityLabel, $change),
            'effective_date' => Carbon::instance($latestCityFuel['effective_date']->toDateTime()),
            'source_label' => (string) config('roznamcha_seo.petrol.backup_city_source_label', 'PakFuel city listing fallback'),
            'extra_json' => [
                'coverage_note' => 'City-level PakFuel snapshot is being shown as a fallback because the official Petroleum Division notice was unavailable for the latest refresh.',
                'has_verified_data' => false,
                'has_live_data' => true,
                'is_official_source' => false,
                'is_indexable' => true,
                'source_type' => 'backup',
                'source_url' => $latestCityFuel['source_url'] ?? (string) config('roznamcha_seo.petrol.backup_city_source_url'),
                'official_source_unavailable' => true,
                'backup_refresh_status' => $backupRefresh['status'] ?? 'stored',
                'backup_refresh_error' => $backupRefresh['error'] ?? null,
            ],
        ];
    }

    private function petrolNationwideBackupSnapshot(string $city, array $nationwideFuel, array $backupRefresh): array
    {
        $cityLabel = str($city)->replace('-', ' ')->title()->value();
        $current = (float) $nationwideFuel['price'];

        return [
            'page_type' => 'petrol',
            'page_key' => $city,
            'title' => "Petrol price in {$cityLabel} today",
            'value_1' => $current,
            'value_2' => $current,
            'value_3' => 0.0,
            'summary_text' => "Latest available PakWheels nationwide petroleum listing places petrol at PKR ".number_format($current, 2)." per litre. Roznamcha is showing this temporary nationwide reference for {$cityLabel} because both the official Petroleum Division notice and the city-level PakFuel snapshot were unavailable during the latest refresh.",
            'comparison_text' => "Official and city-level sources are still pending for {$cityLabel}, so this page is temporarily showing the latest nationwide petrol reference instead of an empty placeholder.",
            'effective_date' => Carbon::instance($nationwideFuel['effective_date']->toDateTime()),
            'source_label' => (string) config('roznamcha_seo.petrol.backup_nationwide_source_label', 'PakWheels nationwide petroleum price fallback'),
            'extra_json' => [
                'coverage_note' => 'Nationwide PakWheels petrol pricing is being shown as a temporary reference because neither the official government notice nor a city-level PakFuel snapshot was available during the latest refresh.',
                'has_verified_data' => false,
                'has_live_data' => true,
                'is_official_source' => false,
                'is_indexable' => true,
                'source_type' => 'backup-national',
                'source_scope' => 'nationwide-reference',
                'source_url' => $nationwideFuel['source_url'] ?? (string) config('roznamcha_seo.petrol.cross_validation_source_url'),
                'official_source_unavailable' => true,
                'backup_refresh_status' => $backupRefresh['status'] ?? 'stored-snapshot-only',
                'backup_refresh_error' => $backupRefresh['error'] ?? null,
            ],
        ];
    }

    private function electricityFallback(string $disco, CarbonInterface $date): array
    {
        $discos = array_values(config('roznamcha_seo.discos', []));
        $discoIndex = array_search($disco, $discos, true);
        $discoIndex = $discoIndex === false ? 0 : $discoIndex;
        $avgRate = round((float) config('roznamcha_seo.electricity.default_avg_rate', 38.00) + ($discoIndex * 1.35) + (($date->dayOfMonth % 4) * 0.35), 2);
        $rateChangeOptions = [-0.8, -0.3, 0.0, 0.4, 0.9];
        $rateChange = $rateChangeOptions[($date->dayOfYear + $discoIndex) % count($rateChangeOptions)];
        $previousAvgRate = round($avgRate - $rateChange, 2);
        $taxMultiplier = (float) config('roznamcha_seo.electricity.tax_multiplier', 1.18);
        $examples = $this->electricityExamples($avgRate, $taxMultiplier);
        $previousExamples = $this->electricityExamples($previousAvgRate, $taxMultiplier);
        $discoLabel = strtoupper($disco);
        $changeAmount = round($examples[200] - $previousExamples[200], 2);

        return [
            'page_type' => 'electricity',
            'page_key' => $disco,
            'title' => "Electricity bill calculator for {$discoLabel}",
            'value_1' => $avgRate,
            'value_2' => $examples[200],
            'value_3' => $previousExamples[200],
            'summary_text' => "Latest available internal estimate places {$discoLabel} residential billing around PKR ".number_format($avgRate, 2).' per unit.',
            'comparison_text' => $this->rangeSentence($discoLabel, $changeAmount),
            'effective_date' => Carbon::instance($date->toDateTime()),
            'source_label' => (string) config('roznamcha_seo.source_label', 'Roznamcha internal estimate'),
            'extra_json' => [
                'unit_examples' => $examples,
                'previous_unit_examples' => $previousExamples,
                'avg_rate_change' => round($rateChange, 2),
                'has_verified_data' => false,
                'has_live_data' => true,
                'is_official_source' => false,
                'is_indexable' => true,
                'source_type' => 'internal-estimate',
            ],
        ];
    }

    private function rationFallback(string $familySize, CarbonInterface $date): array
    {
        $size = (int) $familySize;
        $baseCostPerPerson = (float) config('roznamcha_seo.ration.base_cost_per_person', 8500);
        $inflationBuffer = (float) config('roznamcha_seo.ration.inflation_buffer_percent', 12);
        $seasonalBump = (($date->month % 3) * 250) + (($size % 3) * 175);
        $current = round(($size * $baseCostPerPerson) * (1 + ($inflationBuffer / 100)) + $seasonalBump, 2);
        $changeOptions = [-1200, -450, 0, 900, 1800];
        $change = (float) $changeOptions[($date->dayOfYear + $size) % count($changeOptions)];
        $previous = round($current - $change, 2);
        $range = [
            'low' => round($current * 0.95, 2),
            'high' => round($current * 1.07, 2),
        ];

        return [
            'page_type' => 'ration',
            'page_key' => (string) $size,
            'title' => "Ration cost for {$size} people in Pakistan",
            'value_1' => $current,
            'value_2' => $previous,
            'value_3' => round($change, 2),
            'summary_text' => "Latest internal household basket estimate for a {$size}-person family is PKR ".number_format($current, 0).'.',
            'comparison_text' => $this->rationSentence($size, $change),
            'effective_date' => Carbon::instance($date->toDateTime()),
            'source_label' => (string) config('roznamcha_seo.source_label', 'Roznamcha internal estimate'),
            'extra_json' => [
                'inflation_buffer_percent' => $inflationBuffer,
                'range' => $range,
                'has_verified_data' => false,
                'has_live_data' => true,
                'is_official_source' => false,
                'is_indexable' => true,
                'source_type' => 'internal-estimate',
            ],
        ];
    }

    private function refreshBackupCityFuel(): array
    {
        if (! Schema::hasTable('cities') || ! Schema::hasTable('petrol_prices')) {
            Log::warning('SEO petrol backup refresh skipped because fallback tables are missing.');

            return [
                'status' => 'tables-missing',
                'error' => 'cities or petrol_prices table is missing.',
            ];
        }

        try {
            $stored = $this->pakFuelCityPriceScraperService->scrapeAndStore();

            return [
                'status' => 'stored',
                'stored_count' => $stored['stored_count'] ?? 0,
                'unmatched' => $stored['unmatched'] ?? [],
                'error' => null,
            ];
        } catch (Throwable $throwable) {
            report($throwable);
            Log::warning('SEO petrol backup refresh failed and will rely on any previously stored city rows.', [
                'error' => $throwable->getMessage(),
            ]);

            return [
                'status' => 'stored-snapshot-only',
                'error' => $throwable->getMessage(),
            ];
        }
    }

    private function latestNationwideFuel(string $fuelType = 'petrol'): ?array
    {
        try {
            return $this->pakWheelsFuelPriceScraperService->latestFuel($fuelType);
        } catch (Throwable $throwable) {
            report($throwable);
            Log::warning('SEO petrol nationwide backup refresh failed.', [
                'fuel_type' => $fuelType,
                'error' => $throwable->getMessage(),
            ]);

            return null;
        }
    }

    private function electricityExamples(float $avgRate, float $taxMultiplier): array
    {
        return collect([100, 200, 300])
            ->mapWithKeys(fn (int $units) => [$units => round($units * $avgRate * $taxMultiplier, 2)])
            ->all();
    }

    private function officialPetrolSentence(string $cityLabel, float $change): string
    {
        if (abs($change) < 0.01) {
            return "Official notified petrol price for {$cityLabel} is unchanged from the previous Petroleum Division update.";
        }

        $direction = $change > 0 ? 'increased' : 'decreased';

        return "Official notified petrol price for {$cityLabel} {$direction} by PKR ".number_format(abs($change), 2).' from the previous Petroleum Division update.';
    }

    private function backupPetrolSentence(string $cityLabel, float $change): string
    {
        if (abs($change) < 0.01) {
            return "Latest stored PakFuel city listing for {$cityLabel} is unchanged from the previous city-level update.";
        }

        $direction = $change > 0 ? 'increased' : 'decreased';

        return "Latest stored PakFuel city listing for {$cityLabel} {$direction} by PKR ".number_format(abs($change), 2).' from the previous city-level update.';
    }

    private function rangeSentence(string $discoLabel, float $changeAmount): string
    {
        if (abs($changeAmount) < 50) {
            return "Estimated billing for {$discoLabel} users remains within the same range as the last update.";
        }

        $direction = $changeAmount > 0 ? 'higher' : 'lower';

        return "Estimated billing for {$discoLabel} users is about PKR ".number_format(abs($changeAmount), 0)." {$direction} than the previous update for 200 units.";
    }

    private function rationSentence(int $familySize, float $change): string
    {
        if (abs($change) < 0.01) {
            return "Estimated ration cost for a {$familySize}-person family is broadly unchanged from the previous calculation.";
        }

        $direction = $change > 0 ? 'slightly higher' : 'slightly lower';

        return "Estimated ration cost for a {$familySize}-person family is {$direction} than the previous calculation by around PKR ".number_format(abs($change), 0).'.';
    }

    private function resolveDate(?CarbonInterface $date = null): Carbon
    {
        $timezone = config('app.timezone', 'Asia/Karachi');

        return $date
            ? Carbon::instance($date->toDateTime())->setTimezone($timezone)
            : now($timezone);
    }
}
