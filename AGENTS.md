# Repository Guidelines

## Project Structure & Module Organization
Laravel domain logic (controllers, jobs, listeners, policies) sits in `app/`, while HTTP routes load through `routes/web.php`. Inertia pages live in `resources/js/Pages` and React components in `resources/js/Components`; treat other directories as JSX-free. Asset sources live under `resources/` and compile to `public/`. Database migrations, factories, and seeders belong in `database/`, and localization strings stay in `lang/`. Tests split between `tests/Feature` for HTTP flows and `tests/Unit` for isolated services.

## Build, Test, and Development Commands
- `composer run setup` — installs PHP/NPM deps, copies `.env`, generates the key, and runs migrations.
- `composer run dev` — boots Laravel with Vite for hot module reloading.
- `php artisan migrate` — applies schema changes; run after pulling migrations.
- `composer run test` or `php artisan test --parallel` — executes PHPUnit suites.
- `npm run build` — emits production assets; pair with release branches.

## Coding Style & Naming Conventions
`.editorconfig` enforces UTF-8, LF endings, and four-space PHP indentation. PHP classes mirror their `App\...` namespaces and keep StudlyCase filenames, while database tables and columns stay snake_case. React files (e.g., `resources/js/Pages/ExpenseCard.jsx`) follow PascalCase filenames with camelCase props/state. Run `./vendor/bin/pint` for PHP formatting, rely on the repo Vite ESLint preset for JS/TS, and only extend Tailwind utilities from `tailwind.config.js`.

## Testing Guidelines
Feature specs extend `Tests\TestCase`, hit HTTP routes, and should `use RefreshDatabase` whenever data mutates. Unit tests stay pure, mock integrations, and avoid the database. Name every test class `*Test.php`, seed via factories such as `User::factory()->verified()`, and keep fixtures minimal. Always run `composer run test` before pushing.

## Commit & Pull Request Guidelines
Use present-tense commit subjects near 55 characters (e.g., `Harden expense export`) and add a short body when intent is unclear from the diff. Pull requests must explain what changed, why it matters, and how to verify—include commands or screenshots for UI work. Call out schema updates, new env keys, or artisan scripts reviewers must run, and confirm both `composer run test` and `npm run build` in the PR template.

## Security & Configuration Tips
Never commit `.env`, SQL dumps, or credentials; defaults belong in `.env.example`. Run artisan, composer, and npm commands from the repo root so paths resolve consistently, and keep config/route caching disabled in dev to avoid stale bindings. Scrub sensitive values from logs or screenshots, and document new feature flags or configuration toggles inside the PR so operators can mirror your setup.
