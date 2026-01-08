<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function show(): Response
    {
        $xml = Cache::remember('sitemap:xml', now()->addHours(6), function () {
            $urls = $this->staticUrls();
            $urls[] = [
                'loc' => route('public.blog.index', [], true),
                'priority' => '0.8',
                'changefreq' => 'daily',
            ];

            $posts = BlogPost::query()
                ->published()
                ->orderByDesc('published_at')
                ->get(['slug', 'published_at', 'updated_at']);

            foreach ($posts as $post) {
                $urls[] = [
                    'loc' => route('public.blog.show', ['slug' => $post->slug], true),
                    'priority' => '0.7',
                    'changefreq' => 'weekly',
                    'lastmod' => optional($post->published_at ?? $post->updated_at)->toAtomString(),
                ];
            }

            return view('sitemap.xml', ['urls' => $urls])->render();
        });

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    protected function staticUrls(): array
    {
        return [
            [
                'loc' => route('public.home', [], true),
                'priority' => '1.0',
                'changefreq' => 'weekly',
            ],
            [
                'loc' => route('public.kharcha-map', [], true),
                'priority' => '0.9',
                'changefreq' => 'monthly',
            ],
            [
                'loc' => route('public.ration-brain', [], true),
                'priority' => '0.9',
                'changefreq' => 'monthly',
            ],
            [
                'loc' => route('public.survival-report', [], true),
                'priority' => '0.9',
                'changefreq' => 'monthly',
            ],
            [
                'loc' => route('public.about', [], true),
                'priority' => '0.7',
                'changefreq' => 'yearly',
            ],
            [
                'loc' => route('public.contact', [], true),
                'priority' => '0.7',
                'changefreq' => 'yearly',
            ],
            [
                'loc' => route('public.privacy', [], true),
                'priority' => '0.5',
                'changefreq' => 'yearly',
            ],
            [
                'loc' => route('public.terms', [], true),
                'priority' => '0.5',
                'changefreq' => 'yearly',
            ],
        ];
    }
}
