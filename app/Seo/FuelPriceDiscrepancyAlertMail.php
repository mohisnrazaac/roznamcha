<?php
// Purpose: Send a concise manual-review alert when PakWheels fuel prices drift materially from stored fallback fuel records. Date: 2026-03-29. Author: Mohsin.

namespace App\Seo;

use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FuelPriceDiscrepancyAlertMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly array $discrepancies,
        public readonly string $sourceUrl,
        public readonly CarbonInterface $checkedAt,
    ) {
    }

    public function build(): self
    {
        $rows = collect($this->discrepancies)
            ->map(function (array $row): string {
                $fuelType = e((string) ($row['fuel_type'] ?? 'unknown'));
                $scrapedPrice = number_format((float) ($row['scraped_price'] ?? 0), 2);
                $storedPrice = number_format((float) ($row['stored_price'] ?? 0), 2);
                $difference = number_format(abs((float) ($row['difference'] ?? 0)), 2);

                return "<tr>
                    <td style=\"padding:8px;border:1px solid #d1d5db;\">{$fuelType}</td>
                    <td style=\"padding:8px;border:1px solid #d1d5db;\">PKR {$scrapedPrice}</td>
                    <td style=\"padding:8px;border:1px solid #d1d5db;\">PKR {$storedPrice}</td>
                    <td style=\"padding:8px;border:1px solid #d1d5db;\">PKR {$difference}</td>
                </tr>";
            })
            ->implode('');

        $checkedAt = e($this->checkedAt->copy()->timezone(config('app.timezone', 'Asia/Karachi'))->format('F j, Y g:i A T'));
        $sourceUrl = e($this->sourceUrl);

        $html = <<<HTML
<div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6;">
    <h2 style="margin:0 0 16px;">Fuel price discrepancy alert</h2>
    <p style="margin:0 0 12px;">
        PakWheels pricing differs from the latest stored fallback fuel records by more than the configured threshold.
    </p>
    <p style="margin:0 0 16px;">
        Checked at: {$checkedAt}<br>
        Source: <a href="{$sourceUrl}">{$sourceUrl}</a>
    </p>
    <table style="border-collapse:collapse;width:100%;max-width:680px;">
        <thead>
            <tr>
                <th style="padding:8px;border:1px solid #d1d5db;text-align:left;">Fuel type</th>
                <th style="padding:8px;border:1px solid #d1d5db;text-align:left;">PakWheels</th>
                <th style="padding:8px;border:1px solid #d1d5db;text-align:left;">Stored price</th>
                <th style="padding:8px;border:1px solid #d1d5db;text-align:left;">Difference</th>
            </tr>
        </thead>
        <tbody>
            {$rows}
        </tbody>
    </table>
    <p style="margin:16px 0 0;">
        No records were overwritten. This alert is for manual review only.
    </p>
</div>
HTML;

        return $this->subject('Fuel price discrepancy alert')
            ->html($html);
    }
}
