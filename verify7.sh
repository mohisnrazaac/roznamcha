URLS=(
    "https://roznamcha.pk/blog/best-halal-savings-accounts-mutual-funds-pakistan-2026"
    "https://roznamcha.pk/blog/asaan-mobile-account-open-digital-account-pakistan"
    "https://roznamcha.pk/blog/reduce-kitchen-inflation-ration-buying-habits-pakistan"
    "https://roznamcha.pk/blog/understanding-nepra-tariff-slabs-solar-net-metering-pakistan"
    "https://roznamcha.pk/blog/sadapay-nayapay-jazzcash-best-mobile-wallet-pakistan"
)
for url in "${URLS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "[$STATUS] $url"
done
