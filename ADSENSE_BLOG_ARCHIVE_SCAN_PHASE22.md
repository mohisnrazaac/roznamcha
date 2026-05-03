# AdSense Blog Archive Scan Phase 22

Scan date: 2026-04-21  
Scan basis: actual local `BlogPost::publiclyVisible()` records from the local database plus the current shared blog rendering/controller path

Documents and code reviewed first:

- `ADSENSE_LOW_VALUE_AUDIT_PHASE1.md`
- `ADSENSE_FLAGSHIP_BLOG_FRAMEWORK_PHASE20.md`
- `ADSENSE_FLAGSHIP_HOMEPAGE_PHASE15_APPROVAL_QA.md`
- `ADSENSE_FLAGSHIP_SURVIVAL_REPORT_PHASE19_APPROVAL_QA.md`
- `app/Http/Controllers/BlogPublicController.php`
- `config/internal_links.php`
- current shared blog detail rendering path and metadata fallback logic

## A. Total Number of Blog Articles Scanned

**23**

## B. Classification Summary

### Keep

Count: **7**

- `pakistan-petrol-price-april-2026-rs458-budget-guide`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`
- `pakistan-fuel-quota-system-petrol-price-april-2026`
- `ghar-ka-monthly-budget`
- `pakistani-household-essential-expenses-2026`
- `best-monthly-budget-50000-salary-pakistan-2026`
- `pakistani-family-monthly-expense-control`

Reason:

- These are the strongest current posts by depth, clarity, mission fit, or practical household value.
- They can still benefit from any future safe shared cleanup, but they do not currently need article-level rescue work to stay in the archive.

### Safe Batch Fix Candidate

Count: **8**

- `basant-2026-lahore-kite-prices-household-cost`
- `inflation-household-spending-pakistan-2026`
- `school-fee-inflation-pakistan-2026`
- `petrol-prices-today-pakistan-2026-monthly-budget-impact`
- `new-utility-store-price-list-january-2026-today-subsidized-rates`
- `gold-rates-vs-monthly-savings-household-budget-2026`
- `gold-price-prediction-2026-daily-gold-rate-pakistan`
- `how-to-use-digital-roznamcha-for-business-and-personal-finance-2025`

Reason:

- These posts are not strong enough to leave untouched, but their biggest issues are often shared archive patterns rather than unique article-by-article logic failures.
- They are the best candidates for a safe batch pass focused on duplicated opener cleanup, repetitive outro cleanup, and metadata cleanup.

### Needs Manual Rewrite

Count: **4**

- `cost-of-living-pakistan-2026-monthly-budget`
- `inflation-household-budget-pakistan-2026`
- `electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`
- `utility-store-vs-open-market-price-comparison-2026-pakistan`

Reason:

- These posts have deeper content problems that a safe global pass will not solve.
- The issues include overlap with other posts, thin treatment of an important topic, clickbait framing, and keyword-stuffed metadata that reflects a broader editorial weakness rather than a simple cleanup opportunity.

### Merge/Remove/Noindex Candidate

Count: **4**

- `cost-of-living-pakistan-2026-monthly-budget-with-ai`
- `roznamcha-with-ai`
- `e-challan-bill-management-guide-pakistan-2026`
- `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`

Reason:

- These are either too thin, too derivative, too off-core, or too stale to justify a safe batch rewrite.
- They should be handled as a cleanup group later, not treated as flagship-upgrade candidates.

## C. Top Repeated Archive-Wide Weaknesses

### 1. Old in-body article headers are still embedded in many posts

Many articles still open with branded kickers, duplicated titles, or inline publish/update labels inside the article body itself.

Examples in the current archive:

- `Roznamcha · Fuel Survival`
- `Roznamcha · Ration Strategy`
- `Published: April 3, 2026 | Updated: ...`
- duplicated title text at the start of the body

This is weaker now that the shared blog framework already provides a stronger article header.

### 2. Repetitive promo-heavy endings

Many posts end with product-pitch language, “visit Roznamcha” style cues, or generic tracking-tool reminders that feel bolted on rather than editorially earned.

This is visible across multiple posts, especially the search-led commodity and inflation articles.

### 3. A thin tail of underdeveloped articles remains

Current local word counts show:

- `4` posts under `300` words
- `2` more posts between `300` and `499` words

That tail is too weak for article-level trust even after the shared framework upgrade.

### 4. Search-led topic overlap and derivative angles

The archive still contains overlapping or near-overlapping topics, most clearly:

- `cost-of-living-pakistan-2026-monthly-budget`
- `cost-of-living-pakistan-2026-monthly-budget-with-ai`

There are also adjacent search-led pairs in fuel, gold, and grocery-price topics that need deliberate editorial handling, not blind rewriting.

### 5. Weak stored metadata still exists in some posts

The controller now has better fallback logic, but the stored archive still includes bad source fields such as:

- missing excerpt: `ghar-ka-monthly-budget`
- URL-only excerpt/content: `roznamcha-with-ai`
- keyword-list excerpt and SEO description: `inflation-household-budget-pakistan-2026`

These problems are not universal, but they are repeated enough to justify a safe metadata cleanup pass.

## D. Exact Batch-Fix Opportunities That Can Be Applied Safely Across Many Articles

### 1. Strip duplicate in-body article headers when they clearly repeat the shared framework

Safe scope:

- leading H1 or title line that duplicates `post.title`
- leading branded kicker lines like `Roznamcha · ...`
- leading publish/update metadata lines baked into the body

Why safe:

- the new shared framework already renders a stronger title/excerpt/meta header
- removing duplicated body-level header clutter is presentation cleanup, not substantive rewriting

### 2. Strip narrow known promo boilerplate from trailing article endings

Safe scope:

- repeated end paragraphs that are clearly product CTA boilerplate rather than article substance
- known promotional phrases like `Roznamcha.pk`, `Visit Roznamcha`, generic free-budget prompts, or repetitive “track this in Roznamcha” endings when they appear as terminal boilerplate

Why safe:

- these endings are repeated archive-wide
- they weaken editorial trust
- the shared blog framework now provides a cleaner after-article journey already

Important condition:

- this should be pattern-based and narrow
- it must not remove real conclusions, real FAQs, or topic-specific final guidance

### 3. Run a metadata sanitation pass for obviously broken stored fields

Safe scope:

- empty excerpt
- URL-only excerpt
- keyword-list excerpt or keyword-list SEO description
- meta descriptions that duplicate the headline too closely or are too short to be useful

Why safe:

- the controller already has fallback logic
- a batch pass can target clearly broken source fields without rewriting healthy editorial metadata

### 4. Standardize old body-level branded labels only when they are purely decorative

Safe scope:

- `Roznamcha · X`
- similar decorative prefaces at the very top of articles

Why safe:

- the shared page template now carries the brand and trust framing
- these labels no longer add value and often make the body feel like an old SEO shell

## E. Exact Issues That Must Not Be Batch-Rewritten

These require article-specific decisions and should **not** be handled in a blind archive-wide pass:

- factual numbers, prices, inflation claims, and policy references inside article bodies
- forecast, prediction, quota, or subsidy claims
- duplicate-topic merge decisions
- off-core topic decisions such as whether an article should remain in the archive at all
- full rewrites of thin bodies into substantial guides
- article-specific argument structure, examples, and evidence depth

## F. Shortlist of the Worst Offending Articles

- `roznamcha-with-ai`
  reason: effectively empty; local content is just a YouTube URL
- `cost-of-living-pakistan-2026-monthly-budget-with-ai`
  reason: only `263` words and derivative of the non-AI cost-of-living article
- `electricity-bill-breakdown-pakistan-2026-unit-cost-fpa`
  reason: only `234` words on a topic that needs real depth
- `current-ration-price-list-2025-monthly-grocery-budget-family-of-5-pakistan`
  reason: only `284` words and already stale by year/topic framing
- `inflation-household-budget-pakistan-2026`
  reason: keyword-list excerpt and SEO description, plus modest depth
- `utility-store-vs-open-market-price-comparison-2026-pakistan`
  reason: only `460` words and still framed like clickbait/search bait
- `e-challan-bill-management-guide-pakistan-2026`
  reason: off-core relative to Roznamcha’s strongest household-budget positioning

## G. Shortlist of the Strongest Articles

- `pakistan-fuel-quota-system-petrol-price-april-2026`
- `pakistan-petrol-price-april-2026-rs458-budget-guide`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`
- `ghar-ka-monthly-budget`
- `pakistani-family-monthly-expense-control`
- `pakistani-household-essential-expenses-2026`
- `best-monthly-budget-50000-salary-pakistan-2026`

These are the clearest editorial assets worth preserving and using as quality anchors for future rewrite work.

## H. Recommendation for the Next Task

**Batch-safe improvement pass**

Why:

- the archive still has several low-risk, repeated structural weaknesses that can be improved together without pretending to fix weak bodies by magic
- the shared blog framework is already stronger, so the next sensible move is to clean inherited article-body clutter and clearly broken metadata in one controlled pass

Recommended sequence after that:

1. batch-safe improvement pass
2. cleanup/noindex/removal pass for the worst offenders
3. manual rewrite shortlist for the strategically important weak survivors
