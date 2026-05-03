# Smart Budget Templates

This module adds a public-facing budget template catalog that works as a preview first and a saved household asset second.

The important product choice here is that templates are not generated on every request. Each catalog item is created once, stored in `budget_templates.template_json`, and then served from the database with an application cache key on top. If AI is unavailable or returns bad JSON, the system falls back to a local survival-first structure so the page still works and we do not keep burning requests.

## What ships

- A new `budget_templates` table with starter entries for salary-based, family, student, and joint-family budgets.
- A new `budget_template_user` table to remember who saved what, which household it belongs to, and whether PRO was unlocked later.
- A new `TemplateController` for listing templates, showing previews, saving, and downloading PDFs.
- A template generator service that only generates when `template_json` is missing.
- A download service that produces free and PRO PDFs with DOMPDF.
- Two new Inertia pages under `resources/js/Pages/Templates`.

## User flow

Guest users can browse the catalog and see a partial preview on the detail page. They cannot download. The page pushes them toward the same CTA everywhere: save it for the household, then come back later.

Logged-in users can save a template, which creates or updates a row in `budget_template_user`. The saved list appears on the template index, and the same module is linked from the control-room navigation so the template can be revisited from the app later.

Logged-in users can also download the free PDF immediately. PRO remains deliberately locked unless `pro_unlocked_at` exists on the save row. The download path already has the right gate and placeholder copy for future JazzCash or SadaPay wiring.

## Public promotion and SEO

The templates now sit on the public marketing path instead of hiding behind app discovery. The homepage carries a dedicated Smart Budget Templates section with direct links to the catalog and the individual starter pages. The public Features page now promotes the module as a guest-entry surface as well.

For search engines, the catalog is linked in the public navigation, linked again in the homepage internal-link block, and exposed through a dedicated XML sitemap at `/templates-sitemap.xml`. `robots.txt` now advertises that sitemap so Google can discover the public template URLs without needing the main app session.

If a shared-hosting deploy needs a manual refresh without SSH access, `public/regenerate-sitemaps.php` can clear the cached sitemap keys and warm both sitemap endpoints once from the browser. It is a one-off operational helper and should be deleted after a successful run.

## AI, caching, and idempotency

`TemplateGeneratorService::getOrGenerate()` does three things:

1. Checks the stored JSON first.
2. Uses a cache key tied to the template `updated_at` timestamp so repeated reads are cheap.
3. Uses a database transaction with a row lock before writing the generated payload, so two requests do not race to create the same template.

The actual prompt is strict JSON and includes the required Pakistani household categories. If the AI answer misses required fields like atta, ghee, sugar, electricity, gas, or school fees when family size is above two, the answer is rejected and the fallback template is stored instead.

## PDF modes

The free PDF includes:

- Category breakdown
- Amounts and percentages
- Practical saving tips

The PRO PDF adds:

- Inflation impact at 12%
- Next month projection
- Ask Roza tips

## One implementation note

`app/Services` is root-owned in this workspace, so the two new service classes live in `app/TemplateServices/`. They now use the `App\TemplateServices\...` namespace directly, which means production can autoload them through the default `App\` PSR-4 mapping without relying on a fresh Composer dump after deployment.

There is also a small Blade-side Vite fallback in `resources/views/app.blade.php`: if `public/build/manifest.json` is missing but `public/build/.vite/manifest.json` exists, Laravel switches to the hidden manifest for that request. This is only there to tolerate imperfect shared-hosting uploads; the correct deploy still includes the full `public/build/` output.

The public homepage and the template detail page can now host styled AdSense blocks that look native to the site without disguising that the content is sponsored. They only render when `VITE_ADSENSE_HOME_SLOT` and `VITE_ADSENSE_TEMPLATE_SLOT` are set, so deployment can control the real in-page ad units without changing code again.
