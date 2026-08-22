<!DOCTYPE html>
<html lang="en">
    <head>
        @php
            $pageSeo = data_get($page ?? [], 'props.seo');
            $pageJsonLd = data_get($page ?? [], 'props.jsonLd');
            $serverTitle = data_get($pageSeo, 'title', 'Roznamcha');
            $serverDescription = data_get($pageSeo, 'description');
            $serverCanonical = data_get($pageSeo, 'canonical');
            $serverRobots = data_get($pageSeo, 'robots');
            $siteUrl = rtrim(config('app.url', 'https://roznamcha.pk'), '/');
        @endphp
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="csrf-token" content="{{ csrf_token() }}">
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
        @if ($serverDescription)
            <meta name="description" content="{{ $serverDescription }}" inertia="description">
        @endif
        @if ($serverCanonical)
            <link rel="canonical" href="{{ $serverCanonical }}" inertia="canonical">
        @endif
        @if ($serverRobots)
            <meta name="robots" content="{{ $serverRobots }}" inertia="robots">
        @endif
        @if ($pageJsonLd)
            <script type="application/ld+json" inertia="page-jsonld">
                {!! json_encode($pageJsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
            </script>
        @endif
        @php
            $pagePolicies = data_get($page ?? [], 'props.pagePolicies', []);
            $adsenseClientId = (string) config('services.adsense.client_id', '');
            $analyticsMeasurementId = (string) config('services.analytics.ga_measurement_id', 'G-5EPHFZLH71');
            $clarityProjectId = (string) config('services.analytics.clarity_project_id', 'v5b4l0m7s1');
        @endphp

        @if ($adsenseClientId && data_get($pagePolicies, 'adsAllowed'))
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossorigin>
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
