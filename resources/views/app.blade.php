<!DOCTYPE html>
<html lang="en">
    <head>
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
        <title>Roznamcha</title>

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5EPHFZLH71"></script>
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

        {{-- Vite / React refresh --}}
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead

        @php
            $organizationSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                '@id' => 'https://roznamcha.pk#organization',
                'name' => 'Roznamcha',
                'url' => 'https://roznamcha.pk',
                'logo' => 'https://roznamcha.pk/icons/appicon.png',
                'description' => 'Urdu-first Pakistani platform for household budgeting, ration planning, and inflation insights.',
                'sameAs' => [
                    'https://www.facebook.com/roznamchaPK',
                    'https://www.twitter.com/roznamchaPK',
                    'https://www.linkedin.com/company/roznamcha',
                ],
                'contactPoint' => [
                    [
                        '@type' => 'ContactPoint',
                        'contactType' => 'customer support',
                        'telephone' => '+92-21-111-ROZ-NAM',
                        'email' => 'support@roznamcha.pk',
                        'availableLanguage' => ['en', 'ur'],
                    ],
                ],
            ];

            $websiteSchema = [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                '@id' => 'https://roznamcha.pk#website',
                'name' => 'Roznamcha',
                'url' => 'https://roznamcha.pk',
                'description' => 'Roznamcha helps Pakistani families track kharcha, ration, and inflation in Urdu.',
                'publisher' => [
                    '@id' => 'https://roznamcha.pk#organization',
                ],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => 'https://roznamcha.pk/search?q={query}',
                    'query-input' => 'required name=query',
                ],
            ];
        @endphp

        <script type="application/ld+json">
            {!! json_encode($organizationSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
        </script>
        <script type="application/ld+json">
            {!! json_encode($websiteSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
        </script>
        <script type="application/ld+json">
            {!! json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => 'Roznamcha',
                'url' => 'https://roznamcha.pk',
                'sameAs' => [
                    'https://facebook.com/roznamcha.pk',
                ],
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
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
