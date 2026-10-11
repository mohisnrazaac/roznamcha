# Deployment and Cache Invalidation Runbook

This document details how deployments, cache invalidation, and release tracking work across **roznamcha.pk**.

---

## 1. Public HTML & Data Cache Layers

| Cache Layer | File / Config Path | What It Caches | Default TTL | Invalidation Method |
|---|---|---|---|---|
| **Inertia Node SSR In-Memory Daemon** | `/opt/alt/alt-nodejs20/root/usr/bin/node bootstrap/ssr/ssr.js` running on `127.0.0.1:13714` | In-memory V8 compilation of SSR component tree (`bootstrap/ssr/ssr.js`) and pre-rendered HTML payloads | **Forever** (persists in process memory until killed) | Kill old process on port 13714 (`fuser -k 13714/tcp`) and respawn with `nohup` |
| **LiteSpeed Web Server Cache (LSCache)** | Server-level cache in `/home/roznamch/lscache` | Full HTTP responses that contain `Cache-Control: public` and `s-maxage` headers | 3,600s (1 hour) | Web runner executing cache purge signals or LSCache purge script |
| **Public Cache Headers Middleware** | [`app/Http/Middleware/PublicCacheHeaders.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Middleware/PublicCacheHeaders.php) | Instructs downstream proxies and browsers to cache GET responses for public tools and sitemaps | `public, max-age=3600, s-maxage=3600` | Bypass or flush upstream proxy/browser cache |
| **Core Search Sitemap** | [`app/Http/Controllers/SeoSitemapController.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/SeoSitemapController.php) | Pre-rendered `/sitemap.xml` view stored under key `BlogPost::publicSitemapCacheKey()` (`sitemap:xml:v5`) | 24 hours (`config('roznamcha_seo.cache.sitemap_ttl_hours')`) | `php artisan cache:purge-public` |
| **Template Search Sitemap** | [`app/Http/Controllers/TemplateSitemapController.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/TemplateSitemapController.php) | Pre-rendered `/templates-sitemap.xml` view under key `sitemap:templates:xml:v5` | 6 hours | `php artisan cache:purge-public` |
| **Legacy Sitemap & RSS Feed** | [`app/Http/Controllers/SitemapController.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/SitemapController.php), [`RssController.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/RssController.php) | `sitemap:xml` and `rss:blog` XML strings | 6 hours | `php artisan cache:purge-public` |
| **Programmatic SEO Data & Snapshots** | [`app/Seo/SeoPageDataService.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Seo/SeoPageDataService.php), [`SeoSnapshotService.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Seo/SeoSnapshotService.php) | Computed city fuel, electricity slab, and ration calculations (`roznamcha_seo:page:*`, `roznamcha_seo:snapshot:*`) | 24 hours | `php artisan cache:clear` / `php artisan cache:purge-public` |
| **Smart Budget Template Generation** | [`app/TemplateServices/TemplateGeneratorService.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/TemplateServices/TemplateGeneratorService.php) | Budget template JSON calculations (`budget_template:payload:{slug}:{hash}`) | **Forever** (`Cache::rememberForever`) | `php artisan cache:clear` / `php artisan cache:purge-public` |
| **Compiled Blade Views** | `storage/framework/views/*` | Pre-compiled PHP versions of `.blade.php` templates | Until source file timestamp changes | `php artisan view:clear` |
| **Configuration & Route Cache** | `bootstrap/cache/config.php`, `bootstrap/cache/routes-v7.php` | Compiled array of merged configuration and route trees | Until cleared | `php artisan config:clear`, `php artisan route:clear` |
| **PHP OPcache** | PHP-FPM / LiteSpeed LSAPI engine | Pre-compiled bytecode of PHP scripts | Configured by server `opcache.revalidate_freq` | `opcache_reset()` via web request |
| **Cloudflare / Edge CDN** (Optional) | Cloudflare Edge Network | Edge caching for static and public assets | Managed via CDN dashboard | Triggered via `php artisan cache:purge-public` when `CDN_PURGE_ENABLED=true` |

---

## 2. Release Marker Tracking

Every HTTP web response emitted by the application carries a unique release identifier formatted as:
```text
<git short sha>-<UTC build timestamp>
(e.g., 6b07157-20261010T180950Z)
```

### Where It Appears
1. **HTTP Response Header**:
   ```http
   X-App-Release: 6b07157-20261010T180950Z
   ```
   Injected across **all web responses** by [`app/Http/Middleware/AddReleaseMarkerHeader.php`](file:///Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Middleware/AddReleaseMarkerHeader.php).
2. **HTML Comment**:
   ```html
   <!-- release: 6b07157-20261010T180950Z -->
   </body>
   ```
   Rendered immediately before the closing `</body>` tag on all public pages.

---

## 3. Purging Public Caches via Artisan

Use the dedicated artisan command:

### Dry-run (Plan Only)
```bash
php artisan cache:purge-public --dry-run
```
Prints the structured table detailing every cache layer that will be cleared without making any modifications.

### Live Purge
```bash
php artisan cache:purge-public
```
Executes the full invalidation pipeline:
1. Forgets public sitemap and RSS cache keys (`sitemap:xml:v5`, `sitemap:templates:xml:v5`, `sitemap:xml`, `rss:blog`).
2. Clears application data cache (`cache:clear`).
3. Clears compiled Blade views (`view:clear`).
4. Clears configuration and route caches (`config:clear`, `route:clear`).
5. Re-runs `SeoSitemapController` and `TemplateSitemapController` to immediately pre-warm fresh XML with current timestamps.
6. Invokes `opcache_reset()` if available.
7. Calls Cloudflare purge API if `CDN_PURGE_ENABLED=true`.

---

## 4. Production Deployment Workflow

### Track 1: Direct Bundle Sync (Recommended for Fast Atomic Deploys)
1. **Build Assets Locally**:
   ```bash
   npm run build
   ```
2. **Write Release Marker**:
   ```bash
   git log -1 --format="%h-%cd" --date=format-local:"%Y%m%dT%H%M%SZ" > .release
   ```
3. **Upload Bundle & Refresh Script**:
   - Upload compiled `public/build/` to `public_html/build/` and `rozapp/public/build/`.
   - Upload compiled `bootstrap/ssr/` to `rozapp/bootstrap/ssr/` and `public_html/ssr/`.
   - Upload modified application code to `rozapp/`.
4. **Restart Node SSR Daemon**:
   - Terminate the active process listening on port 13714.
   - Start fresh SSR worker:
     ```bash
     nohup /opt/alt/alt-nodejs20/root/usr/bin/node /home/roznamch/rozapp/bootstrap/ssr/ssr.js > /home/roznamch/rozapp/storage/logs/ssr.log 2>&1 &
     ```
5. **Purge Caches**:
   - Trigger `php artisan cache:purge-public` and `php artisan optimize:clear` via deploy runner.
   - Flush LiteSpeed cache.

### Track 2: SSH CLI Deployment
1. SSH into the server and navigate to `~/rozapp`.
2. Run:
   ```bash
   bash scripts/deploy.sh
   ```
3. Restart SSR worker and verify.

---

## 5. Live Release Verification

Run the following checks from your terminal to confirm that a new release is live:

### 1. Verify `X-App-Release` on Core Public Routes
```bash
curl -sI https://roznamcha.pk/ | grep -i x-app-release
curl -sI https://roznamcha.pk/about | grep -i x-app-release
curl -sI https://roznamcha.pk/blog | grep -i x-app-release
```
All routes should return the same active `<git short sha>-<UTC build timestamp>`.

### 2. Verify HTML Comment Before `</body>`
```bash
curl -s https://roznamcha.pk/ | grep -E "<!-- release:"
```
Expected output:
```html
<!-- release: 6b07157-20261010T180950Z -->
```

### 3. Verify CSRF Token Rotation
```bash
curl -s https://roznamcha.pk/ | grep "csrf-token"
curl -s "https://roznamcha.pk/?query_test=1" | grep "csrf-token"
```
Both queries must output fresh, distinct tokens, confirming LiteSpeed is not caching dynamic sessions.

### 4. Verify Sitemap Lastmod Freshness
```bash
curl -s https://roznamcha.pk/sitemap.xml | grep -m 1 "<lastmod>"
```
The `<lastmod>` date must match the current deployment date.

---

## 6. Automated Pipeline Verification (`scripts/verify-live.sh`)

The repository includes an outside-in verification suite located at `scripts/verify-live.sh`.

### Running Locally / Manually
```bash
chmod +x scripts/verify-live.sh
./scripts/verify-live.sh https://roznamcha.pk
```

### CI/CD Deployment Gating
In `.github/workflows/deploy.yml`, a post-deployment verification step executes `scripts/verify-live.sh https://roznamcha.pk` immediately following the post-deploy hook:

```yaml
- name: Verify live deployment
  run: |
    chmod +x scripts/verify-live.sh
    output=$(./scripts/verify-live.sh https://roznamcha.pk 2>&1)
    echo "$output"
    if echo "$output" | grep -E '^FAIL'; then
      echo "Deployment verification failed: one or more checks reported FAIL."
      exit 1
    fi
```

If any check line starts with `FAIL` (or the script exits with non-zero status), the pipeline fails immediately, blocking subsequent jobs and flagging the release for investigation.

### Checks Performed
1. **Release & Cache**: Ensures `X-App-Release` response header is present and that `<meta name="csrf-token">` is not identically shared across fresh visitor requests (verifies dynamic HTML is not frozen in cache).
2. **Broken Trust Links (F3)**: Validates that raw route names like `public.editorial-policy` or `public.methodology` are not rendered as links across key pages (`/about`, `/contact`, `/tools/*`, `/blog/*`).
3. **Placeholders & Empty States (F4)**: Confirms no placeholder text (`Static placeholder`, `PKR 0`, `slab_rates table`, `Savings Rate: %`, `Rs 0`, `#electrity`) leaks into live tool or article markup.
4. **Heading Hierarchy (F6)**: Enforces exactly one `<h1>` element per landing, tool, and informational page.
5. **Duplicate Content (F1/F2)**: Checks syndicated or duplicate article slugs to ensure content does not repeat across different URLs.
6. **Injected / Off-Topic Blocks (F7)**: Verifies absence of off-topic promo text or boilerplate blocks.
7. **Policy Pages (F9/F11)**: Verifies that `/privacy-policy` contains required disclosure terms (e.g. `last updated`, Google partner-sites policy link, and `aboutads.info` opt-out link) and that `/cookie-policy` has a self-referencing canonical tag.
8. **Sitemap Integrity (F12/F16)**: Verifies that `/sitemap.xml` contains no empty categories and that `<lastmod>` timestamps are distributed rather than clustered onto a single uniform value.
9. **AdSense Compliance (F13)**: Verifies that non-content utility routes (`/features`, `/templates`, `/kharcha-map`, `/ration-brain`, `/survival-report`) do not render ad containers (`>Advertisement<`).
