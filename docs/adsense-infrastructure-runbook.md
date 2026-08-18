# AdSense and crawler infrastructure runbook

## Production deployment

Set `ADSENSE_CLIENT_ID=ca-pub-...`, `INERTIA_SSR_ENABLED=true`, and
`INERTIA_SSR_URL=http://127.0.0.1:13714` in the production environment. Then run:

```bash
cd /var/www/roznamcha
chmod +x deploy-ssr.sh verify-crawler.sh
./deploy-ssr.sh
pm2 status roznamcha-ssr
pm2 logs roznamcha-ssr --lines 50
./verify-crawler.sh https://roznamcha.pk
```

`pm2 reload` performs a graceful cluster-worker replacement. The deployment must
not use `php artisan down`, because that creates an avoidable outage.

To use Supervisor instead, edit the repository template's `directory`, `command`,
and `user`, then install it:

```bash
sudo cp deploy/supervisor/roznamcha-ssr.conf /etc/supervisor/conf.d/roznamcha-ssr.conf
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status roznamcha-ssr
php artisan inertia:check-ssr
```

## Cloudflare security rules

Create the zone-level custom rule **Allow verified crawlers** before any blocking
or challenge rule:

```text
(cf.client.bot)
```

Use action **Skip** and select all remaining custom rules, rate limiting rules,
WAF Managed Rules, and Super Bot Fight Mode. `cf.client.bot` is Cloudflare's
verified known-bot signal and cannot be forged merely by changing User-Agent.

The originally requested expression is:

```text
(http.user_agent contains "Mediapartners-Google") or
(http.user_agent contains "Googlebot") or
(cf.client.bot)
```

Do not deploy that broader expression unless accepting that anyone can spoof
either User-Agent and bypass the selected controls. Cloudflare Free **Bot Fight
Mode cannot be skipped by a WAF custom rule**. Disable it or move to Super Bot
Fight Mode if exceptions are required.

Create a Cache Rule for these paths:

```text
(http.request.uri.path in {
  "/sitemap.xml"
  "/templates-sitemap.xml"
  "/tools/ration-cost-estimator"
  "/tools/monthly-household-budget-calculator"
  "/tools/school-fees-planner"
  "/tools/electricity-bill-estimator"
})
```

Set eligible for cache and edge TTL to one hour. Do not configure a response
header transform that strips `Set-Cookie` globally. The Laravel routes also emit
`Cache-Control: public, max-age=3600, s-maxage=3600` as an origin-side fallback.

## Search Console readiness

1. Submit `https://roznamcha.pk/sitemap.xml` and
   `https://roznamcha.pk/templates-sitemap.xml` in Search Console > Sitemaps.
2. Use URL Inspection for `/`, `/terms`, `/privacy-policy`, and the electricity
   estimator. Run **Test live URL**, inspect rendered HTML, then request indexing.
3. With a Google Cloud service account that owns the Search Console property,
   query the API (replace the token and URL):

```bash
ACCESS_TOKEN="$(gcloud auth application-default print-access-token)"
curl -sS -X POST 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect' \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data '{"inspectionUrl":"https://roznamcha.pk/","siteUrl":"sc-domain:roznamcha.pk","languageCode":"en-US"}'
```

Review `inspectionResult.indexStatusResult.verdict`, `coverageState`,
`robotsTxtState`, `indexingState`, `lastCrawlTime`, and `googleCanonical`. The URL
Inspection API reports the indexed version; the web console's live test verifies
the current deployed response. Search Console does not expose an exact total
Google index count through this endpoint—use the Pages report for aggregate
indexed/not-indexed counts.

Successful crawler verification resembles:

```text
PASS  Googlebot            /                                    HTTP 200, semantic SSR HTML
PASS  Mediapartners-Google /privacy-policy                      HTTP 200, semantic SSR HTML
PASS  Mediapartners-Google /tools/electricity-bill-estimator    HTTP 200, semantic SSR HTML

SUCCESS: all crawler checks returned complete server-rendered HTML.
```
