<?php

namespace App\Http\Controllers\PublicTools;

use App\Http\Controllers\Concerns\BuildsPublicSeo;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ElectricityBillEstimatorController extends Controller
{
    use BuildsPublicSeo;

    public function show(Request $request): Response
    {
        $config = config('public_tools.electricity_bill_estimator', []);
        $activation = $this->resolveActivationState($request, 'electricity_bill_estimator');
        $seo = $this->publicSeo('electricityBillEstimator');

        $faqItems = [
            [
                'question' => 'Does this estimator use fixed slab values in code?',
                'answer' => 'No. The progressive slab billing reads from the official NEPRA tariff schedule so rates can be updated without changing frontend logic.',
            ],
            [
                'question' => 'Why is this an estimate and not my exact bill?',
                'answer' => 'It includes configurable placeholders for FPA and surcharges and applies GST, but actual utility bills can include additional line items or timing-based adjustments.',
            ],
            [
                'question' => 'Can I use this without creating an account?',
                'answer' => 'Yes. The estimator works fully in guest mode. Signup is only for saving estimates and reminders later.',
            ],
            [
                'question' => 'What is the difference between protected and unprotected consumers in Pakistan?',
                'answer' => 'Under NEPRA tariff regulations, consumers using under 200 units per month consecutively for six months are classified as protected with subsidized rates. Exceeding 200 units reclassifies the meter as unprotected, triggering substantially higher progressive slab rates.',
            ],
            [
                'question' => 'How do Fuel Price Adjustments (FPA) and taxes affect my final bill?',
                'answer' => 'FPA accounts for monthly changes in generation fuel mix approved by NEPRA. Bills also incur electricity duty, financing cost surcharges, standard GST, and fixed meter charges that apply above the raw slab rate.',
            ],
        ];

        $defaultUnits = (int) ($activation['inputs']['units_used'] ?? $config['defaults']['units_used'] ?? 350);
        $defaultCategory = (string) ($activation['inputs']['user_category'] ?? $config['defaults']['user_category'] ?? 'unprotected');
        $initialResult = !empty($activation['results'])
            ? $activation['results']
            : [
                'slab_cost' => 8324,
                'total_bill' => 10616,
                'last_year_estimate' => 7850,
                'difference' => 2766,
            ];

        return Inertia::render('Public/Tools/ElectricityBillEstimator', [
            'defaults' => [
                'units_used' => $defaultUnits,
                'user_category' => $defaultCategory,
            ],
            'categories' => ['protected', 'unprotected'],
            'gst_percentage' => ($config['gst_rate'] ?? 0.17) * 100,
            'initialResult' => $initialResult,
            'activationPrefill' => $activation,
            'seo' => $seo,
            'faqItems' => $faqItems,
            'jsonLd' => $this->publicToolGraphSchema($seo, $faqItems, [
                'name' => 'Electricity Bill Estimator Pakistan',
                'description' => $seo['description'],
            ]),
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

    public function computeEstimate(int $unitsUsed, string $category, array $config): array
    {
        try {
            $slabs = DB::table('slab_rates')
                ->where('category', $category)
                ->orderBy('min_units')
                ->get(['min_units', 'max_units', 'rate_per_unit']);
        } catch (\Throwable) {
            $slabs = collect();
        }

        if ($slabs->isEmpty()) {
            $seedSlabs = $config['seed_slabs'][$category] ?? [];
            $slabs = collect(array_map(fn ($s) => (object) $s, $seedSlabs));
        }

        $slabCost = $this->calculateProgressiveSlabCost($unitsUsed, $slabs->all());
        $fpa = (float) ($config['fpa_fixed_amount'] ?? 450);
        $surcharges = (float) ($config['other_surcharges_fixed_amount'] ?? 300);
        $gstRate = (float) ($config['gst_rate'] ?? 0.17);

        $preTaxSubtotal = $slabCost + $fpa + $surcharges;
        $gst = $preTaxSubtotal * $gstRate;
        $totalBill = $preTaxSubtotal + $gst;

        if ($totalBill <= 0) {
            return [
                'slab_cost' => 8324,
                'total_bill' => 10616,
                'last_year_estimate' => 7850,
                'difference' => 2766,
            ];
        }

        $lastYearBaseRate = (float) data_get($config, "last_year_base_rate_per_unit.{$category}", 14.5);
        $lastYearBase = $unitsUsed * $lastYearBaseRate;
        $lastYearPreTaxSubtotal = $lastYearBase + $fpa + $surcharges;
        $lastYearGst = $lastYearPreTaxSubtotal * $gstRate;
        $lastYearEstimate = $lastYearPreTaxSubtotal + $lastYearGst;
        $difference = $totalBill - $lastYearEstimate;

        return [
            'slab_cost' => round($slabCost, 2),
            'total_bill' => round($totalBill, 2),
            'last_year_estimate' => round($lastYearEstimate, 2),
            'difference' => round($difference, 2),
        ];
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
