import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route } from '../../vendor/tightenco/ziggy/dist/index.esm.js';
import { ZiggyReact } from 'ziggy-js';
import { Ziggy } from './ziggy';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - Roznamcha`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx'),
            ),
        setup: ({ App, props }) => {
            const ziggyConfig = page.props.ziggy || Ziggy;

            global.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...ziggyConfig,
                    location: new URL(ziggyConfig.location || 'https://roznamcha.pk'),
                });

            return (
                <ZiggyReact.Provider value={{ Ziggy: ziggyConfig }}>
                    <App {...props} />
                </ZiggyReact.Provider>
            );
        },
    }),
);
