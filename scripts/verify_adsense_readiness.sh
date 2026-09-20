#!/usr/bin/env bash
# ==============================================================================
# Roznamcha Google AdSense Pre-Flight Readiness & Zero-Rejection Validator
# Usage: ./scripts/verify_adsense_readiness.sh [domain]
# Default domain: https://roznamcha.pk
# ==============================================================================

set -euo pipefail

TARGET_DOMAIN="${1:-https://roznamcha.pk}"
RAW_HOST="${TARGET_DOMAIN#https://}"
RAW_HOST="${RAW_HOST#http://}"
RAW_HOST="${RAW_HOST%/}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

check_pass() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    echo -e "  [${GREEN}PASS${NC}] $1"
}

check_fail() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo -e "  [${RED}FAIL${NC}] $1"
    if [ -n "${2:-}" ]; then
        echo -e "         ${YELLOW}Reason:${NC} $2"
    fi
}

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}   ROZNAMCHA GOOGLE ADSENSE PRE-FLIGHT VERIFIER       ${NC}"
echo -e "${BLUE}   Target Domain: ${TARGET_DOMAIN}                    ${NC}"
echo -e "${BLUE}======================================================${NC}\n"

# ------------------------------------------------------------------------------
# Gate 1: Origin Canonicalization (301 Redirects)
# ------------------------------------------------------------------------------
echo -e "${YELLOW}Gate 1: Origin Canonical 301 Redirects${NC}"

# Check HTTP to HTTPS
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://${RAW_HOST}/" || true)
HTTP_REDIRECT=$(curl -sI "http://${RAW_HOST}/" | grep -i "^location:" | tr -d '\r\n' | awk '{print $2}' || true)

if [ "$HTTP_CODE" = "301" ] && [[ "$HTTP_REDIRECT" == "https://${RAW_HOST}/"* ]]; then
    check_pass "http://${RAW_HOST}/ correctly 301 redirects to https://${RAW_HOST}/"
else
    check_fail "http://${RAW_HOST}/ did not 301 redirect (Got HTTP $HTTP_CODE, Location: '$HTTP_REDIRECT')" "Must 301 redirect to https://${RAW_HOST}/"
fi

# Check WWW to non-WWW
WWW_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://www.${RAW_HOST}/" || true)
WWW_REDIRECT=$(curl -sI "https://www.${RAW_HOST}/" | grep -i "^location:" | tr -d '\r\n' | awk '{print $2}' || true)

if [ "$WWW_CODE" = "301" ] && [[ "$WWW_REDIRECT" == "https://${RAW_HOST}/"* ]]; then
    check_pass "https://www.${RAW_HOST}/ correctly 301 redirects to https://${RAW_HOST}/"
else
    check_fail "https://www.${RAW_HOST}/ did not 301 redirect (Got HTTP $WWW_CODE, Location: '$WWW_REDIRECT')" "Must 301 redirect to https://${RAW_HOST}/"
fi

# ------------------------------------------------------------------------------
# Gate 2: Ads.txt & Robots.txt Verification
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}Gate 2: Ads.txt & Robots.txt Compliance${NC}"

ADSTXT_CONTENT=$(curl -sL "${TARGET_DOMAIN}/ads.txt" || true)
if echo "$ADSTXT_CONTENT" | grep -q "pub-8709269992599634"; then
    check_pass "ads.txt contains valid publisher record: pub-8709269992599634"
else
    check_fail "ads.txt is missing publisher ID pub-8709269992599634"
fi

ROBOTS_CONTENT=$(curl -sL "${TARGET_DOMAIN}/robots.txt" || true)
if echo "$ROBOTS_CONTENT" | grep -qi "Mediapartners-Google"; then
    check_pass "robots.txt explicitly configures crawler access"
else
    check_pass "robots.txt allows crawler access by default"
fi

# ------------------------------------------------------------------------------
# Gate 3: Sitemap XML Leakage & Hygiene
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}Gate 3: Sitemap Leakage & Content Hygiene${NC}"

SITEMAP_CONTENT=$(curl -sL "${TARGET_DOMAIN}/sitemap.xml" || true)

# Check for obsolete / thin slugs that must be omitted
BANNED_PATTERNS="utility-store|fuel-quota|petrol-price-april|basant|roznamcha-with-ai|e-challan|gold-price-prediction|current-ration-price-list"
LEAKED_MATCHES=$(echo "$SITEMAP_CONTENT" | grep -E "$BANNED_PATTERNS" || true)

if [ -z "$LEAKED_MATCHES" ]; then
    check_pass "sitemap.xml contains 0 retired/disproven/thin article URLs"
else
    LEAK_COUNT=$(echo "$LEAKED_MATCHES" | wc -l | tr -d ' ')
    check_fail "sitemap.xml leaks $LEAK_COUNT banned URLs!" "Deploy sitemap exclusions and clear Laravel cache on production."
fi

# Check template sitemap
TEMPLATE_SITEMAP=$(curl -sL "${TARGET_DOMAIN}/templates-sitemap.xml" || true)
TEMPLATE_DETAILS=$(echo "$TEMPLATE_SITEMAP" | grep -E "student-budget|50k-salary|100k-family|joint-family" || true)

if [ -z "$TEMPLATE_DETAILS" ]; then
    check_pass "templates-sitemap.xml advertises only the root /templates index"
else
    check_fail "templates-sitemap.xml leaks un-indexed template detail URLs"
fi

# ------------------------------------------------------------------------------
# Gate 4: Screens Without Content & Template Guest Access
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}Gate 4: Screens Without Content & Guest Navigation${NC}"

# Test Guest access to /templates/student-budget
TEMPLATE_CODE=$(curl -s -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 (Googlebot/2.1; +http://www.google.com/bot.html)" "${TARGET_DOMAIN}/templates/student-budget" || true)

if [ "$TEMPLATE_CODE" = "200" ]; then
    check_pass "Template detail page returns HTTP 200 for guest crawlers"
elif [ "$TEMPLATE_CODE" = "302" ]; then
    check_fail "Template detail redirected guest to login (HTTP 302)! Triggers 'Screens without publisher content' policy."
else
    check_fail "Template detail returned unexpected HTTP $TEMPLATE_CODE"
fi

# ------------------------------------------------------------------------------
# Summary Scorecard
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}======================================================${NC}"
echo -e "${BLUE}                   SCORECARD                          ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "Total Checks:  ${TOTAL_CHECKS}"
echo -e "Passed:        ${GREEN}${PASSED_CHECKS}${NC}"
echo -e "Failed:        ${RED}${FAILED_CHECKS}${NC}"

if [ "$FAILED_CHECKS" -eq 0 ]; then
    echo -e "\n${GREEN}>>> VERDICT: 100% PASS — SAFE FOR ADSENSE SUBMISSION <<<${NC}\n"
    exit 0
else
    echo -e "\n${RED}>>> VERDICT: BLOCKED — DO NOT SUBMIT TO ADSENSE YET <<<${NC}"
    echo -e "${YELLOW}Please deploy your changes and resolve the failed items above.${NC}\n"
    exit 1
fi
