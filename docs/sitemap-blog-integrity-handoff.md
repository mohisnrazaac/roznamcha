# Sitemap Blog Integrity Handoff

Date: 2026-04-07

## Root Cause

1. The live sitemap source was `SeoSitemapController`, but its blog query only used `BlogPost::published()`.
2. That allowed published rows with non-public/reserved slugs like `create-post` to be emitted.
3. A stale checked-in `public/sitemap.xml` also existed and could be served directly by Apache before Laravel, which explains why old 404 blog URLs could keep appearing even after application logic changed.

## Filtering Rule Now Used For Public Blog URLs

Public blog URLs now use a shared `BlogPost::publiclyVisible()` rule:

- status is `published`, or `scheduled` with `published_at <= now()`
- slug is not null
- slug is not empty
- slug is not in the reserved public slug blocklist

The current reserved slug blocklist is:

- `create-post`

Public detail route access also rejects invalid/reserved slugs through `BlogPost::hasValidPublicSlug($slug)`.

## Files Changed

- `app/Models/BlogPost.php`
- `app/Http/Controllers/BlogPublicController.php`
- `app/Http/Controllers/SeoSitemapController.php`
- `app/Http/Controllers/RssController.php`
- `app/Http/Controllers/PublicPageController.php`
- `app/Http/Controllers/AskRozaController.php`
- `app/Http/Controllers/Admin/BlogPostController.php`
- `app/Http/Middleware/TrackBlogView.php`
- `public/.htaccess`
- `tests/Feature/BlogPublicTest.php`
- `tests/Feature/PublicPageSeoHeadTest.php`
- removed stale `public/sitemap.xml`

## Local Validation Completed

- `php artisan test tests/Feature/BlogPublicTest.php`
- `php artisan test tests/Feature/PublicPageSeoHeadTest.php`

Both passed locally.

## Before / After Behavior

Before:

- sitemap blog query emitted any published/scheduled-visible slug, including `create-post`
- stale `public/sitemap.xml` could continue serving old 404 URLs

After:

- sitemap emits only rows passing the shared public visibility rule
- reserved slug `create-post` is excluded from sitemap and returns 404 on public blog detail
- admin validation now blocks saving a blog post whose computed public slug is `create-post`
- Apache is forced to route `/sitemap.xml` and `/templates-sitemap.xml` through Laravel even if stale static files still exist on disk

## Stale Content Found

- Stale blog rows are present in the repository SQL dumps, including:
  - `upcoming-mehngai-forecast`
  - `create-post`
  - `how-pakistani-families-can-control-monthly-expenses-without-cutting-their-dignity`
- I could not query the live/active MySQL database from this session because the local DB connection was unavailable.

## Post-Deploy Verification Template

Run these commands after deploy and paste the outputs below.

### 1. Sitemap blog entries

Command:

```bash
curl -s https://roznamcha.pk/sitemap.xml | grep '/blog/'
```

Paste output below:

```text
[paste here]
```

### 2. Check reserved/internal paths are gone

Commands:

```bash
curl -s https://roznamcha.pk/sitemap.xml | grep 'create-post'
curl -s https://roznamcha.pk/sitemap.xml | grep 'blog/rss'
```

Paste output below:

```text
[paste here]
```

Expected result: no matches

### 3. Verify 5 emitted blog URLs return 200

Command pattern:

```bash
curl -sSI https://roznamcha.pk/blog/PASTE-SLUG-HERE
```

Paste 5 header outputs below:

```text
[paste here]
```

Expected result: `HTTP/1.1 200 OK` or equivalent 200 status

### 4. Verify blog listing still works

Command:

```bash
curl -sSI https://roznamcha.pk/blog
```

Paste output below:

```text
[paste here]
```

Expected result: 200

## Upload Back For Recheck

Upload this file again after filling the pasted command outputs, or send the command outputs directly. That will be enough for a second-pass production check and next-action report.
