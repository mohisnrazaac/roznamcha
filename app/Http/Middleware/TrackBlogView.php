<?php

namespace App\Http\Middleware;

use App\Models\BlogPost;
use App\Support\EventRecorder;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackBlogView
{
    public function __construct(private EventRecorder $events)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldTrack($response)) {
            $slug = (string) $request->route('slug');

            if ($slug !== '') {
                $post = BlogPost::query()
                    ->where('slug', $slug)
                    ->first(['id', 'slug']);

                if ($post) {
                    $this->events->record('blog_view', [
                        'post_id' => $post->id,
                        'slug' => $post->slug,
                        'path' => $request->path(),
                        'ref' => $request->headers->get('referer'),
                    ]);
                }
            }
        }

        return $response;
    }

    protected function shouldTrack(Response $response): bool
    {
        $status = $response->getStatusCode();

        return $status >= 200 && $status < 400;
    }
}
