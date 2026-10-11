<!DOCTYPE html>
<html lang="en">
    <head>
        @php
            $pageSeo = data_get($page ?? [], 'props.seo');
            $pageJsonLd = data_get($page ?? [], 'props.jsonLd');
            $siteUrl = rtrim(config('app.url', 'https://roznamcha.pk'), '/');
            $defaultOgImage = "{$siteUrl}/icons/appicon.png";

            $fallbackTitle = 'Roznamcha – Pakistan Household Budget & Expense Tracker';
            $rawTitle = data_get($pageSeo, 'title', '');
            $serverTitle = !empty($rawTitle) ? $rawTitle : $fallbackTitle;

            $fallbackDescription = 'Roznamcha helps Pakistani families track monthly expenses, compare ration costs, manage reminders, and budget with practical local insights.';
            $rawDescription = data_get($pageSeo, 'description', '');
            $effectiveDescription = !empty($rawDescription)
                ? $rawDescription
                : $fallbackDescription;

            $serverCanonical = data_get($pageSeo, 'canonical') ?: url()->current();
            $serverUrl = data_get($pageSeo, 'url', $serverCanonical);
            $serverRobots = data_get($pageSeo, 'robots');
            $serverType = data_get($pageSeo, 'type', 'website');
            $serverImage = data_get($pageSeo, 'image') ?: $defaultOgImage;
            $serverLocale = data_get($pageSeo, 'locale', 'en_PK');
            $serverAuthor = data_get($page ?? [], 'props.post.author.name', data_get($pageJsonLd, 'author.name', 'Mohsin'));
            $serverKeywords = data_get($pageSeo, 'keywords');
            if (is_array($serverKeywords)) {
                $serverKeywords = implode(', ', $serverKeywords);
            }
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        @auth
            <meta name="csrf-token" content="{{ csrf_token() }}">
        @endauth
        <meta name="author" content="{{ $serverAuthor }}" inertia="author">
        <meta property="og:see_also" content="https://facebook.com/roznamcha.pk" />
        {{-- PWA manifest link --}}
        <link rel="manifest" href="/manifest.webmanifest">
        {{-- Primary icon / favicon --}}
        <link rel="icon" type="image/png" href="/icons/appicon.png">
        {{-- PWA meta tags --}}
        <meta name="theme-color" content="#061325">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="canonical" href="{{ $serverCanonical }}" inertia="canonical">
        @if ($serverRobots)
            <meta name="robots" content="{{ $serverRobots }}" inertia="robots">
        @endif

        {{-- Open Graph / Social Sharing --}}
        <meta property="og:site_name" content="Roznamcha" inertia="og:site_name">
        <meta property="og:type" content="{{ $serverType }}" inertia="og:type">
        <meta property="og:url" content="{{ $serverUrl }}" inertia="og:url">
        <meta property="og:title" content="{{ $serverTitle }}" inertia="og:title">
        <meta property="og:description" content="{{ $effectiveDescription }}" inertia="og:description">
        <meta property="og:image" content="{{ $serverImage }}" inertia="og:image">
        <meta property="og:locale" content="{{ $serverLocale }}" inertia="og:locale">
        @php
            $publishedTime = data_get($pageSeo, 'datePublished', data_get($pageJsonLd, 'datePublished'));
            $modifiedTime = data_get($pageSeo, 'dateModified', data_get($pageJsonLd, 'dateModified'));
        @endphp
        @if ($publishedTime)
            <meta property="article:published_time" content="{{ $publishedTime }}" inertia="article:published_time">
            <meta name="datePublished" content="{{ $publishedTime }}" inertia="datePublished">
        @endif
        @if ($modifiedTime)
            <meta property="article:modified_time" content="{{ $modifiedTime }}" inertia="article:modified_time">
            <meta name="dateModified" content="{{ $modifiedTime }}" inertia="dateModified">
        @endif

        {{-- Twitter / X Cards --}}
        <meta name="twitter:card" content="summary_large_image" inertia="twitter:card">
        <meta name="twitter:title" content="{{ $serverTitle }}" inertia="twitter:title">
        <meta name="twitter:description" content="{{ $effectiveDescription }}" inertia="twitter:description">
        <meta name="twitter:image" content="{{ $serverImage }}" inertia="twitter:image">

        <title inertia>{{ $serverTitle }}</title>
        <meta name="description" content="{{ $effectiveDescription }}" inertia="description">
        @if ($serverKeywords)
            <meta name="keywords" content="{{ $serverKeywords }}" inertia="keywords">
        @endif
        @if ($pageJsonLd)
            <script type="application/ld+json" inertia="page-jsonld">
                {!! json_encode($pageJsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
            </script>
        @endif
        @php
            $pagePolicies = data_get($page ?? [], 'props.pagePolicies', []);
            $adsenseClientId = (string) (config('services.adsense.client_id') ?: 'ca-pub-8709269992599634');
            $analyticsMeasurementId = (string) config('services.analytics.ga_measurement_id', 'G-5EPHFZLH71');
            $clarityProjectId = (string) config('services.analytics.clarity_project_id', 'v5b4l0m7s1');
        @endphp

        <meta name="google-adsense-account" content="{{ $adsenseClientId }}">
        <script>
          window.roznamchaPagePolicies = @json($pagePolicies);
          window.roznamchaTrackingConfig = {
            gaMeasurementId: @json($analyticsMeasurementId),
            clarityProjectId: @json($clarityProjectId),
            adsenseClientId: @json($adsenseClientId),
          };

          (function () {
            const policies = window.roznamchaPagePolicies || {};
            const config = window.roznamchaTrackingConfig || {};
            const consentCookieName = policies.consentCookieName || 'roznamcha_cookie_consent';
            const consentModeEnabled = Boolean(policies.consentModeEnabled);
            const adsAllowed = Boolean(policies.adsAllowed);
            const analyticsAllowed = Boolean(policies.analyticsAllowed);
            let analyticsLoaded = false;
            let clarityLoaded = false;
            let adsLoaded = false;

            const appendScript = (src, attributes = {}) => {
              const script = document.createElement('script');
              script.src = src;
              script.async = true;
              Object.entries(attributes).forEach(([key, value]) => {
                script.setAttribute(key, value);
              });
              document.head.appendChild(script);
            };

            const readConsent = () => {
              const match = document.cookie.match(new RegExp('(?:^|; )' + consentCookieName + '=([^;]+)'));
              return match ? decodeURIComponent(match[1]) : null;
            };

            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag() {
              window.dataLayer.push(arguments);
            };

            // Establish Consent Mode v2 default state immediately
            window.gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
            });

            const updateConsentMode = (consentState) => {
              const granted = consentState === 'accepted';
              window.gtag('consent', 'update', {
                ad_storage: granted ? 'granted' : 'denied',
                ad_user_data: granted ? 'granted' : 'denied',
                ad_personalization: granted ? 'granted' : 'denied',
                analytics_storage: granted ? 'granted' : 'denied',
              });
            };

            const loadAnalytics = () => {
              if (!analyticsAllowed || analyticsLoaded || !config.gaMeasurementId) {
                return;
              }

              analyticsLoaded = true;
              appendScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.gaMeasurementId));
              window.gtag('js', new Date());
              window.gtag('config', config.gaMeasurementId, {
                anonymize_ip: true,
                allow_google_signals: false,
              });
            };

            const loadClarity = () => {
              if (!analyticsAllowed || clarityLoaded || !config.clarityProjectId) {
                return;
              }

              clarityLoaded = true;
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, 'clarity', 'script', config.clarityProjectId);
            };

            const loadAds = () => {
              if (!adsAllowed || adsLoaded || !config.adsenseClientId) {
                return;
              }

              adsLoaded = true;
              const script = document.createElement('script');
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(config.adsenseClientId);
              script.async = true;
              script.crossOrigin = 'anonymous';
              script.onload = function () {
                window.roznamchaAdsLoaded = true;
                window.dispatchEvent(new CustomEvent('roznamcha:ads-loaded'));
              };
              document.head.appendChild(script);
            };

            const applyConsentState = (consentState) => {
              updateConsentMode(consentState);

              if (consentState === 'accepted') {
                loadAnalytics();
                loadClarity();
                loadAds();
              }
            };

            if (consentModeEnabled) {
              applyConsentState(readConsent());
              window.addEventListener('roznamcha:consent-updated', function (event) {
                applyConsentState(event.detail?.consent ?? null);
              });
            } else {
              loadAnalytics();
              loadClarity();
            }
          })();
        </script>

        @php
            if (! file_exists(public_path('build/manifest.json')) && file_exists(public_path('build/.vite/manifest.json'))) {
                \Illuminate\Support\Facades\Vite::useManifestFilename('.vite/manifest.json');
            }
        @endphp

        {{-- Vite / React refresh --}}
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead

        @php
            $organizationSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                '@id' => "{$siteUrl}#organization",
                'name' => 'Roznamcha',
                'url' => $siteUrl,
                'logo' => "{$siteUrl}/icons/appicon.png",
                'sameAs' => [
                    'https://web.facebook.com/roznamcha.pk/',
                ],
            ];

            $websiteSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                '@id' => "{$siteUrl}#website",
                'name' => 'Roznamcha',
                'url' => $siteUrl,
                'description' => 'Roznamcha helps Pakistani families track kharcha, ration, and inflation in Urdu.',
                'publisher' => [
                    '@id' => "{$siteUrl}#organization",
                ],
            ];
        @endphp

        <script type="application/ld+json">
            {!! json_encode($organizationSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
        </script>
        <script type="application/ld+json">
            {!! json_encode($websiteSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
        </script>
    </head>
    <body class="antialiased bg-gray-50 text-gray-900 min-h-screen">
        @inertia
        <noscript>
            @if(request()->is('features'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700">
                    <h2 class="text-3xl font-bold">See Every Roznamcha Module Without Logging In</h2>
                    <p>Explore Roznamcha's complete suite of money management and budgeting tools built specifically for Pakistani families. From daily kharcha tracking to monthly ration cost forecasting, our platform gives you full visibility over your household finances before you register.</p>
                    <p>Visualize every rupee spent across categories including groceries, utilities, school fees, transport, and medical care to plug leaks before mid-month cash crunches occur.</p>
                    <img src="/media/features/kharcha-map-expense-tracking-pakistan.webp" alt="Kharcha Map Expense Tracking in Pakistan" width="599" height="410" loading="lazy" decoding="async">
                    <p>Monitor fluctuating prices of flour, cooking oil, rice, sugar, and pulses across Pakistani utility stores and open bazaars. Calculate realistic monthly ration allocations tailored to your household size.</p>
                    <img src="/media/features/ration-brain-grocery-price-tracking-pakistan.webp" alt="Ration Brain Grocery Price Tracking Pakistan" width="598" height="366" loading="lazy" decoding="async">
                    <p>Stay ahead of recurring monthly obligations including electricity slabs, gas bills, school fees, rent, and prescription medicine schedules with timely reminders across your family workspace.</p>
                    <img src="/media/features/reminders-health-guard-bill-medicine-pakistan.webp" alt="Reminders and Health Guard Pakistan" width="599" height="358" loading="lazy" decoding="async">
                    <p>Generate automated end-of-month financial summaries that evaluate your burn rate against total income. Receive actionable signals to reduce discretionary kharcha and safeguard emergency savings.</p>
                    <img src="/media/features/reports-signals-monthly-survival-report-pakistan.webp" alt="Reports and Signals Monthly Survival Report Pakistan" width="598" height="325" loading="lazy" decoding="async">
                    <p>Record your daily transactions in seconds without complicated accounting terminology. Build consistent money habits that keep your entire household financially secure throughout the year.</p>
                    <img src="/media/features/daily-money-snapshot-daily-hooks.webp" alt="Daily Money Snapshot Daily Hooks" width="450" height="744" loading="lazy" decoding="async">
                    <p>Ask financial questions in Urdu or English to get instant advice on ration substitutions, budget adjustments, and inflation protection strategies suited for the local Pakistani economy.</p>
                    <img src="/media/features/ai-insights-urdu-financial-advice-pakistan.webp" alt="AI Insights Urdu Financial Advice Pakistan" width="598" height="125" loading="lazy" decoding="async">
                </article>
            @endif
            @if(request()->is('disclaimer'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700">
                    <h2 class="text-3xl font-bold">Disclaimer &amp; Planning Boundaries | Roznamcha</h2>
                    <p>Roznamcha publishes budgeting guides, calculators, and household-planning content for educational and comparison use across Pakistan. The site does not know your full financial circumstances, obligations, risk tolerance, or legal position. Nothing on this site is personal financial, legal, tax, investment, or regulatory advice. You remain responsible for verifying important decisions against official government notices, contracts, utility bills, and local market conditions.</p>
                    <p>Rates, prices, and dates can change quickly in Pakistani markets. Public prices and rules discussed on the site may change after publication. Calculator outputs are planning estimates designed to support thoughtful budgeting, not guarantee exact outcomes or bank approvals.</p>
                    <p>Economic conditions, currency valuations, fuel adjustments, and taxation policies across federal and provincial authorities in Pakistan fluctuate regularly. Any budgeting simulations, grocery estimates, school fee calculations, or utility bill estimates provided by Roznamcha rely on user-submitted inputs and representative baseline averages. They should not be relied upon as binding quotations or certified banking assessments.</p>
                    <p>Users must exercise their own independent judgement and due diligence when executing financial commitments, signing rental agreements, or making significant household purchasing decisions. Roznamcha accepts no liability for direct, indirect, or incidental financial losses incurred from relying on projections generated through our open tools.</p>
                </article>
            @endif
            @if(request()->is('tools/ration-cost-estimator'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700 space-y-6">
                    <h2 class="text-3xl font-bold">Ration Cost Estimator Pakistan – Monthly Grocery Budget Calculator</h2>
                    <p>Estimate your monthly kitchen ration cost across Pakistan based on essential grocery staples including wheat flour (atta), basmati and regular rice, cooking ghee/oil, refined sugar, and pulses (daal). This tool establishes a reliable, non-perishable food baseline before shopping in wholesale markets or neighborhood kiryana stores.</p>

                    <h2 class="text-2xl font-bold mt-4">Methodology &amp; Calculation Mechanics</h2>
                    <p>The Ration Cost Estimator computes monthly grocery allocations through a deterministic item-quantity model: Total Monthly Ration Cost = &Sigma; (Quantity &times; Base Retail Price). Default baskets are tailored for different household scales—from 2-person compact apartments to 8-person joint family residences. Baseline prices represent weighted open-market retail averages across urban hubs (Karachi, Lahore, Rawalpindi, Faisalabad) and are reviewed against localized distributor trends.</p>

                    <h2 class="text-2xl font-bold mt-4">Underlying Data Baseline &amp; Economic Assumptions</h2>
                    <p>Staple grocery inflation in Pakistan is benchmarked against the Pakistan Bureau of Statistics (PBS) Weekly Sensitive Price Indicator (SPI) and Monthly Consumer Price Index (CPI). Subsidized rates from the Utility Stores Corporation (USC) are tracked for targeted relief items, while commercial retail rates incorporate logistics, wholesale markups, and local packaging premiums. Perishable items (fresh vegetables, seasonal fruit, milk, poultry, and beef) fluctuate on daily supply cycles and are deliberately separated into a distinct variable weekly allocation.</p>

                    <h2 class="text-2xl font-bold mt-4">Practical Application Guide for Pakistani Households</h2>
                    <p>To insulate your household from sudden kitchen budget shocks, follow these actionable purchasing practices:</p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Buy Non-Perishables in Monthly Bulk:</strong> Purchasing 20kg flour bags, 5-litre oil cartons, and whole-sack pulses from wholesale grain markets (ghalla mandi) delivers an immediate 12% to 18% saving over neighborhood kiryana shops.</li>
                        <li><strong>Separate Dry Staples from Weekly Sabzi/Gosht:</strong> Allocate your dry staple budget on salary day, reserving variable cash for twice-weekly fresh bazaar purchases.</li>
                        <li><strong>Audit Brand vs Commodity Premiums:</strong> Premium branded cooking oils and double-refined sugar carry up to a 25% marketing markup over certified loose commodities of identical nutritional grade.</li>
                    </ul>

                    <h2 class="text-2xl font-bold mt-4">Frequently Asked Questions</h2>
                    <h3 class="text-xl font-semibold mt-2">How does this tool estimate grocery costs?</h3>
                    <p>The tool multiplies the quantities you input for staples (atta, rice, oil, sugar, daal) by the baseline retail prices configured in the database, allowing you to establish a basic food cost benchmark before you shop.</p>
                    <h3 class="text-xl font-semibold mt-2">Why are fresh vegetables, meat, and milk missing from the list?</h3>
                    <p>This tool focuses exclusively on long-shelf-life dry staples to establish your core kitchen baseline. Highly volatile fresh perishables (milk, meat, vegetables) should be budgeted separately.</p>
                    <h3 class="text-xl font-semibold mt-2">Can I use this estimator for free without registering?</h3>
                    <p>Yes, the calculator is fully functional in guest mode. Registration is only required if you wish to save your grocery plans and view them inside your household workspace.</p>
                    <h3 class="text-xl font-semibold mt-2">How do Utility Store prices differ from open market kiryana stores in Pakistan?</h3>
                    <p>Subsidized utility stores provide targeted relief on basic essentials for eligible families, whereas neighborhood kiryana stores incorporate transport costs and retail markups. This tool allows budgeting against standard open market benchmarks.</p>
                </article>
            @endif
            @if(request()->is('tools/electricity-bill-estimator'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700 space-y-6">
                    <h2 class="text-3xl font-bold">Electricity Bill Estimator Pakistan – NEPRA Tariff Slabs &amp; Taxes</h2>
                    <p>Forecast your monthly residential electricity bill across Pakistani power distribution companies (LESCO, K-Electric, IESCO, FESCO, MEPCO, GEPCO, PESCO, HESCO, SEPCO, QESCO). Calculate progressive tariff slabs, protected versus unprotected status, fuel price adjustments (FPA), and federal surcharges.</p>

                    <h2 class="text-2xl font-bold mt-4">Methodology &amp; Calculation Mechanics</h2>
                    <p>Residential electricity billing in Pakistan follows a multi-tier progressive slab schedule specified by NEPRA. Your consumption is tiered across sequential brackets (1–100, 101–200, 201–300, 301–400, 401–500, 501–600, 601–700, and 701+ units). Total Payable Bill = (Cumulative Base Slab Cost) + (Fuel Price Adjustment / FPA &times; Units) + (Financing Cost Surcharge) + (Electricity Duty) + (General Sales Tax / GST at 17%) + (TV License Fee &amp; Meter Rent). The estimator calculates each bracket mathematically to show the exact marginal cost of incremental kilowatt-hours.</p>

                    <h2 class="text-2xl font-bold mt-4">Underlying Data Baseline &amp; Economic Assumptions</h2>
                    <p>Tariff slabs mirror the latest NEPRA federal notifications. Under prevailing statutory rules, residential consumers maintaining monthly consumption under 200 units consecutively for six months qualify as Protected Consumers, receiving heavily subsidized base tariffs. Consuming even a single unit above 200 (i.e. 201 units) immediately triggers the Unprotected Consumer schedule for the entire month, increasing the marginal unit cost by over 180%.</p>

                    <h2 class="text-2xl font-bold mt-4">Practical Application Guide: Avoiding the 201-Unit Cliff</h2>
                    <p>Household electricity bills can surge exponentially from minor usage changes. Implement these rules to protect your monthly energy budget:</p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Monitor Meter Readings on Day 20:</strong> Check your meter dial 10 days before the meter reader visits. If reading 180 units, restrict air cooler, iron, and washing machine usage to remain strictly below the 200-unit cliff.</li>
                        <li><strong>Isolate Heavy Inductive Loads:</strong> Ironing clothes in a single batch, servicing refrigerator coils, and setting inverter AC thermostats to 26&deg;C instead of 20&deg;C cuts monthly energy consumption by 40 to 60 units.</li>
                        <li><strong>Evaluate Solar Net Metering:</strong> If your household consistently consumes 500+ units monthly, installing rooftop solar offsets peak grid tariffs (Rs. 58+/unit) with a rapid 3-year payback.</li>
                    </ul>

                    <h2 class="text-2xl font-bold mt-4">Frequently Asked Questions</h2>
                    <h3 class="text-xl font-semibold mt-2">Does this estimator use fixed slab values in code?</h3>
                    <p>No. The progressive slab billing reads from the official NEPRA tariff schedule so rates can be updated without changing frontend logic.</p>
                    <h3 class="text-xl font-semibold mt-2">Why is this an estimate and not my exact bill?</h3>
                    <p>It includes configurable adjustments for FPA and surcharges and applies GST, but actual utility bills can include additional line items or timing-based adjustments.</p>
                    <h3 class="text-xl font-semibold mt-2">Can I use this without creating an account?</h3>
                    <p>Yes. The estimator works fully in guest mode. Signup is only for saving estimates and reminders later.</p>
                    <h3 class="text-xl font-semibold mt-2">What is the difference between protected and unprotected consumers in Pakistan?</h3>
                    <p>Under NEPRA tariff regulations, consumers using under 200 units per month consecutively for six months are classified as protected with subsidized rates. Exceeding 200 units reclassifies the meter as unprotected, triggering substantially higher progressive slab rates.</p>
                    <h3 class="text-xl font-semibold mt-2">How do Fuel Price Adjustments (FPA) and taxes affect my final bill?</h3>
                    <p>FPA accounts for monthly changes in generation fuel mix approved by NEPRA. Bills also incur electricity duty, financing cost surcharges, standard GST, and fixed meter charges that apply above the raw slab rate.</p>
                </article>
            @endif
            @if(request()->is('tools/monthly-household-budget-calculator'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700 space-y-6">
                    <h2 class="text-3xl font-bold">Monthly Household Budget Calculator Pakistan – Ghar Ka Budget Planner</h2>
                    <p>Plan your family's monthly take-home income, house rent, kitchen ration, utility bills, school fees, transport, and miscellaneous medical expenses. Instantly determine whether your household is running a budget surplus or living in a dangerous monthly deficit under prevailing inflation.</p>

                    <h2 class="text-2xl font-bold mt-4">Methodology &amp; Calculation Mechanics</h2>
                    <p>The calculator aggregates your monthly net income against 6 primary expenditure categories: Total Expenses = Rent + Ration + Utilities + Education + Transport + Miscellaneous. Surplus / Deficit = Monthly Income - Total Expenses. Savings Rate = (Surplus / Monthly Income) &times; 100. Each category's percentage share is computed to highlight budget disproportion relative to standard urban middle-class baselines.</p>

                    <h2 class="text-2xl font-bold mt-4">Underlying Data Baseline &amp; Economic Assumptions</h2>
                    <p>Traditional international budgeting benchmarks (like the 50/30/20 rule) assume moderate inflation and low fixed housing shares. In Pakistan, economic baseline conditions differ sharply: rent in major cities (Karachi, Lahore, Islamabad) consumes 30% to 40% of middle-class earnings, while food and utilities frequently account for another 40% to 50%, compressing discretionary savings to under 10% for unoptimized households.</p>

                    <h2 class="text-2xl font-bold mt-4">Practical Application Guide: Restoring a Budget Surplus</h2>
                    <p>If your budget indicates a deficit or a savings rate below 10%, execute these adjustments:</p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Cap Discretionary Kharcha First:</strong> Dine-outs, online food deliveries, and impromptu ride-hailing represent the most flexible expense leaks. Curtailing them provides immediate cash liquidity.</li>
                        <li><strong>Manage Utility Slabs Defensively:</strong> Electricity slab management and fuel route optimization can recover Rs. 8,000 to Rs. 15,000 monthly without compromising family well-being.</li>
                        <li><strong>Build a 3-Month Emergency Liquidity Vault:</strong> Direct any surplus into a dedicated, liquid Islamic mutual fund or emergency cash fund before allocating money to lifestyle upgrades.</li>
                    </ul>

                    <h2 class="text-2xl font-bold mt-4">Frequently Asked Questions</h2>
                    <h3 class="text-xl font-semibold mt-2">What is a normal savings rate for a Pakistani household?</h3>
                    <p>Due to recent high inflation, many middle-income households in Pakistan experience a very tight budget with a savings rate below 10%. A target of 15% is ideal but requires strict allocation of variable expenses like utilities and transport.</p>
                    <h3 class="text-xl font-semibold mt-2">How can I reduce variable household expenses in Pakistan?</h3>
                    <p>Focus on progressive slab management for electricity (staying below 200 or 300 units), buying monthly grocery items in bulk from wholesale markets instead of neighborhood shops, and consolidating transit trips to reduce fuel costs.</p>
                    <h3 class="text-xl font-semibold mt-2">Can I use this budget planner without signing up?</h3>
                    <p>Yes. The Monthly Household Budget Calculator works fully in guest mode. You only need to create a free account if you wish to persist your budget snapshot, compare it against live market updates, and get automated alerts.</p>
                    <h3 class="text-xl font-semibold mt-2">How should I prioritize expenses if running a monthly deficit?</h3>
                    <p>Prioritize non-negotiable survival obligations first: housing rent, basic dry ration staples, and keeping electricity consumption below the next slab threshold. Audit discretionary medical/misc buffers and vehicle fuel trips before borrowing.</p>
                </article>
            @endif
            @if(request()->is('tools/school-fees-planner'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700 space-y-6">
                    <h2 class="text-3xl font-bold">School Fees Planner Pakistan – Cost Calculator &amp; Amortization</h2>
                    <p>Calculate your effective monthly education costs in Pakistan by combining monthly tuition, annual charges, examination fees, and tuition inflation buffers across all school-going children.</p>

                    <h2 class="text-2xl font-bold mt-4">Methodology &amp; Calculation Mechanics</h2>
                    <p>Most parental budgeting breakdowns occur because parents plan solely around monthly tuition vouchers, ignoring large lump-sum charges. Real Monthly Education Cost = (Children Count &times; Monthly Tuition) + [(Annual Registration &amp; Facility Charges + Exam Fees &times; Frequency) / 12]. Projected Next Year Cost applies a localized inflation buffer (default 12%) to project upcoming academic year cash requirements.</p>

                    <h2 class="text-2xl font-bold mt-4">Underlying Data Baseline &amp; Economic Assumptions</h2>
                    <p>Private school fee structures across Punjab, Sindh, Khyber Pakhtunkhwa, and ICT escalate by an average of 10% to 15% annually to absorb private campus electricity tariffs, facility rents, and staff payroll adjustments. Examination fees across Cambridge (O/A Levels), Federal Board (FBISE), and Provincial Boards (BISE) arrive on fixed bi-annual cycles, producing severe cash flow shocks if unamortized.</p>

                    <h2 class="text-2xl font-bold mt-4">Practical Application Guide: Creating an Education Sinking Fund</h2>
                    <p>Implement these steps to keep school costs predictable:</p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Establish a Dedicated Amortization Account:</strong> Deposit the monthly amortized non-tuition amount into a separate bank account on salary day so funds are ready when annual admission charges arrive.</li>
                        <li><strong>Inquire About Sibling Discounts:</strong> Most tier-1 and tier-2 private school chains offer a 10% to 20% sibling tuition concession for second and third children. Confirm this discount is active on your vouchers.</li>
                        <li><strong>Amortize Uniforms and Book Bundles:</strong> School textbook syllabus packs and uniforms cost between Rs. 15,000 and Rs. 35,000 per student every April/August; include these in your annual non-tuition line item.</li>
                    </ul>

                    <h2 class="text-2xl font-bold mt-4">Frequently Asked Questions</h2>
                    <h3 class="text-xl font-semibold mt-2">Why does the real monthly school cost look higher than tuition?</h3>
                    <p>Because annual charges and recurring exam fees are spread across 12 months. This avoids budget shocks during fee-heavy months.</p>
                    <h3 class="text-xl font-semibold mt-2">Does this planner store my school fee data?</h3>
                    <p>No. Guests can calculate instantly. Sign up only if you want to save the estimate inside your household ledger later.</p>
                    <h3 class="text-xl font-semibold mt-2">What is the planning margin used for?</h3>
                    <p>It projects a safer monthly reserve for the next academic year by applying a configurable percentage to your current real monthly cost.</p>
                    <h3 class="text-xl font-semibold mt-2">How should Pakistani families budget for annual private school fee hikes?</h3>
                    <p>Private school tuition across major cities typically increases by 10% to 15% each academic year. Setting aside an inflation buffer in a monthly education sinking fund prevents mid-year fee notices from breaking the family budget.</p>
                </article>
            @endif
            @if(request()->is('tools/solar-net-metering-roi-calculator'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700 space-y-6">
                    <h2 class="text-3xl font-bold">Solar Net Metering &amp; ROI Calculator Pakistan (2026)</h2>
                    <p>Calculate your turnkey solar payback period, NEPRA buyback earnings, and 10-year battery Total Cost of Ownership (TCO) across Pakistan distribution companies (DISCOs) including LESCO, IESCO, K-Electric, FESCO, MEPCO, and PESCO.</p>
                    <p>Under NEPRA's active Net Billing regulations, self-consumed solar electricity offsets peak and off-peak grid tariffs (Rs. 42 to Rs. 71+ per unit for unprotected residential slabs), while surplus exported units are credited at the national average energy purchase price (~Rs. 11.00 per unit). Optimizing daytime self-consumption delivers the fastest payback period (typically 2.8 to 4.2 years).</p>
                    
                    <h2 class="text-2xl font-bold mt-4">Methodology &amp; Calculation Mechanics</h2>
                    <p>Total Monthly Net Savings = (Self-Consumed Units &times; Avoided Retail Grid Tariff) + (Exported Surplus Units &times; National Buyback Rate Rs. 11.00) - (Monthly Battery Levelized Maintenance Cost). Turnkey Solar Payback Period (Years) = Total System Capital Expenditure (CAPEX) / Annualized Net Energy Savings. System Sizing recommends 3kW for monthly consumption under 350 units, 5kW for under 650 units, 10kW for under 1,100 units, and 15kW to 20kW for higher residential and commercial air conditioning demands.</p>

                    <h2 class="text-2xl font-bold mt-4">Underlying Data Baseline: LiFePO4 vs Tall Tubular Storage</h2>
                    <p>While Tall Tubular lead-acid batteries have a lower initial purchase price (approx Rs. 140,000 per 48V bank), they degrade within 800 to 1,200 cycles in high ambient Pakistani summer temperatures (operating at a restrictive 50% maximum Depth of Discharge), necessitating 3 to 4 full bank replacements across a 10-year lifespan. In contrast, Lithium Iron Phosphate (LiFePO4) storage yields 5,000 to 6,000 cycles at 90% Depth of Discharge with zero mid-term replacements, delivering an effective 35% to 40% lower Total Cost of Ownership per stored kilowatt-hour.</p>

                    <h2 class="text-2xl font-bold mt-4">Practical Application Guide for Solar Adopters</h2>
                    <p>Maximize the financial return of your solar investment through strategic consumption shifts:</p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Shift High-Wattage Appliances to Solar Hours (10:00 AM – 3:30 PM):</strong> Running water booster pumps, washing machines, and daytime air conditioning directly from solar arrays yields Rs. 58+/unit in avoided grid tariffs versus only Rs. 11/unit in export compensation.</li>
                        <li><strong>Track Sanctioned Load Verification:</strong> Ensure your distribution transformer capacity allows green meter interconnection before procuring panels and inverters.</li>
                        <li><strong>Verify Earthing Pit Resistance:</strong> DISCO testing teams mandate earthing pit resistance below 5 ohms for bi-directional net billing commissioning.</li>
                    </ul>

                    <h2 class="text-2xl font-bold mt-4">Frequently Asked Questions</h2>
                    <h3 class="text-xl font-semibold mt-2">How does NEPRA Net Billing differ from traditional Net Metering?</h3>
                    <p>Under traditional Net Metering, exported solar units offset imported grid units 1-to-1 at retail slab rates. Under NEPRA's Net Billing (Buyback) framework, self-consumed solar power saves you the full DISCO retail tariff (Rs. 42–58+/unit), while exported excess units are credited at the National Average Energy Purchase Price (~Rs. 11.00/unit). Maximizing daytime self-consumption delivers the highest ROI.</p>
                    <h3 class="text-xl font-semibold mt-2">Why does LiFePO4 battery storage cost less over 10 years than Tubular?</h3>
                    <p>While Tall Tubular lead-acid batteries have a lower upfront cost (Rs. ~140,000 per 48V bank), they degrade rapidly in Pakistani summer temperatures with a cycle life of only 800–1,200 cycles (2–3 years at 50% DoD), requiring 3 to 4 complete bank replacements over 10 years. LiFePO4 lithium batteries last 5,000–6,000 cycles (10+ years at 90% DoD) with zero replacements, resulting in ~35%–40% lower cost per stored kWh.</p>
                    <h3 class="text-xl font-semibold mt-2">How long does the DISCO Green Meter process take in Pakistan?</h3>
                    <p>Typical processing time across LESCO, IESCO, GEPCO, and other DISCOs ranges from 45 to 90 days. The turnkey process includes NEPRA generation license application, distribution transformer load verification, third-party inspection, and bidirectional meter installation.</p>
                    <h3 class="text-xl font-semibold mt-2">Can I run inverter air conditioners during grid load shedding?</h3>
                    <p>Standard On-Grid string inverters shut down immediately during grid outages for lineman safety (anti-islanding). To run air conditioners during load shedding, you need a Hybrid inverter with either Tubular or LiFePO4 battery storage sized to handle compressor inrush currents.</p>
                    <h3 class="text-xl font-semibold mt-2">How does self-consumption affect payback speed?</h3>
                    <p>Because retail electricity slab tariffs (Rs. 42 to 71+/unit) far exceed the exported unit buyback rate (Rs. 11/unit), scheduling heavy daytime loads—such as water pumps, washing machines, and inverter air conditioning—delivers up to 3x higher economic value per solar kilowatt-hour generated.</p>
                </article>
            @endif
            <nav aria-label="Quick directory" class="p-4 text-xs text-slate-500 text-center">
                <a href="/features/monthly-expense-tracker-pakistan">Monthly Expense Tracker Pakistan</a> |
                <a href="/tools/ration-cost-estimator">Ration Cost Estimator</a> |
                <a href="/tools/electricity-bill-estimator">Electricity Bill Estimator</a> |
                <a href="/tools/solar-net-metering-roi-calculator">Solar Net Metering &amp; ROI Calculator</a> |
                <a href="/tools/monthly-household-budget-calculator">Monthly Household Budget Calculator</a> |
                <a href="/tools/school-fees-planner">School Fees Planner</a> |
                <a href="/templates">Smart Budget Templates</a> |
                <a href="/editorial-policy">Editorial Policy</a> |
                <a href="/methodology">Methodology &amp; Sources</a> |
                <a href="/about">About Us</a> |
                <a href="/contact">Contact</a> |
                <a href="/disclaimer">Disclaimer</a> |
                <a href="/cookie-policy">Cookie Policy</a> |
                <a href="/privacy-policy">Privacy Policy</a> |
                <a href="/terms">Terms of Service</a> |
                <a href="/sitemap.xml">Sitemap</a>
            </nav>
        </noscript>
        <script>
            // Service worker registration
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js')
                        .catch((error) => {
                            console.error('Service worker registration failed:', error)
                        })
                })
            }
        </script>
        <!-- release: {{ \App\Support\AppRelease::get() }} -->
    </body>
</html>
