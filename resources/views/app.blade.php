<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Roznamcha</title>

        {{-- Inject Ziggy route() helper into window --}}
        @routes

        {{-- Vite / React refresh --}}
        @viteReactRefresh
        @vite('resources/js/app.jsx')
    </head>
    <body class="antialiased bg-gray-50 text-gray-900 min-h-screen">
        @inertia
    </body>
</html>
