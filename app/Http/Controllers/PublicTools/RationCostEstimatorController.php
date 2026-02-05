<?php

namespace App\Http\Controllers\PublicTools;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RationCostEstimatorController extends Controller
{
    public function show(): Response
    {
        $config = config('ration_cost_estimator');

        // Extension point: swap config-based pricing with a database or API-driven
        // pricing source when real-time ration pricing is available.
        return Inertia::render('Public/Tools/RationCostEstimator', [
            'currency' => $config['currency'] ?? 'PKR',
            'currencySymbol' => $config['currency_symbol'] ?? 'Rs',
            'comparisonPlaceholderPercent' => $config['comparison_placeholder_percent'] ?? 12,
            'defaultHouseholdSize' => $config['default_household_size'] ?? 4,
            'items' => $config['items'] ?? [],
        ]);
    }
}
