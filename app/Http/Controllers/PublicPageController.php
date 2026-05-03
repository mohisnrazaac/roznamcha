<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuildsPublicSeo;
use App\Models\BlogPost;
use App\Seo\SeoPageUrlGenerator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    use BuildsPublicSeo;

    public function __construct(
        private readonly SeoPageUrlGenerator $urlGenerator,
    ) {
    }

    public function home(): Response
    {
        $featuredGuideSlugs = [
            'ghar-ka-monthly-budget',
            'pakistani-family-monthly-expense-control',
            'pakistani-household-essential-expenses-2026',
        ];

        $featuredGuides = BlogPost::query()
            ->publiclyVisible()
            ->whereIn('slug', $featuredGuideSlugs)
            ->get()
            ->sortBy(fn (BlogPost $post) => array_search($post->slug, $featuredGuideSlugs, true))
            ->values()
            ->map(fn (BlogPost $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt ?: Str::limit(strip_tags($post->rendered_content), 160),
                'published_label' => optional($post->published_at)->format('M j, Y'),
                'url' => route('public.blog.show', ['slug' => $post->slug]),
            ])
            ->all();

        $seo = $this->publicSeo('home');

        return Inertia::render('Public/Home', [
            'featuredGuides' => $featuredGuides,
            'seo' => $seo,
            'jsonLd' => $this->publicWebPageSchema($seo),
        ]);
    }

    public function features(): Response
    {
        return $this->renderStaticPage('Public/Features', 'features');
    }

    public function kharchaMap(): Response
    {
        return $this->renderStaticPage('Public/KharchaMap', 'kharchaMap');
    }

    public function rationBrain(): Response
    {
        return $this->renderStaticPage('Public/RationBrain', 'rationBrain');
    }

    public function survivalReport(): Response
    {
        return $this->renderStaticPage('Public/SurvivalReport', 'survivalReport');
    }

    public function about(): Response
    {
        $url = $this->urlGenerator->routeUrl('public.about');
        $siteUrl = $this->urlGenerator->baseUrl();
        $publicContactEmail = (string) config('mail.public_contact_email', 'support@roznamcha.pk');
        $seo = [
            'title' => 'About Mohsin | Founder of Roznamcha.pk',
            'description' => 'Learn about Mohsin, Founder of Roznamcha.pk, a Software Architect building practical tools and content to help Pakistani households manage budgeting, expenses, and everyday financial pressure.',
            'url' => $url,
            'canonical' => $url,
            'type' => 'website',
        ];

        return Inertia::render('Public/About', [
            'contactEmail' => $publicContactEmail,
            'seo' => $seo,
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@type' => 'AboutPage',
                '@id' => "{$url}#webpage",
                'name' => 'About Mohsin',
                'url' => $url,
                'description' => $seo['description'],
                'inLanguage' => 'en',
                'mainEntity' => [
                    '@type' => 'Person',
                    'name' => 'Mohsin',
                    'description' => 'Founder of Roznamcha.pk and Software Architect with 16 years of experience.',
                    'jobTitle' => 'Software Architect',
                    'url' => $url,
                ],
                'about' => [
                    '@type' => 'Organization',
                    'name' => 'Roznamcha',
                    'email' => $publicContactEmail,
                    'url' => $siteUrl,
                ],
                'isPartOf' => [
                    '@id' => "{$siteUrl}#website",
                ],
            ],
        ]);
    }

    public function privacyPolicy(): Response
    {
        return $this->renderStaticPage('Public/PrivacyPolicy', 'privacy', [
            'contactEmail' => (string) config('mail.public_contact_email', 'support@roznamcha.pk'),
        ]);
    }

    public function terms(): Response
    {
        return $this->renderStaticPage('Public/Terms', 'terms', [
            'contactEmail' => (string) config('mail.public_contact_email', 'support@roznamcha.pk'),
        ]);
    }

    protected function renderStaticPage(string $component, string $pageKey, array $props = []): Response
    {
        $seo = $this->publicSeo($pageKey);

        return Inertia::render($component, array_merge([
            'seo' => $seo,
            'jsonLd' => $this->publicWebPageSchema($seo),
        ], $props));
    }
}
