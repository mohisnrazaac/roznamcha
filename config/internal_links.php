<?php

return [
    'tools' => [
        'ration-cost-estimator' => [
            'title' => 'Ration Cost Estimator',
            'route_name' => 'public.tools.ration-cost-estimator',
            'description' => 'Estimate a practical monthly grocery budget before the next market trip or salary squeeze.',
        ],
        'kharcha-map' => [
            'title' => 'Kharcha Map',
            'route_name' => 'public.kharcha-map',
            'description' => 'Track where each rupee is going so a guide turns into a real month-end record.',
        ],
        'ration-brain' => [
            'title' => 'Ration Brain',
            'route_name' => 'public.ration-brain',
            'description' => 'See how Roznamcha frames grocery planning for volatile Pakistan market prices.',
        ],
        'survival-report' => [
            'title' => 'Survival Report',
            'route_name' => 'public.survival-report',
            'description' => 'Review month-end pressure with a clearer total, category breakdown, and comparison view.',
        ],
        'school-fees-planner' => [
            'title' => 'School Fees Planner',
            'route_name' => 'public.tools.school-fees-planner',
            'description' => 'Break school costs into a monthly planning number instead of waiting for fee shock months.',
        ],
        'electricity-bill-estimator' => [
            'title' => 'Electricity Bill Estimator',
            'route_name' => 'public.tools.electricity-bill-estimator',
            'description' => 'Estimate household electricity pressure before the bill arrives or units run too high.',
        ],
    ],

    'blogs' => [
        'pakistani-household-essential-expenses-2026' => [
            'title' => 'What Pakistani Families Really Spend on Food, Electricity, Gas and Rent in 2026 (Budget Guide)',
            'route_name' => 'public.blog.show',
            'route_params' => ['slug' => 'pakistani-household-essential-expenses-2026'],
            'description' => 'Use a grounded essential-expense guide as a reality check before setting your next month budget.',
        ],
        'ghar-ka-monthly-budget' => [
            'title' => 'Ghar Ka Monthly Budget: A Practical Household Budget Guide for Pakistan',
            'route_name' => 'public.blog.show',
            'route_params' => ['slug' => 'ghar-ka-monthly-budget'],
            'description' => 'Start with the strongest evergreen guide for structuring a Pakistan household budget month by month.',
        ],
        'best-monthly-budget-50000-salary-pakistan-2026' => [
            'title' => 'Best Monthly Budget for Rs 50,000 Salary in Pakistan (2026)',
            'route_name' => 'public.blog.show',
            'route_params' => ['slug' => 'best-monthly-budget-50000-salary-pakistan-2026'],
            'description' => 'See how a tighter salary range can still be split across rent, ration, bills, and emergency pressure.',
        ],
        'pakistani-family-monthly-expense-control' => [
            'title' => 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity',
            'route_name' => 'public.blog.show',
            'route_params' => ['slug' => 'pakistani-family-monthly-expense-control'],
            'description' => 'Read a practical control guide that focuses on tradeoffs families can actually live with.',
        ],
    ],

    'defaults' => [
        'blog_related_tools' => [
            'ration-cost-estimator',
            'kharcha-map',
            'survival-report',
        ],
        'blog_related_blogs' => [
            'ghar-ka-monthly-budget',
            'pakistani-family-monthly-expense-control',
            'pakistani-household-essential-expenses-2026',
        ],
    ],

    'mappings' => [
        'tool_to_related_tools' => [
            'ration-cost-estimator' => [
                'kharcha-map',
                'ration-brain',
                'survival-report',
            ],
        ],

        'tool_to_related_blogs' => [
            'ration-cost-estimator' => [
                'ghar-ka-monthly-budget',
                'pakistani-family-monthly-expense-control',
                'pakistani-household-essential-expenses-2026',
            ],
        ],

        'blog_to_related_tools' => [
            'pakistani-household-essential-expenses-2026' => ['ration-cost-estimator', 'ration-brain', 'kharcha-map'],
            'best-monthly-budget-50000-salary-pakistan-2026' => ['kharcha-map', 'survival-report', 'ration-cost-estimator'],
            'pakistani-family-monthly-expense-control' => ['kharcha-map', 'survival-report', 'ration-cost-estimator'],
        ],
    ],
];
