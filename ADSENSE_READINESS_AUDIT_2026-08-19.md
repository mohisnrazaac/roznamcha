# Roznamcha Google AdSense Approval-Readiness Audit

**Audit date:** 19 August 2026 (Asia/Karachi)  
**Scope:** local Laravel/Inertia repository plus `https://roznamcha.pk` production responses  
**Verdict:** **NOT READY**  
**Readiness score:** **2.5 / 10**

This is a policy and quality risk assessment, not a guarantee or prediction of Google's decision. Google performs its own review and may consider signals unavailable to this audit.

## Technical summary

Roznamcha has a legitimate product, a named founder, useful household-planning tools, server-rendered public content, working core sitemaps, a syntactically valid `ads.txt`, and a passing local test/build baseline. Those strengths are outweighed by several approval blockers:

1. materially inaccurate or obsolete financial/government content remains indexed;
2. public navigation promises template previews but every detail page redirects guests to login;
3. live SSR emits `127.0.0.1:8002` links and exposes the entire admin/private route manifest;
4. HTTP, HTTPS, www and non-www all serve independently instead of redirecting to one origin;
5. the cookie banner is not a certified CMP and does not control Google Analytics/Clarity/ad-tag loading;
6. privacy disclosures omit IP addresses and make unverified security/storage claims;
7. production returned LiteSpeed 503s under five simultaneous requests;
8. all 20 indexed articles render duplicate BlogPosting schema, most render duplicate H1s, and one referenced OG image is 404;
9. calculator rates and assumptions are undated/unsourced, with known inaccurate Utility Stores and electricity-tariff statements.

Google prohibits ads on screens without publisher content or with low-value content and requires clear cookie/web-beacon/IP disclosures. It also requires a Google-certified TCF CMP for personalized ads in the EEA, UK and Switzerland. See [Google Publisher Policies](https://support.google.com/adsense/answer/10502938), [screens without publisher content](https://support.google.com/publisherpolicies/answer/11112688), and [Google's certified-CMP requirement](https://support.google.com/adsense/answer/13554020).

## Scope and method

- Mapped all 133 Laravel routes, route middleware, public controllers, sitemap generators, blog model/config, templates, calculators, SEO head generation, SSR shell, cookie banner, privacy page, AdSense components and publisher identifiers.
- Downloaded `robots.txt`, `ads.txt`, `sitemap.xml`, and `templates-sitemap.xml`; the primary sitemap exposed 36 unique URLs (16 core pages plus 20 articles). The template sitemap exposed only `/templates`.
- Fetched production pages with desktop, mobile, Googlebot, Mediapartners-Google and Google-Display-Ads-Bot user agents.
- Parsed live HTML for status/final URL, redirects, timing, response size, title, description, robots, canonical, H1s, approximate visible words, links, images and JSON-LD.
- Downloaded and reviewed all 20 published articles and checked high-risk claims against primary official sources.
- Tested all four template detail links, all four origin variants, first-party assets discovered in crawled pages, and representative authenticated/public boundaries.
- Ran the local PHPUnit suite and production Vite/SSR build.

### Limitations

- AdSense and Search Console account screens were not available, so account-side site verification, CMP configuration, auto-ads exclusions, policy-center history and crawl statistics could not be confirmed.
- No certified CMP geo test was possible because no CMP was detected in code or HTML.
- Lighthouse was not installed locally. Performance findings use response timing/size and bundle output, not a claimed Lighthouse score.
- Local MySQL was unavailable (`SQLSTATE[HY000] [2002] No such file or directory`), so production HTML and sitemaps—not the local database—were the article inventory of record.

## Blocking findings

### B1 — Indexed Utility Stores article is factually obsolete

**URL:** `https://roznamcha.pk/blog/utility-store-vs-open-market-price-comparison-2026-pakistan`

**Evidence:** The article says Utility Stores operate under government subsidies, publishes a 2026 price table, promises BISP discounts of 15–25%, claims Rs 4,000–6,000 monthly savings, and says Utility Store ghee is safe. It provides no external source. The Pakistan Privatisation Commission states that USC operations have already ceased and its liabilities exceed its assets. The FY2026–27 federal budget also includes a line for closure of USC. Sources: [Privatisation Commission](https://www.privatisation.gov.pk/NewsDetail/ZjE3MGVhYjQtZTAwNC00NjdmLTk3OTEtY2JmNGZmYTc3MTg2), [Federal Budget 2026–27](https://www.finance.gov.pk/budget/budget_2026_27/Budget_in_Brief.pdf).

**Risk:** misleading government/financial information, demonstrably stale “2026” content, and unsupported health/savings claims.

**Fix:** immediately unpublish or return 410 and remove from sitemap/internal links. If retained as history, rewrite around USC closure, remove all current prices/discounts/health claims, date every fact, cite primary sources, and noindex until independently reviewed.

**Local sources:** `resources/js/Pages/Public/Tools/RationCostEstimator.jsx` and `resources/js/Pages/Public/Tools/MonthlyHouseholdBudgetCalculator.jsx` also still promote Utility Store/subsidized rates and must be corrected.

### B2 — Fuel quota/subsidy articles turn an unapproved concept into actionable guidance

**URLs:**

- `https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026`
- `https://roznamcha.pk/blog/pakistan-petrol-price-april-2026-rs458-budget-guide`
- `https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026`
- `https://roznamcha.pk/blog/petrol-price-pakistan-2026-monthly-household-impact`

**Evidence:** Copy and metadata promise a mobile-app registration guide and subsidy, describe CNIC/vehicle registration, voucher generation, 20–30 litre quotas, 24,000 pump devices, a Rs 100/litre discount, and prices of Rs 458.40 petrol/Rs 520.35 diesel. The same pages concede cabinet approval and launch were pending. The older quota article still says prices are reviewed “weekly” and projects 1 April prices. No official source is linked on the quota article. Official 2026 petroleum notifications are date-specific; for example, the Petroleum Division published a notification dated 26 June 2026, demonstrating why an April article cannot be presented as “today” without archival framing: [Petroleum Division notification](https://petroleum.gov.pk/SiteImage/Misc/files/Petrol%20Notification-1%2026_6_2026.pdf).

**Risk:** readers may act on a nonexistent or changed government program; obsolete price pages are framed as current; multiple overlapping pages amplify the error.

**Fix:** unpublish/noindex all four now. Rebuild a single dated fuel-price explainer only from the applicable official notification, with effective start/end dates, an archive banner, and no forecast unless explicitly labeled. Do not publish registration instructions before an official app, eligibility notice and launch date exist.

### B3 — Template navigation is misleading and login-gated

**URLs:** `/templates/student-budget`, `/templates/50k-salary-survival-guide`, `/templates/100k-family-budget`, `/templates/joint-family-budget`

**Evidence:** `/templates` is indexed and says “Guests can preview” and “Preview first, save later.” Each of the four “Preview template” links returns a 302 to `/login?return_to=...`, then 200 login. `robots.txt` disallows `/templates/`, and `templates-sitemap.xml` lists only `/templates`.

**Risk:** deceptive navigation and public-content claims; a crawler following prominent navigation reaches login instead of the promised content.

**Fix:** either make all detail previews genuinely public, substantial and ad-free, or change every promise/CTA to “Login required,” remove preview language, and do not present them as public content. Keep downloads/saves authenticated. Add integration tests asserting guest behavior matches visible labels.

**Local sources:** `routes/web.php`, `app/Http/Controllers/TemplateController.php`, `resources/js/Pages/Templates/Index.jsx`, `resources/js/Pages/Templates/Show.jsx`, `app/Http/Controllers/TemplateSitemapController.php`, `public/robots.txt`.

### B4 — Consent implementation is not AdSense-ready

**Evidence:** `CookieConsent.jsx` stores only `accepted` or `declined` in localStorage. It is not a Google-certified CMP, produces no IAB TCF string, has no vendor/purpose controls, and does not change tag behavior. `resources/views/app.blade.php` loads Google Analytics and Microsoft Clarity before any choice and conditionally loads the global AdSense script independent of the stored choice.

**Risk:** noncompliance for EEA/UK/Switzerland traffic and a misleading decline action. Google says a certified CMP integrated with TCF is required for personalized ads in those regions; consent for device storage is required even for non-personalized ads. Sources: [CMP requirement](https://support.google.com/adsense/answer/13554020), [TCF integration](https://support.google.com/adsense/answer/9804260).

**Fix:** implement Google Privacy & Messaging or another Google-certified CMP; default ad/analytics storage to denied where required; prevent ad/analytics tags until the appropriate signal; provide granular revoke/change controls; test EEA, UK and Swiss geo behavior.

**Local sources:** `resources/js/Components/CookieConsent.jsx`, `resources/views/app.blade.php`.

### B5 — Privacy policy is incomplete and contains unverified promises

**URL:** `https://roznamcha.pk/privacy-policy`

**Evidence:** It mentions cookies and web beacons but not IP addresses/other identifiers as a result of ad serving. It calls ad data “non-personal,” which is too categorical. It does not explain CMP choices, retention, controller identity/legal basis, international transfers, children, complaint/escalation, or how to change consent. It claims sensitive fields are encrypted at rest, role-based household invitations, Pakistan-friendly backup zones, WhatsApp alerts, and machine-readable export capabilities without matching evidence in the audited code.

**Risk:** Google expressly requires cookies, web beacons and IP-address/identifier disclosure; inaccurate privacy promises create trust and legal risk. [Google Publisher Policies](https://support.google.com/adsense/answer/10502938).

**Fix:** replace marketing assurances with verified practices; add IP/identifier disclosure and Google's partner-data link; document actual retention, processors, transfers, rights and contact identity; align the page with the implemented CMP and product behavior.

**Local source:** `resources/js/Pages/Public/PrivacyPolicy.jsx`.

### B6 — Production origin canonicalization is broken

**Evidence:** `http://roznamcha.pk/`, `https://www.roznamcha.pk/`, and `http://www.roznamcha.pk/` each returned HTTP 200 with zero redirects; only the requested origin changed. The canonical tags point at `https://roznamcha.pk`, but insecure and duplicate origins remain directly usable.

**Risk:** duplicate crawl surfaces, split signals, insecure HTTP sessions, inconsistent cookies and analytics.

**Fix:** edge-level permanent redirects in one hop from every HTTP/www variant to `https://roznamcha.pk$request_uri`; enable HSTS only after confirming every subdomain is HTTPS-ready; add automated redirect assertions.

### B7 — Live SSR contains localhost links and overexposes route data

**Evidence:** every downloaded article included `http://127.0.0.1:8002/blog` and `/blog/rss.xml`; category-bearing pages included localhost category URLs. Login included `http://127.0.0.1:8002/forgot-password`. Live HTML also serialized the complete Ziggy route table, including admin users, AI logs, blog administration, private household CRUD, password and maintenance route names.

**Risk:** broken navigation, crawl errors, professional-quality failure, and unnecessary disclosure of private/admin application structure.

**Fix:** generate production routes with the production base URL, clear caches/restart SSR after deployment, use relative URLs for internal navigation, and configure Ziggy route groups to expose only routes needed by each frontend surface.

**Local sources:** `resources/js/ziggy.js`, `resources/views/app.blade.php`, route calls in blog/auth components, `routes/web.php`, `vite.config.js`, SSR deployment configuration.

## High-priority findings

### H1 — Financial, tax, banking and investment articles are unsourced or stale

**Affected URLs and action:**

- `/blog/understanding-nepra-tariff-slabs-solar-net-metering-pakistan` — **noindex/rewrite.** It gives undated GST/tax thresholds, says all 301 units use one bracket, claims a 5 kW net-metering minimum and 2.5–3 year ROI, and describes net-off/rollover rules without citing the applicable DISCO tariff or NEPRA amendments. NEPRA recorded amendments in December 2025; the article must cite the current regulation and tariff decisions. [NEPRA legal index](https://nepra.org.pk/Legal.php).
- `/blog/how-to-file-tax-returns-salaried-person-pakistan` — **noindex/rewrite.** It gives fixed filer/non-filer tax rates and legacy form-navigation instructions. Current FBR guidance says salaried persons eligible for the simplified process use Declaration 114(I), and successful filing requires both Return of Income and Wealth Statement to move to Completed Task. [FBR filing guidance](https://www.fbr.gov.pk/categ/file-income-tax-return/51147/80860/71160).
- `/blog/asaan-mobile-account-open-digital-account-pakistan` — **noindex/rewrite.** It states Rs 500k balance, Rs 50k daily and Rs 200k monthly limits without a dated SBP circular and confuses AMA with general Asaan accounts. Link the current SBP AMA guide and bank-specific terms. [SBP AMA](https://www.sbp.org.pk/our-operations/initiatives/asaan-mobile-account).
- `/blog/sadapay-nayapay-jazzcash-best-mobile-wallet-pakistan` — **noindex/rewrite.** Fees, free cards, withdrawals, international charges and UI characterizations are undated and have no provider/SBP sources.
- `/blog/best-halal-savings-accounts-mutual-funds-pakistan-2026` — **noindex/rewrite.** It asserts 16–20% expected returns, “principal highly secure,” fixed tax rates and named “top picks” without dated fund manager reports, SECP risk classifications or a proper investment disclaimer. Software-architect authorship is not sufficient expertise for product recommendations.

**Fix pattern:** show reviewed/modified dates; cite primary regulator/provider documents inline; state the precise effective period; separate facts from examples; add financial/tax disclaimers; schedule quarterly review; automatically noindex on expiry until reviewed.

### H2 — Calculator rates are undated, unsourced and partly inaccurate

**Guest access:** local feature tests confirm all four tools load for guests and three POST calculators return results. Ration estimation is client-side and public. Error UI exists.

**Problems:**

- `config/public_tools.php` contains hard-coded electricity slabs, 17% GST, last-year base rates and fixed placeholders without source/effective date.
- electricity copy says crossing 200/300 units recalculates the entire bill, while controller logic applies progressive marginal slabs; the explanation and formula contradict each other.
- `slab_rates` DB data has no provenance/effective-date evidence in the UI.
- ration benchmarks are fixed, not live, and still refer to Utility Store rates/subsidies after USC ceased operations.
- the school planner defaults to a 12% inflation buffer without a dated source.
- the monthly budget page calls 15% savings “ideal” and promotes Utility Store subsidies without evidence.

**Fix:** add source URL, jurisdiction/DISCO, effective-from/to and last-reviewed metadata to every rate; display the exact formula and excluded bill line items before calculation; reconcile controller math with prose; remove USC claims; clearly label user-entered planning buffers rather than national facts.

**Local sources:** `config/public_tools.php`, `config/ration_cost_estimator.php`, `app/Http/Controllers/PublicTools/*`, `resources/js/Pages/Public/Tools/*`.

### H3 — Production reliability can block crawlers

**Evidence:** five simultaneous homepage requests returned 503 for desktop, mobile and Google-Display-Ads-Bot while Googlebot and Mediapartners returned 200. Google-Display-Ads-Bot returned 200 when retested alone, so this is concurrency/capacity instability rather than deterministic bot blocking. Sitemap page responses ranged roughly 1.4–18.6 seconds during the audit.

**Fix:** inspect LiteSpeed/PHP worker and process limits, origin CPU/memory, SSR timeouts, DB latency and cache hit rate; add uptime/concurrency monitoring; make public HTML cacheable where safe; test a small controlled concurrency profile before submission.

### H4 — AdSense verification and placement controls are incomplete

**Evidence:** publisher ID is internally consistent: `pub-8709269992599634` in `ads.txt` and `ca-pub-8709269992599634` in both ad components. `ads.txt` is HTTP 200 and syntactically valid. Production HTML did not expose an AdSense script/meta verification method during sampled requests, and account-side verification was unavailable. The AdSense loader in `app.blade.php` is global when `ADSENSE_CLIENT_ID` is set; if auto ads are enabled, login, registration, errors, private dashboards and admin pages are not excluded in code. The only explicit ad unit located is on template detail pages, which are currently login-gated/noindex.

**Fix:** confirm the selected ownership method in AdSense; gate the loader to an explicit allowlist of substantial public pages; keep login/register/errors/admin/private/empty/noindex pages ad-free; disable personalized targeting on any surface containing private household finance; add response tests for script absence/presence.

## Medium-priority findings

### M1 — Duplicate structured data and headings

All 20 articles rendered two BlogPosting JSON-LD objects. Most rendered two H1 elements; bilingual fuel articles rendered three. CSS hides H1s inside article content, but hidden duplicate semantics remain in the server HTML. `resources/views/app.blade.php` emits page JSON-LD and `@inertiaHead`, while the React head emits it again.

**Fix:** designate one JSON-LD owner, normalize stored article content by demoting/removing embedded H1s, and enforce exactly one visible/semantic H1 in tests.

### M2 — Broken social image

`https://roznamcha.pk/storage/blog/og-images/5x1ji3eDcXRFRykvKQkdndzoBiuLqhFHs8YwRtqL.png` returned 404 and is referenced by `/blog/best-monthly-budget-50000-salary-pakistan-2026` structured data.

**Fix:** restore the asset or replace the database image path; add sitemap/article asset validation.

### M3 — Duplicate shell footer and oversized route payload

The React public layout renders its own footer and `resources/views/app.blade.php` appends another Facebook footer after `@inertia`. HTML responses are roughly 80–128 kB before assets, partly because every page serializes translations, internal link maps and all Ziggy routes. Production client JS is about 327.5 kB raw/105.4 kB gzip; SSR bundle is about 1.35 MB and includes a 1.165 MB `DeleteUserForm` chunk.

**Fix:** remove the duplicate Blade footer, scope shared props/routes to the current surface, investigate the DeleteUserForm dependency graph, and remeasure with Lighthouse after deployment.

### M4 — Article corpus is highly templated and overlapping

Every article receives identical “How To Use This Guide,” author-note and next-steps blocks. Several articles overlap heavily on inflation, cost of living, essential expenses and monthly budgeting; four fuel pages repeat the same event. This does not make the content automatically invalid, but it dilutes distinct value and creates a low-value/automatically-expanded appearance.

**Fix:** consolidate overlapping posts into a smaller number of flagship guides, remove boilerplate that does not add article-specific value, and require a unique question, original calculation/data, primary citations and editorial review before indexing.

## Low-priority findings

- `caniuse-lite` is 10 months out of date; update and rerun cross-browser checks.
- About page names Mohsin and claims 16 years as a software architect, but financial/tax/investment pieces need domain review and reviewer identity.
- Article modified dates often equal publication dates even when copy says “updated weekly/live.” Do not show dynamic update claims without an actual editorial update record.
- First-party images discovered in rendered pages had alt text, but repeat this check after restoring the missing OG image and adding article media.
- The service worker can preserve stale navigation/assets; verify cache invalidation and error/offline behavior after each deployment.

## Page disposition

### Unpublish/410 immediately

- `utility-store-vs-open-market-price-comparison-2026-pakistan`
- `pakistan-fuel-quota-system-petrol-price-april-2026`
- `pakistan-petrol-price-april-2026-rs458-budget-guide`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`
- `petrol-price-pakistan-2026-monthly-household-impact`

### Noindex until rewritten and independently reviewed

- `understanding-nepra-tariff-slabs-solar-net-metering-pakistan`
- `how-to-file-tax-returns-salaried-person-pakistan`
- `asaan-mobile-account-open-digital-account-pakistan`
- `sadapay-nayapay-jazzcash-best-mobile-wallet-pakistan`
- `best-halal-savings-accounts-mutual-funds-pakistan-2026`
- `school-fee-inflation-pakistan-2026` (date/source every inflation figure)
- `inflation-household-spending-pakistan-2026`
- `inflation-household-budget-pakistan-2026`
- `cost-of-living-pakistan-2026-monthly-budget`
- `pakistani-household-essential-expenses-2026`

### Keep indexed after technical cleanup and light editorial review

- `ghar-ka-monthly-budget`
- `pakistani-family-monthly-expense-control`
- `reduce-kitchen-inflation-ration-buying-habits-pakistan`
- `best-monthly-budget-50000-salary-pakistan-2026` (fix missing image and date all sample prices)
- `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025` (update title/year or make evergreen)

### Public non-article pages

- Keep homepage, about, contact, terms, privacy, features, blog index and four tools only after blockers above are fixed.
- Keep `/templates` indexed only if visible claims match guest behavior; otherwise rewrite or noindex.
- Keep login/register/private/admin/error/offline pages noindex and ad-free.

## Pre-submission checklist

- [ ] Remove/noindex all inaccurate and time-expired articles; purge them from sitemap, RSS and internal links.
- [ ] Correct USC references across tools and articles.
- [ ] Verify current fuel prices/programs only from dated official notifications.
- [ ] Rewrite NEPRA/FBR/banking/investment pieces with primary sources and qualified review.
- [ ] Make template previews public or remove every preview promise.
- [ ] Replace localhost SSR links and restrict Ziggy route exposure.
- [ ] Redirect HTTP/www to canonical HTTPS non-www in one hop.
- [ ] Implement and test a Google-certified CMP with TCF v2.3 and consent-mode behavior.
- [ ] Rewrite privacy disclosures to include IP addresses/identifiers and only verified product/security practices.
- [ ] Confirm AdSense ownership verification in the AdSense account.
- [ ] Allowlist AdSense script/ad units to substantial public pages; exclude auth/private/error/empty/noindex pages.
- [ ] Add effective dates, sources, formulas and exclusions to calculator rates.
- [ ] Remove duplicate BlogPosting schema, duplicate H1s and duplicate footer.
- [ ] Restore/replace the 404 OG image.
- [ ] Fix 503/concurrency instability and slow responses.
- [ ] Run full tests, production build, structured-data validation, link crawl, mobile accessibility and Lighthouse after deployment.
- [ ] Submit fresh sitemaps in Search Console and inspect representative URLs.
- [ ] Wait for recrawl/index cleanup; do not request AdSense review until production—not only local code—passes.

## Commands and results

- `php artisan route:list --except-vendor` — 133 routes mapped.
- `composer run test` — **119 tests passed, 1,118 assertions**, 2.74 s.
- `npm run build` — **passed**; Vite client and SSR builds completed. Warning: browserslist data 10 months old.
- `curl` user-agent tests — isolated Googlebot, Mediapartners and Google-Display-Ads-Bot requests returned 200; concurrent five-agent test exposed transient 503 capacity failures.
- sitemap crawl — 36 unique primary URLs; template sitemap contains only `/templates`; all 20 article URLs downloaded for content review.
- origin tests — all HTTP/HTTPS/www/non-www variants returned 200 with no redirect.
- template tests — all four detail URLs redirected to login.
- asset checks — app JS/CSS/icons/manifest were 200; one article OG image was 404.
- local database inventory — blocked because local MySQL socket/server was unavailable.
- Lighthouse — not run because no local Lighthouse executable was installed; no score is claimed.

## Recommended order of work

1. Remove inaccurate indexed content and misleading template claims.
2. Fix canonical redirects, localhost links, route leakage and crawler reliability.
3. Implement CMP/privacy/ad allowlisting.
4. Correct calculators and rewrite high-risk financial content.
5. Clean schema/H1/footer/asset issues, deploy, then perform a fresh production crawl and Lighthouse run.

