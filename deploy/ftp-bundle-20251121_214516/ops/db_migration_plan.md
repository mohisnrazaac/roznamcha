# DB Migration Safety Plan

## 1. Inventory & Risks
- **Tables**: Users/core tables (0001_*), domain tables (`roles`, `role_user`, `categories`, `expenses`, `ration_items`, `ration_history`, `reminders`, `report_cache`, `user_settings`, `announcements`, `kharcha_entries`, `ration_entries`).
- **Duplicate schemas**: `reminders` exists twice (`2025_10_27_152841` legacy columns vs `2025_10_28_175400` current columns). Running both drops & recreates the table twice, wiping prod data. Consolidate before next deploy.
- **Destructive `up()` calls**: `kharcha_entries`, `ration_entries`, `reminders` migrations call `Schema::dropIfExists` inside `up()`, so a rerun (e.g., `migrate:fresh`) will erase live data. Avoid re-running these on production without full backups.
- **Seeder mismatches**: `RoznamchaDemoSeeder` writes columns (`type`, `next_due`, `frequency`, `status`) that aren’t in the active `reminders` schema and will fail at runtime. Keep demo seeders disabled in production until aligned.

## 2. Backup Strategy
1. **MySQL dump**: `mysqldump -u <user> -p'<pass>' <db> > backups/roznamcha_$(date +%F_%H%M).sql` taken on the hosting panel before every deploy.
2. **Laravel snapshot (optional)**: `php artisan schema:dump --prune` locally to lock schema history without re-running the destructive migrations.
3. **Env snapshot**: Copy `.env` and `config/*.php` from production into `/secure/backups/env_$(date)` for rollback reference.

## 3. Dry-run & Validation
1. **Staging DB**: Restore the latest prod dump into a staging schema.
2. **Dry migration**: `php artisan migrate --pretend --env=staging` to confirm SQL output. This surfaces accidental `drop table` statements before they hit prod.
3. **Seeder smoke**: If demo data is needed, run `php artisan db:seed --class=RoznamchaDemoSeeder` only after schema fixes; otherwise skip to prevent failure.
4. **Integrity checks**: On staging, run bespoke queries (counts for `kharcha_entries`, `ration_entries`, `reminders`) and ensure no NULL constraint violations.

## 4. Production Apply Plan
1. Put the site in maintenance (`php artisan down --render="errors.maintenance"`).
2. Upload code via the GitHub Action or SSH.
3. **Backups confirmed**: Verify the fresh SQL dump exists and is downloadable.
4. Run migrations with verbose logging: `php artisan migrate --force --no-interaction` (covered by `/ops/post-deploy` endpoint or `scripts/deploy.sh`).
5. If new seed data is required, run targeted, idempotent seeders only (e.g., `php artisan db:seed --class=AdminUserSeeder`). Avoid demo seeders in prod.
6. Run optimizations (`config:cache`, `route:cache`, `view:cache`, `event:cache`, `optimize`) and bring app up (`php artisan up`).

## 5. Rollback Notes
- For a single broken migration, run `php artisan migrate:rollback --step=1 --force` while still in maintenance mode.
- If destructive migrations ran accidentally, restore from the SQL dump: `mysql -u <user> -p'<pass>' <db> < backups/roznamcha_<timestamp>.sql`.
- Keep a changelog of migration hashes applied (from `migrations` table) to reconcile partial deploys.

## 6. Seeder Policy
- `AdminUserSeeder` is idempotent (`updateOrCreate`) and safe for prod.
- `RoznamchaDemoSeeder` should be limited to local/staging. Gate it via `if (!app()->isProduction())` once schema mismatches are fixed.
