<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogPost;

class UpdateSeoFieldsSeeder extends Seeder
{
    public function run(): void
    {
        $slug = 'pakistan-sovereign-cloud-ai-trade-ecosystem-2026';
        
        $post = BlogPost::where('slug', $slug)->first();
        if ($post) {
            $post->seo_title = 'Pakistan Sovereign Cloud & AI Trade Ecosystem (2026 Guide)';
            $post->seo_description = 'Discover how Pakistan\'s Sovereign Cloud and AI trade ecosystem aims to transform digital commerce, secure data, and boost exports.';
            $post->seo_keywords = 'Sovereign Cloud Pakistan, AI trade ecosystem, digital economy Pakistan, Pakistan exports 2026, Commerce Ministry Pakistan, data localization';
            $post->save();
            echo "Successfully updated SEO fields for: {$slug}\n";
        }
    }
}
