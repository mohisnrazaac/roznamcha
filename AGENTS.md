# Repository Guidelines

## Project Structure & Module Organization
Roznamcha pairs Laravel with Inertia-powered React. Domain logic, controllers, jobs, and policies stay under `app/`, configs under `config/`, and artisan entry points under `routes/web.php`. React pages belong to `resources/js/Pages` with shared UI in `resources/js/Components`; `resources/js` is the only place to touch JSX. Assets flow through Vite, ending in `public/`, while Tailwind config lives at `tailwind.config.js`. Database migrations, factories, and seeders live in `database/`, language strings in `lang/`, and docs or operational runbooks in `docs/` and `ops/`. Tests are split between `tests/Feature` and `tests/Unit` for HTTP-layer and pure service coverage respectively.

## Build, Test, and Development Commands
- `composer run setup` – bootstraps a fresh clone (dependencies, `.env`, key generation, migrations, and asset build).
- `composer run dev` – starts Laravel and Vite together; rely on this rather than `php artisan serve` during UI work.
- `composer run test` – clears caches and executes `php artisan test`, matching CI defaults; use `php artisan test --parallel` before merging DB-heavy work.
- `npm run build` – produces production JS/CSS bundles; confirm before tagging releases.

## Coding Style & Naming Conventions
`.editorconfig` enforces UTF-8, LF, and four-space PHP indentation (two for YAML). Namespaces live under `App\...` (e.g., `App\Domain\Expense`), database tables stay snake_case, and React components use PascalCase (`ExpenseCard.jsx`) with camelCase props/state. Favor Tailwind utility classes, extracting repeated patterns into `resources/js/Components`. Run `./vendor/bin/pint` on PHP files and let the bundled Vite ESLint preset lint JS/TS before committing.

## Testing Guidelines
Feature tests extend `Tests\TestCase` in `tests/Feature`, usually with `RefreshDatabase` when persisting models. Unit tests target isolated services or helpers inside `tests/Unit`, mocking external dependencies explicitly. Name every test class with the `*Test.php` suffix and mirror the namespace of the code under test. Run `composer run test` locally before pushing, and add `php artisan test --parallel` to catch race conditions around migrations or seeders.

## Commit & Pull Request Guidelines
Write short, present-tense commit subjects (~55 chars) such as `Harden expense export`, followed by descriptive bodies when context is not obvious. Every pull request should explain what changed, why, and how to validate (commands or screenshots/GIFs for UI flows). Call out schema changes, new env keys, or scripts that other developers must run. Confirm both `composer run test` and `npm run build` before requesting review, and link tracking issues when applicable.

## Security & Environment Tips
Never commit `.env`, SQL dumps, or production secrets—defaults belong in `.env.example`. Always run commands from the repository root to respect sandbox paths, and leave `php artisan config:cache` / `route:cache` for deployments so local edits stay live. Use CI secrets or parameter stores instead of hard-coding credentials, and scrub logs or screenshots before sharing outside the team.
