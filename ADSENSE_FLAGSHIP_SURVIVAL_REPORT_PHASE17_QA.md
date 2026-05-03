# AdSense Flagship Survival Report Phase 17 QA

Review date: 2026-04-21  
Scope: QA review only for `/survival-report`

Inputs reviewed:

- `ADSENSE_FLAGSHIP_SURVIVAL_REPORT_PHASE16.md`
- `ADSENSE_FLAGSHIP_RATION_COST_ESTIMATOR_PHASE11_APPROVAL_QA.md`
- `ADSENSE_FLAGSHIP_HOMEPAGE_PHASE15_APPROVAL_QA.md`
- `resources/js/Pages/Public/SurvivalReport.jsx`
- `resources/js/lib/seo.js`
- `app/Http/Controllers/Concerns/BuildsPublicSeo.php`
- `tests/Feature/SurvivalReportPageTest.php`
- `tests/Feature/PublicPageSeoHeadTest.php`
- `app/Services/Reports/SurvivalReportService.php`
- `resources/views/reports/survival.blade.php`

Verification performed:

- re-inspected the full public page implementation
- rechecked the page-level SEO payload and canonical path
- rechecked the underlying report aggregation logic against the public claims
- reran targeted feature coverage:
  `php artisan test tests/Feature/SurvivalReportPageTest.php tests/Feature/PublicPageSeoHeadTest.php`

Important limitation:

- Browser-style loopback rendering is still blocked in this sandbox. A local server process could start, but loopback `curl` access to `127.0.0.1:8002` was not available here.
- Because of that, rendered-output QA relied on the exact current React implementation plus the passing raw-HTML SEO feature tests and the underlying report-service code path. That is enough for this gate because the main remaining question is honesty and flagship quality, not an untested runtime branch.

## A. Overall Verdict

**Needs small fixes**

## B. What Genuinely Improved

- The page is now instantly clearer about what the Survival Report is, who it is for, and why a Pakistani household would care.
- The hero, key-question framing, and public-explainer note are materially better than the earlier feature-pitch version.
- The page now avoids the earlier fake-sounding claims about future shocks, exports, and premium analytics.
- The next-step links are strong and relevant:
  `/kharcha-map`, `/tools/ration-cost-estimator`, and `/tools/school-fees-planner`.
- FAQ is visible and aligned with the visible page, not hidden schema padding.
- Canonical/indexability behavior remains intact through the current centralized SEO path and passing feature coverage.

## C. What Still Feels Weak Or Risky

### 1. The projection claim does not match the actual implementation

This is the main blocker.

The page repeatedly presents a "current-month projection" as a meaningful planning signal:

- `resources/js/Pages/Public/SurvivalReport.jsx`
  `reportSignals`
- `resources/js/Pages/Public/SurvivalReport.jsx`
  `methodologyPoints`
- `resources/js/Pages/Public/SurvivalReport.jsx`
  FAQ answer for "Does the report predict the future?"

But the actual service in `app/Services/Reports/SurvivalReportService.php` calculates:

- `average_daily = total / daysInMonth`
- `projection = average_daily * daysInMonth`

That means `projection` collapses back to the same monthly total, not a meaningful forward-looking projection based on elapsed days. So the public page currently oversells one report signal that the implementation does not really provide.

For a flagship page, that is a trust problem.

### 2. The page is still a bit more verbal than visual

The page explains the report well, but it still does not show a concrete sample output block or a believable visual mini-preview of what the report looks like. It is no longer a weak concept page, but it still leans more on explanation than evidence.

This is not a blocker today, but it is why the page feels slightly less convincing than the approved ration estimator and homepage benchmarks.

### 3. Worked examples are useful but still somewhat generic

The examples are believable enough, but they are still framed as narrative cards rather than sharper output interpretation. They help, but they do not yet deliver the same precision of value as the strongest flagship sections elsewhere on the site.

This is also not the blocker. It is a second-order quality note.

## D. Exact Sections That Should Be Trimmed, Rewritten, Or Kept

Keep:

- hero section
- key questions panel
- public explainer first note
- category breakdown explanation
- methodology and limits structure
- how-to-use-it workflow
- related next-step links
- visible FAQ format

Rewrite:

- `What The Report Actually Shows`
  specifically the `Current-month projection` card
- `Methodology And Limits`
  specifically the projection bullet in `Core logic`
- FAQ
  specifically the answer to `Does the report predict the future?`

Trim later if needed:

- worked examples can stay for now, but one could eventually be tightened or replaced with a more concrete sample output preview

## E. Whether `/survival-report` Is Ready To Stand As The Third Flagship Benchmark

**No**

It is close, and the page is much better than before, but it should not be approved as the third flagship benchmark while one of its core value claims does not match the underlying report logic.

## F. Tiny Corrections That Should Be Made Before Moving To Page 4

Only one item is a true must-fix:

- remove or rewrite the projection-related public claims so they match the real report logic, or fix the report logic itself so the projection becomes real

Non-blocking polish after that:

- consider replacing one worked example with a tighter sample-output-style proof block
