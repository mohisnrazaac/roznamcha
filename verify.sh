URLS=(
    "https://roznamcha.pk/blog/how-to-use-digital-roznamcha-for-business-and-personal-finance-2025"
    "https://roznamcha.pk/blog/pakistani-household-essential-expenses-2026"
    "https://roznamcha.pk/blog/utility-store-vs-open-market-price-comparison-2026-pakistan"
    "https://roznamcha.pk/blog/electricity-bill-breakdown-pakistan-2026-unit-cost-fpa"
    "https://roznamcha.pk/blog/school-fee-inflation-pakistan-2026"
)
for url in "${URLS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "[$STATUS] $url"
done
