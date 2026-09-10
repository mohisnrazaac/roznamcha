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
            $serverTitle = (empty($rawTitle) || strlen($rawTitle) < 30) ? $fallbackTitle : $rawTitle;

            $fallbackDescription = 'Roznamcha helps Pakistani families track monthly expenses, compare ration costs, manage reminders, and budget with practical local insights.';
            $rawDescription = data_get($pageSeo, 'description', '');
            $effectiveDescription = (empty($rawDescription) || strlen($rawDescription) < 50 || strlen($rawDescription) > 160)
                ? $fallbackDescription
                : $rawDescription;

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
        <meta name="csrf-token" content="{{ csrf_token() }}">
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
        <title inertia>{{ $serverTitle }}</title>
        <meta name="description" content="{{ $effectiveDescription }}" inertia="description">
        @if ($serverKeywords)
            <meta name="keywords" content="{{ $serverKeywords }}" inertia="keywords">
        @endif
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

        {{-- Twitter / X Cards --}}
        <meta name="twitter:card" content="summary_large_image" inertia="twitter:card">
        <meta name="twitter:title" content="{{ $serverTitle }}" inertia="twitter:title">
        <meta name="twitter:description" content="{{ $effectiveDescription }}" inertia="twitter:description">
        <meta name="twitter:image" content="{{ $serverImage }}" inertia="twitter:image">

        @if ($pageJsonLd)
            <script type="application/ld+json" inertia="page-jsonld">
                {!! json_encode($pageJsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
            </script>
        @endif
        @php
            $pagePolicies = data_get($page ?? [], 'props.pagePolicies', []);
            $adsenseClientId = (string) config('services.adsense.client_id', 'ca-pub-8709269992599634');
            $analyticsMeasurementId = (string) config('services.analytics.ga_measurement_id', 'G-5EPHFZLH71');
            $clarityProjectId = (string) config('services.analytics.clarity_project_id', 'v5b4l0m7s1');
        @endphp

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8709269992599634" crossorigin="anonymous"></script>
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

            const updateConsentMode = (consentState) => {
              const granted = consentState === 'accepted';
              window.gtag('consent', 'default', {
                ad_storage: granted ? 'granted' : 'denied',
                ad_user_data: granted ? 'granted' : 'denied',
                ad_personalization: granted ? 'granted' : 'denied',
                analytics_storage: granted ? 'granted' : 'denied',
                functionality_storage: 'granted',
                security_storage: 'granted',
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
              appendScript(
                'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(config.adsenseClientId),
                { crossorigin: 'anonymous' }
              );
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
                    <h1 class="text-3xl font-bold">See Every Roznamcha Module Without Logging In</h1>
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
                    <h1 class="text-3xl font-bold">Disclaimer &amp; Planning Boundaries | Roznamcha</h1>
                    <p>Roznamcha publishes budgeting guides, calculators, and household-planning content for educational and comparison use across Pakistan. The site does not know your full financial circumstances, obligations, risk tolerance, or legal position. Nothing on this site is personal financial, legal, tax, investment, or regulatory advice. You remain responsible for verifying important decisions against official government notices, contracts, utility bills, and local market conditions.</p>
                    <p>Rates, prices, and dates can change quickly in Pakistani markets. Public prices and rules discussed on the site may change after publication. Calculator outputs are planning estimates designed to support thoughtful budgeting, not guarantee exact outcomes or bank approvals.</p>
                    <p>Economic conditions, currency valuations, fuel adjustments, and taxation policies across federal and provincial authorities in Pakistan fluctuate regularly. Any budgeting simulations, grocery estimates, school fee calculations, or utility bill estimates provided by Roznamcha rely on user-submitted inputs and representative baseline averages. They should not be relied upon as binding quotations or certified banking assessments.</p>
                    <p>Users must exercise their own independent judgement and due diligence when executing financial commitments, signing rental agreements, or making significant household purchasing decisions. Roznamcha accepts no liability for direct, indirect, or incidental financial losses incurred from relying on projections generated through our open tools.</p>
                </article>
            @endif
            @if(request()->is('login'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700">
                    <h1 class="text-3xl font-bold">Log In to Roznamcha Household Expense Tracker</h1>
                    <p>Access your secure Roznamcha account to manage family budgets, record daily expenses, track local bazaar inflation, and plan grocery purchases across Pakistan. Your personal financial data and household accounts remain private, protected, and accessible only with your verified credentials.</p>
                    <p>If you have forgotten your password or need assistance recovering your household budget account, use the reset options available or contact our support team. Roznamcha provides comprehensive monthly expense summaries, utility bill estimation tools, and smart household budget templates designed specifically for Pakistani families.</p>
                    <p>Stay on top of month-end survival metrics, compare your recurring utility charges, and organize your daily hisab-kitab seamlessly from any mobile device or browser with encrypted data protection.</p>
                    <p>Managing your household finance requires consistent recording of day-to-day transactions. With Roznamcha, your entries are automatically backed up and synchronized across all authorized devices. Whether you are budgeting for seasonal utility spikes during peak summer months or planning advance school fee allocations, logging in keeps your financial cockpit up to date with zero data loss.</p>
                </article>
            @endif
            @if(request()->is('register'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700">
                    <h1 class="text-3xl font-bold">Create Your Free Roznamcha Account</h1>
                    <p>Join thousands of Pakistani households using Roznamcha to take full control of monthly expenses, ration budgets, and inflation pressures. Creating an account gives you instant access to personalized expense categories, automated bill reminders, and long-term financial planning tools.</p>
                    <p>Signing up is completely free and requires only a verified email address. Start logging your groceries, school fees, electricity bills, and household income in Pakistani Rupees with detailed monthly survival reports and smart Urdu-first money management tools.</p>
                    <p>Build disciplined household financial habits, track price trends across Pakistani bazaars, and eliminate end-of-month cash deficits with automated budget allocations tailored to your family size and monthly income.</p>
                    <p>From Karachi and Lahore to Islamabad, Peshawar, and Quetta, households face unique regional cost structures and grocery price movements. Roznamcha empowers you to customize your expense categories according to your exact living standards, calculate emergency cash reserves, and achieve sustainable monthly financial freedom without tedious spreadsheets or confusing accounting jargon.</p>
                </article>
            @endif
            @if(request()->is('tools/solar-net-metering-roi-calculator'))
                <article class="p-6 max-w-4xl mx-auto text-slate-700">
                    <h1 class="text-3xl font-bold">Solar Net Metering &amp; ROI Calculator Pakistan (2026)</h1>
                    <p>Calculate your turnkey solar payback period, NEPRA buyback earnings, and 10-year battery Total Cost of Ownership (TCO) across Pakistan distribution companies (DISCOs) including LESCO, IESCO, K-Electric, FESCO, MEPCO, and PESCO.</p>
                    <p>Under NEPRA's active Net Billing regulations, self-consumed solar electricity offsets peak and off-peak grid tariffs (Rs. 42 to Rs. 71+ per unit for unprotected residential slabs), while surplus exported units are credited at the national average energy purchase price (~Rs. 11.00 per unit). Optimizing daytime self-consumption delivers the fastest payback period (typically 2.8 to 4.2 years).</p>
                    <h2 class="text-2xl font-bold mt-4">Solar System Sizing Heuristics for Pakistani Households</h2>
                    <p>Residential solar system capacity should align with your monthly electricity consumption patterns and sanctioned load limits. A 5kW system generates approximately 550 to 650 kWh monthly, suitable for moderate households running one inverter AC and baseline refrigeration. Larger households consuming 900 to 1,400 units monthly require 10kW to 15kW three-phase systems to offset daytime air conditioning loads.</p>
                    <h2 class="text-2xl font-bold mt-4">Battery Storage Economics: LiFePO4 vs Tall Tubular</h2>
                    <p>While Tall Tubular lead-acid batteries have lower upfront purchase costs, they degrade within 800 to 1,200 cycles in high ambient Pakistani temperatures, requiring 3 to 4 complete bank replacements over a 10-year period. In contrast, Lithium Iron Phosphate (LiFePO4) storage delivers 5,000 to 6,000 cycles at 90% Depth of Discharge (DoD), yielding a 35% to 40% lower cost per stored kilowatt-hour over a decade.</p>
                    <h2 class="text-2xl font-bold mt-4">Frequently Asked Questions</h2>
                    <h3 class="text-xl font-semibold mt-2">How long does the DISCO Green Meter process take in Pakistan?</h3>
                    <p>Processing typically requires 45 to 90 days across distribution companies, covering NEPRA generation licensing, distribution transformer capacity checks, earthing pit resistance verification (must be below 5 ohms), and digital bidirectional meter commissioning.</p>
                    <h3 class="text-xl font-semibold mt-2">Can on-grid inverters operate during load shedding?</h3>
                    <p>Standard on-grid string inverters disconnect during grid outages to comply with anti-islanding safety standards. Running essential household loads during power outages requires a hybrid inverter paired with battery storage sized to handle compressor inrush currents.</p>
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
                <a href="/blog/pakistan-sovereign-cloud-ai-trade-ecosystem-2026">Pakistan Sovereign Cloud & AI Guide</a> |
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
    </body>
</html>
