<?php
// Purpose: Publish XML sitemap entries for smart budget templates so search engines can crawl public template pages. Date: 2026-03-27. Author: Codex.

namespace App\Http\Controllers;

use App\Models\BudgetTemplate;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class TemplateSitemapController extends Controller
{
    public function show(): Response
    {
        $xml = Cache::remember('sitemap:templates:xml', now()->addHours(6), function () {
            $urls = [
                [
                    'loc' => route('templates.index', [], true),
                    'priority' => '0.9',
                    'changefreq' => 'daily',
                ],
            ];

            $templates = BudgetTemplate::query()
                ->orderBy('base_salary_target')
                ->orderBy('title')
                ->get(['slug', 'updated_at']);

            foreach ($templates as $template) {
                $urls[] = [
                    'loc' => route('templates.show', ['slug' => $template->slug], true),
                    'priority' => '0.8',
                    'changefreq' => 'weekly',
                    'lastmod' => optional($template->updated_at)->toAtomString(),
                ];
            }

            return view('sitemap.xml', ['urls' => $urls])->render();
        });

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
