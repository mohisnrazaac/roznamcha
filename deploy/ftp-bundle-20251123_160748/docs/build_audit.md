# Build & Repository Audit

## Platform Snapshot
- **PHP**: `php -v` → 8.3.12; **Laravel**: `php artisan --version` → 12.35.1 (`composer.json` requires ^12.0).
- **Node**: `node -v` → 24.10.0; **Vite** 5.4.0 with React + Laravel plugins (`package.json`).
- **Scripts**: Composer defines `setup`, `dev`, `test`; npm exposes only `dev`/`build` (no JS tests or lint commands).

## Findings & Required Fixes

### Backend / Laravel
1. **Route helpers & Ziggy** – `resources/js/ziggy.js` still points to `127.0.0.1:8002` and lacks newer routes (kharcha/ration/reminders/reports). Regenerate via `php artisan ziggy:generate resources/js/ziggy.js` during deploy to keep Inertia links accurate.
2. **Route name drift** – React AppLayout components use names like `route('kharcha.map')` and `route('reports.generate')` that do not exist in `routes/web.php`. Align component imports or add named routes to avoid runtime errors once Ziggy syncs.
3. **Duplicate migrations** – Two reminder migrations (`2025_10_27_152841_create_reminders_table.php` and `2025_10_28_175400_create_reminders_table.php`) conflict on schema (`type` vs `reminder_type`). Consolidate into one forward-only migration before next deploy.
4. **Seeder schema mismatch** – `database/seeders/RoznamchaDemoSeeder.php` writes `type`, `next_due`, `frequency`, `status` columns that are absent in the current `reminders` table. Update seeder after schema is final so `php artisan db:seed` does not fail.
5. **Queues & cache tables** – `.env.example` defaults to `QUEUE_CONNECTION=database`, `CACHE_STORE=database`, `SESSION_DRIVER=database`, but the migrations for `jobs`, `cache`, and `sessions` must be run before enabling queue workers/`php artisan queue:listen` (invoked by `composer run dev`). Document this in ops guides.
6. **.env parity** – `.env.example` still says `APP_NAME=Laravel`, `APP_URL=http://localhost`, no `ASSET_URL` or `VITE_BASE_PATH`. Update defaults to reflect production host and ensure new env keys (FTP token, POST_DEPLOY_TOKEN) are mirrored.

### Frontend / Vite
1. **Base path** – `vite.config.js` forces `base: '/build/'`, which only works when Laravel lives at domain root. Use `process.env.VITE_BASE_PATH ?? '/build/'` so cPanel subfolders (e.g., `/apps/roznamcha/public`) can override via `.env`.
2. **Manifest + Ziggy assets** – Production build currently lands in `public/build` with `manifest: true`, but there is no CI step to clean the directory before upload besides Vite’s `emptyOutDir`. Keep `public/build` out of Git and ensure FTP deploy uploads both `public/build` and `public/mix-manifest` (if introduced) together.
3. **Node build cache** – Add `~/.npm` cache + `node_modules/.vite` caching to GitHub Actions to keep build minutes low; also add `npm ci` (not `npm install`) to ensure deterministic builds.

### Config & Storage
1. **Storage symlink** – `public/storage` is not committed (good) but there’s no automation; add `php artisan storage:link || true` to deployment scripts (see `scripts/deploy.sh`).
2. **Cache/optimize** – Introduce a dedicated Artisan endpoint (`/ops/post-deploy`) or SSH script that runs `config:cache`, `route:cache`, `view:cache`, `event:cache`, and `optimize` post-deploy so cached config matches the uploaded code.
3. **Log/queue/mail safety** – `.env.example` uses `log` drivers (broadcast, mail), which is safe for shared hosting. Document overrides for production SMTP/Redis so they don’t break the build if credentials are absent.

### Assets / Deployment
1. **Zips & deploy folders** – `deploy/` and several `.zip` artifacts live in the repo root. Add them to `.deployignore` (and `.gitignore` if not already) so CI doesn’t upload outdated bundles.
2. **Hot file** – `public/hot` is present, which will break production if Vite dev server URL leaks. Ensure deploy scripts delete `public/hot` before syncing and rely on compiled assets only.
3. **Missing .deployignore** – Without it, FTP sync will upload `node_modules`, tests, storage/app/private, etc. Provide `.deployignore` to keep deployments lean and compliant.

## Recommended Command Matrix
- **Local bootstrap**: `composer run setup` → wraps composer install, `.env` copy, key generation, migrations, npm install, `npm run build`.
- **Dev loop**: `composer run dev` (php artisan serve + queue + pail + Vite). Requires database + Redis when queues are active.
- **Back-end tests**: `composer run test` (clears config cache then runs `php artisan test`). Add JS/Vitest suite once components gain logic.
- **Manual prod prep**: `php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan event:cache && npm run build` before packaging.
