import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyReact } from 'ziggy-js';
import { Ziggy } from './ziggy';

createInertiaApp({
  title: (title) => `${title} - Roznamcha`,
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
  setup({ el, App, props }) {
    createRoot(el).render(
      <ZiggyReact.Provider value={{ Ziggy }}>
        <App {...props} />
      </ZiggyReact.Provider>
    );
  },
  progress: {
    color: '#1e3a8a',
  },
});
