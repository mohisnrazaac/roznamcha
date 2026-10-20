<?php

namespace App\Http\Controllers\PublicTools;

use App\Http\Controllers\Concerns\BuildsPublicSeo;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class MonthlyHouseholdBudgetCalculatorController extends Controller
{
    use BuildsPublicSeo;

    public function show(Request $request): Response
    {
        $config = config('public_tools.monthly_household_budget_calculator', []);
        $activation = $this->resolveActivationState($request, 'monthly_household_budget_calculator');
        $seo = $this->publicSeo('monthlyHouseholdBudgetCalculator');

        $faqItems = [
            [
                'question' => 'What is a normal savings rate for a Pakistani household?',
                'answer' => 'Due to recent high inflation, many middle-income households in Pakistan experience a very tight budget with a savings rate below 10%. A target of 15% is ideal but requires strict allocation of variable expenses like utilities and transport.',
            ],
            [
                'question' => 'How can I reduce variable household expenses in Pakistan?',
                'answer' => 'Focus on progressive slab management for electricity (staying below 200 or 300 units), buying monthly grocery items in bulk from wholesale markets instead of neighborhood shops, and consolidating transit trips to reduce fuel costs.',
            ],
            [
                'question' => 'Can I use this budget planner without signing up?',
                'answer' => 'Yes. The Monthly Household Budget Calculator works fully in guest mode. You only need to create a free account if you wish to persist your budget snapshot, compare it against live market updates, and get automated alerts.',
            ],
            [
                'question' => 'How should I prioritize expenses if running a monthly deficit?',
                'answer' => 'Prioritize non-negotiable survival obligations first: housing rent, basic dry ration staples, and keeping electricity consumption below the next slab threshold. Audit discretionary medical/misc buffers and vehicle fuel trips before borrowing.',
            ],
        ];

        $defaults = [
            'monthly_income' => (float) ($activation['inputs']['monthly_income'] ?? $config['defaults']['monthly_income'] ?? 85000),
            'rent' => (float) ($activation['inputs']['rent'] ?? $config['defaults']['rent'] ?? 20000),
            'ration' => (float) ($activation['inputs']['ration'] ?? $config['defaults']['ration'] ?? 25000),
            'utilities' => (float) ($activation['inputs']['utilities'] ?? $config['defaults']['utilities'] ?? 12000),
            'education' => (float) ($activation['inputs']['education'] ?? $config['defaults']['education'] ?? 8000),
            'transport' => (float) ($activation['inputs']['transport'] ?? $config['defaults']['transport'] ?? 6000),
            'misc' => (float) ($activation['inputs']['misc'] ?? $config['defaults']['misc'] ?? 4000),
        ];

        $totalExpenses = $defaults['rent']
            + $defaults['ration']
            + $defaults['utilities']
            + $defaults['education']
            + $defaults['transport']
            + $defaults['misc'];

        $surplusDeficit = $defaults['monthly_income'] - $totalExpenses;
        $savingsRate = $defaults['monthly_income'] > 0
            ? ($surplusDeficit / $defaults['monthly_income']) * 100
            : 0;

        $initialResult = !empty($activation['results']) ? $activation['results'] : [
            'total_expenses' => round($totalExpenses, 2),
            'surplus_deficit' => round($surplusDeficit, 2),
            'savings_rate' => round($savingsRate, 2),
            'shares' => [
                'rent' => $totalExpenses > 0 ? round(($defaults['rent'] / $totalExpenses) * 100, 2) : 0,
                'ration' => $totalExpenses > 0 ? round(($defaults['ration'] / $totalExpenses) * 100, 2) : 0,
                'utilities' => $totalExpenses > 0 ? round(($defaults['utilities'] / $totalExpenses) * 100, 2) : 0,
                'education' => $totalExpenses > 0 ? round(($defaults['education'] / $totalExpenses) * 100, 2) : 0,
                'transport' => $totalExpenses > 0 ? round(($defaults['transport'] / $totalExpenses) * 100, 2) : 0,
                'misc' => $totalExpenses > 0 ? round(($defaults['misc'] / $totalExpenses) * 100, 2) : 0,
            ],
        ];

        return Inertia::render('Public/Tools/MonthlyHouseholdBudgetCalculator', [
            'defaults' => $defaults,
            'initialResult' => $initialResult,
            'activationPrefill' => $activation,
            'seo' => $seo,
            'faqItems' => $faqItems,
            'jsonLd' => $this->publicToolGraphSchema($seo, $faqItems, [
                'name' => 'Monthly Household Budget Calculator Pakistan',
                'description' => $seo['description'],
            ]),
        ]);
    }

    public function calculate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'monthly_income' => ['required', 'numeric', 'min:0'],
            'rent' => ['required', 'numeric', 'min:0'],
            'ration' => ['required', 'numeric', 'min:0'],
            'utilities' => ['required', 'numeric', 'min:0'],
            'education' => ['required', 'numeric', 'min:0'],
            'transport' => ['required', 'numeric', 'min:0'],
            'misc' => ['required', 'numeric', 'min:0'],
        ]);

        $totalExpenses = $validated['rent']
            + $validated['ration']
            + $validated['utilities']
            + $validated['education']
            + $validated['transport']
            + $validated['misc'];

        $surplusDeficit = $validated['monthly_income'] - $totalExpenses;
        $savingsRate = $validated['monthly_income'] > 0
            ? ($surplusDeficit / $validated['monthly_income']) * 100
            : 0;

        return response()->json([
            'total_expenses' => round($totalExpenses, 2),
            'surplus_deficit' => round($surplusDeficit, 2),
            'savings_rate' => round($savingsRate, 2),
            'shares' => [
                'rent' => $totalExpenses > 0 ? round(($validated['rent'] / $totalExpenses) * 100, 2) : 0,
                'ration' => $totalExpenses > 0 ? round(($validated['ration'] / $totalExpenses) * 100, 2) : 0,
                'utilities' => $totalExpenses > 0 ? round(($validated['utilities'] / $totalExpenses) * 100, 2) : 0,
                'education' => $totalExpenses > 0 ? round(($validated['education'] / $totalExpenses) * 100, 2) : 0,
                'transport' => $totalExpenses > 0 ? round(($validated['transport'] / $totalExpenses) * 100, 2) : 0,
                'misc' => $totalExpenses > 0 ? round(($validated['misc'] / $totalExpenses) * 100, 2) : 0,
            ],
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
