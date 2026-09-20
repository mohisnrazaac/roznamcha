<?php

namespace App\Http\Controllers\PublicTools;

use App\Http\Controllers\Concerns\BuildsPublicSeo;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SolarRoiCalculatorController extends Controller
{
    use BuildsPublicSeo;

    public function show(Request $request): Response
    {
        $config = config('public_tools.solar_roi_calculator', []);
        $activation = $this->resolveActivationState($request, 'solar_roi_calculator');
        $seo = $this->publicSeo('solarRoiCalculator');

        $queryUnits = $request->query('units');
        $queryBill = $request->query('bill');

        $initialUnits = is_numeric($queryUnits) && (int) $queryUnits > 0
            ? (int) $queryUnits
            : (int) ($activation['inputs']['monthly_units'] ?? $config['defaults']['monthly_units'] ?? 650);

        $initialBill = is_numeric($queryBill) && (float) $queryBill > 0
            ? (float) $queryBill
            : (float) ($activation['inputs']['monthly_bill'] ?? $config['defaults']['monthly_bill'] ?? 32000);

        $faqItems = [
            [
                'question' => 'How does NEPRA Net Billing differ from traditional Net Metering?',
                'answer' => 'Under traditional Net Metering, exported solar units offset imported grid units 1-to-1 at retail slab rates. Under NEPRA\'s Net Billing (Buyback) framework, self-consumed solar power saves you the full DISCO retail tariff (Rs. 42–58+/unit), while exported excess units are credited at the National Average Energy Purchase Price (~Rs. 11.00/unit). Maximizing daytime self-consumption delivers the highest ROI.',
            ],
            [
                'question' => 'Why does LiFePO4 battery storage cost less over 10 years than Tubular?',
                'answer' => 'While Tall Tubular lead-acid batteries have a lower upfront cost (Rs. ~140,000 per 48V bank), they degrade rapidly in Pakistani summer temperatures with a cycle life of only 800–1,200 cycles (2–3 years at 50% DoD), requiring 3 to 4 complete bank replacements over 10 years. LiFePO4 lithium batteries last 5,000–6,000 cycles (10+ years at 90% DoD) with zero replacements, resulting in ~35%–40% lower cost per stored kWh.',
            ],
            [
                'question' => 'How long does the DISCO Green Meter process take in Pakistan?',
                'answer' => 'Typical processing time across LESCO, IESCO, GEPCO, and other DISCOs ranges from 45 to 90 days. The turnkey process includes NEPRA generation license application, distribution transformer load verification, third-party inspection, and bidirectional meter installation.',
            ],
            [
                'question' => 'Can I run inverter air conditioners during grid load shedding?',
                'answer' => 'Standard On-Grid string inverters shut down immediately during grid outages for lineman safety (anti-islanding). To run air conditioners during load shedding, you need a Hybrid inverter with either Tubular or LiFePO4 battery storage sized to handle compressor inrush currents.',
            ],
            [
                'question' => 'How does self-consumption affect payback speed?',
                'answer' => 'Because retail electricity slab tariffs (Rs. 42 to 71+/unit) far exceed the exported unit buyback rate (Rs. 11/unit), scheduling heavy daytime loads—such as water pumps, washing machines, and inverter air conditioning—delivers up to 3x higher economic value per solar kilowatt-hour generated.',
            ],
        ];

        return Inertia::render('Public/Tools/SolarRoiCalculator', [
            'defaults' => [
                'monthly_units' => $initialUnits,
                'monthly_bill' => $initialBill,
                'self_consume_ratio' => (float) ($config['defaults']['self_consume_ratio'] ?? 60),
                'buyback_rate' => (float) ($config['defaults']['buyback_rate'] ?? 11.0),
            ],
            'initialUnits' => $initialUnits,
            'initialBill' => $initialBill,
            'activationPrefill' => $activation,
            'seo' => $seo,
            'faqItems' => $faqItems,
            'jsonLd' => $this->publicToolGraphSchema($seo, $faqItems, [
                'name' => 'Solar Net Metering & ROI Calculator Pakistan',
                'description' => $seo['description'],
            ]),
        ]);
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'monthly_units' => ['nullable', 'integer', 'min:1', 'max:50000'],
            'monthly_bill' => ['nullable', 'numeric', 'min:0', 'max:20000000'],
            'system_size_key' => ['nullable', 'string', 'in:3kw,5kw,10kw,15kw,20kw'],
            'self_consume_ratio' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'retail_tariff' => ['nullable', 'numeric', 'min:1', 'max:200'],
            'buyback_rate' => ['nullable', 'numeric', 'min:1', 'max:50'],
            'battery_type' => ['nullable', 'string', 'in:none,tubular,lifepo4'],
            'capex_override' => ['nullable', 'numeric', 'min:0'],
        ]);

        $units = (int) ($validated['monthly_units'] ?? 650);
        $bill = (float) ($validated['monthly_bill'] ?? 32000);

        $systemSizeKey = $validated['system_size_key'] ?? null;
        if (! $systemSizeKey) {
            if ($units <= 350) {
                $systemSizeKey = '3kw';
            } elseif ($units <= 650) {
                $systemSizeKey = '5kw';
            } elseif ($units <= 1100) {
                $systemSizeKey = '10kw';
            } elseif ($units <= 1600) {
                $systemSizeKey = '15kw';
            } else {
                $systemSizeKey = '20kw';
            }
        }

        $benchmarks = [
            '3kw' => ['kw' => 3, 'monthly_gen' => 350, 'capex' => 550000],
            '5kw' => ['kw' => 5, 'monthly_gen' => 600, 'capex' => 850000],
            '10kw' => ['kw' => 10, 'monthly_gen' => 1200, 'capex' => 1600000],
            '15kw' => ['kw' => 15, 'monthly_gen' => 1800, 'capex' => 2300000],
            '20kw' => ['kw' => 20, 'monthly_gen' => 2400, 'capex' => 3000000],
        ];

        $system = $benchmarks[$systemSizeKey] ?? $benchmarks['5kw'];
        $monthlyGen = $system['monthly_gen'];
        $selfRatio = (float) ($validated['self_consume_ratio'] ?? 60);
        $exportRatio = 100 - $selfRatio;

        $retailTariff = (float) ($validated['retail_tariff'] ?? ($units <= 700 ? 48.0 : 58.0));
        $buybackRate = (float) ($validated['buyback_rate'] ?? 11.0);

        $selfConsumedUnits = round($monthlyGen * ($selfRatio / 100), 1);
        $exportedUnits = round($monthlyGen * ($exportRatio / 100), 1);

        $avoidedSavings = $selfConsumedUnits * $retailTariff;
        $exportRevenue = $exportedUnits * $buybackRate;
        $monthlySavings = $avoidedSavings + $exportRevenue;
        $annualSavings = $monthlySavings * 12;

        $capex = isset($validated['capex_override']) && $validated['capex_override'] !== null
            ? (float) $validated['capex_override']
            : (float) $system['capex'];

        $batteryType = $validated['battery_type'] ?? 'none';
        $batteryCapex = 0;
        if ($batteryType === 'tubular') {
            $batteryCapex = 240000; // 140k battery + 100k hybrid inverter
        } elseif ($batteryType === 'lifepo4') {
            $batteryCapex = 500000; // 400k battery + 100k hybrid inverter
        }

        $totalCapex = $capex + $batteryCapex;
        $paybackYears = $annualSavings > 0 ? round($totalCapex / $annualSavings, 2) : 0;

        return response()->json([
            'system_size_key' => $systemSizeKey,
            'system_kw' => $system['kw'],
            'monthly_gen' => $monthlyGen,
            'self_consumed_units' => $selfConsumedUnits,
            'exported_units' => $exportedUnits,
            'avoided_cost_savings' => round($avoidedSavings, 2),
            'export_revenue' => round($exportRevenue, 2),
            'monthly_savings' => round($monthlySavings, 2),
            'annual_savings' => round($annualSavings, 2),
            'total_capex' => $totalCapex,
            'payback_years' => $paybackYears,
        ]);
    }

    protected function resolveActivationState(Request $request, string $expectedToolKey): array
    {
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
