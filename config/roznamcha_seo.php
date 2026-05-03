<?php
// Purpose: Define programmatic SEO page dimensions, freshness defaults, and cache settings for public landing pages. Date: 2026-03-29. Author: Mohsin.

return [
    'base_url' => rtrim((string) env(
        'ROZNAMCHA_PUBLIC_URL',
        env('APP_ENV') === 'testing'
            ? env('APP_URL', 'http://localhost')
            : 'https://roznamcha.pk'
    ), '/'),

    'cache' => [
        'page_ttl_hours' => 24,
        'snapshot_ttl_hours' => 24,
        'sitemap_ttl_hours' => 24,
    ],

    'search_surface' => [
        // Phase 2 AdSense cleanup: keep weak public groups usable for direct visitors,
        // but remove them from search until they earn indexable quality again.
        'noindex_page_types' => ['petrol', 'electricity', 'ration'],
        'noindex_blog_category_slugs' => [
            'fuel-prices-hike',
            'household-tips',
            'inflation-watch',
            'personal-finance-pakistan',
        ],
    ],

    'source_label' => 'Roznamcha internal estimate',

    'cities' => ['karachi', 'lahore', 'islamabad', 'peshawar', 'quetta'],

    'discos' => ['lesco', 'mepco', 'hesco', 'pesco', 'iesco', 'gepco'],

    'family_sizes' => [4, 6, 8],

    'petrol' => [
        'official_listing_url' => 'https://petroleum.gov.pk/Detail/ODg4OTBmZjMtZDYwMS00NGFhLThmOTctNWZhYWE4ZGIxNWUz',
        'official_source_label' => 'Government of Pakistan - Petroleum Division',
        'pending_source_label' => 'Official and backup fuel sources pending sync',
        'backup_city_source_url' => 'https://pakfuel.today/',
        'backup_city_source_label' => 'PakFuel city listing fallback',
        'backup_nationwide_source_label' => 'PakWheels nationwide petroleum price fallback',
        'cross_validation_source_url' => 'https://www.pakwheels.com/petroleum-prices-in-pakistan',
        'discrepancy_alert_email' => env('FUEL_PRICE_ALERT_EMAIL', env('CONTACT_NOTIFICATION_EMAIL', env('PUBLIC_CONTACT_EMAIL', 'support@roznamcha.pk'))),
        'audit_threshold_rupees' => 2.0,
        'fallback_change_text' => 'No major change from previous update',
        'city_seed_list' => [
            'karachi' => 'Karachi',
            'lahore' => 'Lahore',
            'islamabad' => 'Islamabad',
            'peshawar' => 'Peshawar',
            'quetta' => 'Quetta',
            'multan' => 'Multan',
            'faisalabad' => 'Faisalabad',
            'rawalpindi' => 'Rawalpindi',
            'hyderabad' => 'Hyderabad',
            'gilgit' => 'Gilgit',
            'gujranwala' => 'Gujranwala',
            'sialkot' => 'Sialkot',
            'sukkur' => 'Sukkur',
            'bahawalpur' => 'Bahawalpur',
            'abbottabad' => 'Abbottabad',
        ],
        'verified_releases' => [
            '2026-03-28' => [
                'notice_title' => 'Prices of Petroleum Products from 28th March, 2026',
                'motor_spirit_price' => 321.17,
                'motor_spirit_previous_price' => 321.17,
                'motor_spirit_change' => 0.00,
                'high_speed_diesel_price' => 335.86,
                'high_speed_diesel_previous_price' => 335.86,
                'high_speed_diesel_change' => 0.00,
            ],
        ],
    ],

    'electricity' => [
        'default_avg_rate' => 38.00,
        'tax_multiplier' => 1.18,
    ],

    'ration' => [
        'base_cost_per_person' => 8500,
        'inflation_buffer_percent' => 12,
    ],
];
