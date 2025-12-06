<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use App\Models\Household;
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

        $dateColumn = $this->dateColumn();
        $noteColumn = $this->noteColumn();

        $expensesQuery = Expense::query()
            ->with('category')
            ->forHousehold($household);

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
            ]);

        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $totals = [
            'month' => Expense::query()
                ->forHousehold($household)
                ->whereBetween($dateColumn, [$monthStart->toDateString(), $now->toDateString()])
                ->sum('amount'),
            'today' => Expense::query()
                ->forHousehold($household)
                ->whereDate($dateColumn, $now->toDateString())
                ->sum('amount'),
        ];

        $totals['average_daily'] = $monthStart->daysInMonth
            ? round($totals['month'] / $monthStart->daysInMonth, 2)
            : 0;

        return Inertia::render('Kharcha/Index', [
            'expenses' => $expenses,
            'categories' => Category::orderBy('name')->get(['id', 'name', 'color']),
            'filters' => $filters,
            'totals' => $totals,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Kharcha/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
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
        $this->authorizeExpense($expense);

        return Inertia::render('Kharcha/Edit', [
            'expense' => [
                'id' => $expense->id,
                'amount' => (float) $expense->amount,
                'tx_date' => optional($expense->{$this->dateColumn()})->toDateString(),
                'category_id' => $expense->category_id,
                'note' => $expense->{$this->noteColumn()} ?? null,
            ],
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $this->authorizeExpense($expense);

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
        $this->authorizeExpense($expense);
        $expense->delete();

        return redirect()->route('panel.kharcha.index')->with('success', 'Expense removed.');
    }

    protected function authorizeExpense(Expense $expense): void
    {
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;
        $householdColumn = $this->householdColumn();

        if ($householdColumn && $household && $expense->{$householdColumn} !== $household->id) {
            abort(403);
        }
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
}
