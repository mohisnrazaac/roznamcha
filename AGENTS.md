# Repository Guidelines

## Project Structure & Module Organization
Laravel application code lives in `app/` (controllers, jobs, listeners, policies). HTTP routes are registered in `routes/web.php`. Inertia screens stay in `resources/js/Pages`, reused React components in `resources/js/Components`, and static assets elsewhere under `resources/` before Vite emits them to `public/`. Database migrations, factories, and seeders sit within `database/`, translations in `lang/`, and automated tests split between `tests/Feature` for HTTP flows and `tests/Unit` for isolated services.

## Build, Test, and Development Commands
- `composer run setup` — initial bootstrap: installs PHP/NPM deps, copies `.env`, and runs migrations.
- `composer run dev` — serves Laravel with Vite HMR for full-stack development.
- `php artisan migrate` — applies new migrations after schema changes.
- `composer run test` or `php artisan test --parallel` — executes the PHPUnit suite; ensure green before merging.
- `npm run build` — compiles production assets; run ahead of releases or staging drops.

## Coding Style & Naming Conventions
`.editorconfig` enforces UTF-8, LF endings, and four-space PHP indentation. Match class names to their `App\...` namespace, keep database tables and columns snake_case, and follow Laravel resource naming patterns (e.g., `ExpenseReportController`). React files are PascalCase, while props/state remain camelCase. Format PHP with `./vendor/bin/pint`, rely on the Vite ESLint preset for JS/TS, and extend Tailwind only via `tailwind.config.js`.

## Testing Guidelines
Write feature tests that extend `Tests\TestCase`, hit HTTP routes, and `use RefreshDatabase` when mutating data. Unit tests stay DB-free and mock external integrations. Name every test class `*Test.php`, prefer factories such as `User::factory()->verified()`, and keep fixtures minimal. Run `composer run test` locally before opening any PR and record manual QA steps when UI work is involved.

## Commit & Pull Request Guidelines
Commits should use present-tense subjects near 55 characters (e.g., `Tighten expense policy checks`) with optional bodies for rationale. Pull requests must describe what changed, why it matters, and how reviewers can verify (commands, screenshots, or screencasts). Call out schema updates, new env keys, or artisan scripts reviewers must run, and confirm both `composer run test` and `npm run build` in the PR template with related issue links.

## Security & Configuration Tips
Never commit `.env`, SQL dumps, or secrets—defaults belong in `.env.example`. Operate artisan/composer/npm commands from `/Applications/XAMPP/xamppfiles/htdocs/roznamcha`. Keep config/route caching disabled during development, scrub sensitive values from logs or screenshots, and document any new toggles so operators can mirror production setups quickly.
