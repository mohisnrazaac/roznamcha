# AdSense Low Value Phase 3 QA

Verification date: 2026-04-20  
Governing documents read first:

- `ADSENSE_LOW_VALUE_AUDIT_PHASE1.md`
- `ADSENSE_LOW_VALUE_PHASE2_IMPLEMENTATION.md`

Implementation reviewed:

- `config/roznamcha_seo.php`
- `app/Seo/SeoSnapshotService.php`
- `app/Seo/SeoPageDataService.php`
- `app/Seo/SeoPageMetaService.php`
- `app/Seo/SeoPageUrlGenerator.php`
- `app/Http/Controllers/SeoSitemapController.php`
- `app/Http/Controllers/BlogPublicController.php`
- `app/Http/Controllers/PublicPageController.php`
- `app/Http/Controllers/ContactController.php`
- `app/Http/Controllers/Concerns/BuildsPublicSeo.php`
- `app/Http/Controllers/TemplateController.php`
- `resources/views/app.blade.php`
- related public React pages and layout files used for internal linking

Verification method:

- Raw server-response validation was performed through direct Laravel HTTP-kernel rendering against the current local app state.
- Local DB-backed content state was queried from the actual app bootstrap.
- Feature suite verification also passed:
  `tests/Feature/SeoProgrammaticPagesTest.php`,
  `tests/Feature/PublicPageSeoHeadTest.php`,
  `tests/Feature/BlogPublicTest.php`
  with `30` passing tests and `341` assertions.

Local data state observed during QA:

- Publicly visible blog posts: `23`
- Blog category slugs present locally: `fuel-prices-hike`, `household-tips`, `inflation-watch`, `personal-finance-pakistan`
- Public template slugs present locally: `100k-family-budget`, `50k-salary-survival-guide`, `joint-family-budget`, `student-budget`
- Most recent locally visible blog sample used: `/blog/pakistan-petrol-price-april-2026-rs458-budget-guide`

## A. Verification Summary

Week 1 noindex cleanup is technically working for the intended weak groups.

- Programmatic petrol city pages render `meta robots="noindex,follow"` in raw HTML.
- Programmatic electricity DISCO pages render `meta robots="noindex,follow"` in raw HTML.
- Programmatic ration family-size pages render `meta robots="noindex,follow"` in raw HTML.
- Weak blog category archives render `meta robots="noindex,follow"` in raw HTML.
- Programmatic groups are absent from `/sitemap.xml`.
- Strong sample pages remain indexable and were not accidentally noindexed.
- No direct contradiction was found where a noindexed programmatic page still appeared in the sitemap.

The cleanup is still incomplete from an AdSense-quality perspective because indexable weak content remains elsewhere:

- weak individual blog posts were not touched in Phase 2 and remain publicly visible
- repetitive template detail pages remain indexable
- homepage and global navigation still promote noindexed programmatic pages heavily
- blog index and blog detail pages still link weak category archives even though those archives are now noindexed

## B. Exact Page Samples Tested For Each Noindexed Group

### 1. Programmatic petrol city group

Sample tested: `/petrol-price-karachi-today`

- Status: `200`
- Title present: `Petrol Price in Karachi Today | Roznamcha Pakistan`
- Canonical present: `https://roznamcha.pk/petrol-price-karachi-today`
- Robots present: `noindex,follow`
- Page JSON-LD present: `yes`
- Render conclusion: usable for direct visitors and correctly noindexed

### 2. Programmatic electricity DISCO group

Sample tested: `/electricity-bill-calculator-lesco`

- Status: `200`
- Title present: `Electricity Bill Calculator for LESCO | Roznamcha`
- Canonical present: `https://roznamcha.pk/electricity-bill-calculator-lesco`
- Robots present: `noindex,follow`
- Page JSON-LD present: `yes`
- Render conclusion: usable for direct visitors and correctly noindexed

### 3. Programmatic ration family-size group

Sample tested: `/ration-cost-for-6-people-pakistan`

- Status: `200`
- Title present: `Ration Cost for 6 People in Pakistan | Roznamcha`
- Canonical present: `https://roznamcha.pk/ration-cost-for-6-people-pakistan`
- Robots present: `noindex,follow`
- Page JSON-LD present: `yes`
- Render conclusion: usable for direct visitors and correctly noindexed

### 4. Weak blog category archive group

Sample tested: `/blog/category/personal-finance-pakistan`

- Status: `200`
- Title present: `Personal Finance Pakistan – Roznamcha Blog`
- Canonical present: `http://localhost/blog/category/personal-finance-pakistan`
- Robots present: `noindex,follow`
- Page JSON-LD present: `no`
- Render conclusion: correctly noindexed and still browseable

Note:

- The same weak-category noindex logic is centralized in `config/roznamcha_seo.php` and `BlogPublicController::shouldNoindexCategory()`.
- The local category slugs covered by that shared path are:
  `fuel-prices-hike`, `household-tips`, `inflation-watch`, `personal-finance-pakistan`.

## C. Exact Page Samples Tested For Strong / Indexable Groups

### Core strong pages

Sample tested: `/`

- Status: `200`
- Canonical present: `http://127.0.0.1:8002`
- Robots meta: none
- No noindex signal found
- Page JSON-LD present: yes

Sample tested: `/features`

- Status: `200`
- Canonical present: `http://127.0.0.1:8002/features`
- Robots meta: none
- No noindex signal found
- Page JSON-LD present: yes

Sample tested: `/blog`

- Status: `200`
- Canonical present: `http://localhost/blog`
- Robots meta: none
- No noindex signal found
- Page JSON-LD present: no

### Indexable content pages still live

Sample tested: `/templates`

- Status: `200`
- Canonical present: `http://127.0.0.1:8002/templates`
- Robots meta: none
- No noindex signal found
- Page JSON-LD present: yes

Sample tested: `/blog/pakistan-petrol-price-april-2026-rs458-budget-guide`

- Status: `200`
- Canonical present: `http://localhost/blog/pakistan-petrol-price-april-2026-rs458-budget-guide`
- Robots meta: none
- No noindex signal found
- Page JSON-LD present: yes

Sample tested: `/templates/100k-family-budget`

- Status: `200`
- Canonical present: `http://127.0.0.1:8002/templates/100k-family-budget`
- Robots meta: none
- No noindex signal found
- Page JSON-LD present: yes

Conclusion:

- No strong sample page was accidentally noindexed.
- No strong sample page showed an accidental robots conflict.

## D. Sitemap Verification Results

Actual sitemap sample checks:

- `/petrol-price-karachi-today`: absent
- `/electricity-bill-calculator-lesco`: absent
- `/ration-cost-for-6-people-pakistan`: absent
- `/blog/category/personal-finance-pakistan`: absent
- `/`: present
- `/features`: present
- `/blog`: present
- `/templates`: present

Code-path verification:

- `SeoSitemapController::programmaticSeoUrls()` now skips `petrol`, `electricity`, and `ration` entries via `SeoSnapshotService::isSearchIndexable()`.
- Weak category archive pages were not emitted by sitemap before, and remain excluded.
- Blog detail URLs and template detail URLs remain emitted by their respective sitemap/controller paths.

QA conclusion:

- No programmatic page leak was found in the sitemap.
- No weak category archive leak was found in the sitemap.
- No strong high-level section was accidentally removed from the sitemap.

## E. Canonical And Robots Validation Findings

### Robots validation

Confirmed correct in raw HTML:

- noindexed programmatic petrol sample
- noindexed programmatic electricity sample
- noindexed programmatic ration sample
- noindexed weak category archive sample

Confirmed absent on strong/indexable samples:

- homepage
- features
- blog index
- templates index
- tested blog detail
- tested template detail

`resources/views/app.blade.php` is correctly server-rendering `<meta name="robots" ...>` from page props, so this is not a client-only signal.

### Canonical validation

Noindexed page canonicals are self-referential and not contradictory:

- `/petrol-price-karachi-today` canonicals to itself
- `/electricity-bill-calculator-lesco` canonicals to itself
- `/ration-cost-for-6-people-pakistan` canonicals to itself
- `/blog/category/personal-finance-pakistan` canonicals to itself

No case was found where a noindexed weak page canonicalized to another weak variant.

### Important host inconsistency observed locally

Local raw-response output shows mixed canonical hosts:

- programmatic pages use `https://roznamcha.pk/...`
- some static/template pages use `http://127.0.0.1:8002/...`
- blog index/category/detail samples use `http://localhost/...`

Reason in code:

- programmatic pages use `SeoPageUrlGenerator`, which roots URLs from `config('roznamcha_seo.base_url')`
- many blog/contact/about/category routes use `route(..., true)` and request-derived URLs
- many static/template SEO payloads use `config('app.url')`

Impact on this Phase 3 verdict:

- This does not invalidate the Week 1 noindex cleanup itself.
- It does mean canonical host generation is not fully centralized.
- In this local QA context, host values are inconsistent even though the noindex and sitemap rules are correct.

## F. Internal Linking Observations To Weak / Noindexed Pages

High-prominence internal promotion still exists.

### Homepage still promotes noindexed programmatic groups

Observed in `resources/js/Pages/Public/Home.jsx`:

- homepage city links to petrol pages
- homepage DISCO links to electricity pages
- homepage family-size links to ration pages
- homepage also includes footer-style internal links:
  `Petrol Price Karachi Today`,
  `Electricity Bill Calculator LESCO`,
  `Ration Cost for 6 People`

This means the homepage still actively pushes crawlers and users toward pages that are now intentionally noindexed.

### Global public navigation still promotes noindexed programmatic groups

Observed in `resources/js/Layouts/PublicLayout.jsx`:

- tools menu links to a representative petrol page
- tools menu links to a representative electricity page
- tools menu links to a representative ration page

This is sitewide promotion, not a minor edge case.

### Blog surfaces still promote weak noindexed category archives

Observed in:

- `resources/js/Pages/Public/Blog/Index.jsx`
- `resources/js/Pages/Public/Blog/Show.jsx`

Both surfaces still link category archives through category chips and category lists, including the weak archives marked `noindex`.

### What was not found in this QA sweep

No direct programmatic `seoPageHref(...)` promotion was found in:

- `resources/js/Pages/Public/Features.jsx`
- public tool pages under `resources/js/Pages/Public/Tools`
- template React pages under `resources/js/Pages/Templates`

## G. Remaining Likely AdSense-Risk Sections Still Indexable

The Week 1 cleanup reduced search-surface dilution, but the largest remaining indexable risk is now outside the noindexed groups.

### 1. Weak individual blog posts remain indexable

Phase 2 intentionally did not touch weak posts identified in Phase 1. Those posts remain publicly visible and indexable through the blog/public visibility logic.

Most likely remaining weak indexable cluster:

- thin or derivative AI / commodity / adjacent-topic posts from the audit
- examples from the audit include:
  `/blog/roznamcha-with-ai`
  `/blog/cost-of-living-pakistan-2026-monthly-budget-with-ai`
  `/blog/electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`
  `/blog/current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`

### 2. Template detail pages remain indexable

Phase 2 left templates untouched by design. That means repetitive template-detail pages are still in the sitemap and still indexable.

Most relevant remaining risk samples from Phase 1:

- `/templates/student-budget`
- `/templates/100k-family-budget`
- `/templates/joint-family-budget`

### 3. Internal-link emphasis is still misaligned

Even though the noindexed programmatic groups are removed from the sitemap, homepage and global-nav links still frame them as important discovery targets. That weakens the overall search-surface cleanup from a quality-perception angle.

## H. Final Verdict

### Week 1 cleanup is technically correct

Yes.

- The intended noindexed groups render `noindex,follow` in raw HTML.
- The intended programmatic groups are absent from the sitemap.
- Strong sample pages were not accidentally noindexed.
- No strong section was found to be accidentally removed from the sitemap.

### Week 1 cleanup is incomplete because of X

Yes.

It is incomplete because:

- weak individual blog posts remain indexable
- repetitive template detail pages remain indexable
- homepage and global navigation still push noindexed programmatic pages
- blog pages still link weak noindexed category archives
- canonical host generation is not fully centralized, producing mixed hosts in local raw output

### Safe to proceed to flagship upgrades or not yet

Go, with constraints.

- Safe to proceed to flagship page upgrades because the Week 1 noindex mechanics are functioning as intended.
- Not safe to treat low-value risk as solved. The next phase still needs flagship strengthening plus a second cleanup pass for weak individual blog posts and repetitive template pages.
