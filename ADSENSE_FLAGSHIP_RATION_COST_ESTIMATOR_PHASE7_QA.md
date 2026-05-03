# AdSense Flagship Ration Cost Estimator Phase 7 QA

Review date: 2026-04-20  
Scope: QA review only for `/tools/ration-cost-estimator`

Review inputs used:

- `ADSENSE_FLAGSHIP_RATION_COST_ESTIMATOR_PHASE6.md`
- `app/Http/Controllers/PublicTools/RationCostEstimatorController.php`
- `config/ration_cost_estimator.php`
- `config/internal_links.php`
- `resources/js/Pages/Public/Tools/RationCostEstimator.jsx`
- `tests/Feature/RationCostEstimatorPageTest.php`
- actual route response path through the local Laravel app plus the implemented React output path

Important note:

- This page is delivered through an Inertia shell, so local QA here is based on the real route payload and the actual React component that hydrates it.
- There was no packaged headless browser flow available in this repo for a screenshot-driven review, so the judgment below is based on the real response path plus the exact rendered component logic, not assumptions.

## A. Overall Verdict

**Needs small fixes**

This is materially better than the thin Phase 6 starting point. It now reads like a real public utility page rather than a bare calculator shell. But it is not yet a clean flagship example.

The page still carries three credibility leaks:

1. a prominent household-size control that does not affect the estimate
2. a hidden FAQ schema block with no visible FAQ section
3. a few interpretation widgets that add math density faster than they add decision value

That combination does not make the page bad. It does mean the page is not yet as tight and trustworthy as one of the site’s best five examples should be.

## B. What Genuinely Improved

### Above the fold is much more honest

- The opening now explains who the page helps, what is included, and what the page does not claim to do. That is a real improvement over a thin “calculator only” shell.
- The “not a live market survey” framing is especially useful because it removes a common trust problem early.

Relevant code:

- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:196)
- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:216)

### Methodology is now understandable

- The page plainly explains that the result is just `quantity × fixed configured base price` summed across the current staple basket.
- That is the right level of clarity for this page. It is simple, readable, and aligned with the actual calculator logic.

Relevant code:

- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:373)
- [config/ration_cost_estimator.php](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/config/ration_cost_estimator.php:4)

### Internal links are directionally stronger than before

- Moving away from weaker ration-related blog links was the right call.
- `Kharcha Map`, `Survival Report`, and `Ghar Ka Monthly Budget` are reasonable next steps for a user who has just estimated staple costs.

Relevant code:

- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:471)
- [config/internal_links.php](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/config/internal_links.php:127)

## C. What Still Feels Weak Or Risky

### 1. Household size is still presented like a real calculator input even though it does not change the estimate

This is the biggest remaining UX credibility issue.

- The field sits in the calculator form, above the basket inputs, with a standard input treatment.
- A user will reasonably assume it changes the estimate.
- The explanatory note is honest, but it does not fully fix the mismatch.

Why this matters:

- A flagship page should not make users mentally reverse-engineer which inputs matter.
- This creates a “dressed-up calculator” feeling because one of the most visible controls is non-functional in the core math.

Relevant code:

- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:144)
- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:254)

QA judgment:

- Must fix before confidently presenting this as one of the site’s flagship five.

### 2. FAQ structured data exists, but there is no visible FAQ section on the page

This is the clearest SEO-padding smell left on the page.

- `faqItems` are defined.
- `FAQPage` JSON-LD is injected.
- But the user never sees an actual FAQ block rendered in the page body.

Why this matters:

- Structured data should reflect visible content.
- Right now the FAQ adds markup but not user value.
- An AdSense or quality reviewer will not see those answers in the page itself.

Relevant code:

- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:86)
- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:203)

QA judgment:

- Must fix.
- Either render a visible FAQ section or remove the FAQ JSON-LD.

### 3. The metric stack is partly useful and partly synthetic

The result sidebar is improved, but not every card earns its place.

- `Current cost drivers` is good.
- `How to read this result` is useful.
- `Weekly planning number` is acceptable but weak.
- `Per-person view` is shaky because it depends on a household-size field that does not affect the actual estimate.
- `12% price-shock buffer` is not inherently bad, but it is presented as a strong number without explaining why `12%` deserves trust.

Why this matters:

- The page is trying to look more analytical.
- Some of that analysis is useful, but some of it feels like extra arithmetic rather than better judgment.

Relevant code:

- [config/ration_cost_estimator.php](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/config/ration_cost_estimator.php:6)
- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:160)
- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:310)

QA judgment:

- Small fix, not a page-killer.
- The page should either justify the buffer better or reduce how heavily it is framed.

### 4. Worked examples are grounded enough, but still slightly formulaic

The examples are not fake, but they are still closer to “calculated sample baskets” than to strong public guidance.

- They are better than filler because they use the actual configured basket.
- But they mostly restate quantities and totals.
- They do not say what the user should conclude if their result is above, below, or between those examples.

Relevant code:

- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:27)
- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:423)

QA judgment:

- Keep, but sharpen later.
- Not a must-fix before page 2.

### 5. The page still has some section sprawl

The page now has:

- framing cards
- calculator
- metric cards
- interpretation block
- cost drivers block
- methodology
- base basket block
- assumptions block
- usage block
- worked examples
- price-change block
- where-to-go-next block
- related links block

That is a lot for a page whose core model is still simple.

The result is not disastrous, but some sections are close enough in purpose that the page starts feeling “content-upgraded” rather than fully edited.

Relevant code:

- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:216)
- [resources/js/Pages/Public/Tools/RationCostEstimator.jsx](/Applications/XAMPP/xamppfiles/htdocs/roznamcha/resources/js/Pages/Public/Tools/RationCostEstimator.jsx:499)

QA judgment:

- Small trim recommended.
- Not all of this needs to survive intact.

## D. Exact Sections That Should Be Trimmed, Rewritten, Or Kept

### Keep

- Top framing cards
  Reason: they do real trust work early and set expectations clearly.

- “How this estimate works”
  Reason: it is the clearest methodology block on the page.

- “Current base basket on this page”
  Reason: this is one of the strongest trust sections because it exposes the actual basket logic.

- “Current cost drivers”
  Reason: this is the most useful interpretation add-on because it helps users know where to look first.

- “Where to go next”
  Reason: directionally good if the bottom-of-page link sprawl is reduced elsewhere.

### Rewrite

- Household size block
  Reason: it needs stronger labeling or visual demotion because it is not part of the calculation.

- Metric stack
  Reason: `Per-person view` and `12% price-shock buffer` need stronger justification, lighter emphasis, or both.

- Worked examples
  Reason: they need one extra layer of interpretation, not just quantities plus totals.

### Trim

- `How to use this estimate` and `What can change your ration bill`
  Reason: both are useful topics, but together they start overlapping with the interpretation and assumptions sections.

- Bottom related-link spread
  Reason: “Where to go next” plus `RelatedLinksBlock` pushes the page back toward link density.

### Remove unless made visible

- FAQ JSON-LD
  Reason: as currently implemented, it is not matched by a visible FAQ section and reads like markup-first SEO behavior.

## E. Whether This Page Is Ready To Stand As One Of The 5 Flagship Examples

**Not yet**

It is close enough that I would not call this a failed flagship attempt. The page has crossed the line from thin utility to serious public resource.

But a flagship example should be tight, trustworthy, and obviously edited by someone who knows which details matter. Right now this page still shows a few “content expansion” tells:

- a major visible control that does not affect the result
- hidden FAQ schema without visible FAQ content
- a few math-derived support cards that feel weaker than the calculator itself

That is why the right call is not “still weak” and not “strong pass.” The right call is “needs small fixes.”

## F. Tiny Corrections That Should Be Made Before Moving To Page 2

### Must-fix

1. Demote or relabel the household-size input so users cannot mistake it for a real calculation driver.
2. Remove the FAQ JSON-LD or render an actual visible FAQ section using the same questions.
3. Rework the result metric stack so the weakest pseudo-precision elements do not compete with the genuinely useful ones.

### Nice-to-have, not blocking

1. Add one short interpretation sentence to each worked example or reduce the example count slightly.
2. Reduce the bottom link sprawl by choosing between the “Where to go next” block and the broader related-links spread.

