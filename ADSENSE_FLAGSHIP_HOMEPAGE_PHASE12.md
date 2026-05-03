# AdSense Flagship Homepage Phase 12

Implementation date: 2026-04-21  
Scope: homepage-only flagship upgrade for `/`

Inputs reviewed first:

- `ADSENSE_LOW_VALUE_AUDIT_PHASE1.md`
- `ADSENSE_FLAGSHIP_PAGE_SELECTION_PHASE5.md`
- `ADSENSE_FLAGSHIP_RATION_COST_ESTIMATOR_PHASE11_APPROVAL_QA.md`
- `routes/web.php`
- `app/Http/Controllers/PublicPageController.php`
- `resources/js/Pages/Public/Home.jsx`
- existing homepage SEO payload path and public-page SEO tests

## A. Summary Of What Was Upgraded

The homepage was rewritten to behave more like a proof page and less like a broad landing page.

The new version now:

- explains Roznamcha in one screen as a Pakistani household budgeting and survival platform
- points users toward the strongest public pages first instead of spreading attention across weaker directions
- frames the product honestly as a planning aid rather than an exact-price or exact-bill promise
- organizes the page around real household pressure points: ration, school fees, electricity, and month-end survival
- replaces generic or weak homepage noise with clearer proof-of-value sections and curated guide links

## B. Exact Files Changed

- `resources/js/Pages/Public/Home.jsx`
- `tests/Feature/HomePageFlagshipTest.php`
- `ADSENSE_FLAGSHIP_HOMEPAGE_PHASE12.md`

## C. New Sections Added, Removed, Or Simplified

Added:

- a clearer above-the-fold explanation of what Roznamcha is, who it helps, and what it does not claim
- a "Best First Clicks" block focused on strong public destinations
- a stronger "Proof Of Value" section built around flagship or near-flagship public pages
- a pressure-based journey section to route users by actual household problem
- a tighter trust-and-limits section explaining usefulness without sign-in
- a curated guide section using selected strong blog posts instead of a generic latest-post feed

Removed or simplified:

- the fake-looking testimonial/social-proof block
- vague proof badges and placeholder usage claims
- the AI promo banner
- the demo placeholder block
- the broader feature-description filler sections for Kharcha Map, Ration Brain, and Survival Report
- the homepage FAQ block
- the generic latest blog feed
- the homepage-level internal-link spread that pushed users across too many directions

## D. How Proof-Of-Value And Trust Were Strengthened

Proof-of-value was strengthened by pushing the homepage toward pages that already demonstrate real usefulness:

- `/tools/ration-cost-estimator`
- `/tools/school-fees-planner`
- `/tools/electricity-bill-estimator`
- `/templates/50k-salary-survival-guide`
- `/survival-report`
- `/kharcha-map`

Trust was strengthened by making the homepage more explicit about limits:

- public pages work before sign-in
- calculators and guides are planning aids, not exact guarantees
- the product is built around Pakistan-specific household pressure rather than generic budgeting claims

## E. Which Internal Links Were Promoted And Which Weak Directions Were Reduced

Promoted:

- `/tools/ration-cost-estimator`
- `/tools/school-fees-planner`
- `/tools/electricity-bill-estimator`
- `/templates/50k-salary-survival-guide`
- `/survival-report`
- `/kharcha-map`
- `/blog/ghar-ka-monthly-budget`
- `/blog/pakistani-family-monthly-expense-control`
- `/blog/pakistani-household-essential-expenses-2026`

Reduced from homepage content:

- broad "latest posts" promotion
- weak proof-style messaging
- signup-heavy framing near the top of the page
- placeholder/demo sections that did not prove real utility
- generic feature sprawl that diluted the first-click journey

Important scope note:

- this phase did not change the shared global public layout navigation, because the task was constrained to homepage-only work

## F. Constraints Or Follow-Up Notes For Later Phases

- The homepage now does a materially better job of sending users and reviewers to strong pages, but the shared public navigation still exists outside this page-specific scope and can be reviewed in a later navigation cleanup phase if needed.
- The curated guide section depends on those selected blog posts remaining among the strongest public editorial pages.
- No canonical, robots, sitemap, or indexability behavior was changed in this phase.
- Verification passed with:
  - `php artisan test tests/Feature/HomePageFlagshipTest.php tests/Feature/PublicPageSeoHeadTest.php`
  - `npm run build`
