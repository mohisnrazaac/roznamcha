<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganicActivationTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_view_records_event(): void
    {
        $post = BlogPost::factory()->published()->create();

        $this->get(route('public.blog.show', $post->slug))->assertOk();

        $this->assertDatabaseHas('events', [
            'name' => 'blog_view',
            'meta->post_id' => $post->id,
        ]);
    }

    public function test_blog_cta_click_records_event(): void
    {
        $post = BlogPost::factory()->published()->create();

        $response = $this->postJson(route('events.blog-cta-click'), [
            'post_id' => $post->id,
            'slug' => $post->slug,
            'return_to' => "/blog/{$post->slug}",
            'prefill' => [
                'category' => 'School',
            ],
        ]);

        $response->assertOk()->assertJsonStructure(['redirect']);

        $this->assertDatabaseHas('events', [
            'name' => 'blog_cta_click',
            'meta->post_id' => $post->id,
        ]);
    }

    public function test_onboarding_flow_records_completion_and_expense_added(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $this->actingAs($user);

        $this->post(route('onboarding.household.store'), [
            'name' => 'Ali Household',
        ])->assertRedirect(route('onboarding.index'));

        $this->post(route('onboarding.budget.store'), [
            'monthly_budget' => 50000,
        ])->assertRedirect(route('onboarding.index'));

        $date = now()->toDateString();

        $this->post(route('onboarding.first-expense.store'), [
            'category_id' => $category->id,
            'amount' => 1200,
            'date' => $date,
            'note' => 'School fee',
        ])->assertRedirect(route('onboarding.index'));

        $this->get(route('onboarding.done'))->assertOk();

        $this->assertDatabaseHas('expenses', [
            'user_id' => $user->id,
            'category_id' => $category->id,
            'amount' => 1200,
        ]);

        $this->assertDatabaseHas('events', [
            'name' => 'expense_added',
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseHas('events', [
            'name' => 'onboarding_completed',
            'user_id' => $user->id,
        ]);
    }
}
