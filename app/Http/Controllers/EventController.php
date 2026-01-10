<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Support\ActivationSession;
use App\Support\EventRecorder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;

class EventController extends Controller
{
    public function __construct(private EventRecorder $events)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'meta' => ['nullable', 'array'],
        ]);

        $this->events->record($data['name'], $data['meta'] ?? []);

        return response()->json(['status' => 'ok']);
    }

    public function blogCtaClick(Request $request): JsonResponse
    {
        $data = $request->validate([
            'post_id' => ['required', 'integer', 'exists:blog_posts,id'],
            'slug' => ['required', 'string', 'max:255'],
            'return_to' => ['nullable', 'string', 'max:255'],
            'cta_route' => ['nullable', 'string', 'max:255'],
            'prefill' => ['nullable', 'array'],
            'prefill.category' => ['nullable', 'string', 'max:255'],
            'prefill.tags' => ['nullable', 'array'],
            'prefill.tags.*' => ['string', 'max:50'],
            'prefill.amount' => ['nullable', 'numeric', 'min:0'],
            'prefill.note' => ['nullable', 'string', 'max:255'],
        ]);

        $returnPath = ActivationSession::rememberReturn($request, '/onboarding');
        ActivationSession::rememberCompletion($request, $data['return_to'] ?? $this->blogPath($data['slug']));

        if (! empty($data['prefill'])) {
            ActivationSession::storePrefill($request, Arr::only($data['prefill'], ['category', 'tags', 'amount', 'note']));
        }

        $ctaRoute = $this->validRoute($data['cta_route'] ?? 'register');

        return response()->json([
            'redirect' => route($ctaRoute, ['return_to' => $returnPath]),
        ]);
    }

    protected function blogPath(string $slug): string
    {
        $url = route('public.blog.show', ['slug' => $slug], false);

        return '/'.ltrim(parse_url($url, PHP_URL_PATH) ?: "blog/{$slug}", '/');
    }

    protected function validRoute(string $routeName): string
    {
        if (! Route::has($routeName)) {
            return 'register';
        }

        return $routeName;
    }
}
