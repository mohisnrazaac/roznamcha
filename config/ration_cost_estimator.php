<?php

return [
    'currency' => 'PKR',
    'currency_symbol' => 'Rs',
    'comparison_placeholder_percent' => 12,
    'default_household_size' => 4,

    // Future price automation can replace these base prices with live market data
    // from a dedicated pricing table or an external API.
    'items' => [
        [
            'key' => 'atta',
            'label' => 'Atta (wheat flour)',
            'unit' => 'kg',
            'price' => 220,
            'default_quantity' => 20,
        ],
        [
            'key' => 'rice',
            'label' => 'Rice',
            'unit' => 'kg',
            'price' => 280,
            'default_quantity' => 10,
        ],
        [
            'key' => 'oil',
            'label' => 'Cooking oil',
            'unit' => 'liters',
            'price' => 520,
            'default_quantity' => 5,
        ],
        [
            'key' => 'sugar',
            'label' => 'Sugar',
            'unit' => 'kg',
            'price' => 170,
            'default_quantity' => 6,
        ],
        [
            'key' => 'daal',
            'label' => 'Daal (lentils)',
            'unit' => 'kg',
            'price' => 340,
            'default_quantity' => 6,
        ],
    ],
];
