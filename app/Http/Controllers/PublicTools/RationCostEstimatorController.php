<?php

namespace App\Http\Controllers\PublicTools;

use App\Http\Controllers\Concerns\BuildsPublicSeo;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RationCostEstimatorController extends Controller
{
    use BuildsPublicSeo;

    public function show(Request $request): Response
    {
        $config = config('ration_cost_estimator');
        $relatedLinks = $this->relatedLinksForTool('ration-cost-estimator');
        $activation = $this->resolveActivationState($request, 'ration_cost_estimator');
        $seo = $this->publicSeo('rationCostEstimator');

        $familySizeFromQuery = (int) $request->query('family_size');
        $familySizeFromState = (int) ($activation['inputs']['householdSize'] ?? 0);
        $defaultHouseholdSize = $familySizeFromQuery > 0
            ? $familySizeFromQuery
            : ($familySizeFromState > 0 ? $familySizeFromState : ($config['default_household_size'] ?? 4));

        $faqItems = [
            [
                'question' => 'How does this tool estimate grocery costs?',
                'answer' => 'The tool multiplies the quantities you input for staples (atta, rice, oil, sugar, daal) by the baseline retail prices configured in the database, allowing you to establish a basic food cost benchmark before you shop.',
            ],
            [
                'question' => 'Why are fresh vegetables, meat, and milk missing from the list?',
                'answer' => 'This tool focuses exclusively on long-shelf-life dry staples to establish your core kitchen baseline. Highly volatile fresh perishables (milk, meat, vegetables) should be budgeted separately.',
            ],
            [
                'question' => 'Can I use this estimator for free without registering?',
                'answer' => 'Yes, the calculator is fully functional in guest mode. Registration is only required if you wish to save your grocery plans and view them inside your household workspace.',
            ],
            [
                'question' => 'How do Wholesale Mandi prices differ from open-market kiryana stores in Pakistan?',
                'answer' => 'Wholesale grain mandis (e.g., Akbari Mandi Lahore or Jodia Bazaar Karachi) offer bulk savings of 12% to 22% on sacks of flour, pulses, and oil cartons, whereas neighborhood kiryana stores incorporate transport costs, local packaging, and retail markups. Following the federal restructuring of Utility Stores Corporation subsidies in favor of direct BISP cash disbursements, households achieve real savings through monthly bulk wholesale procurement rather than relying on discontinued store subsidies.',
            ],
        ];

        // Extension point: swap config-based pricing with a database or API-driven
        // pricing source when real-time ration pricing is available.
        return Inertia::render('Public/Tools/RationCostEstimator', [
            'currency' => $config['currency'] ?? 'PKR',
            'currencySymbol' => $config['currency_symbol'] ?? 'Rs',
            'defaultHouseholdSize' => $defaultHouseholdSize,
            'items' => $config['items'] ?? [],
            'relatedLinks' => $relatedLinks,
            'activationPrefill' => $activation,
            'seo' => $seo,
            'faqItems' => $faqItems,
            'jsonLd' => $this->publicToolGraphSchema($seo, $faqItems, [
                'name' => 'Ration Cost Estimator Pakistan',
                'description' => $seo['description'],
            ]),
        ]);
    }

    protected function relatedLinksForTool(string $toolKey): array
    {
        $config = config('internal_links', []);

        return [
            'relatedTools' => $this->resolveLinks(
                data_get($config, 'tools', []),
                data_get($config, "mappings.tool_to_related_tools.{$toolKey}", [])
            ),
            'relatedBlogs' => $this->resolveLinks(
                data_get($config, 'blogs', []),
                data_get($config, "mappings.tool_to_related_blogs.{$toolKey}", [])
            ),
        ];
    }

    protected function resolveLinks(array $library, array $keys): array
    {
        return collect($keys)
            ->map(function (string $key) use ($library) {
                $link = $library[$key] ?? null;
                if (! is_array($link) || empty($link['title'])) {
                    return null;
                }

                $href = $this->resolveHref($link);
                if (! $href) {
                    return null;
                }

                return [
                    'title' => $link['title'],
                    'href' => $href,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    protected function resolveHref(array $link): ?string
    {
        if (! empty($link['route_name']) && Route::has($link['route_name'])) {
            try {
                return route($link['route_name'], $link['route_params'] ?? [], false);
            } catch (Throwable) {
                return null;
            }
        }

        if (! empty($link['href']) && is_string($link['href'])) {
            return $link['href'];
        }

        return null;
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
