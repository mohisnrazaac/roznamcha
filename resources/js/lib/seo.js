export const SITE_URL = 'https://roznamcha.pk';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.ico`;

export const seoContent = {
    home: {
        title: 'Roznamcha – Pakistan’s Urdu-first household budget & kharcha tracker',
        description:
            'Roznamcha helps Pakistani families track monthly expenses, compare ration costs, manage reminders, and understand real household budgets with practical local insights.',
        path: '/',
        url: SITE_URL,
        canonical: SITE_URL,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Pakistan budget app', 'household kharcha', 'Urdu expense tracker', 'grocery inflation', 'family finances'],
        type: 'website',
        schemaName: 'Roznamcha Home',
        inLanguage: 'ur',
    },
    kharchaMap: {
        title: 'Kharcha Map – Visualize every rupee spent across Pakistan',
        description:
            'Plot rent, utilities, transport, and ration spending to see where each rupee goes so Pakistani households can plug leaks quickly.',
        path: '/kharcha-map',
        url: `${SITE_URL}/kharcha-map`,
        canonical: `${SITE_URL}/kharcha-map`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['kharcha map', 'rupee tracking', 'Pakistan household costs', 'Urdu budgeting', 'expense heatmap'],
        type: 'article',
        schemaName: 'Kharcha Map',
    },
    rationBrain: {
        title: 'Ration Brain – Smart grocery planning for volatile Pakistani markets',
        description:
            'Forecast atta, ghee, chawal, and sabzi costs with inflation-aware ration planning tuned for Urdu-speaking Pakistani households.',
        path: '/ration-brain',
        url: `${SITE_URL}/ration-brain`,
        canonical: `${SITE_URL}/ration-brain`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['ration planner', 'grocery inflation Pakistan', 'atta price tracking', 'Urdu grocery app', 'household ration'],
        type: 'article',
        schemaName: 'Ration Brain',
    },
    survivalReport: {
        title: 'Survival Report – Inflation-adjusted budget health for Pakistani families',
        description:
            'Simulate future bills, emergency funds, and fuel hikes to know whether your household plan can survive the next inflation shock.',
        path: '/survival-report',
        url: `${SITE_URL}/survival-report`,
        canonical: `${SITE_URL}/survival-report`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['survival report', 'inflation forecast Pakistan', 'budget resilience', 'Urdu finance planning', 'expense stress test'],
        type: 'article',
        schemaName: 'Survival Report',
    },
    about: {
        title: 'About Roznamcha – Pakistani makers of household finance intelligence',
        description:
            'Meet the Karachi and Lahore technologists building Urdu-first finance tools that help Pakistani households stay solvent.',
        path: '/about',
        url: `${SITE_URL}/about`,
        canonical: `${SITE_URL}/about`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha team', 'Pakistani fintech', 'Urdu finance tools', 'kharcha management team', 'household insights'],
        type: 'article',
        schemaName: 'About Roznamcha',
    },
    contact: {
        title: 'Contact Roznamcha – Support for your Pakistani household budget',
        description:
            'Reach the Roznamcha team for support, product walkthroughs, or media quotes about Pakistani inflation and household budgeting.',
        path: '/contact',
        url: `${SITE_URL}/contact`,
        canonical: `${SITE_URL}/contact`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha support', 'Pakistan finance helpdesk', 'Urdu support', 'kharcha help', 'budget assistance'],
        type: 'article',
        schemaName: 'Contact Roznamcha',
    },
    privacy: {
        title: 'Privacy Policy – How Roznamcha protects Pakistani household data',
        description:
            'Learn how we secure kharcha logs, encrypt ration records, and stay compliant with Pakistan’s data expectations for Urdu-first budgeting tools.',
        path: '/privacy-policy',
        url: `${SITE_URL}/privacy-policy`,
        canonical: `${SITE_URL}/privacy-policy`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha privacy', 'Pakistan data protection', 'expense security', 'Urdu privacy policy', 'kharcha data safety'],
        type: 'article',
        schemaName: 'Roznamcha Privacy Policy',
    },
    terms: {
        title: 'Terms of Service – Roznamcha household finance platform',
        description:
            'Review the service terms governing paid plans, data usage, and compliance for Roznamcha users across Pakistan.',
        path: '/terms',
        url: `${SITE_URL}/terms`,
        canonical: `${SITE_URL}/terms`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha terms', 'Pakistan SaaS agreement', 'Urdu terms of service', 'budget platform rules', 'household finance terms'],
        type: 'article',
        schemaName: 'Roznamcha Terms of Service',
    },
    features: {
        title: 'Roznamcha Features – Preview Kharcha Map, Ration Brain, and AI Insights',
        description:
            'See every Roznamcha module before signing up: Kharcha Map, Ration Brain, Survival Reports, Reminders, Daily Money Snapshot, and AI Insights.',
        path: '/features',
        url: `${SITE_URL}/features`,
        canonical: `${SITE_URL}/features`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha features', 'Pakistan kharcha app demo', 'ration brain preview', 'daily money snapshot', 'AI insights Roznamcha'],
        type: 'article',
        schemaName: 'Roznamcha Features',
    },
    schoolFeesPlanner: {
        title: 'School Fees Planner Pakistan – Real monthly school cost calculator | Roznamcha',
        description:
            'Calculate your real monthly school fee burden in Pakistan by including tuition, annual charges, and exam fees with an inflation buffer for the next academic year.',
        path: '/tools/school-fees-planner',
        url: `${SITE_URL}/tools/school-fees-planner`,
        canonical: `${SITE_URL}/tools/school-fees-planner`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['school fees planner Pakistan', 'school fee calculator PKR', 'tuition budget planner', 'household education costs', 'Pakistan school fee inflation'],
        type: 'article',
        schemaName: 'School Fees Planner',
    },
    electricityBillEstimator: {
        title: 'Electricity Bill Estimator Pakistan – Progressive slab calculator | Roznamcha',
        description:
            'Estimate your Pakistan electricity bill using progressive slab rates, GST, and surcharge placeholders, then compare against a last-year baseline.',
        path: '/tools/electricity-bill-estimator',
        url: `${SITE_URL}/tools/electricity-bill-estimator`,
        canonical: `${SITE_URL}/tools/electricity-bill-estimator`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['electricity bill estimator Pakistan', 'units to bill calculator', 'WAPDA slab calculator', 'electricity tariff comparison', 'household utility planning'],
        type: 'article',
        schemaName: 'Electricity Bill Estimator',
    },
};

export const buildWebPageSchema = ({ schemaName, title, description, path, inLanguage }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}${path}#webpage`,
    name: schemaName ?? title,
    url: `${SITE_URL}${path}`,
    description,
    inLanguage: inLanguage ?? 'en',
    isPartOf: {
        '@id': `${SITE_URL}#website`,
    },
});

export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: 'Roznamcha',
    url: SITE_URL,
    logo: `${SITE_URL}/icons/appicon.png`,
    sameAs: ['https://web.facebook.com/roznamcha.pk/'],
};

export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: 'Roznamcha',
    publisher: {
        '@id': `${SITE_URL}#organization`,
    },
};
