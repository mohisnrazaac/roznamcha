#!/usr/bin/env bash
set -euo pipefail

php -v

php artisan down || true

composer install --no-dev --prefer-dist --optimize-autoloader

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

php artisan migrate --force --no-interaction

npm ci
npm run build

php artisan storage:link || true
php artisan optimize
php artisan up
