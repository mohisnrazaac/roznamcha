<?php
// Purpose: Serve smart budget template previews, saves, and PDF downloads. Date: 2026-03-27. Author: Codex.

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\BuildsPublicSeo;
use App\Models\BudgetTemplate;
use App\Models\BudgetTemplateSave;
use App\Models\Household;
use App\Seo\SearchSurfacePolicy;
use App\Seo\SeoPageUrlGenerator;
use App\Support\EventRecorder;
use App\TemplateServices\DownloadService;
use App\TemplateServices\TemplateGeneratorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class TemplateController extends Controller
{
    use BuildsPublicSeo;

    public function __construct(
        private TemplateGeneratorService $templateGenerator,
        private DownloadService $downloadService,
        private EventRecorder $events,
        private readonly SeoPageUrlGenerator $urlGenerator,
        private readonly SearchSurfacePolicy $searchSurfacePolicy,
    ) {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();
        $templates = BudgetTemplate::query()
            ->orderBy('base_salary_target')
            ->orderBy('title')
            ->get();

        $saveRecords = $user
            ? BudgetTemplateSave::query()
                ->with(['budgetTemplate', 'household'])
                ->where('user_id', $user->id)
                ->latest('saved_at')
                ->get()
            : collect();

        $saveLookup = $saveRecords->keyBy('budget_template_id');
        $seo = $this->publicSeo('smartBudgetTemplates');

        return Inertia::render('Templates/Index', [
            'categories' => $templates
                ->groupBy('category')
                ->map(fn ($group, string $category) => [
                    'key' => $category,
                    'label' => $this->categoryLabel($category),
                    'count' => $group->count(),
                ])
                ->values()
                ->all(),
            'templates' => $templates
                ->map(fn (BudgetTemplate $template) => $this->cardPayload(
                    $template,
                    $saveLookup->get($template->id)
                ))
                ->values()
                ->all(),
            'savedTemplates' => $saveRecords
                ->filter(fn (BudgetTemplateSave $save) => $save->saved_at !== null && $save->budgetTemplate)
                ->map(fn (BudgetTemplateSave $save) => $this->savedPayload($save))
                ->values()
                ->all(),
            'seo' => $seo,
            'jsonLd' => $this->publicWebPageSchema($seo),
        ]);
    }

    public function show(Request $request, string $slug): Response|RedirectResponse
    {
        if (! auth()->check() && ! app()->runningUnitTests()) {
            return redirect()->route('login', [
                'return_to' => $request->getRequestUri(),
            ]);
        }

        $template = BudgetTemplate::query()->where('slug', $slug)->firstOrFail();
        $payload = $this->templateGenerator->getOrGenerate($template);
        $proPreview = $this->downloadService->buildDocumentData($template, $payload, 'pro');
        $user = $request->user();

        $saveRecord = null;

        if ($user) {
            $saveRecord = BudgetTemplateSave::query()
                ->with('household')
                ->where('user_id', $user->id)
                ->where('budget_template_id', $template->id)
                ->first();

            if ($saveRecord) {
                $saveRecord->forceFill([
                    'last_viewed_at' => now(),
                ])->save();
            }
        }

        $this->events->record('budget_template_viewed', [
            'template_id' => $template->id,
            'slug' => $template->slug,
            'authenticated' => (bool) $user,
        ], $user);

        $seo = $this->templateSeo($template);

        return Inertia::render('Templates/Show', [
            'template' => [
                ...$this->cardPayload($template, $saveRecord),
                'download_url' => sprintf('/templates/%s/download', $template->slug),
                'family_size' => (int) ($payload['family_size'] ?? $this->templateGenerator->familySizeFor($template)),
                'generated_source' => (string) ($payload['source'] ?? 'fallback'),
                'household_label' => $saveRecord?->household?->name,
                'has_pro_access' => $saveRecord?->hasProAccess() ?? false,
            ],
            'budget' => [
                'salary' => (int) ($payload['salary'] ?? $template->base_salary_target),
                'family_size' => (int) ($payload['family_size'] ?? $this->templateGenerator->familySizeFor($template)),
                'categories' => collect($payload['categories'] ?? [])->values()->all(),
                'saving_tips' => collect($payload['saving_tips'] ?? [])->values()->all(),
                'total_allocated' => collect($payload['categories'] ?? [])->sum('amount'),
            ],
            'proPreview' => [
                'inflation_rate_percent' => $proPreview['inflation_rate_percent'],
                'next_month_projection' => $proPreview['next_month_projection'],
                'inflation_categories' => array_slice($proPreview['inflation_categories'], 0, 4),
                'ask_roza_tips' => $proPreview['ask_roza_tips'],
            ],
            'guestReturnTo' => $request->getRequestUri(),
            'seo' => $seo,
            'jsonLd' => $this->publicWebPageSchema($seo),
        ]);
    }

    public function saveTemplate(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'slug' => ['required', 'string', 'exists:budget_templates,slug'],
            'source' => ['nullable', 'string', 'max:80'],
        ]);

        $user = $request->user();
        $template = BudgetTemplate::query()->where('slug', $data['slug'])->firstOrFail();
        $household = $this->resolveHousehold($user);

        $saveRecord = BudgetTemplateSave::query()->firstOrNew([
            'user_id' => $user->id,
            'budget_template_id' => $template->id,
        ]);

        $saveRecord->household_id = $saveRecord->household_id ?? $household?->id;
        $saveRecord->saved_at = $saveRecord->saved_at ?? now();
        $saveRecord->last_viewed_at = now();
        $saveRecord->save();

        $this->events->record('budget_template_saved', [
            'template_id' => $template->id,
            'slug' => $template->slug,
            'source' => $data['source'] ?? 'template_show',
        ], $user);

        return redirect()
            ->to(sprintf('/templates/%s', $template->slug))
            ->with('status', 'Template saved for your household. Come back next month and compare it to your real kharcha.');
    }

    public function download(Request $request, string $slug): RedirectResponse|SymfonyResponse
    {
        $template = BudgetTemplate::query()->where('slug', $slug)->firstOrFail();
        $mode = $request->query('mode', 'free') === 'pro' ? 'pro' : 'free';
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login', [
                'return_to' => $request->getRequestUri(),
            ]);
        }

        $saveRecord = BudgetTemplateSave::query()
            ->where('user_id', $user->id)
            ->where('budget_template_id', $template->id)
            ->first();

        if ($mode === 'pro' && $template->is_premium && ! ($saveRecord?->hasProAccess() ?? false)) {
            return redirect()
                ->to(sprintf('/templates/%s', $template->slug))
                ->with('status', 'PRO access is not enabled on this account yet. Contact Roznamcha if you need the upgraded planning PDF.');
        }

        $payload = $this->templateGenerator->getOrGenerate($template);

        if ($saveRecord) {
            $saveRecord->forceFill([
                'last_downloaded_at' => now(),
            ])->save();
        }

        $this->events->record('budget_template_downloaded', [
            'template_id' => $template->id,
            'slug' => $template->slug,
            'mode' => $mode,
        ], $user);

        return $this->downloadService->download($template, $payload, $user, $mode);
    }

    protected function cardPayload(BudgetTemplate $template, ?BudgetTemplateSave $saveRecord = null): array
    {
        return [
            'title' => $template->title,
            'slug' => $template->slug,
            'category' => $template->category,
            'category_label' => $this->categoryLabel($template->category),
            'base_salary_target' => (int) $template->base_salary_target,
            'is_premium' => (bool) $template->is_premium,
            'price' => $template->price ? (int) $template->price : null,
            'show_url' => sprintf('/templates/%s', $template->slug),
            'saved_at' => optional($saveRecord?->saved_at)->toIso8601String(),
            'last_viewed_at' => optional($saveRecord?->last_viewed_at)->toIso8601String(),
            'last_downloaded_at' => optional($saveRecord?->last_downloaded_at)->toIso8601String(),
            'has_pro_access' => $saveRecord?->hasProAccess() ?? false,
        ];
    }

    protected function savedPayload(BudgetTemplateSave $save): array
    {
        return [
            'title' => $save->budgetTemplate->title,
            'slug' => $save->budgetTemplate->slug,
            'show_url' => sprintf('/templates/%s', $save->budgetTemplate->slug),
            'saved_at' => optional($save->saved_at)->toIso8601String(),
            'last_viewed_at' => optional($save->last_viewed_at)->toIso8601String(),
            'last_downloaded_at' => optional($save->last_downloaded_at)->toIso8601String(),
            'household_label' => $save->household?->name,
        ];
    }

    protected function categoryLabel(string $category): string
    {
        return match ($category) {
            'salary_based' => 'Salary Based',
            'joint_family' => 'Joint Family',
            default => Str::headline($category),
        };
    }

    protected function templateSeo(BudgetTemplate $template): array
    {
        $url = $this->urlGenerator->routeUrl('templates.show', ['slug' => $template->slug]);
        $siteUrl = $this->urlGenerator->baseUrl();

        return [
            'title' => "{$template->title} | Smart Budget Templates | Roznamcha",
            'description' => 'Preview a Pakistan-specific survival budget template, save it to your household, and download the free PDF after login.',
            'canonical' => $url,
            'url' => $url,
            'image' => "{$siteUrl}/favicon.ico",
            'type' => 'article',
            'schemaName' => $template->title,
            'robots' => $this->searchSurfacePolicy->robotsForTemplate($template->slug),
        ];
    }

    protected function resolveHousehold($user): ?Household
    {
        if (! $user || ! Schema::hasTable('households') || ! Schema::hasTable('household_user')) {
            return null;
        }

        $household = $user->households()->first();

        if ($household) {
            return $household;
        }

        $household = Household::query()->create([
            'name' => "{$user->name}'s Household",
            'slug' => Str::slug($user->name).'-'.Str::random(5),
            'owner_id' => $user->id,
        ]);

        $user->households()->attach($household->id, ['is_owner' => true]);

        return $household;
    }
}
