<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\KharchaEntry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KharchaController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $baseQuery = KharchaEntry::with('category');

        if (! $user->isSuperAdmin()) {
            $baseQuery->where('user_id', $user->id);
        }

        $entries = (clone $baseQuery)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->map(function (KharchaEntry $entry) {
                return [
                    'id' => $entry->id,
                    'date' => optional($entry->date)->toDateString(),
                    'amount' => (float) $entry->amount,
                    'vendor' => $entry->vendor,
                    'notes' => $entry->notes,
                    'category' => $entry->category ? [
                        'id' => $entry->category->id,
                        'name' => $entry->category->name,
                        'color' => $entry->category->color,
                    ] : null,
                ];
            });

        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd = Carbon::now()->endOfMonth();

        $totalThisMonth = (clone $baseQuery)
            ->whereBetween('date', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->sum('amount');

        $topCategoryRow = (clone $baseQuery)
            ->select('category_id', DB::raw('SUM(amount) as total_amount'))
            ->whereNotNull('category_id')
            ->groupBy('category_id')
            ->orderByDesc('total_amount')
            ->first();

        $topCategoryName = null;
        if ($topCategoryRow && $topCategoryRow->category_id) {
            $topCategoryName = optional(Category::find($topCategoryRow->category_id))->name;
        }

        return Inertia::render('Admin/Kharcha', [
            'user' => $user,
            'entries' => $entries,
            'categories' => Category::orderBy('name')->get(['id', 'name', 'color']),
            'filters' => [],
            'stats' => [
                'totalThisMonth' => (float) $totalThisMonth,
                'topCategory' => $topCategoryName,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'amount' => ['required', 'numeric'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'receipt_path' => ['nullable', 'string', 'max:255'],
        ]);

        KharchaEntry::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('kharcha.index')->with('success', 'Expense recorded.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $entry = KharchaEntry::findOrFail($id);
        $user = $request->user();

        if (! $user->isSuperAdmin() && $entry->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'amount' => ['required', 'numeric'],
            'vendor' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'receipt_path' => ['nullable', 'string', 'max:255'],
        ]);

        $entry->update($validated);

        return redirect()->route('kharcha.index')->with('success', 'Expense updated.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $entry = KharchaEntry::findOrFail($id);
        $user = $request->user();

        if (! $user->isSuperAdmin() && $entry->user_id !== $user->id) {
            abort(403);
        }

        $entry->delete();

        return redirect()->route('kharcha.index')->with('success', 'Expense removed.');
    }
}
