<?php
// Purpose: Verify smart budget template browsing, saving, generation, and downloads. Date: 2026-03-27. Author: Codex.

namespace Tests\Feature;

use App\Models\BudgetTemplate;
use App\Models\BudgetTemplateSave;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SmartBudgetTemplatesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_template_index_loads_for_guests(): void
    {
        $this->get('/templates')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Templates/Index')
                ->has('templates', 4)
                ->has('categories')
            );
    }

    public function test_template_robots_file_advertises_template_sitemap(): void
    {
        $this->assertFileExists(public_path('robots.txt'));
        $this->assertStringContainsString(
            'Sitemap: https://roznamcha.pk/templates-sitemap.xml',
            (string) file_get_contents(public_path('robots.txt'))
        );
    }

    public function test_template_show_generates_and_persists_json_when_missing(): void
    {
        $template = BudgetTemplate::query()->where('slug', '50k-salary-survival-guide')->firstOrFail();

        $this->assertNull($template->template_json);

        $this->get("/templates/{$template->slug}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Templates/Show')
                ->where('template.slug', $template->slug)
            );

        $template->refresh();

        $this->assertIsArray($template->template_json);
        $this->assertNotEmpty($template->template_json['categories'] ?? []);
        $this->assertSame($template->base_salary_target, $template->template_json['salary'] ?? null);
    }

    public function test_student_template_replaces_negative_school_fee_output_with_safe_fallback(): void
    {
        $template = BudgetTemplate::query()->where('slug', 'student-budget')->firstOrFail();

        $template->forceFill([
            'template_json' => [
                'salary' => 25000,
                'family_size' => 1,
                'source' => 'ai',
                'generated_at' => now()->toIso8601String(),
                'categories' => [
                    ['category' => 'Atta', 'amount' => 5400, 'percentage' => 21.43],
                    ['category' => 'Ghee', 'amount' => 3600, 'percentage' => 14.29],
                    ['category' => 'Sugar', 'amount' => 1800, 'percentage' => 7.14],
                    ['category' => 'Electricity', 'amount' => 8900, 'percentage' => 35.71],
                    ['category' => 'Gas', 'amount' => 5400, 'percentage' => 21.43],
                    ['category' => 'School Fees', 'amount' => -100, 'percentage' => 0],
                ],
                'saving_tips' => ['Tip 1', 'Tip 2', 'Tip 3'],
            ],
        ])->save();

        $this->get("/templates/{$template->slug}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Templates/Show')
                ->where('budget.categories', function ($categories) {
                    $rows = collect($categories);

                    $this->assertNotEmpty($rows->all());
                    $this->assertFalse($rows->contains(fn (array $row) => ($row['amount'] ?? 0) < 0));
                    $this->assertFalse($rows->contains(fn (array $row) => str_contains(strtolower($row['category'] ?? ''), 'school')));

                    return true;
                })
            );

        $template->refresh();

        $this->assertSame('fallback', $template->template_json['source'] ?? null);
    }

    public function test_family_template_replaces_absurd_school_fee_share_with_safe_fallback(): void
    {
        $template = BudgetTemplate::query()->where('slug', '100k-family-budget')->firstOrFail();

        $template->forceFill([
            'template_json' => [
                'salary' => 100000,
                'family_size' => 5,
                'source' => 'ai',
                'generated_at' => now()->toIso8601String(),
                'categories' => [
                    ['category' => 'Atta', 'amount' => 10000, 'percentage' => 10],
                    ['category' => 'Ghee', 'amount' => 6000, 'percentage' => 6],
                    ['category' => 'Sugar', 'amount' => 4000, 'percentage' => 4],
                    ['category' => 'Electricity (Protected Slab Estimate)', 'amount' => 12000, 'percentage' => 12],
                    ['category' => 'Gas', 'amount' => 8000, 'percentage' => 8],
                    ['category' => 'School Fees', 'amount' => 60000, 'percentage' => 60],
                ],
                'saving_tips' => ['Tip 1', 'Tip 2', 'Tip 3'],
            ],
        ])->save();

        $this->get("/templates/{$template->slug}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Templates/Show')
                ->where('budget.categories', function ($categories) {
                    $schoolFeeRow = collect($categories)->first(fn (array $row) => str_contains(strtolower($row['category'] ?? ''), 'school'));

                    $this->assertNotNull($schoolFeeRow);
                    $this->assertLessThanOrEqual(25000, $schoolFeeRow['amount'] ?? 0);

                    return true;
                })
            );

        $template->refresh();

        $this->assertSame('fallback', $template->template_json['source'] ?? null);
    }

    public function test_authenticated_user_can_save_template(): void
    {
        $user = User::factory()->create();
        $template = BudgetTemplate::query()->where('slug', '50k-salary-survival-guide')->firstOrFail();

        $this->actingAs($user)
            ->post('/templates/save', [
                'slug' => $template->slug,
            ])
            ->assertRedirect("/templates/{$template->slug}");

        $save = BudgetTemplateSave::query()
            ->where('user_id', $user->id)
            ->where('budget_template_id', $template->id)
            ->first();

        $this->assertNotNull($save);
        $this->assertNotNull($save->saved_at);
    }

    public function test_guest_download_redirects_to_login_with_return_target(): void
    {
        $this->get('/templates/50k-salary-survival-guide/download')
            ->assertRedirect('/login?return_to=%2Ftemplates%2F50k-salary-survival-guide%2Fdownload');
    }

    public function test_authenticated_user_can_download_free_pdf(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/templates/50k-salary-survival-guide/download');

        $response->assertOk();
        $this->assertStringContainsString(
            'application/pdf',
            (string) $response->headers->get('content-type')
        );
    }

    public function test_pro_download_redirects_back_when_not_unlocked(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/templates/100k-family-budget/download?mode=pro')
            ->assertRedirect('/templates/100k-family-budget');
    }

    public function test_pro_download_works_after_manual_unlock(): void
    {
        $user = User::factory()->create();
        $template = BudgetTemplate::query()->where('slug', '100k-family-budget')->firstOrFail();

        BudgetTemplateSave::query()->create([
            'budget_template_id' => $template->id,
            'user_id' => $user->id,
            'saved_at' => now(),
            'pro_unlocked_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/templates/100k-family-budget/download?mode=pro');

        $response->assertOk();
        $this->assertStringContainsString(
            'application/pdf',
            (string) $response->headers->get('content-type')
        );
    }

    public function test_template_sitemap_lists_template_index_and_template_detail_pages(): void
    {
        $response = $this->get('/templates-sitemap.xml');

        $response->assertOk();
        $response->assertSee(route('templates.index', [], true), false);

        foreach (BudgetTemplate::query()->pluck('slug') as $slug) {
            $response->assertSee(route('templates.show', ['slug' => $slug], true), false);
        }
    }
}
