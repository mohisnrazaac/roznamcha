# Antigravity Master Execution Prompt: Roznamcha.pk Google AdSense "Thin / Low-Value Content" Remediation

**Target Repository:** `/Applications/XAMPP/xamppfiles/htdocs/roznamcha`  
**Production Domain:** `https://roznamcha.pk`  
**Publisher ID:** `ca-pub-8709269992599634` (`pub-8709269992599634`)  
**Audit Date:** October 16, 2026  

---

## Copy-Paste Prompt for Antigravity (Local Execution First)

```markdown
You are acting as a Principal Laravel + Inertia.js (React SSR) Architect and a 20-Year Google AdSense Publisher Policy & Technical SEO Specialist.

Your objective is to remediate every technical, structural, crawlability, and content-quality defect causing `https://roznamcha.pk` to be repeatedly rejected by Google AdSense for "Thin Content" / "Low-Value Content" (Inventory Value: Google-served ads on screens without publisher-content or with low-value content).

You MUST execute all changes locally first in `/Applications/XAMPP/xamppfiles/htdocs/roznamcha`, verify them via automated PHPUnit tests and a fresh `npm run build` (client + SSR bundle), and DO NOT push to production until all local verification checks pass 100%.

---

### OFFICIAL GOOGLE DOCUMENTATION CONTEXT & POLICY MANDATES

Every code and content change must strictly adhere to these official Google specifications:
1. **Google Publisher Policies — Inventory Value & Screens Without Publisher Content** (`https://support.google.com/publisherpolicies/answer/11112688?hl=en-GB` & `https://support.google.com/adsense/answer/10502938?hl=en`):
   - Prohibits Google-served ads on screens without publisher content, with low-value/thin content, under construction, or used primarily for alerts, navigation, or behavioral purposes (such as `/login`, `/register`, `/blog` archive index, or empty category pages).
2. **AdSense Eligibility & Unique/Interesting Content Requirements** (`https://support.google.com/adsense/answer/9724?hl=en` & `https://support.google.com/adsense/answer/7299563?hl=en`):
   - Requires original, specialist, people-first content that is not templated, duplicated across pages, or scraped.
3. **Google Search Essentials — Spam Policies (Cloaking, Doorway Abuse, Scaled Content Abuse, Link Spam)** (`https://developers.google.com/search/docs/essentials/spam-policies`):
   - **Cloaking / Hidden Text & Duplication:** Serving giant `<noscript>` blocks that duplicate or differ from the primary React SSR `<main>` content violates Search Essentials and creates 100% intra-page duplicate content for crawlers.
   - **Link Spam:** Injecting unflagged promotional backlinks (such as the `sarkaritayari.pk` paragraphs injected via `deploy_promo_and_posts.py` / `InjectSarkariTayariLinksSeeder.php`) and off-topic articles (`Sovereign Cloud`, `Chromebook`) destroys topical authority and triggers spam/thin-affiliate flags.
   - **Doorway Abuse:** Programmatic city/DISCO/family-size permutations (`/petrol-price-{city}-today`, `/electricity-bill-calculator-{disco}`, `/ration-cost-for-{size}-people-pakistan`) with near-identical boilerplate text must not be indexed.
4. **Google Search Essentials — Helpful, Reliable, People-First Content (YMYL Financial Standards)** (`https://developers.google.com/search/docs/fundamentals/creating-helpful-content`):
   - Personal finance, taxes, and household survival budgets are YMYL (Your Money or Your Life) topics. Content must be factually accurate (no recommending the defunct Utility Stores Corporation subsidies that closed in FY2025/2026), thoroughly cited against primary regulators (NEPRA, PBS, SBP, FBR), and free of thin 350–500 word AI summaries.
5. **AdSense Crawler Access (`Mediapartners-Google`) & `robots.txt` Precedence** (`https://support.google.com/adsense/answer/99376?hl=en` & `https://developers.google.com/search/docs/crawling-indexing/block-indexing`):
   - Per RFC 9309, a specific `User-agent: Googlebot` or `User-agent: Mediapartners-Google` group in `robots.txt` completely overrides `User-agent: *` (it does NOT inherit `Disallow` rules from `*`). Currently, `public/robots.txt` has `User-agent: Googlebot \n Allow: /` with zero `Disallow` lines, which caused Googlebot to crawl and index `https://roznamcha.pk/login`!
   - Furthermore, blocking `Disallow: /login` in `robots.txt` prevents Googlebot from seeing the `<meta name="robots" content="noindex, nofollow">` tag on `/login` once indexed.

---

### TASK 1: FIX `resources/views/app.blade.php` (CRITICAL CLOAKING, DUPLICATE DOM, DUPLICATE HEAD & CRAWLER BLOCKERS)

Inspect `resources/views/app.blade.php` and fix these 5 fatal issues:

1. **Remove the Massive `<noscript>` Article Duplication & Bottom Link Farm:**
   - Currently, `resources/views/app.blade.php` (lines 239+) contains ~35,000 characters of hardcoded `<noscript><article>...</article></noscript>` blocks for `/features`, `/disclaimer`, `/tools/ration-cost-estimator`, `/tools/electricity-bill-estimator`, `/tools/monthly-household-budget-calculator`, `/tools/school-fees-planner`, `/tools/solar-net-metering-roi-calculator`, etc., plus a pipe-separated link farm at the bottom.
   - Because Inertia SSR (`@inertia`) ALREADY renders the full React page HTML server-side, crawlers (`Googlebot` and `Mediapartners-Google`) parse BOTH `@inertia` AND `<noscript>`, seeing the entire 600-word "Editorial Documentation" and FAQ block **duplicated word-for-word twice on the same URL**!
   - **Action:** Delete the entire hardcoded `<noscript><article>...</article>...</noscript>` content dump and bottom link bar from `resources/views/app.blade.php`. Replace it with a clean, single-sentence accessibility notice:
     ```html
     <noscript>
         <div class="p-4 text-center text-sm text-slate-600">
             Interactive calculators work best with JavaScript enabled, though all guides and baseline estimates remain readable above.
         </div>
     </noscript>
     ```

2. **Eliminate Duplicate `<head>` Meta Tags, Canonicals, Titles, and JSON-LD:**
   - Currently, `resources/views/app.blade.php` manually outputs `<title inertia>`, `<link rel="canonical">`, `<meta name="description">`, `<meta name="robots">`, OpenGraph tags, Twitter tags, and `<script type="application/ld+json" inertia="page-jsonld">`, AND THEN outputs `@inertiaHead` (which renders all the exact same tags from `resources/js/Components/SeoHead.jsx` during SSR). This produces duplicate `<title>`, duplicate `<link rel="canonical">`, and duplicate `BlogPosting`/`Article` JSON-LD schemas on every SSR page.
   - **Action:** Make `resources/views/app.blade.php` render the server-side fallback `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="robots">`, OpenGraph/Twitter tags, and `$pageJsonLd` **ONLY when `$page['head']` is empty (i.e., when SSR did not populate `@inertiaHead`)**, OR consolidate ownership so every SSR response contains **strictly ONE** `<title>`, **ONE** `<link rel="canonical">`, **ONE** `<meta name="description">`, **ONE** `<meta name="robots">`, and **ONE** page-level JSON-LD block. Verify with feature tests in `tests/Feature/PublicPageSeoHeadTest.php`.

3. **Fix AdSense Script Loading for `Mediapartners-Google` & Site Review Verification:**
   - Currently, `app.blade.php` withholds `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8709269992599634` inside JS until a visitor manually clicks "Allow ads & analytics" (`consentState === 'accepted'`).
   - Google's AdSense review crawler (`Mediapartners-Google` / `Google-Display-Ads-Bot`) NEVER clicks custom React cookie banners. As a result, when Google crawls `roznamcha.pk`, `adsbygoogle.js` never loads and ad requests never fire.
   - **Action:**
     - Keep `<meta name="google-adsense-account" content="{{ $adsenseClientId }}">` in `<head>`.
     - When `data_get($page ?? [], 'props.pagePolicies.adsAllowed') === true`, include the standard `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ $adsenseClientId }}" crossorigin="anonymous"></script>` in `<head>` alongside Google Consent Mode v2 (`window.gtag('consent', 'default', ...)`), so Google's crawler can verify the live tag on eligible content pages while Consent Mode v2 governs storage behavior.
     - Prepare integration support for Google's certified Privacy & Messaging CMP (TCF v2.2) configurable directly from the AdSense console rather than blocking `adsbygoogle.js` behind a non-TCF local cookie check.

---

### TASK 2: FIX `resources/js/Components/Ads/AdContainer.jsx` & `resources/js/Pages/Public/Blog/Show.jsx` (INVALID AD SLOTS & EMPTY PLACEHOLDERS)

1. **Stop Passing Invalid String Slugs to `data-ad-slot`:**
   - In `resources/js/Pages/Public/Blog/Show.jsx` (lines 125 and 134), `<AdContainer slot="blog-in-article" ... />` and `<AdContainer slot="blog-after-content" ... />` pass non-numeric strings as `data-ad-slot`.
   - Google AdSense requires a 10-digit numeric slot ID (e.g., `^\d{10}$`). Passing `"blog-in-article"` causes `adsbygoogle.js` to fail with `400 Bad Request` and leaves two giant empty 280px white boxes labeled `ADVERTISEMENT` on every blog post (including one *above* the main article text!).
   - **Action:**
     - In `resources/js/Components/Ads/AdContainer.jsx`, validate that `slot` matches `/^\d{8,12}$/` (and comes from a configured numeric slot ID in `config('services.adsense.slots')` or props). If `slot` is not a valid numeric AdSense slot ID, `AdContainer` MUST return `null` and render **ZERO** DOM wrapper/placeholder (`<aside>Advertisement</aside>` must NOT render when no valid numeric slot is configured).
     - In `resources/js/Pages/Public/Blog/Show.jsx`, remove the `<AdContainer>` that sits *above* the `<section className="post-content">` body! Placing a 280px ad container after the boilerplate "How To Use This Guide" box and *before* the actual article body pushes the real publisher content below the fold on mobile devices, violating Google's Above-the-Fold Ad Placement Policy (`https://support.google.com/adsense/answer/1346295?hl=en-GB`).

2. **Update `adsAllowed` Policy in `app/Http/Middleware/HandleInertiaRequests.php`:**
   - Remove `'public.blog.index'` and `'public.features'` from `adsAllowed()`! Under Google Publisher Policies (`https://support.google.com/publisherpolicies/answer/11112688?hl=en-GB`), archive/index pages (`/blog`) and product feature overview directories (`/features`) are navigational hub screens and should NOT serve ads.
   - Allow ads ONLY on substantive long-form editorial articles (`public.blog.show` where the post is indexed and has >= 1,000 words) and the 5 comprehensive interactive public calculator pages (`public.tools.ration-cost-estimator`, `public.tools.monthly-household-budget-calculator`, `public.tools.school-fees-planner`, `public.tools.electricity-bill-estimator`, `public.tools.solar-net-metering-roi-calculator`) plus `public.features.expense-tracker-pakistan`.
   - Also add `'public.editorial-policy'` and `'public.methodology'` to `publicRouteNames()` in `HandleInertiaRequests.php` so Ziggy never strips them on public pages.

---

### TASK 3: FIX `public/robots.txt`, `BuildsPublicSeo.php`, AND SITEMAP/INDEXING LEAKS

1. **Fix `public/robots.txt` User-Agent Precedence Bug & Allow `noindex` Discovery:**
   - Currently, `public/robots.txt` defines separate blocks for `User-agent: Googlebot` and `User-agent: Mediapartners-Google` with only `Allow: /`. Per Google's `robots.txt` specification, `Googlebot` ignores the `User-agent: *` block entirely when a `User-agent: Googlebot` block exists!
   - Furthermore, `/login` is currently indexed in Google Search (`https://roznamcha.pk/login`) because of this bug, AND blocking `/login` in `robots.txt` prevents `Googlebot` from reading the `<meta name="robots" content="noindex, nofollow">` tag on `/login` and `/register` to drop them from the index!
   - **Action:** Rewrite `public/robots.txt` to use a clean, unified rule set that allows `Googlebot` to see the `noindex, nofollow` meta tags on `/login`, `/register`, and `/forgot-password` while blocking private authenticated paths (`/panel/`, `/dashboard/`, `/profile/`, `/onboarding/`, `/admin/`, `/api/`, `/ai/`, `/guest/`):
     ```txt
     User-agent: *
     Allow: /
     Disallow: /panel/
     Disallow: /dashboard
     Disallow: /profile
     Disallow: /onboarding
     Disallow: /admin/
     Disallow: /api/
     Disallow: /ai/
     Disallow: /guest/
     Disallow: /events

     User-agent: Mediapartners-Google
     Allow: /

     Sitemap: https://roznamcha.pk/sitemap.xml
     Sitemap: https://roznamcha.pk/templates-sitemap.xml
     ```

2. **Fix Duplicate Match Keys in `app/Http/Controllers/Concerns/BuildsPublicSeo.php`:**
   - `BuildsPublicSeo.php` currently defines `'login'` and `'register'` **twice** in the `match ($key)` statement (once at lines 106–128 with `'robots' => 'noindex, nofollow'`, and again at lines 206–224 without `'robots'`).
   - **Action:** Delete the duplicate `'login'` and `'register'` arms at lines 206–224. Also add an `'offline'` and `'forgotPassword'` entry with `'robots' => 'noindex, nofollow'`, and ensure `ForgotPasswordController::create` passes `'seo' => $this->publicSeo('forgotPassword')` so `/forgot-password` renders `<meta name="robots" content="noindex, nofollow">`. Also add an HTTP header `X-Robots-Tag: noindex, nofollow` middleware or response header on `/login`, `/register`, `/forgot-password`, and `/offline`.

3. **Keep Programmatic Doorway Routes & Thin Categories De-Indexed:**
   - Verify `config/roznamcha_seo.php` keeps `petrol`, `electricity`, and `ration` in `noindex_page_types`, keeps all 4 template slugs in `noindex_template_slugs` (or upgrades them to 1,000+ word public guides), and keeps `BlogPublicController::category()` returning `noindex,follow` on thin category archives so thin tag/category pagination never pollutes the Google index.
   - In `app/Http/Controllers/SeoSitemapController.php`, add `public.cookie-policy` to `staticUrls()`.

---

### TASK 4: PURGE LINK SPAM, OFF-TOPIC ARTICLES, STALE YMYL CLAIMS & UPGRADE THIN BLOG POSTS

This is the core **Content Quality & YMYL E-E-A-T** remediation required to pass human and automated AdSense review:

1. **Purge `sarkaritayari.pk` Link Spam & Off-Topic Seeder Content:**
   - `deploy_promo_and_posts.py` and `database/seeders/InjectSarkariTayariLinksSeeder.php` injected promotional backlinks to `https://sarkaritayari.pk` across 8 blog posts (still visible live on `https://roznamcha.pk/blog/pakistani-family-monthly-expense-control`) and created `beating-inflation-in-pakistan-household-budgeting-income-upgrades`.
   - Also, `InsertChromebookSeeder.php` and `InsertSovereignCloudSeeder.php` introduced off-topic tech/cloud articles (`pakistan-sovereign-cloud-ai-trade-ecosystem-2026`, `pakistan-assembling-google-chromebooks-2026`), and stale production SSR caches still show `Sovereign Cloud & AI Guide` in the footer of `/about` and `/login`.
   - **Action:**
     - Create a database cleanup migration or idempotent seeder (`Database\Seeders\AdsenseContentRemediationSeeder`) that:
       a) Strips all injected `<p>...<a href="https://sarkaritayari.pk"...>...</a></p>` paragraphs from every `BlogPost` record in the database.
       b) Deletes or marks as `draft` (and adds to `config/blog_cleanup.php` `remove_slugs`) all off-topic / link-insertion posts, including `beating-inflation-in-pakistan-household-budgeting-income-upgrades`, `pakistan-sovereign-cloud-ai-trade-ecosystem-2026`, `pakistan-assembling-google-chromebooks-2026`, and any unverified news/entertainment/sports posts generated by `publisher_agent.py`.
       c) Delete `resources/js/Components/SarkariTayariPromoCard.jsx` and remove its `<SarkariTayariPromoCard />` import/usage from `RationCostEstimator.jsx`, `ElectricityBillEstimator.jsx`, `MonthlyHouseholdBudgetCalculator.jsx`, and `SeoLandingPage.jsx`.
       d) Delete `database/seeders/InjectSarkariTayariLinksSeeder.php`, `InsertChromebookSeeder.php`, `InsertSovereignCloudSeeder.php`, `deploy_promo_and_posts.py`, and `publish_inflation_post.php`.

2. **Fix Factually Obsolete YMYL Claims (Utility Stores Corporation Closure):**
   - Multiple calculators (`RationCostEstimator.jsx`, `MonthlyHouseholdBudgetCalculator.jsx`) and blog posts (`ExpansionSeeder.php` — `pakistani-family-monthly-expense-control`, `best-monthly-budget-50000-salary-pakistan-2026`, `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`) still advise Pakistani families to register their CNIC at the **Utility Stores Corporation (USC)** for subsidized atta/ghee/sugar, despite USC operations and federal subsidies having been wound down by the Government of Pakistan in 2025–2026.
   - **Action:** Update all calculator copy (`RationCostEstimator.jsx`, `MonthlyHouseholdBudgetCalculator.jsx`, `config/ration_cost_estimator.php`) and blog posts to replace active USC subsidy claims with accurate 2026 procurement comparisons: **Wholesale Mandi (Ghalla Mandi / Jodia Bazaar / Akbari Mandi) bulk purchasing vs. provincial Ramzan/targeted BISP cash-transfer relief vs. Tier-1 supermarkets vs. neighborhood Kiryana credit pricing**.

3. **Upgrade Every Publicly Indexed Blog Post to 1,200–1,800+ Words of Original, Data-Backed Pakistani Finance Analysis:**
   - Currently, the posts in `ExpansionSeeder.php` and `RewriteBatchOneSeeder.php` through `RewriteBatchSevenSeeder.php` are only **320 to 620 words long** (e.g., `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025` is ~410 words / "3 min read"; `RewriteBatchSevenSeeder.php` posts are ~330 words) and lack HTML comparison tables, worked PKR mathematical examples, or primary regulatory citations.
   - Worse, every blog post in `resources/js/Pages/Public/Blog/Show.jsx` renders the exact same 3-card boilerplate block (`How To Use This Guide: Planning aid, not a fixed rule...`) at the top of the page. When a blog post body is only 350–500 words, over 45% of the visible text on the page is site-wide boilerplate, triggering Google's **Replicated / Low-Value Content** classifier!
   - **Action:**
     - In `resources/js/Pages/Public/Blog/Show.jsx`, remove or condense the repetitive 3-card `How To Use This Guide` boilerplate block above the article so the unique article content starts immediately above the fold right after the header.
     - Consolidate and expand the core flagship public blog inventory (minimum 20–25 indexed articles) so that **ZERO** publicly visible (`index,follow`) blog posts have fewer than **1,200 words**. Every indexed article mustfollow the flagship standard demonstrated in `build_update_script.py` (like the PSEB Freelancer Tax guide and EV vs 70cc TCO guide):
       * Minimum **1,200 to 1,600+ words** of deep, Pakistan-specific analytical prose.
       * At least **one structured `<table>`** comparing real PKR scenarios, tariff slabs, tax brackets, or city-level wholesale vs. retail costs.
       * Explicit inline citations/links to primary Pakistani institutions (**NEPRA** tariff determinations, **PBS** Weekly SPI / Monthly CPI bulletins, **SBP** monetary policy/AMA circulars, **FBR** Income Tax Ordinance 2001 sections, **CDNS** profit rates).
       * A post-specific **4–5 question FAQ section** (`<h2>Frequently Asked Questions</h2>`) tailored to that exact topic.
     - Any post in the database under 1,000 words that has not yet been expanded must be set to `noindex,follow` (via `config/blog_cleanup.php`) and excluded from `sitemap.xml` and `/blog` archive listings until expanded.

---

### TASK 5: REPOSITORY HYGIENE & PRODUCTION DEPLOYMENT BUNDLE

1. **Clean Up Root Directory Temporary Scripts:**
   - The project root currently contains over 90 ad-hoc debug and FTP upload scripts (`check_*.php`, `temp_*.php`, `upload_*.py`, `run_seeder_*.php`, `test_*.php`, `delete_*.py`). If any of these are uploaded to `public_html` or `rozapp`, they create severe security and crawl hazards.
   - **Action:** Move any needed maintenance scripts into `scripts/archive/` (outside `public/`) and delete the root `temp_*.php`, `check_*.php`, and `upload_*.py` clutter. Ensure `.deployignore` excludes all test/scratch/seeder-runner files.

2. **Compile & Verify Locally Before Any Production Push:**
   - Run `npm run build` (ensuring both Vite client assets in `public/build` AND the Inertia SSR bundle in `bootstrap/ssr/ssr.mjs` are freshly compiled with `https://roznamcha.pk` production URLs, never `127.0.0.1:8002`).
   - Run `php artisan test` and write a new feature test `tests/Feature/AdsenseReadinessAuditTest.php` that asserts:
     1. Every public tool page and blog page renders **at most 1** `<title>`, **1** `<link rel="canonical">`, and **0** duplicate `<noscript><article>` blocks.
     2. `/login`, `/register`, and `/forgot-password` return `<meta name="robots" content="noindex, nofollow">`.
     3. `public/robots.txt` does not override `Disallow` rules for `Googlebot` and does not block `/login` or `/register` from reading `noindex`.
     4. `AdContainer` renders nothing (`null`) when given a non-numeric slot string like `"blog-in-article"`.
     5. `sitemap.xml` contains zero `noindex` URLs, zero `/templates/{slug}` thin URLs, and zero `/petrol-price-*` doorway URLs.
```
