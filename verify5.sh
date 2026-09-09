URLS=(
    "https://roznamcha.pk/blog/gold-rates-vs-monthly-savings-household-budget-2026"
    "https://roznamcha.pk/blog/new-utility-store-price-list-january-2026-today-subsidized-rates"
    "https://roznamcha.pk/blog/inflation-household-budget-pakistan-2026"
    "https://roznamcha.pk/blog/cost-of-living-pakistan-2026-monthly-budget-with-ai"
    "https://roznamcha.pk/blog/inflation-household-spending-pakistan-2026"
)
for url in "${URLS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "[$STATUS] $url"
done
