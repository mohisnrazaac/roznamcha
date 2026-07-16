<?php
// Purpose: Publish a discovery-safe template sitemap that advertises only the approved template index page. Date: 2026-03-27. Author: Codex.

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class TemplateSitemapController extends Controller
{
    public function show(): Response
    {
        $xml = Cache::remember('sitemap:templates:xml:v2', now()->addHours(6), function () {
            return view('sitemap.xml', ['urls' => [
                [
                    'loc' => route('templates.index', [], true),
                    'priority' => '0.9',
                    'changefreq' => 'daily',
                ],
            ]])->render();
        });

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }
}
