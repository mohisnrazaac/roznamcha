# Repository Guidelines

## Project Structure & Module Organization
Laravel domain logic (controllers, jobs, listeners, policies) lives in `app/`, with HTTP entry points defined in `routes/web.php`. Inertia pages belong in `resources/js/Pages`, and re-usable React pieces in `resources/js/Components`; keep every other directory JSX-free. Source assets originate in `resources/` and build into `public/`. Database migrations, factories, and seeders reside in `database/`, while language strings sit under `lang/`. Tests split between `tests/Feature` for HTTP flows and `tests/Unit` for isolated services.

## Build, Test, and Development Commands
After cloning, run `composer run setup` to install PHP and NPM dependencies, copy `.env`, generate the key, and run initial migrations. Start the Laravel plus Vite dev stack with `composer run dev`. Produce release-ready assets using `npm run build`. Apply schema updates via `php artisan migrate`. Execute the full suite with `composer run test`, narrow failures with `php artisan test --filter SomeTest`, and use `php artisan test --parallel` for faster feedback.

## Coding Style & Naming Conventions
`.editorconfig` enforces UTF-8, LF endings, and four-space indentation for PHP. PHP classes mirror their `App\...` namespaces and use StudlyCase filenames, while tables and columns remain snake_case. React components follow PascalCase filenames and camelCase props/state (e.g., `resources/js/Pages/ExpenseCard.jsx`). Run `./vendor/bin/pint` to format PHP, rely on the repo Vite ESLint preset for JS/TS, and only extend Tailwind utilities inside `tailwind.config.js`.

## Testing Guidelines
Feature specs extend `Tests\TestCase`, hit HTTP endpoints, and should `use RefreshDatabase` when mutating records. Unit specs stay pure, mock integrations, and avoid the DB. Name all tests `*Test.php`, seed data with concise factories (e.g., `User::factory()->verified()`), and keep fixtures minimal. Always run `composer run test` before pushing.

## Commit & Pull Request Guidelines
Write present-tense commit subjects around 55 characters (e.g., `Harden expense export`) and add a brief body if context is not obvious from the diff. PRs explain what changed, why it matters, and how reviewers should validate the update—include commands, screenshots, or GIFs for UI tweaks. Highlight schema changes, new env keys, or scripts teammates must run, and confirm both `composer run test` and `npm run build` in the PR template.

## Security & Configuration Tips
Never commit `.env`, SQL dumps, or credentials; defaults belong in `.env.example`. Run artisan, composer, and npm commands from the repo root, and keep config/route caching disabled so deploys mirror dev. Scrub sensitive values from logs or screenshots, and document new feature flags or config toggles in PRs so operators can mirror your setup.
