<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\DailyReturnSnapshot;
use App\Models\SeoPageSnapshot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ModuleHealthRegressionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed basic slab rates so electricity calculations work
        DB::table('slab_rates')->insert([
            ['min_units' => 1, 'max_units' => 100, 'rate_per_unit' => 10.0, 'category' => 'protected', 'created_at' => now(), 'updated_at' => now()],
            ['min_units' => 101, 'max_units' => 200, 'rate_per_unit' => 14.0, 'category' => 'protected', 'created_at' => now(), 'updated_at' => now()],
            ['min_units' => 1, 'max_units' => 100, 'rate_per_unit' => 16.5, 'category' => 'unprotected', 'created_at' => now(), 'updated_at' => now()],
            ['min_units' => 101, 'max_units' => 200, 'rate_per_unit' => 22.0, 'category' => 'unprotected', 'created_at' => now(), 'updated_at' => now()],
            ['min_units' => 201, 'max_units' => 300, 'rate_per_unit' => 28.0, 'category' => 'unprotected', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * MODULE 1: Public Tools & Utility Calculators
     */
    public function test_module_public_tools_render_without_error(): void
    {
        $toolRoutes = [
            '/tools/electricity-bill-estimator' => 'Public/Tools/ElectricityBillEstimator',
            '/tools/monthly-household-budget-calculator' => 'Public/Tools/MonthlyHouseholdBudgetCalculator',
            '/tools/school-fees-planner' => 'Public/Tools/SchoolFeesPlanner',
            '/tools/ration-cost-estimator' => 'Public/Tools/RationCostEstimator',
        ];

        foreach ($toolRoutes as $route => $component) {
            $response = $this->get($route);
            $response->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page->component($component));
        }
    }

    /**
     * MODULE 1 (API): Tool Calculation Endpoints
     */
    public function test_module_tool_calculation_endpoints_return_200(): void
    {
        // 1. Electricity Bill Calculation
        $this->postJson('/tools/electricity-bill-estimator/calculate', [
            'units_used' => 204,
            'user_category' => 'unprotected',
        ])->assertOk()->assertJsonStructure(['slab_cost', 'total_bill', 'last_year_estimate', 'difference']);

        // 2. Budget Calculator
        $this->postJson('/tools/monthly-household-budget-calculator/calculate', [
            'monthly_income' => 100000,
            'rent' => 25000,
            'ration' => 30000,
            'utilities' => 15000,
            'education' => 10000,
            'transport' => 5000,
            'misc' => 5000,
        ])->assertOk()->assertJsonStructure(['total_expenses', 'surplus_deficit', 'savings_rate']);

        // 3. School Fees Planner
        $this->postJson('/tools/school-fees-planner/calculate', [
            'children_count' => 2,
            'monthly_tuition_per_child' => 12000,
            'annual_charges' => 20000,
            'exam_fee' => 3000,
            'exam_frequency' => 2,
            'inflation_buffer_percentage' => 10,
        ])->assertOk()->assertJsonStructure(['monthly_outflow', 'amortized_monthly', 'real_monthly_cost']);
    }

    /**
     * MODULE 2: Programmatic SEO Landing Pages (DISCO, Petrol, Ration)
     */
    public function test_module_programmatic_seo_pages_render_without_error(): void
    {
        // Multi-DISCO pages
        $discos = ['lesco', 'mepco', 'iesco', 'gepco', 'hesco', 'pesco'];
        foreach ($discos as $disco) {
            $response = $this->get("/electricity-bill-calculator-{$disco}");
            $response->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page
                    ->component('SEO/Electricity')
                    ->where('pageKey', $disco)
                );
        }

        // Petrol and Ration pages (tested in test mode)
        $this->get('/petrol-price-karachi-today')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('SEO/Petrol'));

        $this->get('/ration-cost-for-4-people-pakistan')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('SEO/Ration'));
    }

    /**
     * MODULE 3: Core Public Marketing & Information Pages
     */
    public function test_module_public_marketing_pages_render_without_error(): void
    {
        $publicPages = [
            '/' => 'Public/Home',
            '/about' => 'Public/About',
            '/contact' => 'Public/Contact',
            '/features' => 'Public/Features',
            '/features/monthly-expense-tracker-pakistan' => 'Public/ExpenseTrackerPakistan',
            '/survival-report' => 'Public/SurvivalReport',
            '/kharcha-map' => 'Public/KharchaMap',
            '/ration-brain' => 'Public/RationBrain',
            '/terms' => 'Public/Terms',
            '/privacy-policy' => 'Public/PrivacyPolicy',
            '/cookie-policy' => 'Public/CookiePolicy',
            '/disclaimer' => 'Public/Disclaimer',
        ];

        foreach ($publicPages as $url => $component) {
            $response = $this->get($url);
            $response->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page->component($component));
        }
    }

    /**
     * MODULE 4: Smart Budget Templates
     */
    public function test_module_templates_render_without_error(): void
    {
        $this->get('/templates')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Templates/Index'));

        $this->get('/templates/student-budget')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Templates/Show'));
    }

    /**
     * MODULE 5: Public Sitemaps and Feeds
     */
    public function test_module_sitemaps_and_feeds_render_without_error(): void
    {
        $this->get('/sitemap.xml')->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8');

        $this->get('/templates-sitemap.xml')->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8');

        $this->get('/blog/rss.xml')->assertOk()
            ->assertHeader('Content-Type', 'application/rss+xml; charset=UTF-8');
    }

    /**
     * MODULE 6: Authentication & Guest Entry Pages
     */
    public function test_module_auth_pages_render_without_error(): void
    {
        $authPages = [
            '/login' => 'Login',
            '/register' => 'Auth/Register',
            '/forgot-password' => 'Auth/ForgotPassword',
        ];

        foreach ($authPages as $url => $component) {
            $response = $this->get($url);
            $response->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page->component($component));
        }
    }

    /**
     * MODULE 7: Authenticated Dashboard & Panel Pages
     */
    public function test_module_authenticated_panel_renders_without_error(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)->get('/dashboard')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Admin/Dashboard'));

        $this->actingAs($user)->get('/panel/kharcha')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Kharcha/Index'));

        $this->actingAs($user)->get('/panel/ration')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Ration/Index'));

        $this->actingAs($user)->get('/panel/reminders')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Reminders/Index'));

        $this->actingAs($user)->get('/panel/categories')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->component('Categories/Index'));
    }

    /**
     * MODULE 8: 404 & Redirect Integrity
     */
    public function test_module_invalid_routes_properly_404_and_legacy_redirect(): void
    {
        // Invalid programmatic parameter returns 404
        $this->get('/electricity-bill-calculator-invalid_disco_xyz')->assertNotFound();

        // Old legacy calculator routes redirect properly with 301
        $this->get('/electricity-bill-estimator')->assertRedirect('/tools/electricity-bill-estimator');
        $this->get('/monthly-household-budget-calculator')->assertRedirect('/tools/monthly-household-budget-calculator');
        $this->get('/ration-cost-estimator')->assertRedirect('/tools/ration-cost-estimator');
    }
}
