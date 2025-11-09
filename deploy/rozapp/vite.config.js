import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    // 👇 this makes sure that in production,
    // asset URLs start with /build/ (which matches what we deployed to public_html/build)
    base: '/build/',

    plugins: [
        laravel({
            // this tells laravel-vite-plugin how to generate manifest and scripts for prod
            input: 'resources/js/app.jsx',
            refresh: true,

            // we make sure it knows our build dir
            buildDirectory: 'build',
        }),
        react(),
    ],

    build: {
        // 👇 actually write compiled assets into public/build
        outDir: 'public/build',

        // 👇 Laravel expects a manifest.json to exist for @vite() helper
        manifest: true,

        rollupOptions: {
            input: 'resources/js/app.jsx',
        },
        emptyOutDir: true,
    },

    resolve: {
        alias: {
            'ziggy-js': path.resolve('resources/js/lib/ziggy-react.jsx'),
        },
    },
});