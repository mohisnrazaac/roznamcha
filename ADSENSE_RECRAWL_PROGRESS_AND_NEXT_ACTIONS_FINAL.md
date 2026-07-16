# AdSense Recrawl Progress And Next Actions - Final Readiness Record

Date: 2026-06-12
Site: https://roznamcha.pk

## 1. Current Verdict

Roznamcha is not guaranteed for AdSense approval, but the confirmed production leakage and technical issues found during this cleanup cycle have been addressed.

Current status:

- Code cleanup: done
- Production sitemap: clean
- Template sitemap: safe
- FAQ duplicate structured-data issue: fixed
- Weak blog leakage: fixed
- Template detail index risk: controlled with noindex
- Remaining blocker: Google Search Console recrawl, removals, and waiting before AdSense resubmission

The remaining risk is old Google crawl memory, not a confirmed production leakage issue.

## 2. Work Completed So Far

### 2.1 Weak Blog Cleanup

The following weak / retired blog URLs were removed from the public search-discovery surface:

- https://roznamcha.pk/blog/basant-2026-lahore-kite-prices-household-cost
- https://roznamcha.pk/blog/roznamcha-with-ai
- https://roznamcha.pk/blog/e-challan-bill-management-guide-pakistan-2026
- https://roznamcha.pk/blog/gold-price-prediction-2026-daily-gold-rate-pakistan
- https://roznamcha.pk/blog/current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan
- https://roznamcha.pk/blog/cost-of-living-pakistan-2026-monthly-budget-with-ai
- https://roznamcha.pk/blog/petrol-prices-today-pakistan-2026-monthly-budget-impact

Production checks confirmed these are no longer leaking through sitemap.

### 2.2 Noindexed Blog Pages Verified

The following pages remain reachable for direct visitors but are noindexed:

- https://roznamcha.pk/blog/new-utility-store-price-list-january-2026-today-subsidized-rates
- https://roznamcha.pk/blog/gold-rates-vs-monthly-savings-household-budget-2026

Verified robots output:

```html
<meta name="robots" content="noindex,follow">
```

### 2.3 Bad Canonical Cleanup

A production issue was found where one noindexed blog page had a canonical URL missing `/blog/`.

Cleanup query was run to remove bad manual canonical URLs:

```sql
UPDATE blog_posts
SET canonical_url = NULL,
    updated_at = NOW()
WHERE canonical_url IS NOT NULL
  AND canonical_url != ''
  AND canonical_url NOT LIKE 'https://roznamcha.pk/blog/%';
```

### 2.4 FAQ Structured Data Issue Fixed

Google Search Console showed duplicate `FAQPage` structured data for:

- https://roznamcha.pk/tools/school-fees-planner
- https://roznamcha.pk/tools/electricity-bill-estimator

Fix applied:

- Duplicate FAQPage JSON-LD was removed.
- Production now returns no `FAQPage` output for both pages.
- This is acceptable because visible FAQ/content can remain without FAQ structured data.

Verification commands:

```bash
curl -s https://roznamcha.pk/tools/school-fees-planner | grep -i "FAQPage"
curl -s https://roznamcha.pk/tools/electricity-bill-estimator | grep -i "FAQPage"
```

Expected result:

```text
No output
```

### 2.5 Template Page Risk Controlled

Template detail pages return HTTP 200 but emit noindex:

- https://roznamcha.pk/templates/student-budget
- https://roznamcha.pk/templates/100k-family-budget
- https://roznamcha.pk/templates/joint-family-budget
- https://roznamcha.pk/templates/50k-salary-survival-guide

Verified robots output:

```html
<meta name="robots" content="noindex,follow">
```

This means template details are publicly reachable but should not be treated as indexable AdSense review inventory.

### 2.6 Sitemap Hardening Done

Codex hardened sitemap generation so weak/noindex/private URLs do not return to sitemap.

Production sitemap currently exposes 25 URLs:

```text
https://roznamcha.pk/
https://roznamcha.pk/features
https://roznamcha.pk/kharcha-map
https://roznamcha.pk/ration-brain
https://roznamcha.pk/survival-report
https://roznamcha.pk/tools/ration-cost-estimator
https://roznamcha.pk/tools/school-fees-planner
https://roznamcha.pk/tools/electricity-bill-estimator
https://roznamcha.pk/templates
https://roznamcha.pk/blog
https://roznamcha.pk/about
https://roznamcha.pk/contact
https://roznamcha.pk/privacy-policy
https://roznamcha.pk/terms
https://roznamcha.pk/blog/petrol-price-pakistan-2026-monthly-household-impact
https://roznamcha.pk/blog/pakistan-petrol-price-april-2026-rs458-budget-guide
https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026
https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026
https://roznamcha.pk/blog/ghar-ka-monthly-budget
https://roznamcha.pk/blog/inflation-household-spending-pakistan-2026
https://roznamcha.pk/blog/pakistani-household-essential-expenses-2026
https://roznamcha.pk/blog/best-monthly-budget-50000-salary-pakistan-2026
https://roznamcha.pk/blog/cost-of-living-pakistan-2026-monthly-budget
https://roznamcha.pk/blog/school-fee-inflation-pakistan-2026
https://roznamcha.pk/blog/pakistani-family-monthly-expense-control
```

Weak sitemap leakage check returned no output:

```bash
curl -s https://roznamcha.pk/sitemap.xml | grep -E "student-budget|100k-family-budget|joint-family-budget|50k-salary-survival-guide|roznamcha-with-ai|e-challan|gold-price-prediction|current-ration-price-list|monthly-budget-with-ai|petrol-prices-today|login|register|dashboard|panel|admin|onboarding|profile"
```

### 2.7 Template Sitemap Made Safe

Production check:

```bash
curl -s https://roznamcha.pk/templates-sitemap.xml | grep -oE '<loc>[^<]+' | sed 's/<loc>//'
```

Current output:

```text
https://roznamcha.pk/templates
```

This is safe. Do not submit template detail URLs separately.

## 3. Search Console Work Already Done

Initial Search Console recrawl/indexing requests were started for important pages.

Two URLs were left due to quota limit:

- https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026
- https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026

These need to be submitted once quota resets.

## 4. Final Search Console Next Actions

When Search Console quota resets:

### 4.1 Request Indexing For Remaining URLs

Request indexing for:

```text
https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026
https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026
```

### 4.2 Resubmit Main Sitemap

Submit or resubmit:

```text
https://roznamcha.pk/sitemap.xml
```

Do not submit retired URLs.
Do not submit noindexed template detail pages.
Do not submit `templates-sitemap.xml` unless it is already present in Search Console and only needs refresh.

### 4.3 Use Removals For Retired Weak URLs

Use Search Console Removals for these URLs if they still appear indexed or show old snippets:

```text
https://roznamcha.pk/blog/basant-2026-lahore-kite-prices-household-cost
https://roznamcha.pk/blog/roznamcha-with-ai
https://roznamcha.pk/blog/e-challan-bill-management-guide-pakistan-2026
https://roznamcha.pk/blog/gold-price-prediction-2026-daily-gold-rate-pakistan
https://roznamcha.pk/blog/current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan
https://roznamcha.pk/blog/cost-of-living-pakistan-2026-monthly-budget-with-ai
https://roznamcha.pk/blog/petrol-prices-today-pakistan-2026-monthly-budget-impact
```

## 5. Final Verification Commands Before AdSense Resubmission

Run these before resubmitting to AdSense.

### 5.1 Ads.txt

```bash
curl -i https://roznamcha.pk/ads.txt
```

Expected body:

```text
google.com, pub-8709269992599634, DIRECT, f08c47fec0942fa0
```

### 5.2 Sitemap Weak Leakage

```bash
curl -s https://roznamcha.pk/sitemap.xml | grep -E "student-budget|100k-family-budget|joint-family-budget|50k-salary-survival-guide|roznamcha-with-ai|e-challan|gold-price-prediction|current-ration-price-list|monthly-budget-with-ai|petrol-prices-today|login|register|dashboard|panel|admin|onboarding|profile"
```

Expected:

```text
No output
```

### 5.3 Template Sitemap

```bash
curl -s https://roznamcha.pk/templates-sitemap.xml | grep -oE '<loc>[^<]+' | sed 's/<loc>//'
```

Expected:

```text
https://roznamcha.pk/templates
```

### 5.4 FAQPage Duplicate Issue

```bash
curl -s https://roznamcha.pk/tools/school-fees-planner | grep -i "FAQPage"
curl -s https://roznamcha.pk/tools/electricity-bill-estimator | grep -i "FAQPage"
```

Expected:

```text
No output
```

## 6. Final AdSense Resubmission Rule

Do not resubmit to AdSense immediately after requesting indexing.

After Search Console quota resets:

1. Request indexing for the two remaining URLs.
2. Resubmit `https://roznamcha.pk/sitemap.xml`.
3. Use Search Console Removals for retired weak URLs if they still appear indexed.
4. Wait 3 to 7 days before AdSense resubmission.
5. Resubmit AdSense only when:
   - sitemap status is Success
   - important URLs show recent crawl date after cleanup
   - retired URLs show 404, removed, or not indexed
   - FAQ duplicate issue is no longer showing
   - ads.txt returns HTTP 200 with the correct publisher ID
   - sitemap has no weak/noindex/private URLs

## 7. What Not To Do Now

Do not add more pages just to increase sitemap size.
Do not generate new articles before resubmission.
Do not reintroduce template detail URLs into sitemap.
Do not submit noindexed URLs in Search Console.
Do not resubmit AdSense immediately after indexing requests.

## 8. Final Position

The site is now reasonably resubmission-ready after recrawl.

The biggest remaining risk is Google reviewing old crawl memory. Waiting after Search Console recrawl is important.

Recommended next move:

1. Finish the two remaining Search Console indexing requests.
2. Resubmit the main sitemap.
3. Remove old weak URLs if still indexed.
4. Wait 3 to 7 days.
5. Resubmit to AdSense only after the final checks pass.
