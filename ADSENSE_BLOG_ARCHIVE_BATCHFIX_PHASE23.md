# AdSense Blog Archive Batch Fix Phase 23

Execution date: 2026-04-21  
Scope: low-risk archive-wide cleanup only, based on `ADSENSE_BLOG_ARCHIVE_SCAN_PHASE22.md`

## A. Summary of Batch Fixes Applied

This pass applied only the safe shared cleanup patterns that were already approved in the Phase 22 archive scan:

- removed decorative leading body clutter where the pattern was unambiguous
- removed a small set of clearly generic trailing CTA blocks or CTA-only link paragraphs
- repaired obviously broken stored metadata fields using cleaned body text as the fallback source

The cleanup was intentionally conservative. If a duplicate-looking title or opener was not clearly safe to strip from local content, it was left alone.

## B. Exact Files And Content Sources Changed

Code files changed:

- `app/Actions/Blog/ApplySafeArchiveBatchFixes.php`
- `routes/blog_archive_console.php`
- `bootstrap/app.php`
- `tests/Feature/BlogArchiveBatchFixesTest.php`

Content source changed:

- local `blog_posts` records in the database
  - fields touched where applicable: `content`, `excerpt`, `seo_description`

Operational note:

- the cleanup was applied through `php artisan blog:apply-safe-batch-fixes`
- a follow-up dry run returned `posts_updated = 0`, confirming the pass is idempotent after application

## C. How Many Articles Were Affected By Each Fix Type

Total public blog articles scanned: **23**  
Total public blog articles updated: **12**

### Decorative bullet / label cleanup

Affected articles: **1**

- `new-utility-store-price-list-january-2026-today-subsidized-rates`

### Leading language comment cleanup

Affected articles: **3**

- `pakistan-petrol-price-april-2026-rs458-budget-guide`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`
- `pakistan-fuel-quota-system-petrol-price-april-2026`

### Duplicate in-body title block removal

Affected articles: **2**

- `inflation-household-budget-pakistan-2026`
- `cost-of-living-pakistan-2026-monthly-budget`

### Branded opener cleanup

Affected articles: **5**

- `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`
- `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`
- `gold-price-prediction-2026-daily-gold-rate-pakistan`
- `gold-rates-vs-monthly-savings-household-budget-2026`
- `new-utility-store-price-list-january-2026-today-subsidized-rates`

### Generic trailing CTA block removal

Affected articles: **3**

- `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`
- `utility-store-vs-open-market-price-comparison-2026-pakistan`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`

### Generic CTA link removal

Affected articles: **1**

- `pakistan-petrol-price-april-2026-rs458-budget-guide`

### Excerpt repair

Affected articles: **2**

- `ghar-ka-monthly-budget`
- `inflation-household-budget-pakistan-2026`

### SEO description repair

Affected articles: **1**

- `inflation-household-budget-pakistan-2026`

## D. Any Articles Intentionally Skipped Because The Pattern Was Not Safe

These articles were reviewed by the cleanup logic but intentionally left untouched, or only partially cleaned, because the local pattern did not meet the safety threshold:

- `basant-2026-lahore-kite-prices-household-cost`
  - the leading body title remained because the local title alignment was not safe enough to strip automatically
- `inflation-household-spending-pakistan-2026`
  - same reason: leading title block not removed without a clear safe duplicate match
- `school-fee-inflation-pakistan-2026`
  - same reason: leading title block not removed without a clear safe duplicate match
- `utility-store-vs-open-market-price-comparison-2026-pakistan`
  - the generic trailing promo section was removed, but the body opener was left because the title/opener relationship was not safe enough for automatic stripping
- `petrol-prices-today-pakistan-2026-monthly-budget-impact`
  - branded opener remained because the local title match was not safe enough for batch removal
- `e-challan-bill-management-guide-pakistan-2026`
  - branded opener remained for the same reason
- `electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`
  - no safe shared match was applied; this still needs manual editorial attention later
- `roznamcha-with-ai`
  - the URL-only excerpt was not rewritten because the article body is effectively the same URL, so any automatic replacement would still be broken or fabricated

## E. Follow-Up Risks Or Notes For Later Manual Work

- This pass improved the archive baseline, but it did not solve thin article bodies, topic overlap, stale framing, or weak/off-core topic selection.
- The weakest articles identified in Phase 22 still need a separate decision pass for manual rewrite, merge, noindex, or removal.
- Several posts still contain embedded titles or framing that look dated, but they were intentionally left because the archive-wide pattern was not safe enough to rewrite automatically from local data alone.
- `roznamcha-with-ai` remains a clear cleanup problem because the source content is effectively empty.
- A fresh archive scan should be run before the next decision step so the new post classifications reflect the cleaned content and repaired metadata, not the pre-cleanup state.

## Verification

SEO/indexability behavior remained intact.

Checks run:

- `php artisan test tests/Feature/BlogArchiveBatchFixesTest.php tests/Feature/BlogPublicTest.php tests/Feature/PublicPageSeoHeadTest.php`
- `php artisan blog:apply-safe-batch-fixes --dry-run`
  - after application, this returned `posts_updated = 0`
