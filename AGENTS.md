# Repository Guidelines

## Project Structure & Module Organization
Laravel domain logic (controllers, jobs, listeners, policies) lives in `app/`, while HTTP routes register through `routes/web.php`. Front-end screens use Inertia: page components reside in `resources/js/Pages` and shared React pieces under `resources/js/Components`. Plain assets stay elsewhere in `resources/` and are emitted to `public/` after builds. Database migrations, factories, and seeders live in `database/`, localization strings go in `lang/`, and tests split between `tests/Feature` for HTTP flows and `tests/Unit` for isolated services. Keep JSX exclusively in the `resources/js` tree; treat other directories as PHP-only.

## Build, Test, and Development Commands
- `composer run setup` installs PHP/NPM dependencies, copies `.env`, and runs migrations; use it for first-time setup or clean rebuilds.
- `composer run dev` boots the Laravel HTTP server alongside Vite HMR for UI work.
- `php artisan migrate` applies schema changes after pulling migrations.
- `composer run test` (or `php artisan test --parallel`) executes the PHPUnit suite; ensure a green run before pushing.
- `npm run build` compiles production assets—pair with release or staging verification.

## Coding Style & Naming Conventions
The repo’s `.editorconfig` enforces UTF-8, LF endings, and four-space PHP indentation. PHP class names mirror their `App\...` namespaces (StudlyCase filenames), while database tables and columns remain snake_case. React files follow PascalCase filenames with camelCase props/state. Run `./vendor/bin/pint` to format PHP and rely on the Vite ESLint preset for JS/TS linting. Extend Tailwind utilities only through `tailwind.config.js`.

## Testing Guidelines
Feature tests extend `Tests\TestCase`, hit HTTP routes, and should `use RefreshDatabase` whenever data mutates. Unit tests stay pure, mock integrations, and avoid direct database calls. Name every test class `*Test.php`, rely on factories such as `User::factory()->verified()`, and keep fixtures minimal. Always run `composer run test` before submitting changes, and document any additional manual QA steps in the PR.

## Commit & Pull Request Guidelines
Write present-tense commit subjects near 55 characters (e.g., `Harden expense export`) with optional short bodies for context not obvious from the diff. Pull requests must explain what changed, why it matters, and how to verify it; include command logs or screenshots for UI work. Call out schema updates, new env keys, artisan scripts, or feature flags reviewers must run. Confirm both `composer run test` and `npm run build` in the PR template, and link any related issues.

## Security & Configuration Tips
Never commit `.env`, SQL dumps, or secrets; defaults belong in `.env.example`. Run artisan, composer, and npm commands from the repo root (`/Applications/XAMPP/xamppfiles/htdocs/roznamcha`) for consistent paths. Keep config/route caching disabled in development to avoid stale bindings, scrub sensitive values from logs or screenshots, and document new configuration toggles so operators can mirror your setup.
