# Roadmap Coverage – Roznamcha (Sprint 1)

| # | Feature | Backend & Data | UI & Routes | Tests | Status |
|---|---------|----------------|-------------|-------|--------|
| 1 | Kharcha Map | `expenses` table (`2025_02_19_000010_create_expenses_table.php`), `ExpenseController`, household-aware scoping + filters. | Inertia pages `resources/js/Pages/Kharcha/{Index,Create,Edit}.jsx` with shared `ExpenseForm`. Routes under `/panel/kharcha`. | `tests/Feature/ExpenseCrudTest.php`. | ✅ Done |
| 2 | Ration Brain + Δ% | Fresh `ration_items` + `ration_prices` tables, `RationController` + `InflationService`. | `resources/js/Pages/Ration/{Index,Edit}.jsx` (price history, delta badges, add-price form). | `tests/Feature/RationPriceTest.php`. | ✅ Done |
| 3 | Reminder & Health Guard | Expanded `reminders` schema with cron fields + household scope; `ReminderController` CRUD + toggle. | `resources/js/Pages/Reminders/{Index,Create}.jsx`. | `tests/Feature/ReminderCrudTest.php`. | ✅ Done |
| 4 | Survival Report (PDF) | `SurvivalReportService` (Dompdf) aggregates expenses + projection; `/panel/reports/survival` POST. | Reports page button + flash download link in `resources/js/Pages/Admin/Reports.jsx`; PDF view `resources/views/reports/survival.blade.php`. | `tests/Feature/SurvivalReportTest.php`. | ✅ Done |
| 5 | Admin Panel theme | `ControlRoomLayout` updated with translated labels + locale badges; nav hits new `/panel/*` routes. Legacy `AppLayout` kept for marketing screens. | Control Room pages adopt blue/yellow/black spec; breadcrumbs on new screens. | Covered indirectly by feature smoke tests. | 🟡 Partial |
| 6 | Urdu-first UX | `lang/en|ur/roznamcha.php`, `config/roznamcha.php`, locale shared via Inertia + auto RTL direction in `resources/js/app.jsx`. | All new React copy pulls from translations; Urdu strings seeded. | Manual verification only. | 🟡 Partial |
| 7 | Multi-tenant groundwork | `households` + `household_user` tables, `SetHouseholdContext` middleware, nullable `household_id` on new domain tables. | Controllers resolve current household; future tenant switch UI still pending. | Not yet. | 🟠 Partial |
| 8 | Legacy modules (Ration inventory, old Kharcha pages) | Historical tables (`ration_entries`, `kharcha_entries`) left untouched; migration scripts avoid drops. | Legacy React screens remain but nav now points to `/panel` apps. | None. | ⚪ Deferred |

## Critical Gaps & Next Steps
1. **Tenant UX & permissions** – need UI to switch/create households, invite members, and tenant-aware policies (queues, storage, reports). Estimated 1–1.5 sprints.
2. **Urdu/RTL completeness** – only core copy translated. Audit marketing pages, emails, PDFs, and add locale toggle control (0.5 sprint).
3. **Ration forecasting depth** – current Δ% is month-over-month only. Upcoming sprint should add burn-rate days left & charting (0.5 sprint).
4. **Automation hooks** – Reminder cron entries wait for notification workers; document/implement queue job + scheduler story (0.5 sprint).
5. **Older scaffolding cleanup** – remove or migrate `KharchaController`, `RationEntry`, and unused React pages once stakeholders confirm deprecation.
