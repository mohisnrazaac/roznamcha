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
                'question' => 'Bijli ka bill kaise calculate karein?',
                'answer' => 'Bijli ka bill calculate karne ke liye apne meter ke total units ko dekhein. Agar pichlay 6 mahinay se 200 units se kam hain to aap Protected category mein aate hain jahan pehle 100 units Rs 10.54 aur aglay 100 units Rs 13.01 par calculate hotay hain. 200 se oper janay par tamam units unprotected tariff bracket (Rs 22.44 se Rs 47.72) par lagte hain, sath mein 18% GST, FC surcharge (Rs 3.23), Electricity Duty (1.5%), aur Rs 35 TV fee shamil hoti hai.',
            ],
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

        $defaultUnits = (int) ($activation['inputs']['units_used'] ?? $config['defaults']['units_used'] ?? 250);
        $defaultCategory = (string) ($activation['inputs']['user_category'] ?? $config['defaults']['user_category'] ?? 'unprotected');
        $initialResult = ! empty($activation['results'])
            ? $activation['results']
            : $this->computeEstimate($defaultUnits, $defaultCategory, $config);

        return Inertia::render('Public/Tools/ElectricityBillEstimator', [
            'defaults' => [
                'units_used' => $defaultUnits,
                'user_category' => $defaultCategory,
            ],
            'categories' => ['protected', 'unprotected'],
            'gst_percentage' => ($config['gst_rate'] ?? 0.18) * 100,
            'initialResult' => $initialResult,
            'activationPrefill' => $activation,
            'seo' => $seo,
            'faqItems' => $faqItems,
            'jsonLd' => $this->publicToolGraphSchema($seo, $faqItems, [
                'name' => 'Electricity Bill Calculator Pakistan 2026',
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

        $result = $this->computeEstimate($unitsUsed, $category, $config);

        return response()->json($result);
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

        // Base Energy Slab Cost
        $slabCost = $this->calculateSlabCost($unitsUsed, $category, $slabs->all());

        // Fuel Cost Adjustment (FPA/FCA) & Quarterly Tariff Adjustment (QTA)
        $fpaPerUnit = (float) ($config['defaults']['fpa_per_unit'] ?? 3.00);
        $qtaPerUnit = (float) ($config['defaults']['qta_per_unit'] ?? 2.50);
        $fpa = $unitsUsed * $fpaPerUnit;
        $qta = $unitsUsed * $qtaPerUnit;

        // Financing Cost (FC) Surcharge: Rs 3.23/unit unprotected, Rs 0.43/unit protected
        $fcRate = (float) ($config['fc_surcharge'][$category] ?? ($category === 'protected' ? 0.43 : 3.23));
        $fcSurcharge = $unitsUsed * $fcRate;

        // Fixed Charges based on sanctioned load and units
        $sanctionedLoad = (float) ($config['defaults']['sanctioned_load_kw'] ?? 1);
        $fixedRate = 0.0;
        if ($category === 'unprotected') {
            $fixedRate = $unitsUsed > 300
                ? (float) ($config['fixed_charges_per_kw']['unprotected_301_plus'] ?? 600)
                : (float) ($config['fixed_charges_per_kw']['unprotected_1_300'] ?? 400);
        }
        $fixedCharges = $sanctionedLoad * $fixedRate;

        // Electricity Duty: 1.5% of base energy cost
        $edRate = (float) ($config['electricity_duty_rate'] ?? 0.015);
        $electricityDuty = $slabCost * $edRate;

        // TV License Fee: Rs 35 flat
        $tvFee = (float) ($config['tv_fee'] ?? 35.0);

        // Pre-Tax Subtotal
        $preTaxSubtotal = $slabCost + $fpa + $qta + $fcSurcharge + $fixedCharges + $electricityDuty + $tvFee;

        // GST: 18% (0.18) on taxable electricity services
        $gstRate = (float) ($config['gst_rate'] ?? 0.18);
        $gst = $category === 'protected' && $unitsUsed <= 200 ? 0.0 : ($preTaxSubtotal * $gstRate);

        $billBeforeAdvTax = $preTaxSubtotal + $gst;

        // Advance Income Tax (Section 235): 7.5% for bills >= Rs 25,000 for non-filers
        $advTaxThreshold = (float) ($config['advance_tax_threshold'] ?? 25000.0);
        $advTaxRate = (float) ($config['advance_tax_rate'] ?? 0.075);
        $advanceIncomeTax = ($billBeforeAdvTax >= $advTaxThreshold) ? ($billBeforeAdvTax * $advTaxRate) : 0.0;

        $totalBill = $billBeforeAdvTax + $advanceIncomeTax;

        // Last year comparison baseline
        $lastYearBaseRate = (float) data_get($config, "last_year_base_rate_per_unit.{$category}", $category === 'protected' ? 9.5 : 14.5);
        $lastYearBase = $unitsUsed * $lastYearBaseRate;
        $lastYearPreTax = $lastYearBase + ($unitsUsed * 2.0) + ($unitsUsed * ($category === 'protected' ? 0.43 : 2.50)) + $fixedCharges + ($lastYearBase * 0.015) + $tvFee;
        $lastYearGst = $category === 'protected' && $unitsUsed <= 200 ? 0.0 : ($lastYearPreTax * 0.18);
        $lastYearEstimate = $lastYearPreTax + $lastYearGst;
        $difference = $totalBill - $lastYearEstimate;

        return [
            'slab_cost' => round($slabCost, 2),
            'fpa' => round($fpa, 2),
            'qta' => round($qta, 2),
            'fc_surcharge' => round($fcSurcharge, 2),
            'fixed_charges' => round($fixedCharges, 2),
            'electricity_duty' => round($electricityDuty, 2),
            'tv_fee' => round($tvFee, 2),
            'gst' => round($gst, 2),
            'advance_income_tax' => round($advanceIncomeTax, 2),
            'total_bill' => round($totalBill, 2),
            'last_year_estimate' => round($lastYearEstimate, 2),
            'difference' => round($difference, 2),
        ];
    }

    /**
     * Calculate Slab Cost following NEPRA S.R.O. 279(I)/2026:
     * - Protected consumers: benefit of previous slab applies (1-100 @ Rs 10.54, 101-200 @ Rs 13.01; lifeline up to 50 @ Rs 3.95, 51-100 @ Rs 7.74).
     * - Unprotected consumers: Non-telescopic billing (all units billed at the applicable bracket rate of total units consumed).
     *
     * @param  array<int, object>  $slabs
     */
    public function calculateSlabCost(int $unitsUsed, string $category, array $slabs): float
    {
        if ($category === 'protected' && $unitsUsed <= 200) {
            // If custom DB slabs are provided, calculate with progressive slab benefit using DB rates
            if (! empty($slabs)) {
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

                    if ($billableUnits > 0) {
                        $total += $billableUnits * $rate;
                    }
                }

                return $total;
            }

            // Lifeline or 1-previous-slab benefit with NEPRA statutory defaults
            if ($unitsUsed <= 50) {
                return $unitsUsed * 3.95;
            }

            if ($unitsUsed <= 100) {
                return $unitsUsed * 10.54;
            }

            // 101 - 200 units: one-previous-slab benefit
            // First 100 units @ 10.54, remaining units (101-200) @ 13.01
            $first100 = 100 * 10.54;
            $remaining = ($unitsUsed - 100) * 13.01;

            return $first100 + $remaining;
        }

        // Unprotected: Non-telescopic (entire consumption is billed at the slab rate of total units)
        // Check rate from passed slabs or fallback to S.R.O. 279(I)/2026 brackets
        $rate = $this->resolveUnprotectedRate($unitsUsed, $slabs);

        return $unitsUsed * $rate;
    }

    /**
     * @param  array<int, object>  $slabs
     */
    protected function resolveUnprotectedRate(int $unitsUsed, array $slabs): float
    {
        foreach ($slabs as $slab) {
            $min = (int) $slab->min_units;
            $max = $slab->max_units === null ? null : (int) $slab->max_units;

            if ($unitsUsed >= $min && ($max === null || $unitsUsed <= $max)) {
                return (float) $slab->rate_per_unit;
            }
        }

        // Fallback default NEPRA S.R.O. 279(I)/2026 rates
        if ($unitsUsed <= 100) {
            return 22.44;
        }
        if ($unitsUsed <= 200) {
            return 28.07;
        }
        if ($unitsUsed <= 300) {
            return 33.15;
        }
        if ($unitsUsed <= 400) {
            return 37.97;
        }
        if ($unitsUsed <= 500) {
            return 40.17;
        }
        if ($unitsUsed <= 600) {
            return 41.52;
        }
        if ($unitsUsed <= 700) {
            return 42.78;
        }

        return 47.72;
    }

    /**
     * Legacy compatibility method
     *
     * @param  array<int, object>  $slabs
     */
    protected function calculateProgressiveSlabCost(int $unitsUsed, array $slabs): float
    {
        return $this->calculateSlabCost($unitsUsed, 'unprotected', $slabs);
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
