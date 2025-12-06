# Post-Deploy Checklist

- [ ] Visit `/panel/kharcha` → run through filters, create a test expense, edit it, and delete it; confirm summary cards update and flash messaging appears.
- [ ] Open `/panel/ration` → ensure each item shows latest price, last-month price, and Δ%; append a new price entry on the edit screen and verify the delta recalculates.
- [ ] Navigate to `/panel/reminders` → create a sample reminder (finance + cron), toggle it inactive/active, then delete it; confirm cron hint renders in Urdu/English.
- [ ] On `/reports`, trigger “Generate Month-End Survival Report (PDF)” for the current month; ensure the flash link appears and the PDF downloads with bilingual headings.
- [ ] Confirm marketing home (`/`) and `/login` load without Ziggy or RTL console warnings; toggle locale via `.env` and verify RTL direction.
- [ ] Ensure `storage:link` exists and newly generated PDFs resolve via `storage/` URLs.
- [ ] Smoke test admin routes (`/admin/users`, `/admin/categories`) remain accessible and unaffected by the new `/panel` middleware.
- [ ] Review Horizon/queue logs (if enabled) to confirm reminder cron entries aren’t throwing jobs (should be idle for now).
- [ ] Validate `.env` production settings: `APP_ENV=production`, `APP_DEBUG=false`, correct DB + queue drivers, `ROZNAMCHA_LANG_DEFAULT` set appropriately, and `VITE_BASE_PATH` matches hosting path.
