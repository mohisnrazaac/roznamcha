<?php
// Purpose: Publish a discovery-safe template sitemap that advertises only the approved template index page. Date: 2026-03-27. Author: Codex.

namespace App\Http\Controllers;

use App\Models\BudgetTemplate;
use App\Seo\SearchSurfacePolicy;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class TemplateSitemapController extends Controller
{
    public function __construct(private readonly SearchSurfacePolicy $searchSurfacePolicy)
    {
    }

    public function show(): Response
    {
        $xml = Cache::remember('sitemap:templates:xml:v5', now()->addHours(6), function () {
            $lastmod = now()->startOfDay()->toAtomString();
            $urls = [
                [
                    'loc' => route('templates.index', [], true),
                    'priority' => '0.9',
                    'changefreq' => 'daily',
                    'lastmod' => $lastmod,
                ],
            ];

            $templates = BudgetTemplate::query()->get(['slug', 'updated_at']);
            foreach ($templates as $t) {
                if ($this->searchSurfacePolicy->isTemplateNoindexed($t->slug)) {
                    continue;
                }

                $urls[] = [
                    'loc' => route('templates.show', ['slug' => $t->slug], true),
                    'priority' => '0.8',
                    'changefreq' => 'weekly',
                    'lastmod' => optional($t->updated_at)->toAtomString() ?: $lastmod,
                ];
            }

            return view('sitemap.xml', ['urls' => $urls])->render();
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600, s-maxage=3600',
        ]);
    }
}
