<?php

namespace App\Http\Controllers;

use App\Models\AiUsageLog;
use App\Models\BlogPost;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function home(): Response
    {
        $latestPosts = BlogPost::query()
            ->published()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(3)
            ->get()
            ->map(fn (BlogPost $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt ?: Str::limit(strip_tags($post->rendered_content), 160),
                'published_label' => optional($post->published_at)->format('M j, Y'),
                'url' => route('public.blog.show', ['slug' => $post->slug]),
            ]);

        $user = auth()->user();
        $showAiBanner = ! $user;

        $hasUsageTable = Schema::hasTable('ai_usage_logs');

        if ($user && $hasUsageTable) {
            $showAiBanner = ! AiUsageLog::query()
                ->where('user_id', $user->id)
                ->exists();
        } elseif ($user) {
            $showAiBanner = false;
        }

        return Inertia::render('Public/Home', [
            'latestPosts' => $latestPosts,
            'showAiBanner' => $showAiBanner,
        ]);
    }

    public function kharchaMap(): Response
    {
        return Inertia::render('Public/KharchaMap');
    }

    public function rationBrain(): Response
    {
        return Inertia::render('Public/RationBrain');
    }

    public function survivalReport(): Response
    {
        return Inertia::render('Public/SurvivalReport');
    }

    public function about(): Response
    {
        return Inertia::render('Public/About');
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('Public/PrivacyPolicy');
    }

    public function terms(): Response
    {
        return Inertia::render('Public/Terms');
    }
}
