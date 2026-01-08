<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class RssController extends Controller
{
    public function blog(): Response
    {
        $xml = Cache::remember('rss:blog', now()->addHours(6), function () {
            $posts = BlogPost::query()
                ->published()
                ->with('categories')
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->limit(20)
                ->get();

            $siteUrl = rtrim(config('app.url'), '/');

            return view('rss.blog', [
                'posts' => $posts,
                'siteUrl' => $siteUrl,
                'description' => 'Roznamcha blog on Pakistani household budgets, ration strategy, and inflation survival.',
            ])->render();
        });

        return response($xml, 200, ['Content-Type' => 'application/rss+xml; charset=UTF-8']);
    }
}
