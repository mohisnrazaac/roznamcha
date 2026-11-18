#!/usr/bin/env bash
# verify-live.sh — outside-in check of the AdSense findings. Usage: verify-live.sh [base-url]
BASE="${1:-https://roznamcha.pk}"
UA="Mozilla/5.0 (compatible; roznamcha-verify)"
FAIL=0

get()    { curl -sL -A "$UA" -H 'Cache-Control: no-cache' "$BASE$1?_v=$RANDOM$RANDOM"; }
absent() { if get "$1" | grep -qiE -- "$2"; then echo "FAIL  $3  [$1]"; FAIL=1; else echo "PASS  $3  [$1]"; fi; }
present(){ if get "$1" | grep -qiE -- "$2"; then echo "PASS  $3  [$1]"; else echo "FAIL  $3  [$1]"; FAIL=1; fi; }
count_eq(){ n=$(get "$1" | grep -oiE -- "$2" | wc -l | tr -d ' '); if [ "$n" = "$3" ]; then echo "PASS  $4 ($n)  [$1]"; else echo "FAIL  $4 (got $n, want $3)  [$1]"; FAIL=1; fi; }

echo "== release / cache =="
curl -sI -A "$UA" "$BASE/about" | grep -iE '^(x-app-release|cache-control|age|cf-cache-status|x-.*cache)' || echo "INFO  no cache/release headers found"
curl -sI -A "$UA" "$BASE/about" | grep -qi '^x-app-release' && echo "PASS  release marker present" || { echo "FAIL  no X-App-Release header"; FAIL=1; }
t1=$(curl -s -A "$UA" "$BASE/about?_v=$RANDOM" | grep -o 'name="csrf-token" content="[^"]*"')
t2=$(curl -s -A "$UA" "$BASE/about?_v=$RANDOM" | grep -o 'name="csrf-token" content="[^"]*"')
if [ "$t1" = "$t2" ] && [ -n "$t1" ]; then echo "FAIL  csrf token identical across fresh visitors (cached HTML)"; FAIL=1; else echo "PASS  csrf token not shared"; fi

echo "== F3 broken trust links =="
for p in /about /contact /tools/electricity-bill-estimator /tools/monthly-household-budget-calculator /blog/ghar-ka-monthly-budget; do
  absent "$p" 'href=["'\''"]?public\.(editorial-policy|methodology)|>public\.(editorial-policy|methodology)<' "no route-name links"
done

echo "== F4 placeholders / empty states =="
absent /tools/electricity-bill-estimator 'Static placeholder|PKR 0|slab_rates table' "electricity placeholders"
absent /tools/monthly-household-budget-calculator 'Savings Rate: %|Rs 0' "budget empty state"
absent /blog/ghar-ka-monthly-budget '#electrity|\*\*Bill\*\*' "stray widget text"

echo "== F6 hidden / duplicate blocks =="
for p in /tools/electricity-bill-estimator /tools/monthly-household-budget-calculator /tools/ration-cost-estimator /features /disclaimer; do
  count_eq "$p" '<h1[ >]' 1 "exactly one H1"
done

echo "== F1/F2 duplicates =="
SLUGS="pakistan-cost-of-living-and-grocery-price-index-september-2026-economic-report pakistan-cost-of-living-and-grocery-price-index-week-38-september-2026-report weekly-pakistan-cost-of-living-and-grocery-price-index-march-2026-market-analysis wheat-flour-atta-subsidies-vs-open-market-rates-managing-kitchen-grocery-inflation-2026"
seen=""; dup=0
for s in $SLUGS; do
  out=$(curl -sL -A "$UA" -w '\n__URL__%{url_effective}' "$BASE/blog/$s?_v=$RANDOM")
  final=${out##*__URL__}
  if echo "$out" | grep -q 'early morning mist'; then
    case " $seen " in *" $final "*) ;; *) seen="$seen $final"; dup=$((dup+1));; esac
  fi
done
[ "$dup" -le 1 ] && echo "PASS  wheat essay appears on $dup distinct URL(s)" || { echo "FAIL  wheat essay on $dup distinct URLs"; FAIL=1; }

echo "== F7 injected / off-topic =="
absent /blog/ghar-ka-monthly-budget 'sarkaritayari\.pk' "no promo paragraph"
absent /tools/electricity-bill-estimator 'sarkaritayari\.pk' "no promo box"
absent /blog/pakistan-cost-of-living-and-grocery-price-index-week-38-september-2026-report 'stronger shared baseline' "no boilerplate block"

echo "== F9/F11 policy pages =="
present /privacy-policy 'last updated' "privacy last-updated date"
present /privacy-policy 'policies\.google\.com/technologies/partner-sites' "Google partner-sites link"
present /privacy-policy 'aboutads\.info' "aboutads opt-out link"
get /cookie-policy | grep -oE '<link rel="canonical" href="[^"]*"' | grep -q 'cookie-policy' && echo "PASS  cookie-policy canonical is itself" || { echo "FAIL  cookie-policy canonical wrong"; FAIL=1; }

echo "== F12/F16 sitemap =="
sm=$(get /sitemap.xml)
echo "$sm" | grep -q 'category/news' && { echo "FAIL  empty News category in sitemap"; FAIL=1; } || echo "PASS  no News category"
top=$(echo "$sm" | grep -o '<lastmod>[^<]*' | sort | uniq -c | sort -rn | head -1 | awk '{print $1}')
[ "${top:-99}" -le 5 ] && echo "PASS  lastmod values vary" || { echo "FAIL  $top URLs share one lastmod"; FAIL=1; }

echo "== F13 ads off on non-content pages =="
for p in /features /templates /kharcha-map /ration-brain /survival-report; do absent "$p" '>Advertisement<' "no ad label"; done

echo "== Phase 1 unverifiable claims absent =="
TRUST_PAGES="/ /about /blog/ghar-ka-monthly-budget /blog/best-monthly-budget-50000-salary-pakistan-2026 /blog/pakistan-electricity-tariff-increases-and-household-budgeting-defense-2026 /tools/electricity-bill-estimator /tools/monthly-household-budget-calculator /tools/ration-cost-estimator /tools/school-fees-planner /tools/solar-net-metering-roi-calculator"
for p in $TRUST_PAGES; do
  absent "$p" 'certified financial' "no fake financial certification claim"
  absent "$p" 'Financial & Tariff Experts' "no unverified expert panel claim"
  absent "$p" 'hands-on testing' "no unverified testing claim"
done

echo "== Phase 2 retired, redirect, and sitemap checks =="
sm_count=$(echo "$sm" | grep -c '<loc>')
[ "$sm_count" -eq 29 ] && echo "PASS  sitemap URL count is 29" || { echo "FAIL  sitemap URL count is $sm_count (expected 29)"; FAIL=1; }
echo "$sm" | grep -q 'category/household-budgeting' && { echo "FAIL  thin household-budgeting category in sitemap"; FAIL=1; } || echo "PASS  no household-budgeting category in sitemap"
echo "$sm" | grep -q 'category/technology' && { echo "FAIL  thin technology category in sitemap"; FAIL=1; } || echo "PASS  no technology category in sitemap"

for redir in \
  "/blog/solar-battery-storage-economics-in-pakistan-lifepo4-vs-tubular-battery-roi-2026:solar-net-metering-regulations-in-pakistan-2026-payback-period-and-roi-breakdown" \
  "/blog/automobile-fuel-efficiency-and-cng-retrofitting-economics-in-pakistan-2026:fuel-price-deregulation-in-pakistan-transport-inflation-and-commuter-survival-guide" \
  "/blog/national-savings-schemes-behbood-vs-regular-income-certificates-real-returns-against-inflation-2026:gold-investment-vs-national-savings-certificates-protecting-wealth-against-pkr-devaluation-2026"; do
  src="${redir%%:*}"
  tgt="${redir##*:}"
  code=$(curl -sI -A "$UA" "$BASE$src?_v=$RANDOM" | grep -i '^HTTP/' | awk '{print $2}')
  loc=$(curl -sI -A "$UA" "$BASE$src?_v=$RANDOM" | grep -i '^location:' | awk '{print $2}' | tr -d '\r')
  if [ "$code" = "301" ] && echo "$loc" | grep -q "$tgt"; then
    echo "PASS  301 redirect [$src -> $tgt]"
  else
    echo "FAIL  redirect [$src got code $code, loc $loc, want 301 -> $tgt]"; FAIL=1
  fi
done

code_404=$(curl -sI -A "$UA" "$BASE/blog/inverter-ac-vs-non-inverter-power-consumption-practical-testing-for-pakistani-summer-loads?_v=$RANDOM" | grep -i '^HTTP/' | awk '{print $2}')
[ "$code_404" = "404" ] && echo "PASS  inverter-ac article is 404" || { echo "FAIL  inverter-ac article returned $code_404 (expected 404)"; FAIL=1; }

present /blog/how-chatgpt-and-gemini-became-part-of-everyday-life-2026 'meta name="robots" content="noindex,follow"' "chatgpt article is noindex"
absent /blog/how-chatgpt-and-gemini-became-part-of-everyday-life-2026 '>Advertisement<' "chatgpt article has no ads"

for retired in solar-battery-storage automobile-fuel-efficiency inverter-ac national-savings-schemes-behbood; do
  absent / "$retired" "homepage does not link to $retired"
  absent /blog "$retired" "blog index does not link to $retired"
done

echo; [ $FAIL -eq 0 ] && echo "ALL CHECKS PASSED" || echo "SOME CHECKS FAILED"; exit $FAIL
