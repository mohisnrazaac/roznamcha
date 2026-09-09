<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\BlogPost;
use App\Services\AiService;
use Illuminate\Support\Str;

class RewriteThinContentCommand extends Command
{
    protected $signature = 'blog:rewrite-thin {limit=5}';
    protected $description = 'Rewrite thin content blog posts using AI';

    public function handle(AiService $aiService)
    {
        $posts = BlogPost::where('status', 'draft')
            ->where(function($q) {
                $q->whereNull('content')->orWhere('content', '!=', '');
            })
            ->limit($this->argument('limit'))
            ->get();

        $this->info("Found {$posts->count()} posts to rewrite.");

        foreach ($posts as $post) {
            $wordCount = str_word_count(strip_tags($post->content ?? ''));
            if ($wordCount >= 1000) {
                $this->info("Skipping {$post->slug} (already {$wordCount} words)");
                continue;
            }

            $this->info("Rewriting: {$post->slug} (Currently {$wordCount} words)");

            $prompt = "You are an expert Pakistani financial copywriter. I have a blog post about '{$post->title}'. 
The original content is very short: '" . Str::limit(strip_tags($post->content), 300) . "'.
Please write a comprehensive, 1200+ word SEO-optimized article on this topic.
Include practical advice, real-world Pakistani context (like utility bills, inflation, local markets), and use proper HTML headings (<h2>, <h3>) and bullet points.
Output valid JSON with a single key 'content' containing the raw HTML string.";

            $response = $aiService->sendPrompt($prompt, 1, 'blog_rewrite');
            
            if ($response['error']) {
                $this->error("AI Error for {$post->slug}: {$response['error']}");
                continue;
            }

            $decoded = $response['decoded'];
            if (isset($decoded['content']) && strlen($decoded['content']) > 1000) {
                $post->content = $decoded['content'];
                $post->status = 'published';
                $post->save();
                $this->info("Success! Expanded {$post->slug} to " . str_word_count(strip_tags($post->content)) . " words.");
            } else {
                $this->error("Failed to extract valid content for {$post->slug}.");
            }
        }
        
        if (method_exists(BlogPost::class, 'forgetPublicSitemapCache')) {
            BlogPost::forgetPublicSitemapCache();
        }
        
        $this->info("Done processing batch.");
    }
}
