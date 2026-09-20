#!/usr/bin/env bash
# ==============================================================================
# Roznamcha SEO DOM Audit Script
# Verifies indexable editorial scaffolding, word count, schemas, and robots tags
# on public tools and calculator views.
#
# Usage:
#   bash scripts/audit-dom.sh [domain]
# Default:
#   bash scripts/audit-dom.sh https://roznamcha.pk
# ==============================================================================

set -uo pipefail

TARGET_DOMAIN="${1:-https://roznamcha.pk}"
TARGET_DOMAIN="${TARGET_DOMAIN%/}"

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
    echo -e "    [${GREEN}PASS${NC}] $1"
}

check_fail() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    echo -e "    [${RED}FAIL${NC}] $1"
    if [ -n "${2:-}" ]; then
        echo -e "           ${YELLOW}Detail:${NC} $2"
    fi
}

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}        ROZNAMCHA PUBLIC TOOLS DOM SEO AUDIT          ${NC}"
echo -e "${BLUE}   Target: ${TARGET_DOMAIN}                           ${NC}"
echo -e "${BLUE}======================================================${NC}\n"

ROUTES=(
    "/tools/ration-cost-estimator"
    "/tools/electricity-bill-estimator"
    "/tools/monthly-household-budget-calculator"
    "/tools/school-fees-planner"
    "/tools/solar-net-metering-roi-calculator"
)

USER_AGENT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

for PATH_URI in "${ROUTES[@]}"; do
    FULL_URL="${TARGET_DOMAIN}${PATH_URI}"
    echo -e "${YELLOW}Auditing: ${PATH_URI}${NC}"
    
    # 1. Fetch headers and body
    HTTP_RESPONSE=$(curl -sL -A "$USER_AGENT" -w "\n%{http_code}" "$FULL_URL" || true)
    HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n1)
    HTML_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')

    if [ "$HTTP_STATUS" = "200" ]; then
        check_pass "HTTP Status 200 OK"
    else
        check_fail "HTTP Status ${HTTP_STATUS}" "Expected HTTP 200"
        echo ""
        continue
    fi

    # 2. Check semantic <article> or <section> tag
    if echo "$HTML_BODY" | grep -qE "<article|<section"; then
        check_pass "Semantic structural container (<article> or <section>) found"
    else
        check_fail "No semantic <article> or <section> tags found"
    fi

    # 3. Check Methodology section
    if echo "$HTML_BODY" | grep -qiE "Methodology"; then
        check_pass "Methodology & Calculation Mechanics section present"
    else
        check_fail "Methodology section missing in SSR HTML" "AdSense bots may classify calculator as thin automated DOM"
    fi

    # 4. Check Underlying Data Baseline
    if echo "$HTML_BODY" | grep -qiE "Underlying Data Baseline"; then
        check_pass "Underlying Data Baseline & Assumptions section present"
    else
        check_fail "Underlying Data Baseline section missing in SSR HTML"
    fi

    # 5. Check Practical Application Guide
    if echo "$HTML_BODY" | grep -qiE "Practical Application Guide"; then
        check_pass "Practical Application Guide section present"
    else
        check_fail "Practical Application Guide section missing in SSR HTML"
    fi

    # 6. Check Frequently Asked Questions
    if echo "$HTML_BODY" | grep -qiE "Frequently Asked Questions"; then
        check_pass "Frequently Asked Questions section present"
    else
        check_fail "Frequently Asked Questions section missing in SSR HTML"
    fi

    # 7. Check word count of plain text
    WORD_COUNT=$(echo "$HTML_BODY" | php -r '
        $html = file_get_contents("php://stdin");
        $clean = strip_tags(preg_replace(["/<script\b[^>]*>(.*?)<\/script>/is", "/<style\b[^>]*>(.*?)<\/style>/is"], "", $html));
        $words = preg_split("/\s+/", trim(html_entity_decode($clean, ENT_QUOTES | ENT_HTML5, "UTF-8")), -1, PREG_SPLIT_NO_EMPTY);
        echo count($words);
    ')
    WORD_COUNT="${WORD_COUNT:-0}"

    if [ "$WORD_COUNT" -ge 350 ]; then
        check_pass "Content density passed: ${WORD_COUNT} words (Threshold: 350+)"
    elif [ "$WORD_COUNT" -ge 200 ]; then
        check_fail "Content density low: ${WORD_COUNT} words" "Recommended: >= 350 words to avoid low-value flags"
    else
        check_fail "Thin content detected: only ${WORD_COUNT} words" "Severe low-value content trigger"
    fi

    # 8. Check Canonical link
    if echo "$HTML_BODY" | grep -qiE "rel=[\"']canonical[\"']"; then
        check_pass "Canonical link tag present"
    else
        check_fail "Missing rel=\"canonical\" tag"
    fi

    # 9. Check Robots tag does NOT have noindex
    if echo "$HTML_BODY" | grep -qiE "content=[\"'][^\"']*noindex"; then
        check_fail "Unexpected noindex directive found on public tool"
    else
        check_pass "Robots directive permits indexing (no 'noindex' flag)"
    fi

    # 10. Check Structured Data (JSON-LD)
    if echo "$HTML_BODY" | grep -qiE "application/ld\+json"; then
        check_pass "Schema structured data (application/ld+json) present"
    else
        check_fail "Missing Schema structured data (JSON-LD)"
    fi

    echo ""
done

# Summary Scorecard
echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}                   SCORECARD                          ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "Total Checks:  ${TOTAL_CHECKS}"
echo -e "Passed:        ${GREEN}${PASSED_CHECKS}${NC}"
echo -e "Failed:        ${RED}${FAILED_CHECKS}${NC}"

if [ "$FAILED_CHECKS" -eq 0 ]; then
    echo -e "\n${GREEN}>>> AUDIT RESULT: 100% PASS — ALL TOOL DOMS INDEXABLE & RICH <<<${NC}\n"
    exit 0
else
    echo -e "\n${RED}>>> AUDIT RESULT: FAILURES DETECTED (${FAILED_CHECKS} failed) <<<${NC}"
    echo -e "${YELLOW}Notice: If testing against live production, please ensure local git changes have been deployed to the server.${NC}\n"
    exit 1
fi
