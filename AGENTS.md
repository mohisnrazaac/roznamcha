# Repository Guidelines

## Project Structure & Module Organization
Laravel domain logic, controllers, jobs, and policies live in `app/`, while configuration defaults sit in `config/`. Public HTTP entry points stay in `routes/web.php`, and Inertia-powered React views belong to `resources/js/Pages` with shared UI in `resources/js/Components`. Vite compiles frontend assets into `public/`. Database migrations, factories, and seeders live in `database/`, and tests are split between `tests/Feature` for end-to-end flows and `tests/Unit` for isolated services.

## Build, Test, and Development Commands
Run `composer run setup` after cloning to install dependencies, copy `.env`, generate the app key, migrate, and build assets. Daily work uses `composer run dev` to boot Laravel plus Vite. Use `php artisan serve` only when you need the API without the asset pipeline. Produce deployable bundles via `npm run build`, and mirror CI with `composer run test`, which clears caches before executing `php artisan test`.

## Coding Style & Naming Conventions
`.editorconfig` enforces UTF-8, LF endings, four spaces for PHP, and two for YAML. Keep namespaces under `App\...` (for example `App\Domain\Expense`) and keep database tables snake_case. React components are PascalCase (`ExpenseCard.jsx`), while JS state and props stay camelCase. Run `./vendor/bin/pint` before committing PHP, rely on the Vite ESLint preset for JS, and reach for Tailwind utility classes, extracting repeated patterns into `resources/js/Components`.

## Testing Guidelines
Feature tests extend `Tests\TestCase`, live in `tests/Feature`, and should use `RefreshDatabase` whenever models are persisted. Pure services or helpers belong in `tests/Unit` with explicit mocks or fakes. Run `php artisan test --parallel` before pushing anything that touches the database to catch race conditions early. Keep test classes suffixed with `Test.php` and mirror the namespaces of the code they cover.

## Commit & Pull Request Guidelines
Write short, present-tense commit subjects (~55 characters) such as `Harden expense export`, and reference tickets in the body when useful. Pull requests must explain what changed, why it was needed, and how to validate (commands or quick screenshots/GIFs for UI). Call out migrations, new env keys, or scripts so reviewers can prepare. Confirm `composer run test` and `npm run build` before requesting review.

## Security & Environment Tips
Never commit `.env`, SQL dumps, or production secrets; rely on `.env.example` for defaults. Reserve `php artisan config:cache` and `php artisan route:cache` for deployment so local edits stay live. Run commands from the repository root to respect the sandbox, and use CI secrets or parameter stores rather than hard-coded credentials.
