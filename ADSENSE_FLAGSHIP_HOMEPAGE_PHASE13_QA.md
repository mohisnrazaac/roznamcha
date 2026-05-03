# AdSense Flagship Homepage Phase 13 QA

Review date: 2026-04-21  
Scope: QA review only for `/`

Inputs reviewed:

- `ADSENSE_FLAGSHIP_HOMEPAGE_PHASE12.md`
- `ADSENSE_FLAGSHIP_RATION_COST_ESTIMATOR_PHASE11_APPROVAL_QA.md`
- `resources/js/Pages/Public/Home.jsx`
- `resources/js/Layouts/PublicLayout.jsx`
- `app/Http/Controllers/PublicPageController.php`
- `tests/Feature/HomePageFlagshipTest.php`
- `tests/Feature/PublicPageSeoHeadTest.php`

Verification performed:

- homepage React implementation re-inspected in full
- homepage controller payload path rechecked
- shared public layout navigation reviewed because a user landing on `/` sees that header immediately
- homepage SEO response path rechecked through existing feature coverage
- targeted tests rerun:
  - `php artisan test tests/Feature/HomePageFlagshipTest.php tests/Feature/PublicPageSeoHeadTest.php`

Important limitation:

- Browser-style loopback rendering was not available in this sandbox, so final QA relied on the exact homepage React implementation, the shared layout code, the controller payload, and the existing raw-HTML SEO test coverage rather than a visual browser session.
- That is still sufficient for this QA gate because the main remaining question is homepage quality, link direction, and trust framing, not a hidden runtime branch.

## A. Overall Verdict

**Needs small fixes**

## B. What Genuinely Improved

- The homepage is now immediately clearer about what Roznamcha is, who it is for, and what practical problems it addresses.
- The fake proof layer is gone. Removing testimonials, vague badges, AI promo noise, and demo filler materially improved trust.
- The first-click journey is much better inside the homepage body. The strongest public pages now dominate the content instead of weak spread.
- The trust framing is more honest. The page now says these are planning aids, not exact guarantees, and it no longer tries to manufacture authority.
- The curated guide section is a substantial upgrade over a generic latest-post feed because it points to stronger editorial pages instead of whatever happens to be newest.

## C. What Still Feels Weak Or Risky

### 1. The shared header still undermines the homepage cleanup

This is the main blocker.

The homepage body was cleaned up, but the header on the same page still exposes:

- `Petrol Price Pages`
- `DISCO Bill Pages`
- `Ration Cost Pages`

These links are still defined in `resources/js/Layouts/PublicLayout.jsx:52-87`.

That matters because a reviewer landing on `/` does not experience the homepage body in isolation. The first impression still includes a tools menu that points back toward the weak/noindexed programmatic groups that earlier phases deliberately pulled out of the search-facing surface.

### 2. The page still has some duplication in its middle sections

The homepage is much cleaner than before, but it is not fully lean yet.

`Best First Clicks`, `Proof Of Value`, and `Start With The Pressure You Already Feel` all route users toward largely the same destinations. The repetition is more disciplined than before, but it still feels a little over-explained.

### 3. The homepage SEO copy is technically intact but not fully aligned with the new flagship framing

The homepage body now presents Roznamcha as a practical Pakistan household survival platform, but the `home` SEO title/description in `app/Http/Controllers/Concerns/BuildsPublicSeo.php:15-24` still reflect the older broader framing:

- `Pakistan’s Urdu-first household budget & kharcha tracker`
- mentions of tracking expenses and reminders rather than the new flagship proof-first framing

This is not a technical error, but it is still a consistency gap.

## D. Exact Sections That Should Be Trimmed, Rewritten, Or Kept

### Keep

- Hero section in `resources/js/Pages/Public/Home.jsx:125-170`
- `Best First Clicks` in `resources/js/Pages/Public/Home.jsx:173-191`
- `Trust And Limits` framing in `resources/js/Pages/Public/Home.jsx:228-258`
- Curated guide section in `resources/js/Pages/Public/Home.jsx:262-291`

### Trim or simplify

- `Proof Of Value` in `resources/js/Pages/Public/Home.jsx:196-209`
- `Start With The Pressure You Already Feel` in `resources/js/Pages/Public/Home.jsx:212-226`

Only one of those two sections really needs to carry the heavier routing burden. Both are valid, but together they still add a bit of flagship-page redundancy.

### Rewrite outside the homepage file but still relevant to homepage QA

- `resources/js/Layouts/PublicLayout.jsx:52-87`

Those tools-menu entries should stop promoting the weak programmatic groups if the homepage is meant to function as a flagship-quality first impression.

## E. Whether Homepage Is Ready To Stand As The Second Flagship Benchmark

**Not yet**

The homepage body itself is close. If judged only on the content inside `Public/Home.jsx`, it would be near approval.

But judged as a real public page experience, the answer is still no, because the shared header on the homepage continues to route visitors toward the weak programmatic areas that prior phases identified as harmful to quality perception.

## F. Any Tiny Corrections That Should Be Made Before Moving To Page 3

Blocking correction:

- Remove or replace the programmatic weak-group links in the shared public `Tools` menu so homepage visitors are not pushed toward petrol city pages, DISCO pages, and ration family-size pages.

Non-blocking but worthwhile cleanup:

- Trim one of the two middle routing sections so the homepage feels more decisive and less repetitive.
- Align homepage SEO title/description with the new flagship framing so the body copy and metadata are saying the same thing.
