# Roznamcha

Laravel + Inertia + React + Tailwind starter skeleton based on approved Roznamcha mockups.

This project includes:
- Public site (Home, About, Contact, Login)
- Auth-protected Admin Panel (Dashboard, Kharcha Map list, Add Expense form, Reports)

NOTE:
- This is a scaffold. You still need to create actual Laravel app (`laravel new roznamcha` or `composer create-project laravel/laravel roznamcha`) and then COPY these files into it.
- Database models/controllers for real data are not included yet.

Folder mapping:
- routes/web.php -> replace/merge into your Laravel routes/web.php
- resources/js/... -> copy into your Laravel resources/js
- tailwind.config.js, postcss.config.js, package.json -> merge with your Laravel versions

## Maintenance Runner
- Set `MAINTENANCE_PAGE_ENABLED=true` and define a long, random `MAINTENANCE_TRIGGER_SECRET` in `.env` when you need to run database upgrades without SSH access.
- Visit `/maintenance/run` in the browser, enter the secret token, and submit the form to force-run both `migrate` and `db:seed`.
- Disable the page (`MAINTENANCE_PAGE_ENABLED=false`) immediately after use so it is not exposed publicly.

## Repository Modules & Functionality

### Global Architecture
- `routes/web.php` wires public marketing pages, auth screens, the Control Room panel, admin CRUD, and the throttled maintenance trigger. Authenticated routes run through `set.household` middleware so controllers automatically receive the active household context when `ROZNAMCHA_ENABLE_HOUSEHOLDS=true`.
- `app/Http/Middleware/SetHouseholdContext` looks up or creates a household per user, storing it via the service container and request attributes. Admin guarding lives in `app/Http/Middleware/EnsureUserIsAdmin`.

### Households, Users, Profiles
- `app/Models/User` exposes helpers like `isSuperAdmin()` and `primaryHousehold()` plus many-to-many membership with `Household`. Profile updates, password confirms, and account deletion flow through `ProfileController`.
- Household metadata (owner, members, expenses) is centralized in `app/Models/Household`, while seeders can create demo households for testing.

### Kharcha / Expense Tracking
- `ExpenseController` drives Kharcha Map CRUD, filtering by category/date and projecting totals. Flexible column detection supports legacy schemas, and `Expense::scopeForHousehold` enforces tenancy.
- React UI under `resources/js/Pages/Kharcha` surfaces stats, filters, and pagination. `tests/Feature/ExpenseCrudTest.php` verifies create/update/delete plus filter behavior.

### Ration Brain & Inflation
- `RationController` lists pantry items with latest price, prior month comparison, and inflation delta computed by `App\Services\InflationService`.
- `RationItem`/`RationPrice` models track ownership and historical pricing, while `resources/js/Pages/Ration` renders the table. `tests/Feature/RationPriceTest.php` ensures delta math works.

### Reminder Scheduler
- `ReminderController` handles CRUD for finance/health/faith reminders, cron validation, timezone-aware `next_run_at`, and status toggles. Column helpers let it adapt to different migrations.
- Automation is handled by `app/Console/Commands/SendDueReminders`, the `SendReminderEmail` job, and the `ReminderDueMail` markdown template. `App\Support\ReminderScheduler` encapsulates cron parsing, with coverage in `tests/Feature/ReminderEmailTest.php`.

### Reports & Survival PDFs
- `/reports` renders spend breakdowns, faux ration days, upcoming fees, and health signals via `ReportController` and `resources/js/Pages/Admin/Reports.jsx`.
- Posting to `panel.reports.survival` hits `SurvivalReportController`, which calls `App\Services\Reports\SurvivalReportService` to aggregate expenses, compute trends, and emit a DomPDF stored on the `public` disk (`resources/views/reports/survival.blade.php`).
- `tests/Feature/SurvivalReportTest.php` asserts PDF generation with and without household scoping.

### Admin Tools, Marketing, and Seeds
- Control Room chrome lives in `resources/js/Layouts/ControlRoomLayout.jsx`, surfacing module tiles plus admin-only routes to `Admin\UserController` and `Admin\CategoryController`.
- Public marketing pages reuse `PublicLayout` and highlight Kharcha, Ration, and Survival Report benefits for SEO copy (`resources/js/Pages/Public`).
- `database/seeders/RoznamchaDemoSeeder.php` populates demo users, categories, expenses, ration inventory, reminders, cached reports, and announcements so every module has sample data after `composer run setup`.
