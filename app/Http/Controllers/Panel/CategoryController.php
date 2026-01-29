<?php

// Purpose: User-facing categories CRUD with multi-tenant scoping. Date: 2026-02-22. Author: Codex.

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Support\CategoryNameGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $categories = Category::query()
            ->visibleTo($user)
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'is_default' => (bool) $category->is_default,
                'owner' => $category->user ? [
                    'id' => $category->user->id,
                    'name' => $category->user->name,
                ] : null,
                'created_at' => $category->created_at?->toDateTimeString(),
                'can_manage' => ! $category->is_default && $category->user_id === $user->id,
            ]);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        CategoryNameGuard::ensureAvailable($request->user()->id, $data['name']);

        Category::create([
            ...$data,
            'user_id' => $request->user()->id,
            'is_default' => false,
        ]);

        return redirect()->route('panel.categories.index')->with('success', 'Category saved.');
    }

    public function edit(Category $category): Response
    {
        $this->authorizeCategory($category);

        return Inertia::render('Categories/Edit', [
            'category' => $category->only(['id', 'name', 'description']),
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $this->authorizeCategory($category);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        CategoryNameGuard::ensureAvailable($request->user()->id, $data['name'], $category->id);

        $category->update($data);

        return redirect()->route('panel.categories.index')->with('success', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $this->authorizeCategory($category);

        $category->delete();

        return redirect()->route('panel.categories.index')->with('success', 'Category deleted.');
    }

    protected function authorizeCategory(Category $category): void
    {
        $user = request()->user();

        if ($category->is_default || $category->user_id !== $user->id) {
            abort(404);
        }
    }
}
