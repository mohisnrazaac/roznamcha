# AdSense Re-Submission Cleanup Progress And Next Actions

Date: 2026-06-12  
Site: https://roznamcha.pk  
Purpose: record completed AdSense low-value cleanup work, current Google Search Console progress, remaining blocked items, and next action items starting from Step 3.

## 1. Current Status Summary

Roznamcha has completed the major production cleanup required before another AdSense re-submission.

The work done so far has moved the site from a broad, mixed-quality public surface to a tighter public surface focused on stronger pages, cleaned blog inventory, noindexed weak-but-reachable articles, removed weak posts, clean sitemap behavior, and verified public noindex handling.

The current blocker is no longer general content cleanup. The current blocker is completing Google Search Console cleanup and recrawl actions, plus resolving two FAQ-related page problems before requesting indexing again for those affected tool pages.

## 2. Total Progress Achieved So Far

### 2.1 Low-value content cleanup completed

The earlier audit identified the main AdSense risk as content-value perception rather than basic technical reachability. The risk areas were weak programmatic pages, thin blog posts, repetitive template/detail pages, and search-led/off-core article clutter.

Completed cleanup includes:

- Weak programmatic page groups were noindexed and removed from sitemap exposure.
- Weak blog category archives were noindexed.
- Canonical host inconsistency was fixed across public page types.
- Ration Cost Estimator was upgraded and approved as a flagship-quality page.
- Homepage was upgraded and approved after weak navigation leakage was removed.
- Survival Report was upgraded and approved after unsupported projection wording was removed.
- Shared blog article framework was improved.
- Blog archive was scanned, batch-cleaned, re-audited, and then cleaned through remove, merge-retire, noindex, and temporary-keep decisions.
- Weak blog promotion was removed from internal link catalogs.
- RSS route and feed behavior were fixed.
- Public contact identity was unified around support@roznamcha.pk.
- Stale inflation/buffer wording was cleaned from shared snippets and relevant pages.

### 2.2 Production mismatch found and fixed

Production was not matching the cleanup state. The following weak URLs were still published in production when checked:

- roznamcha-with-ai
- e-challan-bill-management-guide-pakistan-2026
- gold-price-prediction-2026-daily-gold-rate-pakistan
- cost-of-living-pakistan-2026-monthly-budget-with-ai
- petrol-prices-today-pakistan-2026-monthly-budget-impact

The cleanup action was then applied on production so retired weak URLs stopped serving public low-value content.

### 2.3 Retired weak URLs verified

The following merge-source URLs now return 404 instead of serving old weak content:

- https://roznamcha.pk/blog/cost-of-living-pakistan-2026-monthly-budget-with-ai
- https://roznamcha.pk/blog/petrol-prices-today-pakistan-2026-monthly-budget-impact

Redirects would be cleaner, but 404 is acceptable for AdSense cleanup because the main goal is to stop serving low-value content.

### 2.4 Noindex verification completed

The two intentionally retained weak-but-direct-access posts were verified to render:

```html
<meta name="robots" content="noindex,follow" inertia="robots">
```

Verified noindex URLs:

- https://roznamcha.pk/blog/new-utility-store-price-list-january-2026-today-subsidized-rates
- https://roznamcha.pk/blog/gold-rates-vs-monthly-savings-household-budget-2026

### 2.5 Sitemap leakage check passed

The sitemap leakage check returned no output for the weak/retired/noindexed URL group.

Checked patterns:

- basant-2026
- roznamcha-with-ai
- e-challan
- gold-price-prediction
- current-ration-price-list
- monthly-budget-with-ai
- petrol-prices-today
- new-utility-store-price-list
- gold-rates-vs-monthly-savings

Result:

- No output
- Meaning: weak retired/noindexed URLs are not leaking through sitemap.xml

### 2.6 Canonical cleanup query completed

A production cleanup query was run to remove bad manual canonical URLs where stored canonicals did not follow the expected blog URL format.

Purpose:

- prevent manually stored bad canonical_url values from overriding correct generated canonicals
- avoid cases where a blog post canonical misses `/blog/`

### 2.7 ads.txt and final public checks completed

The requested ads.txt and public surface checks have been completed.

This means the site is now past the main cleanup verification stage and has moved into Search Console recrawl and final issue resolution.

## 3. Google Search Console Progress So Far

Step 1 and Step 2 have been worked on.

### 3.1 Sitemap submission

Sitemap action has been completed or initiated:

- https://roznamcha.pk/sitemap.xml

Expected final state in Search Console:

- Sitemap status should become Success

### 3.2 Indexing requests completed so far

Indexing was requested for the main high-value public URLs until quota was reached.

High-value URL set intended for indexing:

- https://roznamcha.pk/
- https://roznamcha.pk/tools/ration-cost-estimator
- https://roznamcha.pk/tools/school-fees-planner
- https://roznamcha.pk/tools/electricity-bill-estimator
- https://roznamcha.pk/survival-report
- https://roznamcha.pk/kharcha-map
- https://roznamcha.pk/blog
- https://roznamcha.pk/blog/ghar-ka-monthly-budget
- https://roznamcha.pk/blog/pakistani-family-monthly-expense-control
- https://roznamcha.pk/blog/pakistani-household-essential-expenses-2026
- https://roznamcha.pk/blog/best-monthly-budget-50000-salary-pakistan-2026
- https://roznamcha.pk/blog/pakistan-petrol-price-april-2026-rs458-budget-guide
- https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026
- https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026

## 4. URLs Left Due To Google Search Console Quota Limit

These URLs were left because the indexing request quota was exceeded:

- https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026
- https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026

Action:

Request indexing for these two URLs when Search Console quota resets.

## 5. URLs Currently Having FAQ Problem

These two tool pages currently have FAQ-related problems and must be fixed before they are treated as clean final approval assets:

- https://roznamcha.pk/tools/school-fees-planner
- https://roznamcha.pk/tools/electricity-bill-estimator

Required action:

Fix FAQ issue first, then re-test page source and Search Console inspection.

Likely checks after fix:

```bash
curl -s https://roznamcha.pk/tools/school-fees-planner | grep -i "FAQPage\|faq\|mainEntity"

curl -s https://roznamcha.pk/tools/electricity-bill-estimator | grep -i "FAQPage\|faq\|mainEntity"
```

The visible FAQ content and JSON-LD FAQ schema must match. If FAQ schema exists without visible FAQ content, either render the FAQ visibly or remove the FAQ schema.

## 6. Next Action Items Starting From Step 3

### Step 3: Search Console removals for retired weak URLs

Use Google Search Console Removals tool for retired weak URLs if they still appear in Google search results or URL Inspection shows old indexed content.

Submit temporary removal for:

- https://roznamcha.pk/blog/basant-2026-lahore-kite-prices-household-cost
- https://roznamcha.pk/blog/roznamcha-with-ai
- https://roznamcha.pk/blog/e-challan-bill-management-guide-pakistan-2026
- https://roznamcha.pk/blog/gold-price-prediction-2026-daily-gold-rate-pakistan
- https://roznamcha.pk/blog/current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan
- https://roznamcha.pk/blog/cost-of-living-pakistan-2026-monthly-budget-with-ai
- https://roznamcha.pk/blog/petrol-prices-today-pakistan-2026-monthly-budget-impact

Reason:

These URLs previously contributed to low-value perception. They should not remain visible in Google’s indexed/cached search surface during the next AdSense review cycle.

### Step 4: Fix FAQ issue on affected tool pages

Fix FAQ problems on:

- https://roznamcha.pk/tools/school-fees-planner
- https://roznamcha.pk/tools/electricity-bill-estimator

Rules:

- Do not keep hidden FAQ schema if FAQ content is not visible.
- If FAQ JSON-LD exists, render matching visible FAQ content on the page.
- If the page does not need FAQ content, remove FAQ JSON-LD completely.
- After deployment, inspect the page source and confirm there is no mismatch.

### Step 5: Request indexing for quota-left URLs

When quota resets, request indexing for:

- https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026
- https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026

### Step 6: Re-request indexing after FAQ fix

After FAQ issue is fixed and deployed, request indexing again for:

- https://roznamcha.pk/tools/school-fees-planner
- https://roznamcha.pk/tools/electricity-bill-estimator

### Step 7: Final live verification after 24 hours

Run these checks after deployment and Search Console actions:

```bash
curl -s https://roznamcha.pk/sitemap.xml | grep -E "basant-2026|roznamcha-with-ai|e-challan|gold-price-prediction|current-ration-price-list|monthly-budget-with-ai|petrol-prices-today|new-utility-store-price-list|gold-rates-vs-monthly-savings"
```

Expected:

```text
No output
```

Check RSS leakage:

```bash
curl -s https://roznamcha.pk/blog/rss.xml | grep -E "basant-2026|roznamcha-with-ai|e-challan|gold-price-prediction|current-ration-price-list|monthly-budget-with-ai|petrol-prices-today|new-utility-store-price-list|gold-rates-vs-monthly-savings"
```

Expected:

```text
No output
```

Check RSS status:

```bash
curl -I https://roznamcha.pk/blog/rss.xml
```

Expected:

```text
HTTP 200
```

Check ads.txt again:

```bash
curl -i https://roznamcha.pk/ads.txt
curl -i https://www.roznamcha.pk/ads.txt
```

Expected body:

```text
google.com, pub-8709269992599634, DIRECT, f08c47fec0942fa0
```

### Step 8: Wait before AdSense re-submission

Do not resubmit immediately.

Wait 7 days after:

- sitemap is successfully submitted
- main high-value URLs are crawled again
- weak retired URLs are removed or showing 404/noindex
- FAQ problems are fixed
- ads.txt remains reachable
- sitemap and RSS do not leak weak URLs

## 7. Current Decision

Do not do broad new content work right now.

Do not resubmit to AdSense today.

The correct next move is:

1. Complete Search Console removal step for retired weak URLs.
2. Fix FAQ issues on School Fees Planner and Electricity Bill Estimator.
3. Request indexing for the two quota-left article URLs when quota resets.
4. Re-request indexing for FAQ-fixed tool pages.
5. Wait for recrawl.
6. Then prepare AdSense re-submission.

## 8. Re-submission Readiness Criteria

Re-submit to AdSense only when all are true:

- ads.txt is publicly reachable and correct
- sitemap.xml is clean and successfully processed
- retired weak blog URLs are not in sitemap, RSS, or blog index
- noindexed retained pages render `noindex,follow`
- Search Console removals are submitted for old weak URLs still visible in Google
- quota-left strong article URLs are submitted for indexing
- School Fees Planner FAQ issue is fixed
- Electricity Bill Estimator FAQ issue is fixed
- Google has had at least 7 days to recrawl the updated public surface

