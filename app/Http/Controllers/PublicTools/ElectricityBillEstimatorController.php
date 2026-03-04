<?php

namespace App\Http\Controllers\PublicTools;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ElectricityBillEstimatorController extends Controller
{
    public function show(Request $request): Response
    {
        $config = config('public_tools.electricity_bill_estimator', []);
        $activation = $this->resolveActivationState($request, 'electricity_bill_estimator');

        return Inertia::render('Public/Tools/ElectricityBillEstimator', [
            'defaults' => [
                'units_used' => (int) ($activation['inputs']['units_used'] ?? $config['defaults']['units_used'] ?? 250),
                'user_category' => (string) ($activation['inputs']['user_category'] ?? $config['defaults']['user_category'] ?? 'unprotected'),
            ],
            'categories' => ['protected', 'unprotected'],
            'gst_percentage' => ($config['gst_rate'] ?? 0.17) * 100,
            'activationPrefill' => $activation,
        ]);
    }

    public function electricityEstimator(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'units_used' => ['required', 'integer', 'min:1', 'max:50000'],
            'user_category' => ['required', 'in:protected,unprotected'],
        ]);

        $config = config('public_tools.electricity_bill_estimator', []);
        $unitsUsed = (int) $validated['units_used'];
        $category = (string) $validated['user_category'];

        $slabs = DB::table('slab_rates')
            ->where('category', $category)
            ->orderBy('min_units')
            ->get(['min_units', 'max_units', 'rate_per_unit']);

        if ($slabs->isEmpty()) {
            return response()->json([
                'message' => 'Electricity slab rates are not configured for this category yet.',
            ], 422);
        }

        $slabCost = $this->calculateProgressiveSlabCost($unitsUsed, $slabs->all());
        $fpa = (float) ($config['fpa_fixed_amount'] ?? 0);
        $surcharges = (float) ($config['other_surcharges_fixed_amount'] ?? 0);
        $gstRate = (float) ($config['gst_rate'] ?? 0.17);

        $preTaxSubtotal = $slabCost + $fpa + $surcharges;
        $gst = $preTaxSubtotal * $gstRate;
        $totalBill = $preTaxSubtotal + $gst;

        $lastYearBaseRate = (float) data_get($config, "last_year_base_rate_per_unit.{$category}", 0);
        $lastYearBase = $unitsUsed * $lastYearBaseRate;
        $lastYearPreTaxSubtotal = $lastYearBase + $fpa + $surcharges;
        $lastYearGst = $lastYearPreTaxSubtotal * $gstRate;
        $lastYearEstimate = $lastYearPreTaxSubtotal + $lastYearGst;
        $difference = $totalBill - $lastYearEstimate;

        return response()->json([
            'slab_cost' => round($slabCost, 2),
            'total_bill' => round($totalBill, 2),
            'last_year_estimate' => round($lastYearEstimate, 2),
            'difference' => round($difference, 2),
        ]);
    }

    /**
     * @param  array<int, object>  $slabs
     */
    protected function calculateProgressiveSlabCost(int $unitsUsed, array $slabs): float
    {
        $total = 0.0;

        foreach ($slabs as $slab) {
            $min = (int) $slab->min_units;
            $max = $slab->max_units === null ? null : (int) $slab->max_units;
            $rate = (float) $slab->rate_per_unit;

            if ($unitsUsed < $min) {
                continue;
            }

            $effectiveMax = $max ?? $unitsUsed;
            $billableUnits = min($unitsUsed, $effectiveMax) - $min + 1;

            if ($billableUnits <= 0) {
                continue;
            }

            $total += $billableUnits * $rate;
        }

        return $total;
    }

    protected function resolveActivationState(Request $request, string $expectedToolKey): array
    {
        // ROZNAMCHA-ACTIVATION: recover guest state from URL/base64 or short-lived stash cache after signup.
        $state = [
            'inputs' => [],
            'results' => [],
            'source' => (string) $request->query('source', 'direct'),
        ];

        $encoded = (string) $request->query('tool_state', '');
        if ($encoded !== '') {
            $normalized = strtr($encoded, '-_', '+/');
            $padding = strlen($normalized) % 4;
            if ($padding > 0) {
                $normalized .= str_repeat('=', 4 - $padding);
            }

            $decoded = base64_decode($normalized, true);
            $payload = is_string($decoded) ? json_decode($decoded, true) : null;

            if (is_array($payload) && ($payload['tool_key'] ?? null) === $expectedToolKey) {
                $state['inputs'] = (array) ($payload['inputs'] ?? []);
                $state['results'] = (array) ($payload['results'] ?? []);
                $state['source'] = (string) ($payload['source'] ?? $state['source']);
            }
        }

        $stashId = (string) $request->query('activation_stash', '');
        if ($stashId !== '') {
            $cached = Cache::get('tool_state_stash:'.$stashId);
            if (
                is_array($cached)
                && ($cached['tool_key'] ?? null) === $expectedToolKey
                && ($cached['session_id'] ?? null) === $request->session()->getId()
            ) {
                $payload = (array) ($cached['state'] ?? []);
                $state['inputs'] = (array) ($payload['inputs'] ?? $state['inputs']);
                $state['results'] = (array) ($payload['results'] ?? $state['results']);
                $state['source'] = (string) ($payload['source'] ?? $state['source']);
            }
        }

        return $state;
    }
}
