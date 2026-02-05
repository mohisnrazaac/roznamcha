# Repository Guidelines

## Project Structure & Module Organization
Laravel application logic lives in `app/`, keeping controllers, jobs, listeners, and policies aligned with their `App\` namespaces. Web routes stay in `routes/web.php`, APIs in `routes/api.php`, and console kernels under `app/Console`. Frontend screens belong to `resources/js/Pages`, shared UI to `resources/js/Components`, and Tailwind-first assets under `resources/` before Vite outputs to `public/`. Database migrations, factories, and seeders live in `database/`, translations in `lang/`, and PHPUnit specs in `tests/Feature` or `tests/Unit`.

## Build, Test, and Development Commands
- `composer run setup` — installs PHP and Node dependencies, copies `.env`, and runs migrations for a clean bootstrap.
- `composer run dev` — starts the Laravel server alongside Vite and HMR for full-stack development.
- `php artisan migrate` — applies schema changes; run after updating migrations or pulling new branches.
- `composer run test` (or `php artisan test --parallel`) — executes the full PHPUnit suite.
- `npm run build` — generates production-ready frontend assets.

## Coding Style & Naming Conventions
Follow `.editorconfig`: UTF-8, LF, and four-space indentation for PHP. Mirror namespaces to directory structure, keep tables and columns snake_case, and name React components with PascalCase filenames plus camelCase props and state. Format PHP with `./vendor/bin/pint`, rely on the Vite ESLint preset for JS/TS linting, and only extend styling via `tailwind.config.js`.

## Testing Guidelines
Feature specs extend `Tests\TestCase` and should `use RefreshDatabase` whenever persistence is touched. Unit tests avoid the database and mock integrations instead. Name every test file `*Test.php`, favor factories like `User::factory()->verified()`, and run `composer run test` (or `php artisan test --parallel`) before opening a pull request. Document any manual QA when UI flows change so reviewers can replicate the steps.

## Commit & Pull Request Guidelines
Write commit subjects in present tense and roughly 55 characters (e.g., `Tighten expense policy checks`), adding contextual bodies when needed. Pull requests must explain what changed, why it matters, and how to verify it. Reference related issues, list commands executed (such as `composer run test` or `npm run build`), call out schema or env updates, and attach screenshots or screencasts for frontend work.

## Security & Configuration Tips
Never commit `.env`, SQL dumps, or secrets; instead keep sanitized defaults in `.env.example`. Run artisan/composer/npm commands from `/Applications/XAMPP/xamppfiles/htdocs/roznamcha` to avoid path mismatches. Leave config and route caching disabled during development, scrub sensitive data from logs, and document new feature flags so operators can mirror production quickly.
