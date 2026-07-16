<?php

namespace App\Http\Controllers\Concerns;

use App\Seo\SeoPageUrlGenerator;

trait BuildsPublicSeo
{
    protected function publicSeo(string $key): array
    {
        $siteUrl = $this->publicUrlGenerator()->baseUrl();
        $defaultImage = "{$siteUrl}/favicon.ico";

        return match ($key) {
            'home' => [
                'title' => 'Roznamcha – Pakistan’s Urdu-first household budget & kharcha tracker',
                'description' => 'Roznamcha helps Pakistani families track monthly expenses, compare ration costs, manage reminders, and understand real household budgets with practical local insights.',
                'url' => $siteUrl,
                'canonical' => $siteUrl,
                'image' => $defaultImage,
                'keywords' => ['Pakistan budget app', 'household kharcha', 'Urdu expense tracker', 'smart budget templates Pakistan', 'grocery inflation', 'family finances'],
                'type' => 'website',
                'schemaName' => 'Roznamcha Home',
                'inLanguage' => 'ur',
            ],
            'features' => [
                'title' => 'Roznamcha Features – Preview Kharcha Map, Ration Brain, and AI Insights',
                'description' => 'See the main Roznamcha modules before you register: Kharcha Map, Ration Brain, Survival Reports, Smart Budget Templates, Reminders, Daily Money Snapshot, and AI Insights.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.features'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.features'),
                'image' => $defaultImage,
                'keywords' => ['Roznamcha features', 'Pakistan kharcha app demo', 'smart budget templates', 'ration brain preview', 'daily money snapshot', 'AI insights Roznamcha'],
                'type' => 'article',
                'schemaName' => 'Roznamcha Features',
            ],
            'kharchaMap' => [
                'title' => 'Kharcha Map – Visualize every rupee spent across Pakistan',
                'description' => 'Plot rent, utilities, transport, and ration spending to see where each rupee goes so Pakistani households can plug leaks quickly.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.kharcha-map'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.kharcha-map'),
                'image' => $defaultImage,
                'keywords' => ['kharcha map', 'rupee tracking', 'Pakistan household costs', 'Urdu budgeting', 'expense heatmap'],
                'type' => 'article',
                'schemaName' => 'Kharcha Map',
            ],
            'rationBrain' => [
                'title' => 'Ration Brain – Smart grocery planning for volatile Pakistani markets',
                'description' => 'Plan atta, ghee, chawal, and sabzi costs with practical ration planning for Urdu-speaking Pakistani households.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.ration-brain'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.ration-brain'),
                'image' => $defaultImage,
                'keywords' => ['ration planner', 'grocery inflation Pakistan', 'atta price tracking', 'Urdu grocery app', 'household ration'],
                'type' => 'article',
                'schemaName' => 'Ration Brain',
            ],
            'survivalReport' => [
                'title' => 'Survival Report Pakistan – Month-end spending summary and pressure view | Roznamcha',
                'description' => 'See how Roznamcha turns recorded monthly expenses into a clear total, daily average, category breakdown, and month-over-month pressure signal for Pakistani households.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.survival-report'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.survival-report'),
                'image' => $defaultImage,
                'keywords' => ['survival report Pakistan', 'month-end budget summary', 'household spending breakdown', 'Urdu finance planning', 'monthly expense pressure'],
                'type' => 'article',
                'schemaName' => 'Survival Report',
            ],
            'privacy' => [
                'title' => 'Privacy Policy – How Roznamcha protects Pakistani household data',
                'description' => 'Learn how we handle kharcha logs, ration records, and household data for Urdu-first budgeting tools.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.privacy'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.privacy'),
                'image' => $defaultImage,
                'keywords' => ['Roznamcha privacy', 'Pakistan data protection', 'expense security', 'Urdu privacy policy', 'kharcha data safety'],
                'type' => 'article',
                'schemaName' => 'Roznamcha Privacy Policy',
            ],
            'terms' => [
                'title' => 'Terms of Service – Roznamcha household finance platform',
                'description' => 'Review the service terms governing paid plans, data usage, and compliance for Roznamcha users across Pakistan.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.terms'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.terms'),
                'image' => $defaultImage,
                'keywords' => ['Roznamcha terms', 'Pakistan SaaS agreement', 'Urdu terms of service', 'budget platform rules', 'household finance terms'],
                'type' => 'article',
                'schemaName' => 'Roznamcha Terms of Service',
            ],
            'smartBudgetTemplates' => [
                'title' => 'Smart Budget Templates Pakistan | Roznamcha',
                'description' => 'Preview survival-first monthly budget templates for Pakistani households, then save them inside Roznamcha to revisit next month.',
                'url' => $this->publicUrlGenerator()->routeUrl('templates.index'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('templates.index'),
                'image' => $defaultImage,
                'keywords' => ['smart budget templates Pakistan', 'salary budget template PKR', 'Pakistan family budget', 'student budget Pakistan', 'joint family budget'],
                'type' => 'article',
                'schemaName' => 'Smart Budget Templates',
            ],
            'schoolFeesPlanner' => [
                'title' => 'School Fees Planner Pakistan – Real monthly school cost calculator | Roznamcha',
                'description' => 'Calculate your monthly school fee burden in Pakistan by including tuition, annual charges, and exam fees with a planning margin for the next academic year.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.tools.school-fees-planner'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.tools.school-fees-planner'),
                'image' => $defaultImage,
                'keywords' => ['school fees planner Pakistan', 'school fee calculator PKR', 'tuition budget planner', 'household education costs', 'Pakistan school fee inflation'],
                'type' => 'article',
                'schemaName' => 'School Fees Planner',
            ],
            'electricityBillEstimator' => [
                'title' => 'Electricity Bill Estimator Pakistan – Progressive slab calculator | Roznamcha',
                'description' => 'Estimate your Pakistan electricity bill using progressive slab rates, GST, and surcharge placeholders, then compare against a last-year baseline.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.tools.electricity-bill-estimator'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.tools.electricity-bill-estimator'),
                'image' => $defaultImage,
                'keywords' => ['electricity bill estimator Pakistan', 'units to bill calculator', 'WAPDA slab calculator', 'electricity tariff comparison', 'household utility planning'],
                'type' => 'article',
                'schemaName' => 'Electricity Bill Estimator',
            ],
            'rationCostEstimator' => [
                'title' => 'Ration Cost Estimator Pakistan – Monthly grocery budget calculator | Roznamcha',
                'description' => 'Estimate your monthly ration cost in Pakistan using base prices for atta, rice, oil, sugar, and daal before the next grocery run.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.tools.ration-cost-estimator'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.tools.ration-cost-estimator'),
                'image' => $defaultImage,
                'keywords' => ['ration cost estimator Pakistan', 'grocery budget calculator PKR', 'monthly ration planner', 'Pakistan household grocery costs', 'atta rice oil budget'],
                'type' => 'article',
                'schemaName' => 'Ration Cost Estimator',
            ],
            'monthlyHouseholdBudgetCalculator' => [
                'title' => 'Monthly Household Budget Calculator Pakistan – Ghar ka budget planner | Roznamcha',
                'description' => 'Calculate your monthly household budget in Pakistan by tracking rent, ration, school fees, transport, and utilities to see your surplus or deficit.',
                'url' => $this->publicUrlGenerator()->routeUrl('public.tools.monthly-household-budget-calculator'),
                'canonical' => $this->publicUrlGenerator()->routeUrl('public.tools.monthly-household-budget-calculator'),
                'image' => $defaultImage,
                'keywords' => ['monthly household budget calculator Pakistan', 'ghar ka budget calculator PKR', 'monthly budget planner', 'Pakistan household expense tracker', 'salary planning Pakistan'],
                'type' => 'article',
                'schemaName' => 'Monthly Household Budget Calculator',
            ],
            default => [
                'title' => 'Roznamcha',
                'description' => 'Roznamcha helps Pakistani households manage budgets, kharcha, and daily money pressure.',
                'url' => $siteUrl,
                'canonical' => $siteUrl,
                'image' => $defaultImage,
                'type' => 'website',
                'schemaName' => 'Roznamcha',
            ],
        };
    }

    protected function publicWebPageSchema(array $seo): array
    {
        $pageUrl = rtrim((string) ($seo['url'] ?? $this->publicUrlGenerator()->baseUrl()), '/');
        $siteUrl = $this->publicUrlGenerator()->baseUrl();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebPage',
            '@id' => "{$pageUrl}#webpage",
            'name' => $seo['schemaName'] ?? $seo['title'] ?? 'Roznamcha',
            'url' => $pageUrl,
            'description' => $seo['description'] ?? '',
            'inLanguage' => $seo['inLanguage'] ?? 'en',
            'isPartOf' => [
                '@id' => "{$siteUrl}#website",
            ],
        ];
    }

    protected function publicOrganizationSchema(): array
    {
        $siteUrl = $this->publicUrlGenerator()->baseUrl();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            '@id' => "{$siteUrl}#organization",
            'name' => 'Roznamcha',
            'url' => $siteUrl,
            'logo' => "{$siteUrl}/icons/appicon.png",
            'sameAs' => ['https://web.facebook.com/roznamcha.pk/'],
        ];
    }

    protected function publicWebsiteSchema(): array
    {
        $siteUrl = $this->publicUrlGenerator()->baseUrl();

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => "{$siteUrl}#website",
            'url' => $siteUrl,
            'name' => 'Roznamcha',
            'publisher' => [
                '@id' => "{$siteUrl}#organization",
            ],
        ];
    }

    protected function publicUrlGenerator(): SeoPageUrlGenerator
    {
        return app(SeoPageUrlGenerator::class);
    }
}
