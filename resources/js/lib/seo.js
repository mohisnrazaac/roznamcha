export const SITE_URL = 'https://roznamcha.pk';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/appicon.png`;

export const seoContent = {
    home: {
        title: 'Roznamcha – Pakistan’s Household Budget & Kharcha Tracker',
        description:
            'Track monthly expenses, compare ration costs, and manage household budgets with practical local insights for Pakistani families.',
        path: '/',
        url: SITE_URL,
        canonical: SITE_URL,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Pakistan budget app', 'household kharcha', 'Urdu expense tracker', 'smart budget templates Pakistan', 'grocery inflation', 'family finances'],
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
        title: 'Ration Brain – Grocery Price Planning Pakistan | Roznamcha',
        description:
            'Plan atta, ghee, chawal, and grocery costs with practical monthly ration budget planning for Pakistani households.',
        path: '/ration-brain',
        url: `${SITE_URL}/ration-brain`,
        canonical: `${SITE_URL}/ration-brain`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['ration planner', 'grocery inflation Pakistan', 'atta price tracking', 'Urdu grocery app', 'household ration'],
        type: 'article',
        schemaName: 'Ration Brain',
    },
    survivalReport: {
        title: 'Survival Report – Month-End Spending Summary | Roznamcha',
        description:
            'Turn recorded monthly expenses into a clear spending total, daily average, category breakdown, and budget pressure signals.',
        path: '/survival-report',
        url: `${SITE_URL}/survival-report`,
        canonical: `${SITE_URL}/survival-report`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['survival report Pakistan', 'month-end budget summary', 'household spending breakdown', 'Urdu finance planning', 'monthly expense pressure'],
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
            'Reach the Roznamcha team for support, corrections, or partnership inquiries related to household budgeting tools.',
        path: '/contact',
        url: `${SITE_URL}/contact`,
        canonical: `${SITE_URL}/contact`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha support', 'Pakistan finance helpdesk', 'Urdu support', 'kharcha help', 'budget assistance'],
        type: 'article',
        schemaName: 'Contact Roznamcha',
    },
    privacy: {
        title: 'Privacy Policy – Household Data Protection | Roznamcha',
        description:
            'Learn how Roznamcha protects kharcha logs, ration records, and household financial data for Pakistani families.',
        path: '/privacy-policy',
        url: `${SITE_URL}/privacy-policy`,
        canonical: `${SITE_URL}/privacy-policy`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha privacy', 'Pakistan data protection', 'expense security', 'Urdu privacy policy', 'kharcha data safety'],
        type: 'article',
        schemaName: 'Roznamcha Privacy Policy',
    },
    cookiePolicy: {
        title: 'Cookie Policy – Roznamcha.pk',
        description: 'Learn how Roznamcha uses cookies for functionality, analytics, and Google AdSense advertising.',
        path: '/cookie-policy',
        url: `${SITE_URL}/cookie-policy`,
        canonical: `${SITE_URL}/cookie-policy`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha cookie policy', 'AdSense cookies', 'privacy'],
        type: 'article',
        schemaName: 'Roznamcha Cookie Policy',
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
    disclaimer: {
        title: 'Disclaimer & Planning Boundaries | Roznamcha',
        description:
            'Understand what Roznamcha tools do, what they do not guarantee, and why official notifications matter for household decisions.',
        path: '/disclaimer',
        url: `${SITE_URL}/disclaimer`,
        canonical: `${SITE_URL}/disclaimer`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha disclaimer', 'financial planning disclaimer Pakistan', 'calculator estimate disclaimer', 'budgeting content disclaimer'],
        type: 'article',
        schemaName: 'Roznamcha Disclaimer',
    },
    features: {
        title: 'Roznamcha Features – Kharcha Map, Ration Brain & Tools',
        description:
            'Explore Roznamcha modules: Kharcha Map, Ration Brain, Survival Reports, Smart Budget Templates, and Reminders for Pakistani families.',
        path: '/features',
        url: `${SITE_URL}/features`,
        canonical: `${SITE_URL}/features`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['Roznamcha features', 'Pakistan kharcha app demo', 'smart budget templates', 'ration brain preview', 'daily money snapshot', 'AI insights Roznamcha'],
        type: 'article',
        schemaName: 'Roznamcha Features',
    },
    smartBudgetTemplates: {
        title: 'Smart Budget Templates Pakistan | Roznamcha',
        description:
            'Preview survival-first monthly budget templates for Pakistani households, then save them inside Roznamcha to revisit next month.',
        path: '/templates',
        url: `${SITE_URL}/templates`,
        canonical: `${SITE_URL}/templates`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['smart budget templates Pakistan', 'salary budget template PKR', 'Pakistan family budget', 'student budget Pakistan', 'joint family budget'],
        type: 'article',
        schemaName: 'Smart Budget Templates',
    },
    schoolFeesPlanner: {
        title: 'School Fees Planner Pakistan – Cost Calculator | Roznamcha',
        description:
            'Calculate your monthly school fee burden in Pakistan by including tuition, annual charges, and exam fees with a planning margin for the next academic year.',
        path: '/tools/school-fees-planner',
        url: `${SITE_URL}/tools/school-fees-planner`,
        canonical: `${SITE_URL}/tools/school-fees-planner`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['school fees planner Pakistan', 'school fee calculator PKR', 'tuition budget planner', 'household education costs', 'Pakistan school fee inflation'],
        type: 'article',
        schemaName: 'School Fees Planner',
    },
    electricityBillEstimator: {
        title: 'Electricity Bill Estimator Pakistan – Slab Rates | Roznamcha',
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
    rationCostEstimator: {
        title: 'Ration Cost Estimator Pakistan – Grocery Budget | Roznamcha',
        description:
            'Estimate your monthly ration cost in Pakistan using base prices for atta, rice, oil, sugar, and daal before the next grocery run.',
        path: '/tools/ration-cost-estimator',
        url: `${SITE_URL}/tools/ration-cost-estimator`,
        canonical: `${SITE_URL}/tools/ration-cost-estimator`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['ration cost estimator Pakistan', 'grocery budget calculator PKR', 'monthly ration planner', 'Pakistan household grocery costs', 'atta rice oil budget'],
        type: 'article',
        schemaName: 'Ration Cost Estimator',
    },
    expenseTrackerPakistan: {
        title: 'Best Monthly Expense Tracker in Pakistan | Roznamcha',
        description:
            'Track daily kharcha, ration costs, and utility bill slabs with the best monthly expense tracker designed specifically for Pakistani household budgets.',
        path: '/features/monthly-expense-tracker-pakistan',
        url: `${SITE_URL}/features/monthly-expense-tracker-pakistan`,
        canonical: `${SITE_URL}/features/monthly-expense-tracker-pakistan`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['monthly expense tracker Pakistan', 'kharcha tracker', 'Pakistan household expense app', 'Urdu budgeting tool'],
        type: 'article',
        schemaName: 'Monthly Expense Tracker Pakistan',
    },
    monthlyHouseholdBudgetCalculator: {
        title: 'Monthly Household Budget Calculator Pakistan | Roznamcha',
        description:
            'Calculate your monthly household budget in Pakistan by tracking rent, ration, school fees, transport, and utilities to see your surplus or deficit.',
        path: '/tools/monthly-household-budget-calculator',
        url: `${SITE_URL}/tools/monthly-household-budget-calculator`,
        canonical: `${SITE_URL}/tools/monthly-household-budget-calculator`,
        image: DEFAULT_OG_IMAGE,
        keywords: ['monthly household budget calculator Pakistan', 'ghar ka budget calculator PKR', 'monthly budget planner', 'Pakistan household expense tracker', 'salary planning Pakistan'],
        type: 'article',
        schemaName: 'Monthly Household Budget Calculator',
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
