<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KharchaController extends Controller
{
    /**
     * Display the expense listing with optional filters.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $filters = $request->only(['category', 'search', 'month']);

        $expensesQuery = Expense::with('category')
            ->where('user_id', $user->id)
            ->when($filters['category'] ?? null, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('description', 'like', "%{$search}%");
            })
            ->when($filters['month'] ?? null, function ($query, $month) {
                $start = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
                $end = (clone $start)->endOfMonth();

                $query->whereBetween('date', [
                    $start->toDateString(),
                    $end->toDateString(),
                ]);
            })
            ->orderByDesc('date')
            ->orderByDesc('created_at');

        $expenses = $expensesQuery->paginate(10)->withQueryString();

        return Inertia::render('KharchaMapList', [
            'filters' => $filters,
            'categories' => Category::where('user_id', $user->id)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]),
            'expenses' => [
                'data' => collect($expenses->items())->map(function (Expense $expense) {
                    return [
                        'id' => $expense->id,
                        'date' => $expense->date->toDateString(),
                        'category' => optional($expense->category)->name,
                        'category_color' => optional($expense->category)->color_code,
                        'description' => $expense->description,
                        'amount' => (float) $expense->amount,
                    ];
                }),
                'pagination' => [
                    'total' => $expenses->total(),
                    'per_page' => $expenses->perPage(),
                    'current_page' => $expenses->currentPage(),
                    'last_page' => $expenses->lastPage(),
                ],
            ],
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Display the add expense form.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('AddExpenseForm', [
            'categories' => Category::where('user_id', $user->id)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Category $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]),
        ]);
    }

    /**
     * Store a newly created expense.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'description' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'receipt_path' => ['nullable', 'string', 'max:255'],
        ]);

        $expense = new Expense($validated);
        $expense->user_id = $request->user()->id;
        $expense->save();

        return redirect()
            ->route('kharcha.map')
            ->with('success', 'Expense recorded successfully.');
    }

    /**
     * Update the specified expense.
     */
    public function update(Expense $expense, Request $request): RedirectResponse
    {
        abort_unless($expense->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'description' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'receipt_path' => ['nullable', 'string', 'max:255'],
        ]);

        $expense->update($validated);

        return redirect()
            ->route('kharcha.map')
            ->with('success', 'Expense updated.');
    }

    /**
     * Remove the specified expense.
     */
    public function destroy(Expense $expense, Request $request): RedirectResponse
    {
        abort_unless($expense->user_id === $request->user()->id, 403);

        $expense->delete();

        return redirect()
            ->route('kharcha.map')
            ->with('success', 'Expense deleted.');
    }
}
