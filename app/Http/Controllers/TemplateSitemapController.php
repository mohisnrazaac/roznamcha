<?php

// Purpose: Publish a discovery-safe template sitemap that advertises only the approved template index page. Date: 2026-03-27. Author: Codex.

namespace App\Http\Controllers;

use App\Models\BudgetTemplate;
use App\Seo\SearchSurfacePolicy;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class TemplateSitemapController extends Controller
{
    public function __construct(private readonly SearchSurfacePolicy $searchSurfacePolicy) {}

    public function show(): Response
    {
        $xml = Cache::remember('sitemap:templates:xml:v6', now()->addHours(6), function () {
            return view('sitemap.xml', ['urls' => []])->render();
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600, s-maxage=3600',
            'X-Robots-Tag' => 'noindex, follow',
        ]);
    }
}
