<?php

return [
    'monthly_household_budget_calculator' => [
        'defaults' => [
            'monthly_income' => 85000,
            'rent' => 20000,
            'ration' => 25000,
            'utilities' => 12000,
            'education' => 8000,
            'transport' => 6000,
            'misc' => 4000,
        ],
    ],
    'school_fees_planner' => [
        'defaults' => [
            'children_count' => 2,
            'monthly_tuition_per_child' => 18000,
            'annual_charges' => 50000,
            'exam_fee' => 6000,
            'exam_frequency' => 2,
            'inflation_buffer_percentage' => 12,
        ],
    ],
    'electricity_bill_estimator' => [
        'defaults' => [
            'units_used' => 250,
            'user_category' => 'unprotected',
            'sanctioned_load_kw' => 1,
            'fpa_per_unit' => 2.37,
            'qta_per_unit' => 0.52,
        ],
        'gst_rate' => 0.18,
        'electricity_duty_rate' => 0.015,
        'tv_fee' => 35.0,
        'advance_tax_threshold' => 25000.0,
        'advance_tax_rate' => 0.075,
        'fc_surcharge' => [
            'protected' => 0.43,
            'unprotected' => 3.23,
        ],
        'fixed_charges_per_kw' => [
            'protected' => 0,
            'unprotected_1_300' => 400,
            'unprotected_301_plus' => 600,
        ],
        'last_year_base_rate_per_unit' => [
            'protected' => 9.5,
            'unprotected' => 14.5,
        ],
        // NEPRA S.R.O. 279(I)/2026 domestic residential rates
        'seed_slabs' => [
            'lifeline' => [
                ['min_units' => 1, 'max_units' => 50, 'rate_per_unit' => 3.95],
                ['min_units' => 51, 'max_units' => 100, 'rate_per_unit' => 7.74],
            ],
            'protected' => [
                ['min_units' => 1, 'max_units' => 100, 'rate_per_unit' => 10.54],
                ['min_units' => 101, 'max_units' => 200, 'rate_per_unit' => 13.01],
            ],
            'unprotected' => [
                ['min_units' => 1, 'max_units' => 100, 'rate_per_unit' => 22.44],
                ['min_units' => 101, 'max_units' => 200, 'rate_per_unit' => 28.07],
                ['min_units' => 201, 'max_units' => 300, 'rate_per_unit' => 33.15],
                ['min_units' => 301, 'max_units' => 400, 'rate_per_unit' => 37.97],
                ['min_units' => 401, 'max_units' => 500, 'rate_per_unit' => 40.17],
                ['min_units' => 501, 'max_units' => 600, 'rate_per_unit' => 41.52],
                ['min_units' => 601, 'max_units' => 700, 'rate_per_unit' => 42.78],
                ['min_units' => 701, 'max_units' => null, 'rate_per_unit' => 47.72],
            ],
        ],
    ],
    'solar_roi_calculator' => [
        'defaults' => [
            'monthly_units' => 650,
            'monthly_bill' => 32000,
            'self_consume_ratio' => 60,
            'buyback_rate' => 11.0,
        ],
    ],
];
