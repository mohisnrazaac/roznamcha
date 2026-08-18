#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(dirname "$0")"

npm ci
npm run build
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

if pm2 describe roznamcha-ssr >/dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --only roznamcha-ssr --update-env
else
    pm2 start ecosystem.config.cjs --only roznamcha-ssr
fi

pm2 save
php artisan inertia:check-ssr
