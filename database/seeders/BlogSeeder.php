<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = BlogCategory::factory()
            ->count(2)
            ->sequence(
                ['name' => 'Inflation Watch'],
                ['name' => 'Household Tips']
            )
            ->create();

        $published = BlogPost::factory()->published()->create([
            'title' => 'How to stretch ration for 30 days',
        ]);
        $published->categories()->sync($categories->pluck('id'));

        BlogPost::factory()->draft()->create([
            'title' => 'Draft insights on school fees',
        ]);

        BlogPost::factory()->scheduled()->create([
            'title' => 'Upcoming mehngai forecast',
            'published_at' => now()->addDays(2),
        ]);
    }
}
