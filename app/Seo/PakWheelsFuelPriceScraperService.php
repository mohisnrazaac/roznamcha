<?php
// Purpose: Scrape PakWheels fuel prices for cross-source auditing without overwriting stored fallback data. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use Carbon\Carbon;
use DOMDocument;
use DOMElement;
use DOMXPath;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

class PakWheelsFuelPriceScraperService
{
    public function __construct(private readonly Client $client)
    {
    }

    public function scrape(): array
    {
        $sourceUrl = (string) config('roznamcha_seo.petrol.cross_validation_source_url');
        $html = $this->fetchHtml($sourceUrl);
        $parsed = $this->parseHtml($html);

        Log::info('PakWheels scrape parsed fuel rows.', [
            'source_url' => $sourceUrl,
            'effective_date' => $parsed['effective_date']->toDateString(),
            'row_count' => count($parsed['prices'] ?? []),
        ]);

        return $parsed;
    }

    public function latestFuel(string $fuelType = 'petrol'): ?array
    {
        $scraped = $this->scrape();
        $row = collect($scraped['prices'] ?? [])->firstWhere('fuel_type', $fuelType);

        if (! $row) {
            return null;
        }

        return [
            'fuel_type' => (string) $row['fuel_type'],
            'label' => (string) $row['label'],
            'price' => (float) $row['price'],
            'effective_date' => $scraped['effective_date'],
            'source_url' => $scraped['source_url'],
        ];
    }

    public function parseHtml(string $html): array
    {
        $xpath = $this->xpath($html);
        $bodyText = $this->normalizeText($this->bodyText($xpath, $html));
        $effectiveDate = $this->extractEffectiveDate($bodyText);
        $prices = $xpath ? $this->extractFuelRowsFromTables($xpath) : [];

        if ($prices === []) {
            $prices = $this->extractFuelRowsFromText($bodyText);
        }

        if ($prices === []) {
            throw new RuntimeException('PakWheels fuel rows could not be parsed.');
        }

        return [
            'effective_date' => $effectiveDate,
            'source_url' => (string) config('roznamcha_seo.petrol.cross_validation_source_url'),
            'prices' => $prices,
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
        if (preg_match('/Prices w\.e\.f\s*([0-9]{1,2}-[A-Za-z]+ ?-?[0-9]{4})/i', $bodyText, $matches) === 1) {
            $normalized = preg_replace('/\s+/', '', str_replace(' -', '-', trim($matches[1])));

            return Carbon::createFromFormat('d-F-Y', $normalized, config('app.timezone', 'Asia/Karachi'));
        }

        throw new RuntimeException('PakWheels effective date could not be parsed.');
    }

    private function extractFuelRowsFromTables(DOMXPath $xpath): array
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

            if (! $this->isFuelTableHeader($headers)) {
                continue;
            }

            foreach (array_slice($tableRows, 1) as $rowNode) {
                $cells = $this->cellTexts($xpath, $rowNode);
                if (count($cells) < 3) {
                    continue;
                }

                $fuelType = $this->normalizeFuelType($cells[0]);
                $price = $this->extractPrice($cells[2] ?? $cells[1]);

                if (! $fuelType || $price === null) {
                    continue;
                }

                $rows[$fuelType] = [
                    'fuel_type' => $fuelType,
                    'label' => $cells[0],
                    'price' => $price,
                ];
            }
        }

        return array_values($rows);
    }

    private function extractFuelRowsFromText(string $bodyText): array
    {
        $patterns = [
            'petrol' => '/Petrol(?:\s*\(Super\))?.{0,40}?PKR\s*(\d{2,4}\.\d{2})/i',
            'diesel' => '/High Speed Diesel.{0,40}?PKR\s*(\d{2,4}\.\d{2})/i',
            'light-speed-diesel' => '/Light Speed Diesel.{0,40}?PKR\s*(\d{2,4}\.\d{2})/i',
            'kerosene-oil' => '/Kerosene Oil.{0,40}?PKR\s*(\d{2,4}\.\d{2})/i',
            'lpg' => '/LPG.{0,40}?(?:PKR|RS)\s*(\d{2,4}\.\d{2})/i',
        ];

        $rows = [];

        foreach ($patterns as $fuelType => $pattern) {
            if (preg_match($pattern, $bodyText, $matches) !== 1) {
                continue;
            }

            $rows[] = [
                'fuel_type' => $fuelType,
                'label' => $fuelType,
                'price' => (float) $matches[1],
            ];
        }

        return $rows;
    }

    private function isFuelTableHeader(array $headers): bool
    {
        $headerText = implode(' ', $headers);

        return Str::contains($headerText, 'fuel type')
            && Str::contains($headerText, 'new price');
    }

    private function normalizeFuelType(string $value): ?string
    {
        $value = Str::lower($value);

        return match (true) {
            Str::contains($value, 'petrol') => 'petrol',
            Str::contains($value, 'high speed diesel') => 'diesel',
            Str::contains($value, 'light speed diesel') => 'light-speed-diesel',
            Str::contains($value, 'kerosene') => 'kerosene-oil',
            Str::contains($value, 'lpg') => 'lpg',
            Str::contains($value, 'cng') => 'cng',
            Str::contains($value, 'octane') => 'high-octane',
            default => null,
        };
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
