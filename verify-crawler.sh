#!/usr/bin/env bash
set -Eeuo pipefail

BASE_URL="${1:-https://roznamcha.pk}"
BASE_URL="${BASE_URL%/}"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

GOOGLEBOT='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
MEDIAPARTNERS='Mediapartners-Google'
failures=0

check_page() {
    local path="$1" ua_name="$2" ua="$3" text_pattern="$4" schema_required="$5"
    local slug headers body status
    slug="$(printf '%s' "$path" | tr '/?' '__')"
    headers="$WORK_DIR/${slug}-${ua_name}.headers"
    body="$WORK_DIR/${slug}-${ua_name}.html"

    if ! status="$(curl --silent --show-error --location --max-time 30 \
        --user-agent "$ua" --dump-header "$headers" --output "$body" \
        --write-out '%{http_code}' "${BASE_URL}${path}")"; then
        status="${status:-000}"
    fi

    if [[ "$status" != '200' ]]; then
        printf 'FAIL  %-20s %-36s HTTP %s\n' "$ua_name" "$path" "$status"
        failures=$((failures + 1))
        return
    fi

    if ! grep -Eiq '<h1([ >])' "$body" || ! grep -Eiq '<p([ >])' "$body"; then
        printf 'FAIL  %-20s %-36s missing semantic <h1>/<p>\n' "$ua_name" "$path"
        failures=$((failures + 1))
        return
    fi

    if ! grep -Eiq "$text_pattern" "$body"; then
        printf 'FAIL  %-20s %-36s expected page text missing\n' "$ua_name" "$path"
        failures=$((failures + 1))
        return
    fi

    if grep -Eiq "<div[^>]+id=['\"]app['\"][^>]*>[[:space:]]*</div>" "$body"; then
        printf 'FAIL  %-20s %-36s empty Inertia root (SSR unavailable)\n' "$ua_name" "$path"
        failures=$((failures + 1))
        return
    fi

    if [[ "$schema_required" == 'yes' ]] && ! grep -Eiq 'application/ld\+json|FAQPage' "$body"; then
        printf 'FAIL  %-20s %-36s JSON-LD/FAQ schema missing\n' "$ua_name" "$path"
        failures=$((failures + 1))
        return
    fi

    printf 'PASS  %-20s %-36s HTTP 200, semantic SSR HTML\n' "$ua_name" "$path"
}

for bot in googlebot mediapartners; do
    if [[ "$bot" == googlebot ]]; then
        bot_name='Googlebot'
        bot_ua="$GOOGLEBOT"
    else
        bot_name='Mediapartners-Google'
        bot_ua="$MEDIAPARTNERS"
    fi

    check_page '/' "$bot_name" "$bot_ua" 'Roznamcha|budget|kharcha' no
    check_page '/terms' "$bot_name" "$bot_ua" 'Acceptable Use|Terms' no
    check_page '/privacy-policy' "$bot_name" "$bot_ua" 'Privacy Policy|AdSense' no
    check_page '/tools/electricity-bill-estimator' "$bot_name" "$bot_ua" 'Electricity Bill Estimator' yes
done

if (( failures > 0 )); then
    printf '\nFAILED: %d crawler check(s) failed.\n' "$failures" >&2
    exit 1
fi

printf '\nSUCCESS: all crawler checks returned complete server-rendered HTML.\n'
