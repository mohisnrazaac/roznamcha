const fallbackUrl = import.meta.env.VITE_APP_URL ?? 'https://roznamcha.pk';

const resolveZiggy = () => {
    if (typeof window !== 'undefined' && window.Ziggy) {
        return window.Ziggy;
    }

    return {
        url: fallbackUrl,
        defaults: {},
        routes: {},
        location: fallbackUrl,
    };
};

const Ziggy = resolveZiggy();

export { Ziggy };
