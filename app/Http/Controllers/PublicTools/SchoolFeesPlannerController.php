<?php

namespace App\Http\Controllers\PublicTools;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\BuildsPublicSeo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SchoolFeesPlannerController extends Controller
{
    use BuildsPublicSeo;

    public function show(Request $request): Response
    {
        $config = config('public_tools.school_fees_planner', []);
        $activation = $this->resolveActivationState($request, 'school_fees_planner');
        $seo = $this->publicSeo('schoolFeesPlanner');

        return Inertia::render('Public/Tools/SchoolFeesPlanner', [
            'defaults' => [
                'children_count' => (int) ($activation['inputs']['children_count'] ?? $config['defaults']['children_count'] ?? 2),
                'monthly_tuition_per_child' => (float) ($activation['inputs']['monthly_tuition_per_child'] ?? $config['defaults']['monthly_tuition_per_child'] ?? 15000),
                'annual_charges' => (float) ($activation['inputs']['annual_charges'] ?? $config['defaults']['annual_charges'] ?? 40000),
                'exam_fee' => (float) ($activation['inputs']['exam_fee'] ?? $config['defaults']['exam_fee'] ?? 5000),
                'exam_frequency' => (int) ($activation['inputs']['exam_frequency'] ?? $config['defaults']['exam_frequency'] ?? 2),
                'inflation_buffer_percentage' => (float) ($activation['inputs']['inflation_buffer_percentage'] ?? $config['defaults']['inflation_buffer_percentage'] ?? 12),
            ],
            'activationPrefill' => $activation,
            'seo' => $seo,
            'jsonLd' => $this->publicWebPageSchema($seo),
        ]);
    }

    public function schoolFeesPlanner(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'children_count' => ['required', 'integer', 'min:1', 'max:20'],
            'monthly_tuition_per_child' => ['required', 'numeric', 'min:0'],
            'annual_charges' => ['required', 'numeric', 'min:0'],
            'exam_fee' => ['required', 'numeric', 'min:0'],
            'exam_frequency' => ['required', 'integer', 'min:0', 'max:24'],
            'inflation_buffer_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $inflationBuffer = (float) ($validated['inflation_buffer_percentage']
            ?? config('public_tools.school_fees_planner.defaults.inflation_buffer_percentage', 12));

        $monthlyOutflow = (int) $validated['children_count'] * (float) $validated['monthly_tuition_per_child'];
        $annualTotal = (float) $validated['annual_charges']
            + ((float) $validated['exam_fee'] * (int) $validated['exam_frequency']);
        $amortizedMonthly = $annualTotal / 12;
        $realMonthlyCost = $monthlyOutflow + $amortizedMonthly;
        $projectedNextYear = $realMonthlyCost * (1 + ($inflationBuffer / 100));

        return response()->json([
            'monthly_outflow' => round($monthlyOutflow, 2),
            'amortized_monthly' => round($amortizedMonthly, 2),
            'real_monthly_cost' => round($realMonthlyCost, 2),
            'projected_next_year' => round($projectedNextYear, 2),
        ]);
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
