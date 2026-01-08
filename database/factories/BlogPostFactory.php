<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogPost>
 */
class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        $status = $this->faker->randomElement(['draft', 'published', 'scheduled']);
        $publishedAt = $status === 'draft'
            ? null
            : $this->faker->dateTimeBetween('-10 days', '+5 days');

        return [
            'title' => $title,
            'excerpt' => $this->faker->paragraph(),
            'content' => implode("\n\n", $this->faker->paragraphs(5)),
            'content_format' => 'markdown',
            'status' => $status,
            'published_at' => $publishedAt,
            'seo_title' => $title,
            'seo_description' => $this->faker->sentence(12),
            'seo_keywords' => implode(', ', $this->faker->words(5)),
            'language' => $this->faker->randomElement(['ur', 'en']),
        ];
    }

    public function draft(): self
    {
        return $this->state(fn () => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function published(): self
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);
    }

    public function scheduled(): self
    {
        return $this->state(fn () => [
            'status' => 'scheduled',
            'published_at' => now()->addDay(),
        ]);
    }
}
