<!-- Purpose: Document the programmatic SEO pages, snapshot refresh flow, sitemap behavior, and extension points. Date: 2026-03-29. Author: Mohsin. -->

# Programmatic SEO pages

This feature adds a small SEO engine for public long-tail pages that can stay fresh over time instead of acting like static placeholder templates.

## What was added

- Public SEO pages for petrol by city, electricity bill estimates by DISCO, and ration cost by family size.
- A snapshot table that stores the latest numeric values and comparison copy for each generated page.
- A refresh command that can write a fresh batch of snapshot rows without depending on a live third-party API today.
- A main sitemap endpoint that now includes the generated SEO pages alongside the existing public URLs.
- A pair of URL helpers so future frontend or backend links can generate these page paths from one place.
- Verified Petroleum Division handling for petrol pages, including source links, noindex fallback, and sitemap gating until a real source is present.
- A `cities` table plus `petrol_prices` and `price_audit_logs` tables so city-level fallback prices and cross-source checks have their own storage.
- PakFuel fallback scraping for city-level petrol and diesel prices.
- PakWheels cross-validation so material price mismatches are logged and emailed for manual review instead of overwriting data.

## New routes

- `/petrol-price-{city}-today`
- `/electricity-bill-calculator-{disco}`
- `/ration-cost-for-{size}-people-pakistan`
- `/sitemap.xml`

The public sitemap route name stays `public.sitemap` so existing links do not break.

## Config structure

`config/roznamcha_seo.php` is the single source of truth for:

- allowed cities
- allowed DISCO slugs
- allowed family sizes
- default fallback values
- cache windows
- the public source label used when the page is showing an internal estimate
- the Petroleum Division press-release listing URL
- the verified petrol notices that are safe to publish

If a city, DISCO, or family size is not listed there, the route returns a 404.

## Snapshot data design

`seo_page_snapshots` stores the latest values that make each page feel alive:

- `page_type` and `page_key` identify the page family and slug
- `value_1`, `value_2`, and `value_3` hold the important numbers for that page type
- `summary_text` and `comparison_text` provide updated copy without changing templates
- `effective_date` tracks when that snapshot is for
- `source_label` keeps the source disclosure visible
- `extra_json` stores the page-specific extras such as 100/200/300 unit examples or ration ranges

The page renderer always prefers the newest snapshot row. Electricity and ration pages can still fall back to internal estimate logic. Petrol pages now have three states:

- official Petroleum Division snapshot
- city-level PakFuel fallback snapshot
- pending noindex state when neither source has usable data

`petrol_prices` stores city-level fallback rows by city, fuel type, date, and source URL. It does not replace the SEO snapshot table. It just gives the petrol page refresh flow a real backup source when the official site is unavailable.

`price_audit_logs` stores comparison records between PakWheels and the latest stored fallback prices. That table is there for manual review and alert history, not for publishing prices automatically.

## Refresh command

The refresh command is:

```bash
php artisan roznamcha:refresh-seo-snapshots
```

You can also generate a batch for a specific date:

```bash
php artisan roznamcha:refresh-seo-snapshots --date=2026-03-29
```

The command is registered in `routes/seo_console.php` and scheduled from `bootstrap/app.php` for `00:15` in the app timezone.

The command now does three different things:

- Petrol pages first try to read the latest Petroleum Division press-release entry, verify that the release date matches a checked-in verified notice, and then write official Motor Spirit values for every configured city page.
- If the official petrol source is unavailable, the refresh flow tries to refresh `petrol_prices` from PakFuel and then writes fallback petrol snapshots from the latest stored city rows.
- Electricity and ration pages still use internal calculation logic because those upstream feeds have not been wired yet.

This split keeps the risky part honest. Petrol pages no longer get fake placeholder numbers.

There are also two fuel-source specific artisan commands:

```bash
php artisan pakfuel:scrape-city-prices
php artisan pakwheels:scrape-fuel-prices
```

`pakfuel:scrape-city-prices` scrapes PakFuel, matches city names against the `cities` table by slug, stores matched petrol and diesel rows, and logs unmatched cities without stopping the run.

`pakwheels:scrape-fuel-prices` scrapes PakWheels, compares those prices against the latest stored `petrol_prices` rows, writes every comparison to `price_audit_logs`, and sends an alert email when any difference is greater than the configured Rs.2 threshold.

## Production without SSH

If production access is limited to the browser or a hosting panel, two helper files are now available in `public/`:

- `public/run-seo-page-snapshots-migration.php`
- `public/run-seo-page-snapshots-direct.php`
- `public/seo-page-snapshots-install.sql`

Use the PHP runner when you can hit a temporary URL on the deployed site:

```text
/run-seo-page-snapshots-migration.php
```

If you also want it to write the latest snapshot rows right away, use:

```text
/run-seo-page-snapshots-migration.php?refresh=1
```

If you also want the PakWheels audit to run right away, append `&audit=1`.

Use the SQL file when you prefer importing the table through phpMyAdmin or a similar control panel.

These files are deployment helpers, not permanent public features. Remove the PHP runner after one successful production run.

## How the sitemap works

`/sitemap.xml` is served by `SeoSitemapController`. It caches the generated XML for 24 hours and includes:

- the existing public marketing pages
- public tools
- templates index and detail pages when available
- blog index and published blog posts
- every configured programmatic SEO page that is allowed to be indexed

For the generated SEO pages, `lastmod` comes from the newest snapshot row when available. Petrol pages are added when the page has real source-backed data. If there is no official or fallback snapshot yet, the petrol city page stays out of the sitemap and renders as `noindex,follow`.

## Adding more cities, DISCOs, or family sizes

Update `config/roznamcha_seo.php`:

- add the new slug to `cities`
- add the new slug to `discos`
- add the new number to `family_sizes`

After that, run the refresh command once so the snapshot table gets a fresh row for the new page.

If you add a new petrol city, it will stay noindex until either an official Petroleum Division snapshot or a stored PakFuel city snapshot exists for that slug.

## Fallback behavior

Fallback now works in two modes:

- Electricity and ration pages show internal estimate logic with an honest source label.
- Petrol pages do not invent values anymore. They first prefer the official Petroleum Division notice, then the latest stored PakFuel city snapshot, and only fall back to a pending noindex state when neither source is available.

The admin alert email for PakWheels discrepancies is controlled by `FUEL_PRICE_ALERT_EMAIL`. If that env value is missing, the code falls back to `CONTACT_NOTIFICATION_EMAIL`.

## Future API work

The next step is replacing the checked-in verified petrol notice map with a more automated official-source parser and tightening the city matching for broader Pakistan coverage. The fallback storage, audit logging, and page rendering flow are already ready for that swap.
