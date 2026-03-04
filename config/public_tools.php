<?php

return [
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
        ],
        'fpa_fixed_amount' => 450,
        'other_surcharges_fixed_amount' => 300,
        'gst_rate' => 0.17,
        'last_year_base_rate_per_unit' => [
            'protected' => 9.5,
            'unprotected' => 14.5,
        ],
        'seed_slabs' => [
            'protected' => [
                ['min_units' => 1, 'max_units' => 100, 'rate_per_unit' => 10.0],
                ['min_units' => 101, 'max_units' => 200, 'rate_per_unit' => 14.0],
                ['min_units' => 201, 'max_units' => null, 'rate_per_unit' => 18.0],
            ],
            'unprotected' => [
                ['min_units' => 1, 'max_units' => 100, 'rate_per_unit' => 16.5],
                ['min_units' => 101, 'max_units' => 200, 'rate_per_unit' => 22.0],
                ['min_units' => 201, 'max_units' => 300, 'rate_per_unit' => 28.0],
                ['min_units' => 301, 'max_units' => 700, 'rate_per_unit' => 34.0],
                ['min_units' => 701, 'max_units' => null, 'rate_per_unit' => 40.0],
            ],
        ],
    ],
];
