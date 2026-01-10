<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use App\Models\Household;
use App\Models\User;
use App\Models\UserSetting;
use App\Support\ActivationSession;
use App\Support\EventRecorder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function __construct(private EventRecorder $events)
    {
    }

    public function index(Request $request): RedirectResponse
    {
        return redirect()->route($this->nextStep($request->user()));
    }

    public function household(Request $request): Response
    {
        $user = $request->user();
        $household = $this->ensureHousehold($user);

        return Inertia::render('Onboarding/Household', [
            'householdName' => $household?->name,
            'progress' => $this->progress($user),
        ]);
    }

    public function storeHousehold(Request $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $household = $this->ensureHousehold($user, true);

        if ($household) {
            $household->name = $data['name'];

            if (empty($household->slug)) {
                $household->slug = Str::slug($data['name']) . '-' . Str::random(5);
            }

            $household->save();
        }

        $this->setSetting($user, 'onboarding.household_name', $data['name']);

        return redirect()->route('onboarding.index');
    }

    public function budget(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Onboarding/Budget', [
            'monthlyBudget' => $this->getSetting($user, 'onboarding.monthly_budget'),
            'progress' => $this->progress($user),
        ]);
    }

    public function storeBudget(Request $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'monthly_budget' => ['required', 'numeric', 'min:0'],
        ]);

        $this->setSetting($user, 'onboarding.monthly_budget', number_format((float) $data['monthly_budget'], 2, '.', ''));

        return redirect()->route('onboarding.index');
    }

    public function firstExpense(Request $request): Response
    {
        $user = $request->user();

        if ($request->filled('prefillCategory') || $request->filled('prefillAmount') || $request->filled('prefillNote')) {
            ActivationSession::storePrefill($request, [
                'category' => $request->query('prefillCategory'),
                'amount' => $request->query('prefillAmount'),
                'note' => $request->query('prefillNote'),
            ]);
        }

        $categories = Category::orderBy('name')->get(['id', 'name']);
        $prefill = ActivationSession::getPrefill($request);

        $prefillCategoryId = null;
        if (! empty($prefill['category'])) {
            $prefillCategoryId = $categories->firstWhere('name', $prefill['category'])?->id;
        }

        return Inertia::render('Onboarding/FirstExpense', [
            'categories' => $categories,
            'prefill' => [
                'category_id' => $prefillCategoryId,
                'category_name' => $prefill['category'] ?? null,
                'amount' => $prefill['amount'] ?? null,
                'note' => $prefill['note'] ?? null,
            ],
            'progress' => $this->progress($user),
            'defaultDate' => now()->toDateString(),
        ]);
    }

    public function storeFirstExpense(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $household = $this->ensureHousehold($user, true);

        $payload = [
            'user_id' => $user->id,
            'household_id' => $household?->id,
            'category_id' => $data['category_id'],
            'amount' => $data['amount'],
            'tx_date' => $data['date'],
            'note' => $data['note'] ?? 'Onboarding expense',
        ];

        if (Schema::hasColumn('expenses', 'date')) {
            $payload['date'] = $data['date'];
        }

        $expense = Expense::create($payload);

        $this->setSetting($user, 'onboarding.first_expense_id', (string) $expense->id);
        ActivationSession::forgetPrefill($request);

        $this->events->record('expense_added', [
            'expense_id' => $expense->id,
            'source' => 'onboarding',
        ], $user);

        return redirect()->route('onboarding.index');
    }

    public function done(Request $request): Response
    {
        $user = $request->user();
        $completedAt = $this->getSetting($user, 'onboarding.completed_at');

        if (! $completedAt) {
            $this->setSetting($user, 'onboarding.completed_at', now()->toDateTimeString());

            $this->events->record('onboarding_completed', [
                'source' => 'organic',
            ], $user);
        }

        $nextUrl = ActivationSession::hasCompletion($request)
            ? ActivationSession::pullCompletion($request)
            : '/dashboard';

        return Inertia::render('Onboarding/Done', [
            'nextUrl' => $nextUrl,
            'progress' => $this->progress($user),
        ]);
    }

    protected function nextStep(User $user): string
    {
        if (! $this->getSetting($user, 'onboarding.household_name')) {
            return 'onboarding.household';
        }

        if (! $this->getSetting($user, 'onboarding.monthly_budget')) {
            return 'onboarding.budget';
        }

        if (! $this->getSetting($user, 'onboarding.first_expense_id') && ! Expense::where('user_id', $user->id)->exists()) {
            return 'onboarding.first-expense';
        }

        return 'onboarding.done';
    }

    protected function ensureHousehold(User $user, bool $create = false): ?Household
    {
        $household = $user->households()->first();

        if (! $household && $create) {
            $household = Household::create([
                'name' => "{$user->name}'s Home",
                'slug' => Str::slug($user->name).'-'.Str::random(5),
                'owner_id' => $user->id,
            ]);

            $user->households()->attach($household->id, ['is_owner' => true]);
        }

        return $household;
    }

    protected function setSetting(User $user, string $key, string $value): void
    {
        UserSetting::updateOrCreate(
            ['user_id' => $user->id, 'key' => $key],
            ['value' => $value]
        );
    }

    protected function getSetting(User $user, string $key): ?string
    {
        return UserSetting::query()
            ->where('user_id', $user->id)
            ->where('key', $key)
            ->value('value');
    }

    protected function progress(User $user): array
    {
        return [
            'household' => (bool) $this->getSetting($user, 'onboarding.household_name'),
            'budget' => (bool) $this->getSetting($user, 'onboarding.monthly_budget'),
            'expense' => (bool) $this->getSetting($user, 'onboarding.first_expense_id')
                || Expense::where('user_id', $user->id)->exists(),
        ];
    }
}
