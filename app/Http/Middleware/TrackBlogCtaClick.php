<?php

namespace App\Http\Middleware;

use App\Support\EventRecorder;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackBlogCtaClick
{
    public function __construct(private EventRecorder $events)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $this->events->record('blog_cta_click', [
            'post_id' => $request->integer('post_id') ?: null,
            'slug' => $request->string('slug')->value(),
            'return_to' => $request->string('return_to')->value(),
            'path' => $request->path(),
        ]);

        return $next($request);
    }
}
