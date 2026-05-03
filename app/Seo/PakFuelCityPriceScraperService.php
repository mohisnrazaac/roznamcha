<?php
// Purpose: Scrape city-level PakFuel petrol and diesel listings for fallback storage and SEO recovery. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use App\Models\City;
use App\Models\PetrolPrice;
use Carbon\Carbon;
use DOMDocument;
use DOMElement;
use DOMXPath;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use RuntimeException;

class PakFuelCityPriceScraperService
{
    public function __construct(private readonly Client $client)
    {
    }

    public function scrape(): array
    {
        $sourceUrl = (string) config('roznamcha_seo.petrol.backup_city_source_url');

        Log::info('PakFuel scrape started.', [
            'source_url' => $sourceUrl,
        ]);

        $html = $this->fetchHtml($sourceUrl);
        Log::info('PakFuel scrape fetched HTML.', [
            'source_url' => $sourceUrl,
            'html_bytes' => strlen($html),
        ]);

        $parsed = $this->parseHtml($html);

        Log::info('PakFuel scrape parsed city rows.', [
            'source_url' => $sourceUrl,
            'effective_date' => $parsed['effective_date']->toDateString(),
            'row_count' => count($parsed['prices'] ?? []),
        ]);

        return $parsed;
    }

    public function parseHtml(string $html): array
    {
        $xpath = $this->xpath($html);
        $bodyText = $this->normalizeText($this->bodyText($xpath, $html));

        $effectiveDate = $this->extractEffectiveDate($bodyText);
        $prices = $xpath ? $this->extractCityRowsFromTables($xpath) : [];

        if ($prices === []) {
            $prices = $this->extractCityRowsFromText($bodyText);
        }

        if ($prices === []) {
            Log::warning('PakFuel parse found no city rows.', [
                'source_url' => (string) config('roznamcha_seo.petrol.backup_city_source_url'),
                'body_preview' => Str::limit($bodyText, 260),
            ]);

            throw new RuntimeException('PakFuel city rows could not be parsed.');
        }

        return [
            'effective_date' => $effectiveDate,
            'source_url' => (string) config('roznamcha_seo.petrol.backup_city_source_url'),
            'prices' => $prices,
        ];
    }

    public function scrapeAndStore(): array
    {
        if (! Schema::hasTable('cities') || ! Schema::hasTable('petrol_prices')) {
            throw new RuntimeException('cities or petrol_prices table is missing.');
        }

        $this->ensureSeedCities();

        $scraped = $this->scrape();
        $cities = City::query()->get()->keyBy('slug');
        $storedRows = [];
        $unmatched = [];

        foreach ($scraped['prices'] as $row) {
            $city = $cities->get($row['city_slug']);

            if (! $city) {
                $unmatched[] = $row['city_name'];
                Log::warning('PakFuel city did not match a local cities row.', ['city' => $row['city_name']]);
                continue;
            }

            foreach (['petrol', 'diesel'] as $fuelType) {
                $price = $row[$fuelType] ?? null;

                if ($price === null) {
                    continue;
                }

                $storedRows[] = PetrolPrice::query()->firstOrCreate([
                    'city_id' => $city->id,
                    'fuel_type' => $fuelType,
                    'effective_date' => $scraped['effective_date']->toDateString(),
                    'source_url' => $scraped['source_url'],
                ], [
                    'price_per_litre' => $price,
                ]);
            }
        }

        Log::info('PakFuel scrape store completed.', [
            'effective_date' => $scraped['effective_date']->toDateString(),
            'scraped_count' => count($scraped['prices'] ?? []),
            'stored_count' => count($storedRows),
            'unmatched_count' => count(array_unique($unmatched)),
        ]);

        return [
            'effective_date' => $scraped['effective_date'],
            'source_url' => $scraped['source_url'],
            'stored_count' => count($storedRows),
            'unmatched' => array_values(array_unique($unmatched)),
            'prices' => $scraped['prices'],
        ];
    }

    public function latestCityFuel(string $citySlug, string $fuelType = 'petrol'): ?array
    {
        if (! Schema::hasTable('cities') || ! Schema::hasTable('petrol_prices')) {
            return null;
        }

        $this->ensureSeedCities();

        $city = City::query()->where('slug', $citySlug)->first();

        if (! $city) {
            return null;
        }

        $rows = PetrolPrice::query()
            ->where('city_id', $city->id)
            ->where('fuel_type', $fuelType)
            ->orderByDesc('effective_date')
            ->orderByDesc('id')
            ->limit(2)
            ->get();

        if ($rows->isEmpty()) {
            return null;
        }

        $current = $rows->first();
        $previous = $rows->count() > 1 ? $rows[1] : null;
        $currentPrice = (float) $current->price_per_litre;
        $previousPrice = $previous ? (float) $previous->price_per_litre : $currentPrice;

        return [
            'city' => $city,
            'current_price' => $currentPrice,
            'previous_price' => $previousPrice,
            'change' => round($currentPrice - $previousPrice, 2),
            'effective_date' => $current->effective_date,
            'source_url' => $current->source_url,
        ];
    }

    private function fetchHtml(string $url): string
    {
        $response = $this->client->get($url, [
            'headers' => [
                'Accept' => 'text/html,application/xhtml+xml',
                'User-Agent' => 'RoznamchaBot/1.0',
            ],
            'timeout' => 20,
        ]);

        return (string) $response->getBody();
    }

    private function extractEffectiveDate(string $bodyText): Carbon
    {
        if (preg_match('/Prices effective ([A-Za-z]+ \d{1,2}, \d{4})/i', $bodyText, $matches) === 1) {
            return Carbon::parse($matches[1], config('app.timezone', 'Asia/Karachi'));
        }

        if (preg_match('/All \d+ petroleum products [—-] ([A-Za-z]+ \d{1,2}, \d{4})/i', $bodyText, $matches) === 1) {
            return Carbon::parse($matches[1], config('app.timezone', 'Asia/Karachi'));
        }

        throw new RuntimeException('PakFuel effective date could not be parsed.');
    }

    private function extractCityRowsFromTables(DOMXPath $xpath): array
    {
        $rows = [];

        foreach ($xpath->query('//table') ?: [] as $tableNode) {
            if (! $tableNode instanceof DOMElement) {
                continue;
            }

            $tableRows = $this->queryNodes($xpath, './/tr', $tableNode);

            if ($tableRows === []) {
                continue;
            }

            $headers = array_map(
                fn (string $value) => Str::lower($value),
                $this->cellTexts($xpath, $tableRows[0])
            );

            if (! $this->isCityTableHeader($headers)) {
                continue;
            }

            foreach (array_slice($tableRows, 1) as $rowNode) {
                $cells = $this->cellTexts($xpath, $rowNode);
                if (count($cells) < 3) {
                    continue;
                }

                $petrol = $this->extractPrice($cells[1]);
                $diesel = $this->extractPrice($cells[2]);

                if ($petrol === null && $diesel === null) {
                    continue;
                }

                $cityName = $cells[0];

                $rows[] = [
                    'city_name' => $cityName,
                    'city_slug' => Str::slug($cityName),
                    'petrol' => $petrol,
                    'diesel' => $diesel,
                ];
            }
        }

        return $rows;
    }

    private function extractCityRowsFromText(string $bodyText): array
    {
        $section = $bodyText;

        if (preg_match('/City-Wise Prices(.*?)OGRA Price Prediction Tool/si', $bodyText, $matches) === 1) {
            $section = $matches[1];
        } elseif (preg_match('/City prices:(.*?)(?:About PakFuel|How Petrol Prices Are Determined)/si', $bodyText, $matches) === 1) {
            $section = $matches[1];
        }

        $rows = [];
        $cityNames = collect(config('roznamcha_seo.petrol.city_seed_list', []))
            ->values()
            ->sortByDesc(fn (string $name) => strlen($name))
            ->values()
            ->all();

        foreach ($cityNames as $cityName) {
            $quotedCity = preg_quote($cityName, '/');

            if (preg_match('/\b'.$quotedCity.'\b\s*(?:Rs\.?\s*)?(?<petrol>\d{2,4}\.\d{2})\s*(?:Rs\.?\s*)?(?<diesel>\d{2,4}\.\d{2})/i', $section, $matches) === 1) {
                $rows[] = [
                    'city_name' => $cityName,
                    'city_slug' => Str::slug($cityName),
                    'petrol' => (float) $matches['petrol'],
                    'diesel' => (float) $matches['diesel'],
                ];

                continue;
            }

            if (preg_match('/\b'.$quotedCity.'\b\s*(?:Rs\.?\s*)?(?<petrol>\d{2,4}\.\d{2})/i', $section, $matches) === 1) {
                $rows[] = [
                    'city_name' => $cityName,
                    'city_slug' => Str::slug($cityName),
                    'petrol' => (float) $matches['petrol'],
                    'diesel' => null,
                ];
            }
        }

        return $rows;
    }

    private function isCityTableHeader(array $headers): bool
    {
        $headerText = implode(' ', $headers);

        return Str::contains($headerText, 'city')
            && Str::contains($headerText, 'petrol')
            && Str::contains($headerText, 'diesel');
    }

    private function extractPrice(string $value): ?float
    {
        if (preg_match('/(\d{2,4}\.\d{2})/', $value, $matches) !== 1) {
            return null;
        }

        return (float) $matches[1];
    }

    private function normalizeText(string $value): string
    {
        return trim((string) preg_replace('/\s+/u', ' ', html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
    }

    private function ensureSeedCities(): void
    {
        $rows = collect(config('roznamcha_seo.petrol.city_seed_list', []))
            ->map(fn (string $name, string $slug) => [
                'name' => $name,
                'slug' => $slug,
                'created_at' => now(),
                'updated_at' => now(),
            ])
            ->values()
            ->all();

        if ($rows === []) {
            return;
        }

        City::query()->upsert($rows, ['slug'], ['name', 'updated_at']);
    }

    private function xpath(string $html): ?DOMXPath
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();

        if (! $dom->loadHTML($html)) {
            libxml_clear_errors();

            return null;
        }

        libxml_clear_errors();

        return new DOMXPath($dom);
    }

    private function bodyText(?DOMXPath $xpath, string $html): string
    {
        if (! $xpath) {
            return strip_tags($html);
        }

        $bodyNode = $xpath->query('//body')->item(0);

        return $bodyNode instanceof DOMElement ? $bodyNode->textContent : strip_tags($html);
    }

    /**
     * @return array<int, DOMElement>
     */
    private function queryNodes(DOMXPath $xpath, string $expression, ?DOMElement $context = null): array
    {
        $nodes = $xpath->query($expression, $context);

        if (! $nodes) {
            return [];
        }

        $elements = [];

        foreach ($nodes as $node) {
            if ($node instanceof DOMElement) {
                $elements[] = $node;
            }
        }

        return $elements;
    }

    /**
     * @return array<int, string>
     */
    private function cellTexts(DOMXPath $xpath, DOMElement $row): array
    {
        return array_map(
            fn (DOMElement $cell) => $this->normalizeText($cell->textContent),
            $this->queryNodes($xpath, './th|./td', $row)
        );
    }
}
