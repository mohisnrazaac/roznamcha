# Google AdSense Technical Audit & Implementation Plan

**Project:** Roznamcha (`https://roznamcha.pk`)  
**Date:** 2026-09-20  
**Status:** Ready for Execution / Staged for Diagnostics  
**Publisher ID:** `ca-pub-8709269992599634` / `pub-8709269992599634`  
**GA4 Measurement ID:** `G-5EPHFZLH71`  

---

## 1. Context & Objectives

This implementation plan consolidates findings from a 4-specialty technical and policy audit (`agency-seo-specialist`, `agency-frontend-developer`, `agency-programmatic-display-buyer`, `agency-tracking-measurement-specialist`). It addresses:
1. **Approval Blockers:** "Low-value content" risks, sitemap leaks of thin pages, keyword-stuffed `<noscript>` cloaking on `/login` and `/register`.
2. **Core Web Vitals:** Eliminating Cumulative Layout Shift (CLS) in dynamic ad rendering containers.
3. **Tracking & Privacy Compliance:** Correcting Google Consent Mode v2 lifecycle (`default` vs `update`) and instrumenting GA4 virtual pageviews on Inertia.js client-side transitions.
4. **Monetization Architecture:** High-RPM, high-viewability placement architecture without violating Google's ad density or utility screen policies.

---

## 2. User Review & Decisions Required

> [!IMPORTANT]
> **AdSense Verification Strategy:**
> Currently, `resources/views/app.blade.php` (line 84) has an unconditional `<script async src="https://pagead2.googlesyndication.com/..."></script>` in `<head>`. We replace this with `<meta name="google-adsense-account" content="ca-pub-8709269992599634">` and load `adsbygoogle.js` dynamically only when `pagePolicies.adsAllowed === true` and consent is established.

> [!WARNING]
> **Sitemap Cleanups & Test Suite Alignment:**
> `tests/Feature/AdsenseSearchSurfaceCleanupTest.php` currently fails because programmatic landing pages (`/petrol-price-*`, `/electricity-bill-*`, `/ration-cost-*`) and template details (`/templates/*`) were re-exposed to sitemaps and set to `index,follow`. We restore `noindex,follow` on these thin surfaces until content depth is upgraded, bringing the test suite back to 100% pass.

---

## 3. Detailed Proposed Changes

### Component 1: SEO Specialist (`agency-seo-specialist`)

#### 1.1 `config/roznamcha_seo.php`
- Re-enable the search surface noindex boundaries:
  ```php
  'search_surface' => [
      'noindex_page_types' => ['petrol', 'electricity', 'ration'],
      'noindex_template_slugs' => [
          'student-budget',
          '50k-salary-survival-guide',
          '100k-family-budget',
          'joint-family-budget',
      ],
      'noindex_blog_category_slugs' => [
          'fuel-prices-hike',
          'household-tips',
          'inflation-watch',
          'personal-finance-pakistan',
      ],
  ],
  ```

#### 1.2 `app/Http/Controllers/SeoSitemapController.php`
- Inject `SearchSurfacePolicy` into the controller constructor.
- Filter `programmaticUrls()` to omit any page type present in `noindex_page_types`.
- Filter `templateUrls()` to omit any slug present in `noindex_template_slugs`.
- Add `/cookie-policy` to `staticUrls()`.

#### 1.3 `app/Http/Controllers/TemplateSitemapController.php`
- Filter `BudgetTemplate::query()` to exclude slugs in `noindex_template_slugs` so that `templates-sitemap.xml` only advertises `/templates`.

#### 1.4 `app/Http/Controllers/Concerns/BuildsPublicSeo.php`
- Add `'robots' => 'noindex, nofollow'` to both `'login'` and `'register'` SEO configurations to prevent authentication forms from indexing as thin content.

#### 1.5 `resources/views/app.blade.php`
- Remove lines 271–288 (the keyword-stuffed `<article>` blocks within `<noscript>` on `/login` and `/register`).

#### 1.6 `app/Http/Middleware/HandleInertiaRequests.php`
- Add `'public.cookie-policy'` to `publicRouteNames()`.

---

### Component 2: Frontend Engineering & Core Web Vitals (`agency-frontend-developer`)

#### 2.1 `resources/views/app.blade.php`
- Remove the unconditional `<script async src="https://pagead2.googlesyndication.com/..."></script>` from line 84.
- Add `<meta name="google-adsense-account" content="ca-pub-8709269992599634">` in `<head>`.
- Restrict `adsbygoogle.js` loading to the existing `loadAds()` function gated by `policies.adsAllowed`.

#### 2.2 `resources/js/Components/Ads/AdContainer.jsx`
- **Eliminate CLS:** Enforce minimum reserved heights:
  - `responsive`: `min-height: 280px; width: 100%;`
  - `leaderboard`: `min-height: 90px; width: 100%; max-width: 728px;`
  - `rectangle`: `min-height: 250px; width: 300px;`
- **Fix Mobile Overflow:** Replace fixed 728px leaderboard styling with responsive fluid container and media queries.
- **Inertia SPA Lifecycle Protection:** Ensure `(window.adsbygoogle = window.adsbygoogle || []).push({})` only fires if the `<ins>` DOM element is empty (`ins.children.length === 0`), preventing fatal push errors on page navigation.
- **Strict Labeling Compliance:** Retain only compliant uppercase `ADVERTISEMENT` text; eliminate ambiguous branding.

#### 2.3 `resources/js/Layouts/PublicLayout.jsx`
- Add a "Cookie Preferences" button to the footer to allow users to trigger the consent preferences modal at any time (required by GDPR/CPRA/TCF).

---

### Component 3: Programmatic Display Placements (`agency-programmatic-display-buyer`)

#### 3.1 `resources/js/Pages/Public/Blog/Show.jsx`
- Import `AdContainer`.
- **Unit 1 (Mid-Article):** Mount an `AdContainer` (variant="responsive", slot configured via props/env) after the third paragraph or directly above `UseInRoznamchaWidget` (targeting 75%+ viewability).
- **Unit 2 (End-of-Article):** Mount an `AdContainer` directly above `<ArticleNextSteps />` (targeting 60%+ viewability).
- Ensure ad density stays well below the 30% threshold.

---

### Component 4: Tracking, Analytics & Consent Mode (`agency-tracking-measurement-specialist`)

#### 4.1 `resources/views/app.blade.php`
- Correct the Google Consent Mode v2 lifecycle:
  1. Dispatch `gtag('consent', 'default', { ... denied ... })` immediately on page load before any tags load.
  2. In `updateConsentMode`, call `gtag('consent', 'update', { ... granted ... })` when consent is accepted (instead of re-calling `default`).

#### 4.2 `resources/js/app.jsx`
- Add an Inertia navigation listener to track virtual pageviews in GA4:
  ```javascript
  router.on('navigate', () => {
      if (typeof window.gtag === 'function' && window.roznamchaTrackingConfig?.gaMeasurementId) {
          window.gtag('event', 'page_view', {
              page_location: window.location.href,
              page_title: document.title,
          });
      }
  });
  ```

---

## 4. Verification Plan

### Automated Tests
```bash
# Verify search surface cleanup and sitemap isolation
php artisan test tests/Feature/AdsenseSearchSurfaceCleanupTest.php

# Verify blog routing and public SEO heads
php artisan test tests/Feature/BlogPublicTest.php
php artisan test tests/Feature/PublicPageSeoHeadTest.php

# Verify full regression suite
php artisan test
```

### Build Verification
```bash
npm run build
```

### Manual Verification Checklist
1. `curl -s http://127.0.0.1:8002/sitemap.xml | grep -i "student-budget"` -> Returns 0 results.
2. `curl -s http://127.0.0.1:8002/templates-sitemap.xml` -> Only contains `/templates`.
3. `curl -s http://127.0.0.1:8002/login` -> Verifies `<meta name="robots" content="noindex, nofollow">` is present and `<noscript>` promotional articles are absent.
4. Open Chrome DevTools Performance/Lighthouse panel on `/blog/{slug}`: Verify CLS = 0.00 for the mid-article ad container.
5. In GA4 DebugView: Verify virtual `page_view` events fire on Inertia page transitions.
