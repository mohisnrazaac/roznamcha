# AdSense Blog Cleanup Decisions Phase 25

Decision date: 2026-04-21  
Decision basis: current local blog archive state after `ADSENSE_BLOG_ARCHIVE_BATCHFIX_PHASE23.md` and `ADSENSE_BLOG_ARCHIVE_REAUDIT_PHASE24.md`

Documents and code reviewed first:

- `ADSENSE_BLOG_ARCHIVE_REAUDIT_PHASE24.md`
- `ADSENSE_BLOG_ARCHIVE_BATCHFIX_PHASE23.md`
- `ADSENSE_FLAGSHIP_BLOG_FRAMEWORK_PHASE20.md`
- current local post-cleanup blog content from the local database
- current shared blog rendering path

## A. Exact List Of The 10 Candidate Posts

1. `basant-2026-lahore-kite-prices-household-cost`
2. `cost-of-living-pakistan-2026-monthly-budget-with-ai`
3. `roznamcha-with-ai`
4. `petrol-prices-today-pakistan-2026-monthly-budget-impact`
5. `e-challan-bill-management-guide-pakistan-2026`
6. `new-utility-store-price-list-january-2026-today-subsidized-rates`
7. `gold-rates-vs-monthly-savings-household-budget-2026`
8. `gold-price-prediction-2026-daily-gold-rate-pakistan`
9. `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`
10. `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`

## B. Recommended Action For Each Post

### 1. `basant-2026-lahore-kite-prices-household-cost`

Recommended action: **Remove**

Why:

- topic is seasonal and weakly aligned with Roznamcha’s core household-survival mission
- only `544` words, with limited strategic value even after cleanup
- no strong evergreen user journey depends on this post staying live
- it adds archive breadth, not archive quality

Merge target:

- none recommended

### 2. `cost-of-living-pakistan-2026-monthly-budget-with-ai`

Recommended action: **Merge**

Why:

- only `263` words
- concept is derivative of the stronger `cost-of-living-pakistan-2026-monthly-budget`
- the current body is mostly product-pitch language, not standalone editorial value
- keeping both posts dilutes the cost-of-living topic cluster

Merge target:

- `cost-of-living-pakistan-2026-monthly-budget`

### 3. `roznamcha-with-ai`

Recommended action: **Remove**

Why:

- current local content is effectively just a YouTube URL
- there is no meaningful article body to rescue
- this is pure low-value archive weight and should not remain public editorial inventory

Merge target:

- none recommended

### 4. `petrol-prices-today-pakistan-2026-monthly-budget-impact`

Recommended action: **Merge**

Why:

- topic overlaps heavily with stronger existing fuel coverage
- only `557` words and still carries old branded-opener framing
- the best parts of its user intent already belong inside a stronger fuel-impact guide
- keeping it separate weakens concentration around the best fuel article cluster

Merge target:

- `pakistan-petrol-price-april-2026-rs458-budget-guide`

### 5. `e-challan-bill-management-guide-pakistan-2026`

Recommended action: **Remove**

Why:

- off-core topic relative to Roznamcha’s strongest household-budget and survival positioning
- mixed-topic framing makes it feel like a search grab, not a focused editorial asset
- even at `716` words, the topic does not strengthen the archive in the way stronger finance-survival pages do

Merge target:

- none recommended

### 6. `new-utility-store-price-list-january-2026-today-subsidized-rates`

Recommended action: **Noindex**

Why:

- highly temporal: `January 2026`, `today`, `Ramazan Relief`
- still offers some direct visitor utility if someone lands on it from an old reference or internal context
- not strong enough to stay in the indexed search surface
- better to keep route usability temporarily while taking it out of quality-signaling search inventory

Merge target:

- none recommended at this stage

### 7. `gold-rates-vs-monthly-savings-household-budget-2026`

Recommended action: **Noindex**

Why:

- some real user value remains, but it is only marginally aligned with the core household-survival mission
- still feels search-led rather than essential to Roznamcha’s best public positioning
- not weak enough to require immediate deletion, but weak enough to stop carrying indexable archive weight

Merge target:

- none recommended

### 8. `gold-price-prediction-2026-daily-gold-rate-pakistan`

Recommended action: **Remove**

Why:

- prediction-heavy framing is a poor fit for trust-building household-budget content
- search-led “daily rate / prediction” angle has short shelf life and limited editorial defensibility
- even after cleanup it still reads like a tracking/prediction page, not a flagship-quality household resource

Merge target:

- none recommended

### 9. `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`

Recommended action: **Temporary Keep**

Why:

- weak as an indexed editorial asset, but it still explains the “Digital Roznamcha” concept in a way some direct visitors may understand
- year framing is stale and the business+personal scope is broader than the current household-survival positioning
- there is not yet a stronger dedicated replacement article for this exact explanatory role
- this is the one candidate with a defensible transitional hold if the team wants to avoid over-pruning before a better product explainer exists

Merge target:

- none now; replace later with a stronger non-blog or evergreen explainer if one is created

### 10. `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`

Recommended action: **Remove**

Why:

- only `211` words after cleanup
- stale `2025` framing
- family-of-5 ration budgeting is already better served by stronger live public resources, especially the flagship `Ration Cost Estimator`
- there is not enough unique article value left to justify a separate public post

Merge target:

- none recommended

## C. Reasoning Summary By Decision Type

### Noindex

Use `Noindex` where the post still has some direct-visitor usefulness but should stop signaling search-surface quality.

Chosen for:

- `new-utility-store-price-list-january-2026-today-subsidized-rates`
- `gold-rates-vs-monthly-savings-household-budget-2026`

### Merge

Use `Merge` where the topic has salvageable value, but that value belongs inside a stronger existing article rather than a separate weak post.

Chosen for:

- `cost-of-living-pakistan-2026-monthly-budget-with-ai`
- `petrol-prices-today-pakistan-2026-monthly-budget-impact`

### Remove

Use `Remove` where the post is too thin, too stale, too off-core, too empty, or too weakly differentiated to justify continued public existence.

Chosen for:

- `basant-2026-lahore-kite-prices-household-cost`
- `roznamcha-with-ai`
- `e-challan-bill-management-guide-pakistan-2026`
- `gold-price-prediction-2026-daily-gold-rate-pakistan`
- `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`

### Temporary Keep

Use `Temporary Keep` only where pruning now would create a gap before a better explanatory replacement exists.

Chosen for:

- `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`

## D. Merge Targets Where Relevant

- `cost-of-living-pakistan-2026-monthly-budget-with-ai`
  - merge target: `cost-of-living-pakistan-2026-monthly-budget`
- `petrol-prices-today-pakistan-2026-monthly-budget-impact`
  - merge target: `pakistan-petrol-price-april-2026-rs458-budget-guide`

## E. Estimated Effect Of This Cleanup On Archive Quality Perception

If these decisions are implemented cleanly:

- the weakest blog candidate group stops dominating the archive tail
- the indexed archive would concentrate much more clearly around Roznamcha’s strongest budgeting and household-survival topics
- derivative AI/product clutter would shrink
- thin, stale, and off-core posts would stop diluting reviewer perception

Expected qualitative effect:

- higher concentration of real-value pages
- lower proportion of search-led or low-depth editorial pages
- clearer editorial identity around Pakistani household budgeting pressure

Expected rough search-surface effect:

- the current `23`-post public archive would stop treating all `10` weak candidates as equally valid search-surface assets
- after implementation, only the defensible survivors should remain accessible, and only a much smaller subset should remain indexed

## F. Recommended Next Implementation Task After Decisions Are Approved

**Controlled blog cleanup implementation pass**

Recommended order:

1. implement `noindex` for the two noindex decisions
2. remove the five remove candidates safely from public editorial surface
3. retire or redirect the two merge-source posts after deciding the exact redirect/merge handling
4. leave the one temporary-keep post untouched for now, but flag it explicitly for later replacement

Implementation note:

- keep this as a reversible, reviewable cleanup pass
- do not mix it with manual article rewrites
- do not broaden it into sitewide SEO work
