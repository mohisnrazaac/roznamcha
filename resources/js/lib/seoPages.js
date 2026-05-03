// Purpose: Centralize frontend href generation for programmatic SEO pages so future cross-linking avoids scattered URL strings. Date: 2026-03-29. Author: Mohsin.

const normalize = (value) => String(value ?? '').trim().toLowerCase();

export const seoPageHref = (pageType, pageKey) => {
    switch (pageType) {
        case 'petrol':
            return `/petrol-price-${normalize(pageKey)}-today`;
        case 'electricity':
            return `/electricity-bill-calculator-${normalize(pageKey)}`;
        case 'ration':
            return `/ration-cost-for-${Number(pageKey)}-people-pakistan`;
        default:
            throw new Error(`Unsupported SEO page type: ${pageType}`);
    }
};

export const seoPageLabel = (pageType, pageKey) => {
    switch (pageType) {
        case 'petrol':
            return `Petrol price in ${normalize(pageKey).replace(/-/g, ' ')} today`;
        case 'electricity':
            return `Electricity bill calculator for ${normalize(pageKey).toUpperCase()}`;
        case 'ration':
            return `Ration cost for ${Number(pageKey)} people in Pakistan`;
        default:
            throw new Error(`Unsupported SEO page type: ${pageType}`);
    }
};
