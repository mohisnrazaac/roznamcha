import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from '../../vendor/tightenco/ziggy/dist/index.esm.js';
import { ZiggyReact } from 'ziggy-js';

const fallbackZiggy = {
    url: import.meta.env.VITE_APP_URL ?? 'https://roznamcha.pk',
    defaults: {},
    routes: {},
    location: import.meta.env.VITE_APP_URL ?? 'https://roznamcha.pk',
};

createInertiaApp({
  title: (title) => `${title} - Roznamcha`,
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    const applyDirection = (pageProps) => {
      document.documentElement.dir = pageProps?.isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = pageProps?.appLocale ?? 'en';
    };

    applyDirection(props.initialPage.props);

    const unsubscribe = router.on('finish', (event) => {
      applyDirection(event.detail.page.props);
    });

    const ziggyConfig = props.initialPage.props?.ziggy ?? fallbackZiggy;
    window.route = (name, params, absolute) =>
      route(name, params, absolute, {
        ...ziggyConfig,
        location: new URL(ziggyConfig.location || window.location.href),
      });

    createRoot(el).render(
      <ZiggyReact.Provider value={{ Ziggy: ziggyConfig }}>
        <App {...props} />
      </ZiggyReact.Provider>
    );

    return () => {
      unsubscribe();
    };
  },
  progress: {
    color: '#1e3a8a',
  },
});
