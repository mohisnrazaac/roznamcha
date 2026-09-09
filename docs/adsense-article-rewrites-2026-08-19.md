# Applying the five reviewed article rewrites

The update is idempotent and changes only these existing slugs:

- `utility-store-vs-open-market-price-comparison-2026-pakistan`
- `pakistan-fuel-quota-system-petrol-price-april-2026`
- `pakistan-petrol-price-april-2026-rs458-budget-guide`
- `fuel-price-impact-on-commodity-prices-pakistan-2026`
- `petrol-price-pakistan-2026-monthly-household-impact`

It refuses to run if any target row is missing. All five updates are committed in one database transaction, and the public sitemap cache is cleared afterward.

## Local CLI

Start XAMPP MySQL, then preview:

```bash
php artisan blog:apply-adsense-article-rewrites --dry-run
```

Apply:

```bash
php artisan blog:apply-adsense-article-rewrites
```

## Production web trigger

Deploy the code and ensure `MAINTENANCE_TRIGGER_SECRET` is a long random value in production. Do not paste that value into logs, chat, or source control.

Preview without changing rows:

```bash
curl -sS -X POST 'https://roznamcha.pk/maintenance/apply-adsense-article-rewrites?token=YOUR_SECRET&dry_run=1'
```

Apply once:

```bash
curl -sS -X POST 'https://roznamcha.pk/maintenance/apply-adsense-article-rewrites?token=YOUR_SECRET'
```

Run the apply request a second time only to verify idempotency. Every `changed_fields` array should then be empty.

After applying, clear application caches if the deployment process did not already do so:

```bash
php artisan optimize:clear
```

## Production URLs

- <https://roznamcha.pk/blog/utility-store-vs-open-market-price-comparison-2026-pakistan>
- <https://roznamcha.pk/blog/pakistan-fuel-quota-system-petrol-price-april-2026>
- <https://roznamcha.pk/blog/pakistan-petrol-price-april-2026-rs458-budget-guide>
- <https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026>
- <https://roznamcha.pk/blog/petrol-price-pakistan-2026-monthly-household-impact>

Do not treat these links as updated until the production apply response returns `"ok": true` and each page has been fetched and checked afterward.
