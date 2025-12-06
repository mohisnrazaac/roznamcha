# Deploy Runbook (GitHub Actions + SSH)

## Overview
Roznamcha ships as a Laravel 12 + Inertia/React + Vite app. We support two deploy tracks:
1. **Track 1 – GitHub Actions → FTP** (`.github/workflows/deploy.yml`).
2. **Track 2 – Manual SSH/CLI** (`scripts/deploy.sh`).
Both tracks expect production `.env` to live on the server, database backups before migrations, and a post-deploy endpoint (`/ops/post-deploy`) that can run cache + migrate commands when FTP access lacks SSH.

## Track 1 – GitHub Actions → FTP
1. Push to `main` or run **Actions → “Deploy Roznamcha over FTP”** (workflow_dispatch).
2. Required repository secrets:
   - `FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_REMOTE_DIR`.
   - `POST_DEPLOY_URL`, `POST_DEPLOY_TOKEN` (HTTPS endpoint that runs Artisan commands server-side).
3. Optional workflow inputs:
   - `run_migrations` (boolean) – passes `{ "run_migrations": true }` to the post-deploy endpoint so it can call `php artisan migrate --force`.
   - `vite_base_path` – override Vite’s base if Apache serves Laravel from a subdirectory (e.g., `/apps/roznamcha/public/build/`).
4. Pipeline steps:
   - Checkout, install PHP 8.3 runtime, cache Composer (`composer install --no-dev --optimize-autoloader`).
   - Setup Node 20, `npm ci`, `npm run build` (writes `public/build/manifest.json`).
   - Run `bash scripts/prepare-deploy.sh` to mirror the repository (minus anything listed in `.deployignore`) into `deploy/rozapp/`. This gives Actions and manual operators the same trimmed bundle.
   - Upload bundle using `SamKirkland/FTP-Deploy-Action` over FTPS.
   - POST to `/ops/post-deploy` with bearer token; the endpoint should execute:
     `php artisan config:cache route:cache view:cache event:cache`, optionally `php artisan migrate --force`, `php artisan optimize`, `php artisan queue:restart`.

## Track 2 – SSH/CLI Script
Use when SSH becomes available.
1. SSH into the host, `cd` into the Laravel project root.
2. Run `bash scripts/deploy.sh`:
   - Puts app in maintenance mode.
   - Installs Composer dependencies (`--no-dev`).
   - Warms caches, runs `php artisan migrate --force --no-interaction`.
   - Installs Node deps (`npm ci`) and rebuilds assets.
   - Re-links storage, runs `php artisan optimize`, and brings the app up.
3. Adjust `PATH`/`NODE_ENV` variables as needed for shared hosting (e.g., `export NODE_OPTIONS=--openssl-legacy-provider` on older Node runtimes).

## Secrets & Configuration Checklist
- `.env` must include `APP_ENV=production`, `APP_DEBUG=false`, correct `APP_URL`, optional `ASSET_URL`, `VITE_BASE_PATH` if hosted in a subfolder, database/queue/mail credentials, and a `POST_DEPLOY_TOKEN` to validate the webhook.
- Ensure `storage/` is writable by the web user and `php artisan storage:link` can run (Track 2 handles it; Track 1 relies on the server’s symlink).
- FTP deployments require a `.deployignore` tuned to skip logs/zips/tests; keep it updated as new folders are added.

## Rollback Procedure
1. Restore the latest SQL dump (`mysql < backup.sql`).
2. Re-upload the last known-good artifact (Actions keeps prior runs downloadable).
3. Run `php artisan migrate:rollback --step=1 --force` if only the latest migration is problematic.
4. Clear caches: `php artisan config:clear && php artisan route:clear && php artisan view:clear && php artisan event:clear`.
5. Smoke-test using the `docs/post_deploy_checklist.md`.
