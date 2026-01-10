<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="csrf-token" content="{{ csrf_token() }}">
        {{-- PWA manifest link --}}
        <link rel="manifest" href="/manifest.webmanifest">
        {{-- Primary icon / favicon --}}
        <link rel="icon" type="image/png" href="/icons/appicon.png">
        {{-- PWA meta tags --}}
        <meta name="theme-color" content="#061325">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <title>Roznamcha</title>

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
