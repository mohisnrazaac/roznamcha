URLS=(
    "https://roznamcha.pk/blog/basant-2026-lahore-kite-prices-household-cost"
    "https://roznamcha.pk/blog/fuel-price-impact-on-commodity-prices-pakistan-2026"
    "https://roznamcha.pk/blog/pakistan-petrol-price-april-2026-rs458-budget-guide"
    "https://roznamcha.pk/blog/petrol-price-pakistan-2026-monthly-household-impact"
    "https://roznamcha.pk/blog/how-to-file-tax-returns-salaried-person-pakistan"
)
for url in "${URLS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "[$STATUS] $url"
done
