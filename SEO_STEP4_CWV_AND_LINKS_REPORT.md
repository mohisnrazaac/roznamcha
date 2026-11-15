# Step 4 Core Web Vitals & Internal Links Validation Report

**Domain:** `https://roznamcha.pk`  
**Execution Timestamp:** 2026-11-15 17:02:00 PKT  
**Branch / Commit Scope:** Task 1 (Live `blog_posts` Link Audit & Fixes), Task 2 (Mobile Core Web Vitals Audit & Optimization), Task 3 (Deployment & Verification)  
**Test Suite Status:** 188 passed (2,086 assertions)  

---

## 1. Executive Summary

This report documents the completion and live production verification of Step 4 technical optimizations for Roznamcha (`https://roznamcha.pk`):
1. **Live `blog_posts` Database Audit & Link Modernization:** Created a full JSON backup of the `blog_posts` table on the production server. Audited all 21 published posts, eliminated legacy 301-redirected URLs and noindex anchor targets, and injected contextual upper-body links pointing directly to canonical `/tools/*` calculators.
2. **Contextual Tool CTAs on Blog Articles:** Integrated the shared `HouseholdPlanningSuite` at the base of every blog article in `resources/js/Pages/Public/Blog/Show.jsx` to establish complete two-way internal linking between editorial content and interactive financial tools.
3. **Mobile Core Web Vitals (LCP, INP, CLS) Audit & Optimizations:**
   - **CLS (Cumulative Layout Shift):** Audited `<img>` tags across `PublicHeader.jsx`, `Show.jsx`, `Features.jsx`, and `GuestLayout.jsx`, confirming all key image tags carry explicit `width`, `height`, and `loading="lazy"` attributes to prevent DOM reflows.
   - **LCP (Largest Contentful Paint):** Verified CSS delivery uses zero external render-blocking font networks (native system / Tailwind sans font stack), and critical stylesheets are compressed via Brotli (`br`) and long-cached.
   - **Compression & Network Efficiency:** Updated `public/.htaccess` with comprehensive `mod_deflate` MIME filtering (`text/html`, `text/plain`, `text/xml`, `text/css`, `application/javascript`, `application/json`, `image/svg+xml`).
4. **Testing, Build & Production Verification:** Rebuilt Vite and SSR bundles, deployed all modified assets via FTP, cleared caches (`optimize:clear` and `opcache_reset`), restarted the Node SSR service, and verified live canonical responses across multiple endpoints.

---

## 2. Task 1: Audit & Fix Internal Links in Live Published `blog_posts`

### 1. Database Backup
Before performing any mutations, a complete database snapshot was exported:
- **Backup File Location:** `/home/roznamch/rozapp/storage/app/blog_posts_backup_20261115_115554.json`
- **Total Records Captured:** 60 blog posts (including published, drafts, and archived revisions).

### 2. Audit Scope & Replacements
All 21 live published articles were scanned against known redirect patterns and legacy targets:

| Search Target | Canonical Replacement | Reason |
| :--- | :--- | :--- |
| `/50k-salary-survival-guide` | `/blog/best-monthly-budget-50000-salary-pakistan-2026` | 301 redirect elimination |
| `/monthly-expense-tracker-pakistan` | `/features/monthly-expense-tracker-pakistan` | 301 redirect elimination |
| `/solar-net-metering-roi-calculator` | `/tools/solar-net-metering-roi-calculator` | 301 redirect elimination |
| `/electricity-bill-calculator-lesco` | `/tools/electricity-bill-estimator` | 301 redirect elimination |
| `/electricity-bill-estimator` | `/tools/electricity-bill-estimator` | 301 redirect elimination |
| `/ration-cost-estimator` | `/tools/ration-cost-estimator` | 301 redirect elimination |
| `/monthly-household-budget-calculator` | `/tools/monthly-household-budget-calculator` | 301 redirect elimination |
| `/terms-of-service` | `/terms` | 301 redirect elimination |
| `/kharcha-map` | `/tools/monthly-household-budget-calculator` | Re-pointing noindex target |
| `/ration-brain` | `/tools/ration-cost-estimator` | Re-pointing noindex target |
| `/survival-report` | `/tools/monthly-household-budget-calculator` | Re-pointing noindex target |
| `/templates` | `/tools/monthly-household-budget-calculator` | Re-pointing noindex target |
| `/features` (unqualified) | `/features/monthly-expense-tracker-pakistan` | Re-pointing noindex target |

### 3. Execution Results
- **Published Posts Audited:** 21 posts
- **Posts With Redirects / Noindex Links Fixed:** 8 posts
- **Total Redirect Links Replaced:** 14 links
- **Posts Injected With Upper-Body Canonical Tool Links:** 11 posts (in the first 25% of the body)
- **Double-Prefix Normalization:** 7 posts were normalized from `/tools/tools/*` to clean `/tools/*`.

### 4. Blog Show Layout Enhancement
In `resources/js/Pages/Public/Blog/Show.jsx`, added `<HouseholdPlanningSuite currentPath="" />` directly below `ArticleNextSteps`, guaranteeing every reader has instant access to all 6 core household planning tools regardless of the entry blog post.

---

## 3. Task 2: Mobile Core Web Vitals Audit & Optimization

### 1. Network & Server-Side Performance Baselines
Using `curl` timing instrumentation simulating mobile user-agents (`iPhone / iOS Safari`):

| Page | DNS Lookup | TCP Connect | TLS Handshake | TTFB (Time to First Byte) | Total Transfer | Payload Size |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Homepage (`/`)** | 0.0016s | 0.170s | 0.338s | **0.578s** | 1.248s | 62,178 bytes |
| **Electricity Tool (`/tools/electricity-bill-estimator`)** | 0.0022s | 0.143s | 0.306s | **0.539s** | 1.046s | 100,806 bytes |

*PageSpeed Insights Note: When querying the public PageSpeed API without a dedicated Google Cloud API key, the API returned `429: Too Many Requests` due to global IP throttling. Performance audit was verified through direct HTTP/2 timing metrics, Brotli asset inspection, and layout stability checks.*

### 2. Codebase & Asset Optimizations Applied

#### A. CLS (Cumulative Layout Shift) Prevention: `CLS < 0.1`
- **Header Logo:** [resources/js/Components/Nav/PublicHeader.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Components/Nav/PublicHeader.jsx) sets explicit `width="44"` and `height="44"` on `/icons/appicon.png`.
- **Blog Hero Images:** [resources/js/Pages/Public/Blog/Show.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Blog/Show.jsx) sets explicit `width="1200"` and `height="630"` with `loading="lazy"`.
- **Feature Screenshots:** [resources/js/Pages/Public/Features.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Features.jsx) calculates dynamic aspect ratios using `imageMeta.width` and `imageMeta.height`.
- **Guest Layout Logo:** [resources/js/Layouts/GuestLayout.jsx](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Layouts/GuestLayout.jsx) sets explicit `width="64"` and `height="64"`.

#### B. LCP (Largest Contentful Paint) & Render-Blocking Optimization
- **Zero External Font Blocking:** The application relies entirely on Tailwind's native system font stack (`sans: ['Figtree', ...defaultTheme.fontFamily.sans]`) without making synchronous network requests to Google Fonts or Typekit.
- **Async Scripts:** Google Consent Mode v2 initializes synchronously with denied defaults (mandated by Google AdSense policy), while Google AdSense (`adsbygoogle.js`) loads asynchronously via `<script async>`.
- **Preload / Preconnect:** Primary stylesheets are delivered with `<link rel="preload" as="style">` and `<link rel="stylesheet">`.

#### C. Compression & Caching (`public/.htaccess`)
- Updated `public/.htaccess` with full MIME compression:
  ```apache
  <IfModule mod_deflate.c>
      AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json text/javascript application/xml application/xhtml+xml image/svg+xml
  </IfModule>
  ```
- Long-term caching enabled for immutable hashed Vite assets (`Cache-Control: public, max-age=31536000, immutable`).
- Verified static assets return Brotli (`content-encoding: br`) on LiteSpeed.

---

## 4. Task 3: Live Verification & Testing

### 1. Live Article URL Inspections (`curl`)

#### Article 1: Electricity Tariff Increases (ID 51)
- **URL:** `https://roznamcha.pk/blog/pakistan-electricity-tariff-increases-and-household-budgeting-defense-2026`
- **Verified Canonical Links in SSR HTML:**
  - `href="/tools/electricity-bill-estimator"` (Lead callout & body)
  - `href="/tools/monthly-household-budget-calculator"`
  - `href="/tools/solar-net-metering-roi-calculator"`
  - `href="/tools/school-fees-planner"`
  - `href="/tools/ration-cost-estimator"`
- **Redirects Remaining:** 0

#### Article 2: 50k Salary Survival Budget (ID 24)
- **URL:** `https://roznamcha.pk/blog/best-monthly-budget-50000-salary-pakistan-2026`
- **Verified Canonical Links in SSR HTML:**
  - `href="/tools/monthly-household-budget-calculator"` (Lead callout & body)
  - `HouseholdPlanningSuite` tool suite links rendered at base of page.
- **Redirects Remaining:** 0

#### Article 3: Solar Battery Storage Economics (ID 82)
- **URL:** `https://roznamcha.pk/blog/solar-battery-storage-economics-in-pakistan-lifepo4-vs-tubular-battery-roi-2026`
- **Verified Canonical Links in SSR HTML:**
  - `href="/tools/solar-net-metering-roi-calculator"` (Lead callout & body)
  - `HouseholdPlanningSuite` tool suite links rendered at base of page.
- **Redirects Remaining:** 0

### 2. Quality Assurance & Test Results
- **PHPUnit Test Suite:**
  ```
  Tests:    188 passed (2086 assertions)
  Duration: 4.47s
  ```
- **SSR Server Status:** Node SSR daemon restarted successfully on port 13714 (`{"status":"OK"}`).
- **Cache Purge:** Full bootstrap and OpCache reset performed on production.
