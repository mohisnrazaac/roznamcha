<?php
// Purpose: Centralize backend URL generation for programmatic SEO pages so linking never hardcodes slug patterns. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use Illuminate\Support\Str;
use InvalidArgumentException;

class SeoPageUrlGenerator
{
    public function baseUrl(): string
    {
        return $this->rootUrl();
    }

    public function homeUrl(): string
    {
        return $this->rootUrl().'/';
    }

    public function path(string $pageType, string|int $pageKey): string
    {
        return match ($pageType) {
            'petrol' => '/petrol-price-'.Str::slug((string) $pageKey).'-today',
            'electricity' => '/electricity-bill-calculator-'.Str::slug((string) $pageKey),
            'ration' => '/ration-cost-for-'.(int) $pageKey.'-people-pakistan',
            default => throw new InvalidArgumentException("Unsupported SEO page type [{$pageType}]."),
        };
    }

    public function url(string $pageType, string|int $pageKey): string
    {
        return $this->rootUrl().$this->path($pageType, $pageKey);
    }

    public function routeUrl(string $routeName, array $parameters = []): string
    {
        return $this->rootUrl().route($routeName, $parameters, false);
    }

    public function label(string $pageType, string|int $pageKey): string
    {
        return match ($pageType) {
            'petrol' => 'Petrol price in '.$this->cityLabel((string) $pageKey).' today',
            'electricity' => 'Electricity bill calculator for '.$this->discoLabel((string) $pageKey),
            'ration' => 'Ration cost for '.(int) $pageKey.' people in Pakistan',
            default => throw new InvalidArgumentException("Unsupported SEO page type [{$pageType}]."),
        };
    }

    public function siblings(string $pageType, string|int $currentKey): array
    {
        $keys = match ($pageType) {
            'petrol' => config('roznamcha_seo.cities', []),
            'electricity' => config('roznamcha_seo.discos', []),
            'ration' => config('roznamcha_seo.family_sizes', []),
            default => [],
        };

        return collect($keys)
            ->reject(fn ($key) => (string) $key === (string) $currentKey)
            ->values()
            ->map(fn ($key) => [
                'title' => $this->label($pageType, $key),
                'href' => $this->path($pageType, $key),
            ])
            ->all();
    }

    public function cityLabel(string $city): string
    {
        return Str::title(str_replace('-', ' ', $city));
    }

    public function discoLabel(string $disco): string
    {
        return Str::upper(str_replace('-', '', $disco));
    }

    private function rootUrl(): string
    {
        return rtrim((string) config('roznamcha_seo.base_url', url('/')), '/');
    }
}
