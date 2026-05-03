<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AskRozaController extends Controller
{
    public function ask(Request $request): JsonResponse|RedirectResponse
    {
        // ROZNAMCHA-ACTIVATION: deterministic guest tip flow grounded in current blog content.
        $validated = $request->validate([
            'question' => ['required', 'string', 'min:8', 'max:280'],
            'context_hint' => ['nullable', 'string', 'max:200'],
            'source_url' => ['nullable', 'string', 'max:500'],
        ]);

        $question = trim((string) $validated['question']);
        $snippets = $this->findRelevantSnippets($question);
        $tipText = $this->generateTip($question, $snippets);

        $response = [
            'tip_text' => $tipText,
            'related_links' => array_slice(array_map(fn ($snippet) => [
                'title' => $snippet['title'],
                'url' => $snippet['url'],
            ], $snippets), 0, 3),
            'cta' => [
                'primary' => 'Sign up to track this advice',
                'secondary' => 'Save it now. Compare your progress next month.',
            ],
        ];

        if ($request->header('X-Inertia')) {
            return back()->with('askRozaTip', $response)->withInput();
        }

        return response()->json($response);
    }

    protected function findRelevantSnippets(string $question): array
    {
        $keywords = collect(preg_split('/\s+/', Str::lower($question)) ?: [])
            ->map(fn (string $token) => preg_replace('/[^a-z0-9]/', '', $token))
            ->filter(fn (?string $token) => $token && strlen($token) >= 3)
            ->values();

        $posts = BlogPost::query()
            ->publicArchiveVisible()
            ->orderByDesc('published_at')
            ->limit(20)
            ->get(['id', 'title', 'slug', 'excerpt', 'content']);

        $ranked = $posts->map(function (BlogPost $post) use ($keywords) {
            $haystack = Str::lower(implode(' ', [
                $post->title,
                $post->excerpt,
                Str::limit(strip_tags((string) $post->content), 600),
            ]));

            $score = $keywords->sum(fn (string $keyword) => Str::contains($haystack, $keyword) ? 1 : 0);

            return [
                'score' => $score,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => Str::limit(strip_tags((string) ($post->excerpt ?: $post->content)), 180),
                'url' => route('public.blog.show', ['slug' => $post->slug]),
            ];
        })->sortByDesc('score')->values();

        $top = $ranked->filter(fn (array $item) => $item['score'] > 0)->take(3)->values()->all();

        if (count($top) === 0) {
            return $ranked->take(3)->values()->all();
        }

        return $top;
    }

    protected function generateTip(string $question, array $snippets): string
    {
        $lower = Str::lower($question);

        if (Str::contains($lower, ['electricity', 'bill', 'units', 'bijli'])) {
            return 'Cap high-load usage between 7pm-11pm, then run the Electricity Bill Estimator and save this baseline so next month you can compare unit cuts directly.';
        }

        if (Str::contains($lower, ['utility', 'ration', 'grocery', 'family'])) {
            return 'Run one ration estimate with your current basket and one with Utility Store substitutes, then save both snapshots to compare where pressure drops next month.';
        }

        if (Str::contains($lower, ['school', 'fee', 'tuition'])) {
            return 'Spread annual charges into a monthly reserve, then save your School Fees plan now so you can compare fee creep before next term starts.';
        }

        $first = $snippets[0]['title'] ?? 'our latest blog guidance';

        return "Start with {$first}, apply one change this week, and save today’s numbers so you can compare progress next month.";
    }
}
