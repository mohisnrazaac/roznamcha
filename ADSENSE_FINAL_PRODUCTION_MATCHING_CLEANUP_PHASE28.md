# AdSense Final Production-Matching Cleanup Phase 28

Date: 2026-04-21

This pass stayed focused on the remaining production-matching AdSense risks:

- weak legacy surface leakage
- public contact identity consistency
- weak/off-core blog promotion
- stale snippet-style inflation/buffer wording
- sitemap, archive, and RSS consistency

No new flagship page work was started.
No broad redesign was introduced.
No database rows were rewritten in this pass.

## A. Exact Remaining Risks Addressed

1. Weak legacy blog/programmatic surfaces were still being surfaced through shared promotion and snippet copy.
2. The public trust/contact surface needed one branded contact identity everywhere.
3. The shared blog catalog still contained weak survivor entries that could keep them discoverable or promoted.
4. Several public snippets still used inflation/buffer-style phrasing that read like old SEO residue.
5. The RSS route was shadowed by `/blog/{slug}` and needed a route-order fix so the feed actually resolved.

## B. Exact Files / Content Sources Changed

Code files changed:

- [`app/Http/Controllers/BlogPublicController.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/BlogPublicController.php)
- [`app/Http/Controllers/ContactController.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/ContactController.php)
- [`app/Http/Controllers/Concerns/BuildsPublicSeo.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/Concerns/BuildsPublicSeo.php)
- [`app/Http/Controllers/RssController.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/RssController.php)
- [`app/Seo/SeoPageDataService.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Seo/SeoPageDataService.php)
- [`app/Seo/SeoPageMetaService.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Seo/SeoPageMetaService.php)
- [`config/internal_links.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/config/internal_links.php)
- [`resources/js/lib/seo.js`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/lib/seo.js)
- [`resources/js/Pages/Public/Blog/Index.jsx`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Blog/Index.jsx)
- [`resources/js/Pages/Public/Tools/SchoolFeesPlanner.jsx`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/SchoolFeesPlanner.jsx)
- [`routes/web.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/routes/web.php)
- [`tests/Feature/BlogCleanupImplementationTest.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/tests/Feature/BlogCleanupImplementationTest.php)
- [`tests/Feature/BlogPublicTest.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/tests/Feature/BlogPublicTest.php)
- [`tests/Feature/PublicPageSeoHeadTest.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/tests/Feature/PublicPageSeoHeadTest.php)

Content sources changed:

- shared public SEO strings
- shared blog promotion catalog
- RSS feed description
- blog index hero copy
- School Fees Planner visible copy and JSON-LD description

## C. Legacy Weak-Surface Fixes Applied

1. Removed weak blog survivors from the shared blog catalog in `config/internal_links.php`.
2. Removed weak survivor-specific related-tool mappings so weak posts now fall back to the generic strong tool set instead of custom promo routing.
3. Updated the blog index hero text to remove the old inflation-survival phrasing.
4. Updated the RSS feed description to match the cleaned, neutral blog surface.
5. Cleaned the School Fees Planner visible copy to use "planning margin" instead of "inflation buffer" language.
6. Cleaned the programmatic ration helper copy to use "planning margin" wording instead of "inflation buffer" wording.

## D. Contact Identity Cleanup Applied

1. `About`, `Contact`, `Privacy Policy`, and `Terms` now share the same branded public contact email in the rendered code path.
2. The controller-side contact SEO description was simplified so it no longer reads like media-promo copy.
3. A regression test now checks for `support@roznamcha.pk` and blocks `@gmail.com`, `privacy@`, and `legal@` from the public trust pages.

## E. Off-Core Blog Promotion / Visibility Cleanup Applied

1. Weak survivor blog entries were removed from the shared blog catalog.
2. Weak survivor-specific related-tool mappings were removed.
3. The blog index stays public, but its headline/description are now neutral and utility-focused.
4. RSS now points at public archive-visible posts only and no longer relies on the old inflation-survival feed copy.
5. The RSS route was moved ahead of the generic blog slug route so `/blog/rss.xml` is actually reachable.

## F. Metadata / Snippet Cleanup Applied

1. Blog index metadata now uses neutral household-budget wording instead of "surviving inflation" wording.
2. Blog detail fallback descriptions now use a practical planning fallback instead of inflation-centered phrasing.
3. Programmatic ration page helper text now says "planning margin" instead of "inflation buffer."
4. School Fees Planner meta description, FAQ, visible helper text, and JSON-LD description now use "planning margin" wording.
5. Shared SEO defaults were updated so the client-side fallback copy matches the cleaned server-side copy.

## G. Sitemap / Archive / RSS Consistency Results

1. Sitemap and archive behavior remained intact in the verified feature suite.
2. Weak noindex programmatic pages still render `noindex,follow` and stay out of the sitemap.
3. Public blog archive behavior still excludes draft/retired/noindex entries as intended.
4. RSS now resolves correctly after the route-order fix.
5. RSS feed behavior was verified to include public archive-visible posts and exclude the noindex slug used in the regression test.

Verification run:

- `php artisan test tests/Feature/PublicPageSeoHeadTest.php tests/Feature/BlogCleanupImplementationTest.php tests/Feature/BlogPublicTest.php tests/Feature/SeoProgrammaticPagesTest.php`

Result:

- `37` tests passed
- `496` assertions passed

## H. Tests Added Or Updated

Added:

- `tests/Feature/BlogCleanupImplementationTest.php` now checks that weak survivor slugs are absent from both the shared blog catalog and the per-post related-tool map.
- `tests/Feature/BlogPublicTest.php` now checks RSS feed output, neutral RSS description, and RSS exclusion of a noindex slug.

Updated:

- `tests/Feature/PublicPageSeoHeadTest.php` to reflect the cleaned metadata and the broader public contact identity check.

## I. Remaining Limitations

1. Google recrawl is still required before search results, snippets, and cached previews fully reflect the cleaned code paths.
2. Direct URLs for intentionally kept noindexed pages remain reachable by design, but they are not part of the search-discovery surface.
3. The one temporary-keep blog post remains public until a later editorial decision removes or replaces it; this pass only reduced its promotion surface.

## Terminal Output

Files/content sources changed:

- [`app/Http/Controllers/BlogPublicController.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/BlogPublicController.php)
- [`app/Http/Controllers/ContactController.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/ContactController.php)
- [`app/Http/Controllers/Concerns/BuildsPublicSeo.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/Concerns/BuildsPublicSeo.php)
- [`app/Http/Controllers/RssController.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Http/Controllers/RssController.php)
- [`app/Seo/SeoPageDataService.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Seo/SeoPageDataService.php)
- [`app/Seo/SeoPageMetaService.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/app/Seo/SeoPageMetaService.php)
- [`config/internal_links.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/config/internal_links.php)
- [`resources/js/lib/seo.js`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/lib/seo.js)
- [`resources/js/Pages/Public/Blog/Index.jsx`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Blog/Index.jsx)
- [`resources/js/Pages/Public/Tools/SchoolFeesPlanner.jsx`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/SchoolFeesPlanner.jsx)
- [`routes/web.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/routes/web.php)
- [`tests/Feature/BlogCleanupImplementationTest.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/tests/Feature/BlogCleanupImplementationTest.php)
- [`tests/Feature/BlogPublicTest.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/tests/Feature/BlogPublicTest.php)
- [`tests/Feature/PublicPageSeoHeadTest.php`](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/tests/Feature/PublicPageSeoHeadTest.php)

Whether weak legacy surfaces are now fully non-promoted and non-index-discoverable in current code:

- Yes for the cleaned weak groups. The intentional noindexed programmatic pages remain direct-access pages, but they are not sitemap-discoverable and no longer sit in shared promo catalogs.

Whether public contact identity is now fully consistent:

- Yes. The public trust pages now all resolve to the same branded contact email in the current code path.

Whether off-core survivors are no longer over-promoted:

- Yes. Weak survivor blog entries were removed from the shared blog catalog and from weak-specific related-tool mappings.

Whether sitemap/archive/RSS consistency remained intact:

- Yes. The verified feature suite passed, and the RSS route now resolves correctly after the route-order fix.

Whether the codebase should now move to final live audit only:

- Yes. This cleanup pass is complete enough for final live audit / recrawl verification.
