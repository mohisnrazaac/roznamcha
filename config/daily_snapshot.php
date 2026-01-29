<?php

/**
 * Config keeps the Daily Money Snapshot automation decoupled from specific APIs so we can swap feeds without code edits.
 * Each endpoint returns numeric Pakistan indicators that power the Urdu copy generated every night at 12 AM PKT.
 */
return [
    'timezone' => env('SNAPSHOT_TIMEZONE', 'Asia/Karachi'),

    'sources' => [
        // Inflation percentage derived from World Bank CPI data keeps the household tone grounded in real numbers.
        'cpi' => env('SNAPSHOT_CPI_URL', 'https://api.worldbank.org/v2/country/PAK/indicator/FP.CPI.TOTL.ZG?format=json&per_page=1'),

        // Weekly SPI endpoint can point to PBS or any internal proxy that normalizes the official CSV dump.
        'spi' => env('SNAPSHOT_SPI_URL', 'https://raw.githubusercontent.com/open-metro/datasets/main/pakistan_spi.json'),

        // Fuel price feed should expose the blended petrol/diesel average so we can mention it in saving tips.
        'fuel' => env('SNAPSHOT_FUEL_URL', 'https://raw.githubusercontent.com/open-metro/datasets/main/pakistan_fuel_prices.json'),

        // Utility tariff averages let us talk about bijli/gas bills without exposing utility APIs directly.
        'utility' => env('SNAPSHOT_UTILITY_URL', 'https://raw.githubusercontent.com/open-metro/datasets/main/pakistan_utility_tariff.json'),

        // Currency fallback (USD/PKR) or optional gold rate ensures we still have anchor data when local APIs fail.
        'currency' => env('SNAPSHOT_CURRENCY_URL', 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/pkr.json'),
    ],

    // The automation runs shortly after 12 AM in Karachi so returning users always see a fresh story in the morning.
    'cron_minute' => env('SNAPSHOT_CRON_MINUTE', '05'),
];
