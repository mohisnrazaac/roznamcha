# AdSense Low Value Phase 2 Implementation

Implementation date: 2026-04-20  
Governing document used: `ADSENSE_LOW_VALUE_AUDIT_PHASE1.md`

## A. Page Groups Changed

- Programmatic petrol city pages
- Programmatic electricity DISCO pages
- Programmatic ration family-size pages
- Weak blog category archive pages flagged in the audit:
  `fuel-prices-hike`, `household-tips`, `inflation-watch`, `personal-finance-pakistan`

## B. Exact Method Used For Each Group

### Programmatic petrol city pages

- Method: `noindex only` for page rendering
- Method: `sitemap exclusion`
- Route removal: `none`

Implementation:

- Centralized forced-noindex policy added in `config/roznamcha_seo.php`
- `SeoPageDataService` now maps these pages to `meta robots = noindex,follow`
- `SeoSitemapController` now excludes them from `/sitemap.xml` through `SeoSnapshotService::isSearchIndexable()`

### Programmatic electricity DISCO pages

- Method: `noindex only` for page rendering
- Method: `sitemap exclusion`
- Route removal: `none`

Implementation:

- Same centralized forced-noindex policy used for the `electricity` page type
- Pages remain directly usable
- Canonicals remain intact

### Programmatic ration family-size pages

- Method: `noindex only` for page rendering
- Method: `sitemap exclusion`
- Route removal: `none`

Implementation:

- Same centralized forced-noindex policy used for the `ration` page type
- Pages remain directly usable
- Canonicals remain intact

### Weak blog category archive pages

- Method: `noindex only`
- Method: `sitemap exclusion` was already effectively true because these category pages were not emitted by the sitemap
- Route removal: `none`

Implementation:

- Centralized weak-category slug list added in `config/roznamcha_seo.php`
- `BlogPublicController::seoForCategory()` now assigns `robots = noindex,follow` to the audit-flagged category archives
- `resources/views/app.blade.php` now renders server-visible `robots` meta when a page supplies it, so the noindex signal is present in the initial HTML response

## C. Weak Groups Intentionally Left Untouched

- Weak or repetitive template detail pages were left untouched in this phase.
  Reason: the audit marked them as `Rewrite`, not `Noindex`.
- Weak individual blog posts marked `Rewrite`, `Merge`, or `Remove` were left untouched.
  Reason: this task was limited to Week 1 noindex cleanup, not article rewrites or route/content retirement.
- Strong and medium pages outside the explicit noindex list were left untouched.
  Reason: the prompt explicitly excluded broad SEO changes and asked to preserve strong pages.

## D. Risk And Follow-Up Notes

- Programmatic routes still exist and remain linked internally, so direct visitors can still use them. Search exposure is what changed.
- If any of these programmatic page groups are later rewritten into genuinely differentiated landing pages, the change is reversible by editing the centralized config.
- Weak category archives still exist for navigation and browsing. If future cleanup is stricter, they could be removed from category chips or replaced by stronger editorial hub pages.
- Template detail pages remain a content-quality risk until later rewrite work addresses repetitive structure and weak local template data.

## E. Exact Files Changed

- `config/roznamcha_seo.php`
- `app/Seo/SeoSnapshotService.php`
- `app/Seo/SeoPageDataService.php`
- `app/Http/Controllers/SeoSitemapController.php`
- `app/Http/Controllers/BlogPublicController.php`
- `resources/views/app.blade.php`
- `tests/Feature/SeoProgrammaticPagesTest.php`
- `tests/Feature/PublicPageSeoHeadTest.php`
- `tests/Feature/BlogPublicTest.php`
- `ADSENSE_LOW_VALUE_PHASE2_IMPLEMENTATION.md`
