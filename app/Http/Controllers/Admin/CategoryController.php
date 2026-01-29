<?php

// Purpose: Admin global categories management with ownership filters. Date: 2026-02-22. Author: Codex.

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\User;
use App\Support\CategoryNameGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'user_id' => $request->integer('user_id'),
        ];

        $categories = Category::query()
            ->with('user')
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->when($filters['user_id'], fn ($query) => $query->where('user_id', $filters['user_id']))
            ->get(['id', 'name', 'description', 'created_at', 'is_default', 'user_id'])
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'created_at' => $category->created_at?->toDateTimeString(),
                'is_default' => (bool) $category->is_default,
                'owner' => $category->user ? [
                    'id' => $category->user->id,
                    'name' => $category->user->name,
                    'email' => $category->user->email,
                ] : null,
            ]);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $filters,
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        CategoryNameGuard::ensureAvailable(null, $data['name']);

        Category::create([
            ...$data,
            'is_default' => true,
            'user_id' => null,
        ]);

        return redirect()->route('admin.categories.index');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category->only(['id', 'name', 'description']),
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        CategoryNameGuard::ensureAvailable($category->user_id, $data['name'], $category->id);

        $category->update($data);

        return redirect()->route('admin.categories.index');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()->route('admin.categories.index');
    }
}
