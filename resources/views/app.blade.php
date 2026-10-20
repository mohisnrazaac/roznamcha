<!DOCTYPE html>
<html lang="en">
    <head>
        @php
            if (!isset($__inertiaSsrDispatched)) {
                $__inertiaSsrDispatched = true;
                $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page);
            }
            $hasSsrHead = !empty($__inertiaSsrResponse?->head);

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

            $pagePolicies = data_get($page ?? [], 'props.pagePolicies', []);
            $adsenseClientId = (string) (config('services.adsense.client_id') ?: 'ca-pub-8709269992599634');
            $analyticsMeasurementId = (string) config('services.analytics.ga_measurement_id', 'G-5EPHFZLH71');
            $clarityProjectId = (string) config('services.analytics.clarity_project_id', 'v5b4l0m7s1');
            $adsAllowed = (bool) data_get($pagePolicies, 'adsAllowed', false);
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        @auth
            <meta name="csrf-token" content="{{ csrf_token() }}">
        @endauth
        <meta property="og:see_also" content="https://facebook.com/roznamcha.pk" />
        {{-- PWA manifest link --}}
        <link rel="manifest" href="/manifest.webmanifest">
        {{-- Primary icon / favicon --}}
        <link rel="icon" type="image/png" href="/icons/appicon.png">
        {{-- PWA meta tags --}}
        <meta name="theme-color" content="#061325">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="google-adsense-account" content="{{ $adsenseClientId }}">

        {{-- Google Consent Mode v2 Default State (Must precede all Google tags) --}}
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted'
            });
        </script>

        @if ($adsAllowed && !empty($adsenseClientId))
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ $adsenseClientId }}" crossorigin="anonymous"></script>
        @endif

        @if (!$hasSsrHead)
            <meta name="author" content="{{ $serverAuthor }}" inertia="author">
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
        @endif
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
            window.gtag = window.gtag || function gtag() {
              window.dataLayer.push(arguments);
            };

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
              const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
              if (existingScript) {
                window.roznamchaAdsLoaded = true;
                window.dispatchEvent(new CustomEvent('roznamcha:ads-loaded'));
                return;
              }

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

            const headAdScript = document.querySelector('script[src*="adsbygoogle.js"]');
            if (headAdScript) {
              headAdScript.addEventListener('load', function () {
                window.roznamchaAdsLoaded = true;
                window.dispatchEvent(new CustomEvent('roznamcha:ads-loaded'));
              });
            }

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
            <div class="p-4 text-center text-sm text-slate-600">
                Interactive calculators work best with JavaScript enabled, though all guides and baseline estimates remain readable above.
            </div>
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
