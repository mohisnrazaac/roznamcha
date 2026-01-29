<?php

// Purpose: Enforce multi-tenant scoping for kharcha records. Date: 2026-02-22. Author: Codex.

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use App\Models\Household;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var Household|null $household */
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;
        $filters = $request->only(['category', 'from', 'to']);
        $user = $request->user();

        $dateColumn = $this->dateColumn();
        $noteColumn = $this->noteColumn();
        $requestedUser = $user->isAdmin() ? $request->integer('user_id') : null;

        $expensesQuery = Expense::query()
            ->with(['category', 'user'])
            ->forHousehold($household)
            ->when(! $user->isAdmin(), fn ($query) => $query->where('user_id', $user->id))
            ->when($user->isAdmin() && $requestedUser, fn ($query) => $query->where('user_id', $requestedUser));

        if ($filters['category'] ?? null) {
            $expensesQuery->where('category_id', $filters['category']);
        }

        if ($filters['from'] ?? null) {
            $expensesQuery->whereDate($dateColumn, '>=', $filters['from']);
        }

        if ($filters['to'] ?? null) {
            $expensesQuery->whereDate($dateColumn, '<=', $filters['to']);
        }

        $expenses = $expensesQuery
            ->orderByDesc($dateColumn)
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Expense $expense) => [
                'id' => $expense->id,
                'amount' => (float) $expense->amount,
                'tx_date' => optional($expense->{$dateColumn})->toDateString(),
                'note' => $expense->{$noteColumn} ?? null,
                'category_id' => $expense->category_id,
                'category' => $expense->category ? [
                    'id' => $expense->category->id,
                    'name' => $expense->category->name,
                ] : null,
                'owner' => $expense->user ? [
                    'id' => $expense->user->id,
                    'name' => $expense->user->name,
                    'email' => $expense->user->email,
                ] : null,
            ]);

        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $totalsQueryBase = Expense::query()
            ->forHousehold($household)
            ->when(! $user->isAdmin(), fn ($query) => $query->where('user_id', $user->id))
            ->when($user->isAdmin() && $requestedUser, fn ($query) => $query->where('user_id', $requestedUser));

        $totals = [
            'month' => (clone $totalsQueryBase)
                ->whereBetween($dateColumn, [$monthStart->toDateString(), $now->toDateString()])
                ->sum('amount'),
            'today' => (clone $totalsQueryBase)
                ->whereDate($dateColumn, $now->toDateString())
                ->sum('amount'),
        ];

        $totals['average_daily'] = $monthStart->daysInMonth
            ? round($totals['month'] / $monthStart->daysInMonth, 2)
            : 0;

        return Inertia::render('Kharcha/Index', [
            'expenses' => $expenses,
            'categories' => $this->categoryOptions($user, ['id', 'name', 'color']),
            'filters' => [
                ...$filters,
                'user_id' => $requestedUser,
            ],
            'totals' => $totals,
            'users' => $user->isAdmin()
                ? User::orderBy('name')->get(['id', 'name', 'email'])
                : [],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Kharcha/Create', [
            'categories' => $this->categoryOptions($request->user(), ['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'tx_date' => ['required', 'date', 'before_or_equal:today'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;
        $dateColumn = $this->dateColumn();
        $noteColumn = $this->noteColumn();
        $householdColumn = $this->householdColumn();

        $payload = $validated;

        $payload[$dateColumn] = $payload['tx_date'];
        if ($dateColumn !== 'tx_date') {
            unset($payload['tx_date']);
        }

        if ($noteColumn) {
            $payload[$noteColumn] = $payload['note'] ?? null;
            if ($noteColumn !== 'note') {
                unset($payload['note']);
            }
        } else {
            unset($payload['note']);
        }

        $createPayload = [
            ...$payload,
            'user_id' => $request->user()->id,
        ];

        if ($householdColumn) {
            $createPayload[$householdColumn] = $household?->id;
        }

        Expense::create($createPayload);

        return redirect()->route('panel.kharcha.index')->with('success', 'Expense recorded.');
    }

    public function edit(Expense $expense): Response
    {
        $this->assertExpenseOwner(request(), $expense);
        $this->authorize('update', $expense);

        return Inertia::render('Kharcha/Edit', [
            'expense' => [
                'id' => $expense->id,
                'amount' => (float) $expense->amount,
                'tx_date' => optional($expense->{$this->dateColumn()})->toDateString(),
                'category_id' => $expense->category_id,
                'note' => $expense->{$this->noteColumn()} ?? null,
            ],
            'categories' => $this->categoryOptions(request()->user(), ['id', 'name']),
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $this->assertExpenseOwner($request, $expense);
        $this->authorize('update', $expense);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'tx_date' => ['required', 'date', 'before_or_equal:today'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);
        $dateColumn = $this->dateColumn();
        $noteColumn = $this->noteColumn();

        $payload = $validated;

        $payload[$dateColumn] = $payload['tx_date'];
        if ($dateColumn !== 'tx_date') {
            unset($payload['tx_date']);
        }

        if ($noteColumn) {
            $payload[$noteColumn] = $payload['note'] ?? null;
            if ($noteColumn !== 'note') {
                unset($payload['note']);
            }
        } else {
            unset($payload['note']);
        }

        $expense->update($payload);

        return redirect()->route('panel.kharcha.index')->with('success', 'Expense updated.');
    }

    public function destroy(Expense $expense)
    {
        $this->assertExpenseOwner(request(), $expense);
        $this->authorize('delete', $expense);
        $expense->delete();

        return redirect()->route('panel.kharcha.index')->with('success', 'Expense removed.');
    }

    private function dateColumn(): string
    {
        return Schema::hasColumn('expenses', 'tx_date') ? 'tx_date' : (Schema::hasColumn('expenses', 'date') ? 'date' : 'tx_date');
    }

    private function noteColumn(): ?string
    {
        if (Schema::hasColumn('expenses', 'note')) {
            return 'note';
        }

        if (Schema::hasColumn('expenses', 'notes')) {
            return 'notes';
        }

        if (Schema::hasColumn('expenses', 'description')) {
            return 'description';
        }

        return null;
    }

    private function householdColumn(): ?string
    {
        return Schema::hasColumn('expenses', 'household_id') ? 'household_id' : null;
    }

    private function assertExpenseOwner(Request $request, Expense $expense): void
    {
        if (! $request->user()->isAdmin() && (int) $expense->user_id !== (int) $request->user()->id) {
            abort(404);
        }
    }

    private function categoryOptions(User $user, array $columns = ['id', 'name'])
    {
        return Category::query()
            ->visibleTo($user)
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get($columns);
    }
}
