<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BlogCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = BlogCategory::orderBy('name')
            ->get(['id', 'name', 'slug', 'created_at']);

        return Inertia::render('Admin/Blog/Categories', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        BlogCategory::create($data);

        return redirect()->back()->with('success', 'Category created.');
    }

    public function update(Request $request, BlogCategory $category): RedirectResponse
    {
        $data = $this->validated($request, $category);

        $category->update($data);

        return redirect()->back()->with('success', 'Category updated.');
    }

    public function destroy(BlogCategory $category): RedirectResponse
    {
        $category->posts()->detach();
        $category->delete();

        return redirect()->back()->with('success', 'Category removed.');
    }

    protected function validated(Request $request, ?BlogCategory $category = null): array
    {
        $categoryId = $category?->id;

        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_categories', 'slug')->ignore($categoryId)],
        ]);
    }
}
