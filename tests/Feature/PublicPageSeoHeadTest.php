<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\BudgetTemplate;
use App\Models\SeoPageSnapshot;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PublicPageSeoHeadTest extends TestCase
{
    use RefreshDatabase;

    public function testAboutPageRendersSeoTagsInRawHtml(): void
    {
        $response = $this->get(route('public.about'));

        $response->assertOk();
        $response->assertSee('<title inertia>About Mohsin | Founder of Roznamcha.pk</title>', false);
        $response->assertSee('meta name="description" content="Learn about Mohsin, Founder of Roznamcha.pk, a Software Architect building practical tools and content to help Pakistani households manage budgeting, expenses, and everyday financial pressure."', false);
        $response->assertSee('link rel="canonical" href="'.$this->publicRouteUrl('public.about').'" inertia="canonical"', false);
        $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
    }

    public function testContactPageRendersSeoTagsInRawHtml(): void
    {
        $response = $this->get(route('public.contact'));

        $response->assertOk();
        $response->assertSee('<title inertia>Contact Roznamcha.pk</title>', false);
        $response->assertSee('meta name="description" content="Contact Roznamcha.pk for support, feedback, corrections, and partnership inquiries related to household budgeting tools."', false);
        $response->assertSee('link rel="canonical" href="'.$this->publicRouteUrl('public.contact').'" inertia="canonical"', false);
        $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
    }

    public function test_about_and_contact_pages_share_the_same_public_contact_identity(): void
    {
        config()->set('mail.public_contact_email', 'support@roznamcha.pk');

        $pages = [
            ['route' => 'public.about', 'component' => 'Public/About'],
            ['route' => 'public.contact', 'component' => 'Public/Contact'],
            ['route' => 'public.privacy', 'component' => 'Public/PrivacyPolicy'],
            ['route' => 'public.terms', 'component' => 'Public/Terms'],
        ];

        foreach ($pages as $page) {
            $response = $this->get(route($page['route']));

            $response->assertOk()
                ->assertInertia(fn (AssertableInertia $inertia) => $inertia
                    ->component($page['component'])
                    ->where('contactEmail', 'support@roznamcha.pk')
                )
                ->assertSee('support@roznamcha.pk')
                ->assertDontSee('@gmail.com')
                ->assertDontSee('privacy@')
                ->assertDontSee('legal@');
        }
    }

    public function testBlogDetailPageRendersSeoTagsAndStructuredDataInRawHtml(): void
    {
        $post = BlogPost::factory()->published()->create([
            'title' => 'Best Monthly Budget for 50000 Salary in Pakistan',
            'slug' => 'best-monthly-budget-50000-salary-pakistan-2026',
            'seo_title' => 'Best Monthly Budget for 50000 Salary in Pakistan 2026',
            'seo_description' => 'A practical monthly budget plan for a 50000 salary in Pakistan with household expense guidance.',
            'content' => 'Budget article body',
            'content_format' => 'markdown',
        ]);

        $response = $this->get(route('public.blog.show', $post->slug));

        $response->assertOk();
        $response->assertSee('<title inertia>Best Monthly Budget for 50000 Salary in Pakistan 2026</title>', false);
        $response->assertSee('meta name="description" content="A practical monthly budget plan for a 50000 salary in Pakistan with household expense guidance."', false);
        $response->assertSee('link rel="canonical" href="'.$this->publicRouteUrl('public.blog.show', ['slug' => $post->slug]).'" inertia="canonical"', false);
        $response->assertSee('type="application/ld+json" inertia="page-jsonld"', false);
        $response->assertSee('"datePublished"', false);
        $response->assertSee('"dateModified"', false);
        $response->assertSee('"name":"Mohsin"', false);
        $response->assertSee('Founder of Roznamcha.pk', false);
        $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
    }

    public function testHomePageRendersSpecificServerVisibleSeoTags(): void
    {
        $response = $this->get(route('public.home'));

        $response->assertOk();
        $response->assertSee('<title inertia>Roznamcha – Pakistan’s Urdu-first household budget &amp; kharcha tracker</title>', false);
        $response->assertSee('meta name="description" content="Roznamcha helps Pakistani families track monthly expenses, compare ration costs, manage reminders, and understand real household budgets with practical local insights."', false);
        $response->assertSee('link rel="canonical" href="'.$this->publicBaseUrl().'" inertia="canonical"', false);
        $response->assertSee('type="application/ld+json" inertia="page-jsonld"', false);
        $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
    }

    public function testStaticPublicContentPagesRenderSpecificServerVisibleSeoTags(): void
    {
        $expectations = [
            [
                'requestUrl' => route('public.features'),
                'canonicalUrl' => $this->publicRouteUrl('public.features'),
                'title' => 'Roznamcha Features – Preview Kharcha Map, Ration Brain, and AI Insights',
                'description' => 'See the main Roznamcha modules before you register: Kharcha Map, Ration Brain, Survival Reports, Smart Budget Templates, Reminders, Daily Money Snapshot, and AI Insights.',
            ],
            [
                'requestUrl' => route('public.kharcha-map'),
                'canonicalUrl' => $this->publicRouteUrl('public.kharcha-map'),
                'title' => 'Kharcha Map – Visualize every rupee spent across Pakistan',
                'description' => 'Plot rent, utilities, transport, and ration spending to see where each rupee goes so Pakistani households can plug leaks quickly.',
            ],
            [
                'requestUrl' => route('public.ration-brain'),
                'canonicalUrl' => $this->publicRouteUrl('public.ration-brain'),
                'title' => 'Ration Brain – Smart grocery planning for volatile Pakistani markets',
                'description' => 'Plan atta, ghee, chawal, and sabzi costs with practical ration planning for Urdu-speaking Pakistani households.',
            ],
            [
                'requestUrl' => route('public.survival-report'),
                'canonicalUrl' => $this->publicRouteUrl('public.survival-report'),
                'title' => 'Survival Report Pakistan – Month-end spending summary and pressure view | Roznamcha',
                'description' => 'See how Roznamcha turns recorded monthly expenses into a clear total, daily average, category breakdown, and month-over-month pressure signal for Pakistani households.',
            ],
            [
                'requestUrl' => route('public.privacy'),
                'canonicalUrl' => $this->publicRouteUrl('public.privacy'),
                'title' => 'Privacy Policy – How Roznamcha protects Pakistani household data',
                'description' => 'Learn how we handle kharcha logs, ration records, and household data for Urdu-first budgeting tools.',
            ],
            [
                'requestUrl' => route('public.terms'),
                'canonicalUrl' => $this->publicRouteUrl('public.terms'),
                'title' => 'Terms of Service – Roznamcha household finance platform',
                'description' => 'Review the service terms governing paid plans, data usage, and compliance for Roznamcha users across Pakistan.',
            ],
            [
                'requestUrl' => route('public.features.expense-tracker-pakistan'),
                'canonicalUrl' => $this->publicRouteUrl('public.features.expense-tracker-pakistan'),
                'title' => 'Best Monthly Expense Tracker in Pakistan | Roznamcha',
                'description' => 'Track daily kharcha, ration costs, and utility bill slabs with the best monthly expense tracker designed specifically for Pakistani household budgets.',
            ],
        ];

        foreach ($expectations as $expectation) {
            $response = $this->get($expectation['requestUrl']);

            $response->assertOk();
            $response->assertSee("<title inertia>{$expectation['title']}</title>", false);
            $response->assertSee('meta name="description" content="'.$expectation['description'].'"', false);
            $response->assertSee('link rel="canonical" href="'.$expectation['canonicalUrl'].'" inertia="canonical"', false);
            $response->assertSee('type="application/ld+json" inertia="page-jsonld"', false);
            $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
        }
    }

    public function testBlogIndexRendersSpecificSeoTagsWithoutPageLevelSchema(): void
    {
        $response = $this->get(route('public.blog.index'));

        $response->assertOk();
        $response->assertSee('<title inertia>Roznamcha Blog – Daily tips on Pakistani budgets, kharcha, and ration planning</title>', false);
        $response->assertSee('meta name="description" content="Practical guides on household budgeting, ration planning, and month-end pressure for Pakistani families."', false);
        $response->assertSee('link rel="canonical" href="'.$this->publicRouteUrl('public.blog.index').'" inertia="canonical"', false);
        $response->assertDontSee('inertia="page-jsonld"', false);
        $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
    }

    public function testTemplatesIndexAndShowRenderSpecificSeoTags(): void
    {
        $template = BudgetTemplate::query()->create([
            'title' => 'SEO Test Salary Guide',
            'slug' => 'seo-test-salary-guide',
            'category' => 'salary_based',
            'base_salary_target' => 50000,
            'is_premium' => false,
            'template_json' => [
                'family_size' => 4,
                'categories' => [
                    ['category' => 'Ration', 'amount' => 15000],
                    ['category' => 'Rent', 'amount' => 18000],
                    ['category' => 'Transport', 'amount' => 5000],
                    ['category' => 'Utilities', 'amount' => 4000],
                ],
                'saving_tips' => ['Buy staples in bulk.'],
            ],
        ]);

        $indexResponse = $this->get(route('templates.index'));
        $indexResponse->assertOk();
        $indexResponse->assertSee('<title inertia>Smart Budget Templates Pakistan | Roznamcha</title>', false);
        $indexResponse->assertSee('meta name="description" content="Preview survival-first monthly budget templates for Pakistani households, then save them inside Roznamcha to revisit next month."', false);
        $indexResponse->assertSee('link rel="canonical" href="'.$this->publicRouteUrl('templates.index').'" inertia="canonical"', false);
        $indexResponse->assertSee('type="application/ld+json" inertia="page-jsonld"', false);

        $showResponse = $this->get(route('templates.show', ['slug' => $template->slug]));
        $showResponse->assertOk();
        $showResponse->assertSee('<title inertia>SEO Test Salary Guide | Smart Budget Templates | Roznamcha</title>', false);
        $showResponse->assertSee('meta name="description" content="Preview a Pakistan-specific survival budget template, save it to your household, and download the free PDF after login."', false);
        $showResponse->assertSee('link rel="canonical" href="'.$this->publicRouteUrl('templates.show', ['slug' => $template->slug]).'" inertia="canonical"', false);
        $showResponse->assertSee('type="application/ld+json" inertia="page-jsonld"', false);
    }

    public function testPublicToolsRenderSpecificSeoTagsInRawHtml(): void
    {
        $expectations = [
            [
                'requestUrl' => route('public.tools.ration-cost-estimator'),
                'canonicalUrl' => $this->publicRouteUrl('public.tools.ration-cost-estimator'),
                'title' => 'Ration Cost Estimator Pakistan – Monthly grocery budget calculator | Roznamcha',
                'description' => 'Estimate your monthly ration cost in Pakistan using base prices for atta, rice, oil, sugar, and daal before the next grocery run.',
                'expectsPageSchema' => true,
            ],
            [
                'requestUrl' => route('public.tools.school-fees-planner'),
                'canonicalUrl' => $this->publicRouteUrl('public.tools.school-fees-planner'),
                'title' => 'School Fees Planner Pakistan – Real monthly school cost calculator | Roznamcha',
                'description' => 'Calculate your monthly school fee burden in Pakistan by including tuition, annual charges, and exam fees with a planning margin for the next academic year.',
                'expectsPageSchema' => true,
            ],
            [
                'requestUrl' => route('public.tools.electricity-bill-estimator'),
                'canonicalUrl' => $this->publicRouteUrl('public.tools.electricity-bill-estimator'),
                'title' => 'Electricity Bill Estimator Pakistan – Progressive slab calculator | Roznamcha',
                'description' => 'Estimate your Pakistan electricity bill using progressive slab rates, GST, and surcharge placeholders, then compare against a last-year baseline.',
                'expectsPageSchema' => true,
            ],
        ];

        foreach ($expectations as $expectation) {
            $response = $this->get($expectation['requestUrl']);

            $response->assertOk();
            $response->assertSee("<title inertia>{$expectation['title']}</title>", false);
            $response->assertSee('meta name="description" content="'.$expectation['description'].'"', false);
            $response->assertSee('link rel="canonical" href="'.$expectation['canonicalUrl'].'" inertia="canonical"', false);
            if ($expectation['expectsPageSchema']) {
                $response->assertSee('type="application/ld+json" inertia="page-jsonld"', false);
            }
            $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
        }
    }

    public function testProgrammaticPagesRenderSpecificSeoTagsAndJsonLdInRawHtml(): void
    {
        $snapshot = SeoPageSnapshot::query()->create([
            'page_type' => 'petrol',
            'page_key' => 'karachi',
            'title' => 'Petrol price in Karachi today',
            'value_1' => 321.17,
            'value_2' => 321.17,
            'value_3' => 0.00,
            'summary_text' => 'Official Petroleum Division petrol pricing places Motor Spirit (MS) at PKR 321.17 per litre for Pakistan, which is the same notified rate households in Karachi can use as today\'s planning benchmark.',
            'comparison_text' => 'Official notified petrol price for Karachi is unchanged from the previous Petroleum Division update.',
            'effective_date' => '2026-03-28',
            'source_label' => 'Government of Pakistan - Petroleum Division',
            'extra_json' => [
                'has_verified_data' => true,
                'has_live_data' => true,
                'is_indexable' => true,
                'source_type' => 'official',
                'source_url' => 'https://petroleum.gov.pk/example-notice',
            ],
        ]);

        $snapshot->forceFill([
            'updated_at' => Carbon::parse('2026-03-29 09:00:00', 'Asia/Karachi'),
        ])->save();

        $expectations = [
            [
                'requestUrl' => route('seo.petrol', ['city' => 'karachi']),
                'canonicalUrl' => $this->publicRouteUrl('seo.petrol', ['city' => 'karachi']),
                'title' => 'Petrol Price in Karachi Today | Roznamcha Pakistan',
                'description' => 'Check the latest petrol price update for Karachi today with comparison insight and related city price pages on Roznamcha.',
                'jsonLdName' => 'Petrol Price in Karachi Today',
            ],
            [
                'requestUrl' => route('seo.electricity', ['disco' => 'lesco']),
                'canonicalUrl' => $this->publicRouteUrl('seo.electricity', ['disco' => 'lesco']),
                'title' => 'Electricity Bill Calculator for LESCO | Roznamcha',
                'description' => 'Estimate your LESCO electricity bill using Roznamcha monthly usage examples and comparison context.',
                'jsonLdName' => 'Electricity Bill Calculator for LESCO',
            ],
            [
                'requestUrl' => route('seo.ration', ['size' => 4]),
                'canonicalUrl' => $this->publicRouteUrl('seo.ration', ['size' => 4]),
                'title' => 'Ration Cost for 4 People in Pakistan | Roznamcha',
                'description' => 'See the estimated monthly ration cost for a 4-person family in Pakistan with practical budgeting guidance on Roznamcha.',
                'jsonLdName' => 'Ration Cost for 4 People in Pakistan',
            ],
        ];

        foreach ($expectations as $expectation) {
            $response = $this->get($expectation['requestUrl']);

            $response->assertOk();
            $response->assertSee("<title inertia>{$expectation['title']}</title>", false);
            $response->assertSee('meta name="description" content="'.$expectation['description'].'"', false);
            $response->assertSee('meta name="robots" content="noindex,follow"', false);
            $response->assertSee('link rel="canonical" href="'.$expectation['canonicalUrl'].'" inertia="canonical"', false);
            $response->assertSee('type="application/ld+json" inertia="page-jsonld"', false);
            $response->assertSee('"name":"'.$expectation['jsonLdName'].'"', false);
            $response->assertSee('"url":"'.$expectation['canonicalUrl'].'"', false);
            $this->assertSame(1, substr_count($response->getContent(), 'rel="canonical"'));
        }
    }

    public function testBlogDetailFallsBackToSlugAndExcerptWhenStoredMetadataLooksPlaceholder(): void
    {
        $post = BlogPost::factory()->published()->create([
            'title' => 'Est et voluptatibus quo sunt.',
            'slug' => 'upcoming-mehngai-forecast',
            'seo_title' => null,
            'seo_description' => null,
            'excerpt' => 'Preview the upcoming mehngai forecast for Pakistani households dealing with utility, ration, and transport pressure.',
            'content' => 'Forecast article body',
            'content_format' => 'markdown',
        ]);

        $response = $this->get(route('public.blog.show', ['slug' => $post->slug]));

        $response->assertOk();
        $response->assertSee('<title inertia>Upcoming Mehngai Forecast | Roznamcha Blog</title>', false);
        $response->assertSee('meta name="description" content="Preview the upcoming mehngai forecast for Pakistani households dealing with utility, ration, and transport pressure."', false);
        $response->assertSee('"headline":"Upcoming Mehngai Forecast"', false);
    }

    public function testBlogDetailFallsBackFromTitleAsDescriptionToCleanerExcerpt(): void
    {
        $post = BlogPost::factory()->published()->create([
            'title' => 'SEO & Sharing',
            'slug' => 'seo-sharing-metadata',
            'seo_title' => null,
            'seo_description' => "SEO & Sharing\r\nSEO & Sharing\r\nSEO & Sharing",
            'excerpt' => 'Learn how SEO sharing metadata should be cleaned up for Roznamcha blog posts without duplicating the article title in the description tag.',
            'content' => 'Sharing article body',
            'content_format' => 'markdown',
        ]);

        $response = $this->get(route('public.blog.show', ['slug' => $post->slug]));

        $response->assertOk();
        $response->assertSee('<title inertia>SEO &amp; Sharing | Roznamcha Blog</title>', false);
        $response->assertSee('meta name="description" content="Learn how SEO sharing metadata should be cleaned up for Roznamcha blog posts without duplicating the article title in the description tag."', false);
        $response->assertDontSee('content="SEO &amp; Sharing&#13;', false);
    }

    public function testRepresentativePublicPagesShareTheSameCanonicalHostSource(): void
    {
        $post = BlogPost::factory()->published()->create([
            'slug' => 'canonical-host-check-post',
            'content' => 'Canonical host check body',
            'content_format' => 'markdown',
        ]);

        $template = BudgetTemplate::query()->create([
            'title' => 'Canonical Host Template',
            'slug' => 'canonical-host-template',
            'category' => 'salary_based',
            'base_salary_target' => 50000,
            'is_premium' => false,
            'template_json' => [
                'family_size' => 4,
                'categories' => [
                    ['category' => 'Ration', 'amount' => 15000],
                ],
                'saving_tips' => ['Tip'],
            ],
        ]);

        $samples = [
            route('public.home'),
            route('public.features'),
            route('public.blog.show', ['slug' => $post->slug]),
            route('templates.show', ['slug' => $template->slug]),
            route('public.tools.ration-cost-estimator'),
            route('seo.petrol', ['city' => 'karachi']),
        ];

        foreach ($samples as $sample) {
            $response = $this->get($sample);

            $response->assertOk();
            $this->assertStringContainsString(
                'link rel="canonical" href="'.$this->publicBaseUrl(),
                $response->getContent()
            );
        }
    }

    private function publicBaseUrl(): string
    {
        return rtrim((string) config('roznamcha_seo.base_url'), '/');
    }

    private function publicRouteUrl(string $routeName, array|string $parameters = []): string
    {
        return $this->publicBaseUrl().route($routeName, $parameters, false);
    }
}
