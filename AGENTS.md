# Repository Guidelines

## Project Structure & Module Organization
Laravel source code lives in `app/` and mirrors the `App\` namespaces for controllers, jobs, listeners, and policies. Web routes belong in `routes/web.php`, while API routes and console kernels follow Laravel defaults under `routes/api.php` and `app/Console`. Frontend screens reside in `resources/js/Pages`, shared components in `resources/js/Components`, and Tailwind-first assets under `resources/` before Vite outputs to `public/`. Database migrations, factories, and seeders are contained in `database/`, translations in `lang/`, and PHPUnit specs in `tests/Feature` or `tests/Unit`.

## Build, Test, and Development Commands
- `composer run setup` — installs PHP/NPM dependencies, copies `.env`, and runs migrations for a clean bootstrap.
- `composer run dev` — starts the Laravel server, Vite, and HMR for full-stack development.
- `php artisan migrate` — applies new schema changes; re-run whenever migrations change.
- `composer run test` (or `php artisan test --parallel`) — executes the full PHPUnit suite.
- `npm run build` — compiles production-ready frontend assets.

## Coding Style & Naming Conventions
The repository follows `.editorconfig`: UTF-8, LF, and four-space indentation for PHP. Match classes to their `App\...` namespaces, keep database tables and columns snake_case, and name React components with PascalCase filenames plus camelCase props/state. Format PHP using `./vendor/bin/pint`, rely on the Vite ESLint preset for JS/TS, and extend styling only via `tailwind.config.js`.

## Testing Guidelines
Feature tests extend `Tests\TestCase` and should `use RefreshDatabase` when they touch persistence. Unit tests avoid the database and mock integrations. Name every test file `*Test.php`, prefer factories like `User::factory()->verified()`, and run `composer run test` (or `php artisan test --parallel`) before opening a pull request. Document any manual QA whenever UI flows change.

## Commit & Pull Request Guidelines
Write commit subjects in present tense around 55 characters (e.g., `Tighten expense policy checks`) and add contextual bodies when helpful. Pull requests must describe what changed, why it matters, and how reviewers can verify it. Reference related issues, list commands executed (such as `composer run test` or `npm run build`), call out schema or env updates, and include screenshots or screencasts for frontend work.

## Security & Configuration Tips
Never commit `.env`, SQL dumps, or credentials; keep sanitized defaults in `.env.example`. Run artisan/composer/npm commands from `/Applications/XAMPP/xamppfiles/htdocs/roznamcha` for consistent local paths. Leave config and route caching disabled during development, scrub sensitive data from logs, and document new feature flags so operators can mirror production quickly.
