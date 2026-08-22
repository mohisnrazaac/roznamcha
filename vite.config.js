import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

const rawBase = process.env.VITE_BASE_PATH || '/build/';
const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

export default defineConfig({
    // 👇 this makes sure that in production,
    // asset URLs start with /build/ (override via VITE_BASE_PATH for subfolder hosting)
    base: normalizedBase,

    plugins: [
        laravel({
            // this tells laravel-vite-plugin how to generate manifest and scripts for prod
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,

            // we make sure it knows our build dir
            buildDirectory: 'build',
        }),
        react(),
    ],

    build: {
        // 👇 Laravel expects a manifest.json to exist for @vite() helper
        manifest: true,
        emptyOutDir: true,
    },

    // Produce a deployable SSR bundle for shared hosting where node_modules
    // is not installed alongside bootstrap/ssr.
    ssr: {
        noExternal: true,
    },

    resolve: {
        alias: {
            'ziggy-js': path.resolve('resources/js/lib/ziggy-react.jsx'),
        },
    },
});
