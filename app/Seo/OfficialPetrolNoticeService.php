<?php
// Purpose: Fetch and verify official Petroleum Division petrol notices before public petrol pages are indexed. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use Carbon\Carbon;
use DOMDocument;
use DOMElement;
use DOMXPath;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OfficialPetrolNoticeService
{
    public function latestVerifiedNotice(): ?array
    {
        $listingUrl = (string) config('roznamcha_seo.petrol.official_listing_url', '');

        if ($listingUrl === '') {
            Log::warning('SEO petrol official notice lookup skipped because no listing URL is configured.');

            return null;
        }

        $listingHtml = $this->fetchHtml($listingUrl);

        if (! $listingHtml) {
            Log::warning('SEO petrol official listing fetch returned no HTML.', ['url' => $listingUrl]);

            return null;
        }

        $release = $this->parseLatestRelease($listingHtml, $listingUrl);

        if (! $release) {
            Log::warning('SEO petrol official listing could not be parsed into a latest release row.', ['url' => $listingUrl]);

            return null;
        }

        $verifiedRelease = $this->verifiedRelease($release['effective_date']);

        if (! $verifiedRelease) {
            Log::warning('SEO petrol official release was detected but is not present in the verified release map.', [
                'effective_date' => $release['effective_date'],
                'detected_title' => $release['title'],
            ]);

            return null;
        }

        if (! $this->titlesMatch($release['title'], (string) $verifiedRelease['notice_title'])) {
            Log::warning('SEO petrol official release title did not match the verified release map.', [
                'effective_date' => $release['effective_date'],
                'detected_title' => $release['title'],
                'verified_title' => $verifiedRelease['notice_title'],
            ]);

            return null;
        }

        $detailMeta = $this->parseNoticeMeta($release['notice_url']);

        Log::info('SEO petrol official release verified successfully.', [
            'effective_date' => $release['effective_date'],
            'notice_title' => $release['title'],
            'notice_url' => $release['notice_url'],
        ]);

        return [
            'effective_date' => Carbon::parse($release['effective_date'], config('app.timezone', 'Asia/Karachi')),
            'notice_title' => $release['title'],
            'notice_url' => $release['notice_url'],
            'notice_asset_url' => $detailMeta['asset_url'] ?? $release['notice_url'],
            'motor_spirit_price' => (float) $verifiedRelease['motor_spirit_price'],
            'motor_spirit_previous_price' => (float) $verifiedRelease['motor_spirit_previous_price'],
            'motor_spirit_change' => (float) $verifiedRelease['motor_spirit_change'],
            'high_speed_diesel_price' => (float) $verifiedRelease['high_speed_diesel_price'],
            'high_speed_diesel_previous_price' => (float) $verifiedRelease['high_speed_diesel_previous_price'],
            'high_speed_diesel_change' => (float) $verifiedRelease['high_speed_diesel_change'],
            'source_label' => (string) config('roznamcha_seo.petrol.official_source_label', 'Government of Pakistan - Petroleum Division'),
        ];
    }

    private function verifiedRelease(string $effectiveDate): ?array
    {
        $releases = config('roznamcha_seo.petrol.verified_releases', []);
        $release = $releases[$effectiveDate] ?? null;

        return is_array($release) ? $release : null;
    }

    private function fetchHtml(string $url): ?string
    {
        try {
            $response = Http::accept('text/html')
                ->timeout(20)
                ->withUserAgent('RoznamchaBot/1.0')
                ->get($url);
        } catch (\Throwable $throwable) {
            Log::warning('SEO petrol official HTML fetch threw an exception.', [
                'url' => $url,
                'error' => $throwable->getMessage(),
            ]);

            return null;
        }

        if (! $response->successful()) {
            Log::warning('SEO petrol official HTML fetch returned a non-success status.', [
                'url' => $url,
                'status' => $response->status(),
            ]);

            return null;
        }

        return $response->body();
    }

    private function parseLatestRelease(string $html, string $listingUrl): ?array
    {
        $xpath = $this->xpath($html);

        if (! $xpath) {
            return null;
        }

        $rows = $xpath->query('//tr');

        if (! $rows) {
            return null;
        }

        foreach ($rows as $row) {
            if (! $row instanceof DOMElement) {
                continue;
            }

            $title = $this->rowTitle($row);
            $href = $this->rowHref($xpath, $row);

            if (! $title || ! $href || ! Str::contains($title, 'Prices of Petroleum Products from')) {
                continue;
            }

            $effectiveDate = $this->extractEffectiveDate($title);

            if (! $effectiveDate) {
                continue;
            }

            return [
                'title' => $title,
                'effective_date' => $effectiveDate,
                'notice_url' => $this->resolveUrl($listingUrl, $href),
            ];
        }

        return null;
    }

    private function parseNoticeMeta(string $noticeUrl): array
    {
        if (! Str::contains($noticeUrl, '/NewsDetail/')) {
            return ['asset_url' => $noticeUrl];
        }

        $detailHtml = $this->fetchHtml($noticeUrl);

        if (! $detailHtml) {
            return ['asset_url' => $noticeUrl];
        }

        $xpath = $this->xpath($detailHtml);

        if (! $xpath) {
            return ['asset_url' => $noticeUrl];
        }

        $imageNode = $xpath->query('//*[@id="ContentPlaceHolder1_ImgSlider"]/@src')->item(0);

        if ($imageNode) {
            return ['asset_url' => $this->resolveUrl($noticeUrl, $imageNode->nodeValue)];
        }

        return ['asset_url' => $noticeUrl];
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

    private function rowTitle(DOMElement $row): ?string
    {
        foreach ($row->getElementsByTagName('td') as $cell) {
            $text = $this->cleanText($cell->textContent);

            if (Str::contains($text, 'Prices of Petroleum Products from')) {
                return $text;
            }
        }

        return null;
    }

    private function rowHref(DOMXPath $xpath, DOMElement $row): ?string
    {
        $link = $xpath->query('.//a[@href]', $row)->item(0);

        return $link?->attributes?->getNamedItem('href')?->nodeValue;
    }

    private function extractEffectiveDate(string $title): ?string
    {
        $datePhrase = trim((string) Str::of($title)->after('from')->replace("\xc2\xa0", ' '));

        if ($datePhrase === '') {
            return null;
        }

        $normalizedDatePhrase = preg_replace('/(\d{1,2})(st|nd|rd|th)/i', '$1', $datePhrase);
        $normalizedDatePhrase = trim((string) $normalizedDatePhrase);

        try {
            return Carbon::createFromFormat('j F, Y', $normalizedDatePhrase, config('app.timezone', 'Asia/Karachi'))
                ->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }

    private function resolveUrl(string $baseUrl, string $href): string
    {
        if (Str::startsWith($href, ['http://', 'https://'])) {
            return $href;
        }

        if (Str::startsWith($href, '//')) {
            $scheme = parse_url($baseUrl, PHP_URL_SCHEME) ?: 'https';

            return $scheme.':'.$href;
        }

        $scheme = parse_url($baseUrl, PHP_URL_SCHEME) ?: 'https';
        $host = parse_url($baseUrl, PHP_URL_HOST) ?: '';

        return $scheme.'://'.$host.'/'.ltrim($href, '/');
    }

    private function titlesMatch(string $detectedTitle, string $verifiedTitle): bool
    {
        return $this->cleanText($detectedTitle) === $this->cleanText($verifiedTitle);
    }

    private function cleanText(string $text): string
    {
        return trim((string) preg_replace('/\s+/u', ' ', html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
    }
}
