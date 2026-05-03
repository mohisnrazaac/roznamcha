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
                ->publicArchiveVisible()
                ->with('categories')
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->limit(20)
                ->get();

            $siteUrl = rtrim(config('app.url'), '/');

            return view('rss.blog', [
                'posts' => $posts,
                'siteUrl' => $siteUrl,
                'description' => 'Practical guides on household budgeting, ration planning, and month-end pressure for Pakistani families.',
            ])->render();
        });

        return response($xml, 200, ['Content-Type' => 'application/rss+xml; charset=UTF-8']);
    }
}
