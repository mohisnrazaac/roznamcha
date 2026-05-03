# AdSense Low Value Phase 4 Canonical Fix

Implementation date: 2026-04-20  
Governing documents read first:

- `ADSENSE_LOW_VALUE_AUDIT_PHASE1.md`
- `ADSENSE_LOW_VALUE_PHASE2_IMPLEMENTATION.md`
- `ADSENSE_LOW_VALUE_PHASE3_QA.md`

## A. Root Cause Of Mixed Canonical Hosts

The mixed-host problem came from three different canonical URL sources being used across public page types:

- `config('roznamcha_seo.base_url')`
  Used by the programmatic SEO URL generator, which produced `https://roznamcha.pk/...`
- `config('app.url')`
  Used by static page SEO builders and template SEO payloads
- `route(..., true)`
  Used by blog, about, contact, and category SEO payloads, which inherited the current request/app host such as `http://localhost` or `http://127.0.0.1:8002`

So the issue was not one broken page. It was split canonical authority.

## B. Exact Files Changed

- `app/Seo/SeoPageUrlGenerator.php`
- `app/Http/Controllers/Concerns/BuildsPublicSeo.php`
- `app/Http/Controllers/PublicPageController.php`
- `app/Http/Controllers/ContactController.php`
- `app/Http/Controllers/BlogPublicController.php`
- `app/Http/Controllers/TemplateController.php`
- `tests/Feature/PublicPageSeoHeadTest.php`
- `tests/Feature/BlogPublicTest.php`
- `ADSENSE_LOW_VALUE_PHASE4_CANONICAL_FIX.md`

## C. Centralized Strategy Implemented

Canonical generation is now centralized on the existing public URL source already used by the programmatic SEO layer:

- single host source: `config('roznamcha_seo.base_url')`
- shared generator: `App\Seo\SeoPageUrlGenerator`
- shared route assembly for public canonicals: `SeoPageUrlGenerator::routeUrl(...)`

Implementation details:

- `SeoPageUrlGenerator` now exposes `baseUrl()`
- `BuildsPublicSeo` now builds static/tool/template-index SEO URLs from `SeoPageUrlGenerator` instead of `config('app.url')`
- `PublicPageController` about page SEO now uses the same generator-backed public URL source
- `ContactController` SEO now uses the same generator-backed public URL source
- `BlogPublicController` blog index/category/detail SEO URLs now use the same generator-backed public URL source
- `TemplateController` template detail SEO now uses the same generator-backed public URL source

Important scope note:

- This fix targets SEO URLs and canonicals only.
- Internal navigation URLs and user-facing route behavior were left untouched.
- Noindex behavior and sitemap logic were not refactored.

## D. Sample Pages Verified

Representative rendered sample verification after the fix:

- Homepage: `/`
  Canonical: `https://roznamcha.pk`
- Static page: `/features`
  Canonical: `https://roznamcha.pk/features`
- Tool page: `/tools/ration-cost-estimator`
  Canonical: `https://roznamcha.pk/tools/ration-cost-estimator`
- Blog detail page: `/blog/pakistan-petrol-price-april-2026-rs458-budget-guide`
  Canonical: `https://roznamcha.pk/blog/pakistan-petrol-price-april-2026-rs458-budget-guide`
- Template detail page: `/templates/100k-family-budget`
  Canonical: `https://roznamcha.pk/templates/100k-family-budget`
- Noindexed programmatic page: `/petrol-price-karachi-today`
  Canonical: `https://roznamcha.pk/petrol-price-karachi-today`
  Robots: `noindex,follow`

Result:

- the canonical host is now consistent across the verified public page types
- no representative sample fell back to `localhost` or `127.0.0.1`

## E. Confirmation That Noindex Cleanup Still Works

Noindex and sitemap behavior remained intact.

Rendered verification:

- `/petrol-price-karachi-today`
  still renders `meta robots="noindex,follow"`

Automated verification:

- `tests/Feature/SeoProgrammaticPagesTest.php` still passes
- `tests/Feature/BlogPublicTest.php` still passes
- `tests/Feature/PublicPageSeoHeadTest.php` still passes

Representative sitemap checks after the fix:

- `/petrol-price-karachi-today` absent from sitemap
- `/electricity-bill-calculator-lesco` absent from sitemap
- `/ration-cost-for-6-people-pakistan` absent from sitemap
- `/features` still present
- `/blog` still present
- `/templates` still present

## F. Any Remaining SEO Consistency Risks

The host inconsistency found in Phase 3 is fixed for the verified public page types, but two consistency risks still exist by design:

- Blog posts can still use a manual `canonical_url` override if one is explicitly stored on the record.
  That is intentional, but a bad manual override could bypass the standard generator.
- Client-side fallback SEO constants still exist in `resources/js/lib/seo.js`.
  The verified public pages receive server-side SEO props, so this did not affect rendered canonicals in the tested routes, but future pages should continue using server-provided SEO payloads rather than relying on client defaults.

## Verification Commands Run

- `php artisan test tests/Feature/PublicPageSeoHeadTest.php tests/Feature/BlogPublicTest.php tests/Feature/SeoProgrammaticPagesTest.php`
- direct Laravel HTTP-kernel rendering against representative public routes using the local app bootstrap

Result summary:

- `31` tests passed
- `353` assertions passed
- representative public canonicals now resolve to the same public host source
