<?php

namespace App\Services;

use App\Models\RationPrice;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class InflationService
{
    public function deltaForItem(int $itemId, Carbon|string $fromDate, Carbon|string $toDate): ?float
    {
        $from = $fromDate instanceof Carbon ? $fromDate : Carbon::parse($fromDate);
        $to = $toDate instanceof Carbon ? $toDate : Carbon::parse($toDate);

        if (! Schema::hasTable('ration_prices')) {
            return null;
        }

        $latest = RationPrice::query()
            ->where('ration_item_id', $itemId)
            ->whereDate('priced_at', '<=', $to->toDateString())
            ->orderByDesc('priced_at')
            ->value('price');

        $previous = RationPrice::query()
            ->where('ration_item_id', $itemId)
            ->whereDate('priced_at', '<', $from->toDateString())
            ->orderByDesc('priced_at')
            ->value('price');

        if (! $latest || ! $previous || $previous == 0.0) {
            return null;
        }

        return round((($latest - $previous) / $previous) * 100, 2);
    }
}
