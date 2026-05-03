<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class HomePageFlagshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_surfaces_curated_guides_and_keeps_programmatic_groups_out_of_the_payload(): void
    {
        BlogPost::factory()->published()->create([
            'title' => 'Ghar Ka Monthly Budget',
            'slug' => 'ghar-ka-monthly-budget',
            'excerpt' => 'Practical household budget guide.',
            'content' => 'Guide body',
            'content_format' => 'markdown',
        ]);

        BlogPost::factory()->published()->create([
            'title' => 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity',
            'slug' => 'pakistani-family-monthly-expense-control',
            'excerpt' => 'Expense control guide.',
            'content' => 'Guide body',
            'content_format' => 'markdown',
        ]);

        BlogPost::factory()->published()->create([
            'title' => 'What Pakistani Families Really Spend on Food, Electricity, Gas and Rent in 2026',
            'slug' => 'pakistani-household-essential-expenses-2026',
            'excerpt' => 'Essential spending guide.',
            'content' => 'Guide body',
            'content_format' => 'markdown',
        ]);

        BlogPost::factory()->published()->create([
            'title' => 'Thin Off-Core Post',
            'slug' => 'roznamcha-with-ai',
            'excerpt' => 'Weak post.',
            'content' => 'Body',
            'content_format' => 'markdown',
        ]);

        $response = $this->get(route('public.home'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Public/Home')
            ->missing('latestPosts')
            ->missing('showAiBanner')
            ->missing('youtubeDemoUrl')
            ->has('featuredGuides', 3)
            ->where('featuredGuides.0.slug', 'ghar-ka-monthly-budget')
            ->where('featuredGuides.0.url', route('public.blog.show', ['slug' => 'ghar-ka-monthly-budget']))
            ->where('featuredGuides.1.slug', 'pakistani-family-monthly-expense-control')
            ->where('featuredGuides.1.url', route('public.blog.show', ['slug' => 'pakistani-family-monthly-expense-control']))
            ->where('featuredGuides.2.slug', 'pakistani-household-essential-expenses-2026')
            ->where('featuredGuides.2.url', route('public.blog.show', ['slug' => 'pakistani-household-essential-expenses-2026']))
        );
    }
}
