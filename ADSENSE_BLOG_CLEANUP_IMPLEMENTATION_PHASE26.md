# AdSense Blog Cleanup Implementation Phase 26

Implementation date: 2026-04-21  
Scope: apply only the approved Phase 25 blog cleanup decisions

Documents and code reviewed first:

- `ADSENSE_BLOG_CLEANUP_DECISIONS_PHASE25.md`
- `ADSENSE_BLOG_ARCHIVE_REAUDIT_PHASE24.md`
- `ADSENSE_BLOG_ARCHIVE_BATCHFIX_PHASE23.md`
- current local blog visibility, sitemap, routing, and rendering paths

## A. Exact Posts Affected By Each Action

### Noindex

- `new-utility-store-price-list-january-2026-today-subsidized-rates`
- `gold-rates-vs-monthly-savings-household-budget-2026`

### Remove

- `basant-2026-lahore-kite-prices-household-cost`
- `roznamcha-with-ai`
- `e-challan-bill-management-guide-pakistan-2026`
- `gold-price-prediction-2026-daily-gold-rate-pakistan`
- `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`

### Merge / retire

- `cost-of-living-pakistan-2026-monthly-budget-with-ai`
  - surviving target: `cost-of-living-pakistan-2026-monthly-budget`
- `petrol-prices-today-pakistan-2026-monthly-budget-impact`
  - surviving target: `pakistan-petrol-price-april-2026-rs458-budget-guide`

### Temporary Keep

- `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`

## B. What Was Implemented

### Noindex

Implemented for the two approved direct-visitor posts:

- both posts remain published and reachable on their existing blog URLs
- both now emit `meta robots noindex,follow`
- both are excluded from archive-visible surfaces:
  - blog index
  - category pages
  - blog RSS feed
  - XML sitemap

### Remove

Implemented for the five approved remove candidates:

- local `blog_posts.status` changed from `published` to `draft`
- those posts now disappear from public archive and sitemap logic automatically
- no redirect was added for the remove group
- if requested directly, they now resolve as hidden / not found

### Merge / retire

Implemented for the two approved merge-source posts:

- source posts were retired from public editorial inventory by switching them to `draft`
- permanent redirect handling was added at the show-route layer
- requests for the retired source slugs now redirect to the approved stronger surviving article
- source slugs are excluded from archive-visible surfaces and sitemap

### Temporary Keep

Implemented state:

- left published and reachable
- no cleanup action was applied beyond shared consistency changes already in place

## C. Exact Files / Content Sources Changed

Code files changed:

- `config/blog_cleanup.php`
- `app/Models/BlogPost.php`
- `app/Http/Controllers/BlogPublicController.php`
- `app/Http/Controllers/RssController.php`
- `app/Http/Controllers/AskRozaController.php`
- `app/Http/Controllers/SeoSitemapController.php`
- `config/internal_links.php`
- `app/Actions/Blog/ApplyPhase25CleanupDecisions.php`
- `routes/blog_archive_console.php`
- `tests/Feature/BlogCleanupImplementationTest.php`

Content source changed:

- local `blog_posts` records in the database
  - `status` changed to `draft` for the 5 remove candidates and 2 merge-source candidates

## D. Whether Redirects Were Implemented Or Not, And Why

Redirects were implemented for the **2 merge-source posts only**.

Why:

- Phase 25 explicitly identified those two pages as merge sources rather than simple removals
- the current architecture supports clean redirect handling at the `/blog/{slug}` controller path
- redirecting the source slug to the stronger surviving article preserves existing references while concentrating search and user attention on the better page

Redirects were **not** implemented for the 5 remove candidates.

Why:

- Phase 25 classified those as low-value removals without a clean surviving target
- forcing unrelated redirects would be sloppy and misleading

## E. Confirmation That Sitemap / Indexability Behavior Stayed Correct

Confirmed:

- retired remove and merge-source posts no longer remain in public archive logic
- noindex posts remain reachable but are excluded from archive-visible query surfaces
- the public archive counts now reflect the cleanup:
  - `publicly_visible = 16`
  - `public_archive_visible = 14`
- the Phase 25 apply command is idempotent after execution:
  - `php artisan blog:apply-phase25-cleanup --dry-run`
  - returned `retired_now = 0`

Verification completed with:

- `php artisan test tests/Feature/BlogCleanupImplementationTest.php tests/Feature/BlogPublicTest.php tests/Feature/PublicPageSeoHeadTest.php`
- `php artisan blog:apply-phase25-cleanup --dry-run`
- local DB status check for all 10 candidate slugs

## F. Follow-Up Cleanup Still Needed After This Implementation

- re-audit the blog archive again so the next decisions reflect the implemented Phase 26 state
- decide whether the temporary-keep article should later be replaced by a stronger evergreen explainer outside the current blog archive
- proceed to the manual rewrite shortlist afterward, starting with:
  - `electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`

## Implementation Notes

- a dedicated cleanup config now centralizes:
  - blog noindex slugs
  - merge-source redirect map
  - remove slugs
  - temporary keep slugs
- internal shared blog catalog entries were reduced so removed / retired / noindex posts are not casually re-promoted through shared link props
