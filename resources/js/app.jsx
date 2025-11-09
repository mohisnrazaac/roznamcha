import './bootstrap';
import '../css/app.css';
import React from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyReact } from 'ziggy-js';
import { Ziggy } from './ziggy';

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

    createRoot(el).render(
      <ZiggyReact.Provider value={{ Ziggy }}>
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
