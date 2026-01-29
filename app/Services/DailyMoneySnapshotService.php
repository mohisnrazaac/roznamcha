<?php

namespace App\Services;

use App\Models\DailyMoneySnapshot;
use Carbon\CarbonInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

/**
 * Pulls public Pakistan indicators, simplifies them into Urdu text, and writes the Daily Return snapshot each midnight.
 * The nightly automation gives returning households a 12 AM story even when marketing is asleep, while admins can rerun it manually.
 * We intentionally summarize the numbers so the copy reads like a household conversation, and we overwrite per-day rows so cron retries stay safe.
 */
class DailyMoneySnapshotService
{
    /**
     * Generate or refresh the snapshot for a specific date so cron and the admin button reuse the same logic.
     *
     * @throws RuntimeException when indicators could not be fetched.
     */
    public function generate(?CarbonInterface $date = null): DailyMoneySnapshot
    {
        $timezone = config('daily_snapshot.timezone', config('app.timezone'));
        $targetDate = ($date ?? now($timezone))->setTimezone($timezone)->toDateString();

        $metrics = $this->fetchEconomicIndicators();

        if (! $this->hasUsableMetrics($metrics)) {
            throw new RuntimeException('Unable to fetch Pakistan indicators for the daily snapshot.');
        }

        $payload = $this->buildHouseholdCopy($metrics);

        // Overwrite the same date so cron retries or admin reruns keep the widget stable for returning users.
        return DailyMoneySnapshot::updateOrCreate(
            ['snapshot_date' => $targetDate],
            array_merge($payload, [
                'source_metadata' => $this->trimMetadata($metrics, $targetDate),
                'last_updated_at' => now(),
            ])
        );
    }

    /**
     * Cron-safe fetch that keeps source swapping simple for future teams.
     */
    private function fetchEconomicIndicators(): array
    {
        return [
            'inflation' => $this->fetchValueFromSource('cpi', ['1.0.value', 'value']),
            'spi' => $this->fetchValueFromSource('spi', ['latest.value', 'value']),
            'fuel' => $this->fetchValueFromSource('fuel', ['average.petrol', 'petrol', 'prices.petrol']),
            'utility' => $this->fetchValueFromSource('utility', ['electricity.average', 'average']),
            'currency' => $this->fetchValueFromSource('currency', ['pkr', 'rates.pkr', 'rate']),
        ];
    }

    private function fetchValueFromSource(string $key, array $paths): ?array
    {
        $url = config("daily_snapshot.sources.{$key}");

        if (! $url) {
            return null;
        }

        $payload = $this->safeHttpGet($url);

        if (! $payload) {
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

    private function safeHttpGet(string $url): ?array
    {
        try {
            $response = Http::timeout(10)
                ->acceptJson()
                ->get($url);

            if (! $response->successful()) {
                Log::warning('Daily snapshot source returned non-success', ['url' => $url, 'status' => $response->status()]);

                return null;
            }

            return $response->json();
        } catch (Throwable $exception) {
            Log::warning('Daily snapshot HTTP fetch failed', ['url' => $url, 'error' => $exception->getMessage()]);

            return null;
        }
    }

    private function locateNumericValue(array $payload, array $paths): ?float
    {
        foreach ($paths as $path) {
            $value = data_get($payload, $path);

            if (is_numeric($value)) {
                return (float) $value;
            }

            if (is_string($value) && is_numeric($stripped = preg_replace('/[^0-9.\-]/', '', $value))) {
                return (float) $stripped;
            }
        }

        // Some endpoints return [meta, [records...]], so flatten the records and retry.
        if (isset($payload[1]) && is_array($payload[1])) {
            return $this->locateNumericValue($payload[1], $paths);
        }

        return null;
    }

    private function hasUsableMetrics(array $metrics): bool
    {
        return collect($metrics)
            ->filter(fn ($entry) => is_array($entry) && array_key_exists('value', $entry))
            ->isNotEmpty();
    }

    /**
     * Convert the numeric readings into soft Urdu storytelling for the homepage widget.
     * We avoid raw stats so every household can quickly scan the card when they return after midnight.
     */
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

                return Arr::only($entry, ['value', 'source', 'fetched_at']);
            })
            ->filter()
            ->merge([
                'snapshot_generated_for' => $date,
            ])
            ->toArray();
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
