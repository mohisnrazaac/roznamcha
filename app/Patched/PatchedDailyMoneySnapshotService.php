<?php
// Purpose: Repair Daily Snapshot source parsing and source resilience without modifying the locked base service. Date: 2026-03-28. Author: Codex.

namespace App\Patched;

use App\Models\DailyMoneySnapshot;
use App\Services\DailyMoneySnapshotService as BaseDailyMoneySnapshotService;
use Carbon\CarbonInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class PatchedDailyMoneySnapshotService extends BaseDailyMoneySnapshotService
{
    public function generate(?CarbonInterface $date = null): DailyMoneySnapshot
    {
        $timezone = config('daily_snapshot.timezone', config('app.timezone'));
        $targetDate = ($date ?? now($timezone))->setTimezone($timezone)->toDateString();

        $metrics = $this->fetchEconomicIndicators();

        if (! $this->hasUsableMetrics($metrics)) {
            throw new RuntimeException('Unable to fetch Pakistan indicators for the daily snapshot.');
        }

        $payload = $this->buildHouseholdCopy($metrics);

        return DailyMoneySnapshot::updateOrCreate(
            ['snapshot_date' => $targetDate],
            array_merge($payload, [
                'source_metadata' => $this->trimMetadata($metrics, $targetDate),
                'last_updated_at' => now(),
            ])
        );
    }

    private function fetchEconomicIndicators(): array
    {
        return [
            'inflation' => $this->fetchValueFromSource('cpi', ['1.*.value', '1.0.value', 'value']),
            'spi' => $this->fetchSpiValue(),
            'fuel' => $this->fetchValueFromSource('fuel', ['average.petrol', 'petrol', 'prices.petrol']),
            'utility' => $this->fetchValueFromSource('utility', ['electricity.average', 'average']),
            'currency' => $this->fetchValueFromSource('currency', ['usd.pkr', 'pkr', 'rates.pkr', 'rate']),
        ];
    }

    private function fetchValueFromSource(string $key, array $paths): ?array
    {
        $url = config("daily_snapshot.sources.{$key}");

        if (! $url) {
            return null;
        }

        $response = $this->safeHttpGet($url);

        if (! $response) {
            return null;
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            return null;
        }

        $value = $this->locateNumericValue($payload, $paths);

        if ($value === null) {
            return null;
        }

        return [
            'value' => $value,
            'source' => $url,
            'fetched_at' => now()->toIso8601String(),
        ];
    }

    private function fetchSpiValue(): ?array
    {
        $url = config('daily_snapshot.sources.spi');

        if (! $url) {
            return null;
        }

        $response = $this->safeHttpGet($url);

        if (! $response) {
            return null;
        }

        $jsonPayload = $response->json();

        if (is_array($jsonPayload)) {
            $value = $this->locateNumericValue($jsonPayload, ['latest.value', 'value']);

            if ($value !== null) {
                return [
                    'value' => $value,
                    'source' => $url,
                    'fetched_at' => now()->toIso8601String(),
                ];
            }
        }

        return $this->extractSpiValueFromPbsHtml($response->body(), $url);
    }

    private function safeHttpGet(string $url): ?\Illuminate\Http\Client\Response
    {
        try {
            $response = Http::timeout(10)
                ->withUserAgent('Roznamcha Daily Snapshot/1.0')
                ->get($url);

            if (! $response->successful()) {
                Log::warning('Daily snapshot source returned non-success', ['url' => $url, 'status' => $response->status()]);

                return null;
            }

            return $response;
        } catch (Throwable $exception) {
            Log::warning('Daily snapshot HTTP fetch failed', ['url' => $url, 'error' => $exception->getMessage()]);

            return null;
        }
    }

    private function locateNumericValue(array $payload, array $paths): ?float
    {
        foreach ($paths as $path) {
            $numeric = $this->extractNumericValue(data_get($payload, $path));

            if ($numeric !== null) {
                return $numeric;
            }
        }

        foreach ($payload as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            $numeric = $this->locateNumericValue($entry, $paths);

            if ($numeric !== null) {
                return $numeric;
            }
        }

        return null;
    }

    private function extractNumericValue(mixed $value): ?float
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        if (is_string($value)) {
            $normalized = trim((string) preg_replace('/[^0-9.\-]/', '', $value));

            return $normalized !== '' && is_numeric($normalized)
                ? (float) $normalized
                : null;
        }

        if (! is_array($value)) {
            return null;
        }

        foreach ($value as $entry) {
            $numeric = $this->extractNumericValue($entry);

            if ($numeric !== null) {
                return $numeric;
            }
        }

        return null;
    }

    private function hasUsableMetrics(array $metrics): bool
    {
        return collect($metrics)
            ->filter(fn ($entry) => is_array($entry) && array_key_exists('value', $entry))
            ->isNotEmpty();
    }

    private function buildHouseholdCopy(array $metrics): array
    {
        $inflation = data_get($metrics, 'inflation.value');
        $spi = data_get($metrics, 'spi.value');
        $fuel = data_get($metrics, 'fuel.value');
        $utility = data_get($metrics, 'utility.value');
        $currency = data_get($metrics, 'currency.value');

        return [
            'expense_summary_text' => $this->expenseSummary($inflation, $fuel),
            'inflation_status_text' => $this->inflationStatus($inflation, $spi),
            'saving_tip_text' => $this->savingTip($utility, $fuel),
            'today_update_line' => $this->todayUpdateLine($currency, $fuel),
            'yesterday_change_line' => $this->yesterdayChangeLine($spi),
        ];
    }

    private function expenseSummary(?float $inflation, ?float $fuel): string
    {
        if ($inflation && $fuel) {
            return "گھر کے خرچ کا مزاج {$this->formatPercent($inflation)} مہنگائی اور پیٹرول {$this->formatRupees($fuel)} فی لٹر کے ساتھ برقرار ہے۔";
        }

        if ($inflation) {
            return "گھر کے خرچ کا دباؤ {$this->formatPercent($inflation)} سالانہ مہنگائی کے ساتھ برقرار ہے، اس لیے راشن اور بلوں میں بفر رکھیں۔";
        }

        return 'گھر کے اخراجات آج بھی حالیہ مارکیٹ رپورٹس کے مطابق پچھلے ہفتے کی طرح متوازن رہنے کی امید ہے۔';
    }

    private function inflationStatus(?float $inflation, ?float $spi): string
    {
        if ($inflation && $spi) {
            $direction = $spi >= 0 ? 'اوپر' : 'نیچے';

            return "حساس قیمت انڈیکس {$this->formatNumber(abs($spi))} پوائنٹ {$direction} گیا جبکہ سالانہ مہنگائی {$this->formatPercent($inflation)} پر ہے۔";
        }

        if ($inflation) {
            return "تازہ CPI کے مطابق مہنگائی کی رفتار {$this->formatPercent($inflation)} ہے، اس لیے ہفتے کے پلان میں تھوڑا بفر رکھیں۔";
        }

        return 'مہنگائی کا بوجھ مستحکم ہے، مگر تھوڑا سا محتاط رہ کر روزمرہ خریداری کریں۔';
    }

    private function savingTip(?float $utility, ?float $fuel): string
    {
        if ($utility) {
            return "بجلی اور گیس کا اوسط بل {$this->formatRupees($utility)} رہنے کا امکان ہے، آج ہی آلات آف کر کے یونٹ بچائیں۔";
        }

        if ($fuel) {
            return "اگر سفر ضروری ہو تو {$this->formatRupees($fuel)} فی لٹر کے حساب سے کار شیئرنگ بہتر رہے گی۔";
        }

        return 'گھر کا ماہانہ بجٹ اپ ڈیٹ کریں تاکہ اچانک بل آنے پر کنٹرول رہے۔';
    }

    private function todayUpdateLine(?float $currency, ?float $fuel): string
    {
        if ($currency) {
            return "ڈالر آج {$this->formatNumber($currency, 2)} روپے میں ٹریڈ ہو رہا ہے، اسی کے مطابق درآمدی اشیاء کی قیمت دیکھیں۔";
        }

        if ($fuel) {
            return "ایندھن {$this->formatRupees($fuel)} فی لٹر ہے اس لیے طویل ڈرائیوز کو ضروری کام تک محدود رکھیں۔";
        }

        return 'آج کی صورتحال مستحکم ہے، گھر کا خرچ لاگ بک ضرور اپ ڈیٹ کریں۔';
    }

    private function yesterdayChangeLine(?float $spi): string
    {
        if ($spi === null) {
            return 'کل کے مقابلے میں بڑے فرق کی اطلاع نہیں ملی، پھر بھی خریداری کی فہرست مختصر رکھیں۔';
        }

        $direction = $spi === 0.0 ? 'کوئی بڑی تبدیلی نہیں' : ($spi > 0 ? 'تھوڑا اضافہ' : 'ہلکی کمی');

        return "کل کے مقابلے میں حساس قیمت انڈیکس میں {$direction} ہوا (±{$this->formatNumber(abs($spi))}).";
    }

    private function trimMetadata(array $metrics, string $date): array
    {
        return collect($metrics)
            ->map(function ($entry) {
                if (! $entry) {
                    return null;
                }

                return Arr::only($entry, ['value', 'source', 'fetched_at', 'as_of']);
            })
            ->filter()
            ->merge([
                'snapshot_generated_for' => $date,
            ])
            ->toArray();
    }

    private function extractSpiValueFromPbsHtml(string $html, string $url): ?array
    {
        if (! Str::contains($html, 'drawSPIChart')) {
            return null;
        }

        preg_match("/categories:\\s*\\[(.*?)\\]\\s*,\\s*labels/s", $html, $categoryMatches);
        preg_match("/name:\\s*'Combined'\\s*,\\s*data:\\s*\\[(.*?)\\]/s", $html, $dataMatches);

        $values = $this->extractNumberList($dataMatches[1] ?? '');

        if ($values === []) {
            return null;
        }

        $labels = $this->extractQuotedList($categoryMatches[1] ?? '');
        $latestLabel = $labels === [] ? null : end($labels);

        return [
            'value' => (float) end($values),
            'source' => $url,
            'fetched_at' => now()->toIso8601String(),
            'as_of' => $latestLabel ?: null,
        ];
    }

    private function extractNumberList(string $value): array
    {
        preg_match_all('/-?\d+(?:\.\d+)?/', $value, $matches);

        return array_map('floatval', $matches[0] ?? []);
    }

    private function extractQuotedList(string $value): array
    {
        preg_match_all('/[\'"]([^\'"]+)[\'"]/', $value, $matches);

        return $matches[1] ?? [];
    }

    private function formatPercent(float $value): string
    {
        return $this->formatNumber($value, 1).'%';
    }

    private function formatRupees(float $value): string
    {
        return '₨'.$this->formatNumber($value, 0);
    }

    private function formatNumber(float $value, int $precision = 1): string
    {
        return number_format($value, $precision, '.', '');
    }
}
