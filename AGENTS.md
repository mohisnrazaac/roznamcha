# Repository Guidelines

## Project Structure & Module Organization
Roznamcha combines Laravel and Inertia-powered React. PHP domain logic, controllers, jobs, and policies live under `app/`, with HTTP entry points in `routes/web.php`. React pages belong to `resources/js/Pages`, shared UI resides in `resources/js/Components`, and no other tree should contain JSX. Assets flow through Vite and land in `public/`, while Tailwind config sits at `tailwind.config.js`. Database migrations, factories, and seeders live in `database/`, localized strings in `lang/`, and tests split between `tests/Feature` and `tests/Unit`.

## Build, Test, and Development Commands
Use `composer run setup` after cloning to install dependencies, copy `.env`, generate keys, run migrations, and build assets. `composer run dev` starts Laravel and Vite together for local UI work; prefer it over `php artisan serve`. Run `composer run test` for the standard pre-commit suite (cleans caches then executes `php artisan test`). Before releases, run `npm run build` to produce production JS/CSS bundles, and consider `php artisan test --parallel` for DB-heavy changes.

## Coding Style & Naming Conventions
`.editorconfig` enforces UTF-8, LF, and four-space indentation for PHP (two for YAML). Namespaces follow the `App\...` pattern, database tables remain snake_case, and React components use PascalCase with camelCase props/state (e.g., `ExpenseCard.jsx`). Favor Tailwind utility classes, extracting repeated patterns into shared components. Run `./vendor/bin/pint` on PHP files and rely on the bundled Vite ESLint preset for JS/TS linting before committing.

## Testing Guidelines
Feature tests extend `Tests\TestCase` in `tests/Feature`, typically with `RefreshDatabase` when persisting models. Unit tests target isolated services in `tests/Unit`, mocking external dependencies explicitly. Name every test class with a `*Test.php` suffix mirroring the namespace of the code under test. Run `composer run test` locally before pushing, and add `php artisan test --parallel` to surface migration or seeder race conditions.

## Commit & Pull Request Guidelines
Write short, present-tense commit subjects (~55 characters) like `Harden expense export`; add descriptive bodies when context is unclear. Every pull request should explain what changed, why, and how to validate (commands or screenshots/GIFs for UI flows). Call out schema changes, new env keys, or scripts teammates must run. Confirm both `composer run test` and `npm run build` before requesting review, and link tracking issues when applicable.

## Security & Configuration Tips
Never commit `.env`, SQL dumps, or production secrets—defaults belong in `.env.example`. Always run commands from the repository root to respect sandbox paths, and leave `php artisan config:cache` or `route:cache` for deployments so local edits stay live. Use CI secrets or parameter stores instead of hard-coding credentials, and scrub logs or screenshots before sharing externally.
