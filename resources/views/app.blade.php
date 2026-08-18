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

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5EPHFZLH71"></script>
        @if (config('services.adsense.client_id'))
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossorigin>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ urlencode(config('services.adsense.client_id')) }}" crossorigin="anonymous"></script>
        @endif
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-5EPHFZLH71');
        </script>

        <script type="text/javascript">
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "v5b4l0m7s1");
        </script>

        {{-- Inject Ziggy route() helper into window --}}
        @routes

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
        <footer class="bg-gray-900 text-center text-sm text-white/80 py-4">
            <a
                href="https://facebook.com/roznamcha.pk"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-yellow-300 hover:text-white transition"
            >
                Follow us on Facebook
            </a>
        </footer>
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
