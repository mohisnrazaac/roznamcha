# AdSense Blog Archive Re-Audit Phase 24

Scan date: 2026-04-21  
Scan basis: current local `BlogPost::publiclyVisible()` records after `ADSENSE_BLOG_ARCHIVE_BATCHFIX_PHASE23.md`, plus the current shared blog rendering path

Documents and code reviewed first:

- `ADSENSE_BLOG_ARCHIVE_SCAN_PHASE22.md`
- `ADSENSE_BLOG_ARCHIVE_BATCHFIX_PHASE23.md`
- `ADSENSE_FLAGSHIP_BLOG_FRAMEWORK_PHASE20.md`
- `app/Http/Controllers/BlogPublicController.php`
- `resources/js/Pages/Public/Blog/Show.jsx`

## A. Total Articles Scanned

**23**

## B. Updated Classification Counts

### Keep

Count: **7**

- `pakistan-petrol-price-april-2026-rs458-budget-guide`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`
- `pakistan-fuel-quota-system-petrol-price-april-2026`
- `ghar-ka-monthly-budget`
- `pakistani-household-essential-expenses-2026`
- `best-monthly-budget-50000-salary-pakistan-2026`
- `pakistani-family-monthly-expense-control`

Why:

- These are still the strongest current editorial assets by depth, utility, or mission fit.
- The shared framework already helps them present better, and they do not need immediate rescue to remain indexable.

### Needs Manual Rewrite

Count: **6**

- `inflation-household-spending-pakistan-2026`
- `cost-of-living-pakistan-2026-monthly-budget`
- `inflation-household-budget-pakistan-2026`
- `school-fee-inflation-pakistan-2026`
- `electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`
- `utility-store-vs-open-market-price-comparison-2026-pakistan`

Why:

- These topics are strategically important enough to justify keeping them in the archive, but the current articles are still not strong enough to stand on their own.
- The remaining problems are article-level: thin depth, overlap, soft or search-led framing, weak evidence density, and incomplete practical guidance.

### Merge / Remove / Noindex Candidate

Count: **10**

- `basant-2026-lahore-kite-prices-household-cost`
- `cost-of-living-pakistan-2026-monthly-budget-with-ai`
- `roznamcha-with-ai`
- `petrol-prices-today-pakistan-2026-monthly-budget-impact`
- `e-challan-bill-management-guide-pakistan-2026`
- `new-utility-store-price-list-january-2026-today-subsidized-rates`
- `gold-rates-vs-monthly-savings-household-budget-2026`
- `gold-price-prediction-2026-daily-gold-rate-pakistan`
- `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`
- `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`

Why:

- These are still too thin, too temporal, too derivative, too off-core, or too search-led to justify keeping as-is.
- The batch pass removed some clutter, but it did not change their strategic weakness.

## C. What Improved After Phase 23

The Phase 23 batch cleanup did produce meaningful archive-wide improvements:

- fewer posts now open with obvious decorative branded kickers
- several weak terminal CTA blocks are gone
- the worst broken metadata fields were repaired
- `ghar-ka-monthly-budget` no longer suffers from a null excerpt state
- `inflation-household-budget-pakistan-2026` no longer carries the old keyword-list excerpt / description problem

More importantly, the shared blog framework from Phase 20 now combines with the batch cleanup well enough that some posts no longer feel like raw SEO shells even when their bodies still need better editorial work.

## D. What Remains The Main Archive Weakness

The main archive weakness is no longer shared page chrome or repetitive CTA clutter.

It is now the **thin and strategically weak article tail**:

- underdeveloped posts on important topics
- time-bound “today / January / 2025 / prediction” posts with short shelf life
- overlapping search-led topics where one stronger article already exists
- off-core posts that do not strengthen Roznamcha’s household-survival positioning

Secondary remaining weakness:

- a few posts still contain embedded body-level header/meta leftovers because the batch pass correctly skipped patterns that were not safe enough to strip automatically

## E. Strongest Current Editorial Pages

These are the clearest current blog assets worth preserving and using as the editorial benchmark:

- `pakistan-fuel-quota-system-petrol-price-april-2026`
- `pakistan-petrol-price-april-2026-rs458-budget-guide`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`
- `ghar-ka-monthly-budget`
- `pakistani-family-monthly-expense-control`
- `pakistani-household-essential-expenses-2026`
- `best-monthly-budget-50000-salary-pakistan-2026`

## F. Manual Rewrite Shortlist

Priority order:

1. `electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`
   reason: highly strategic topic, but only `234` words and far too thin for the search intent
2. `cost-of-living-pakistan-2026-monthly-budget`
   reason: useful evergreen topic, but still overlaps with the weaker AI variant and leans on product framing instead of solid household value
3. `school-fee-inflation-pakistan-2026`
   reason: strong household-pressure topic with real Pakistan relevance, but the current piece still needs sharper structure and better proof
4. `utility-store-vs-open-market-price-comparison-2026-pakistan`
   reason: strategically useful ration topic, but still thin and still framed too much like search bait
5. `inflation-household-spending-pakistan-2026`
   reason: mission fit is good, but the article remains generic and not yet distinctive enough
6. `inflation-household-budget-pakistan-2026`
   reason: metadata is fixed now, but it still overlaps with the stronger inflation article and needs a deliberate rewrite-or-prune decision

## G. Merge / Remove / Noindex Shortlist

Highest-priority cleanup candidates:

1. `roznamcha-with-ai`
   reason: effectively empty local content
2. `cost-of-living-pakistan-2026-monthly-budget-with-ai`
   reason: only `263` words and derivative of the main cost-of-living article
3. `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`
   reason: stale year framing and only `211` words after cleanup
4. `e-challan-bill-management-guide-pakistan-2026`
   reason: off-core relative to Roznamcha’s strongest public positioning
5. `gold-price-prediction-2026-daily-gold-rate-pakistan`
   reason: prediction-heavy and search-led without strong fit to the household-survival core
6. `new-utility-store-price-list-january-2026-today-subsidized-rates`
   reason: highly temporal and still reads like a daily-rate tracker article
7. `petrol-prices-today-pakistan-2026-monthly-budget-impact`
   reason: weaker overlapping fuel article beside much stronger fuel coverage already in the archive
8. `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`
   reason: outdated year framing and product-first angle
9. `gold-rates-vs-monthly-savings-household-budget-2026`
   reason: marginal mission fit and still too search-led
10. `basant-2026-lahore-kite-prices-household-cost`
    reason: seasonal and weakly aligned with the core household-survival mission

## H. Specific Verdict On `/blog/ghar-ka-monthly-budget`

**Strong enough now**

Why:

- it remains one of the deepest current local articles at `2454` words
- it is directly aligned with Roznamcha’s core household budgeting mission
- the shared blog framework now carries the trust, scanability, and next-step journey better than before
- Phase 23 repaired its missing excerpt state, which removed one of the obvious archive-quality defects

Important note:

- it still has inline styled body-header material, so it is not perfectly clean
- but it is **not** currently a manual rewrite priority
- it is strong enough to stay in the `Keep` group while weaker archive sections are handled first

## Recommendation For The Next Task

**Cleanup / noindex / removal decision pass for the merge-remove-noindex group**

Why:

- the archive now has a clearer separation between worth-saving articles and weak survivors
- the next highest-leverage move is to reduce the still-indexable weak tail before investing rewrite effort in medium-value posts
- after that, the manual rewrite shortlist should start with `electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`
