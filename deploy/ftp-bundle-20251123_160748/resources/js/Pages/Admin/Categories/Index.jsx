import React from 'react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import { Link, router } from '@inertiajs/react';

export default function CategoriesIndex({ categories }) {
  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      router.delete(`/admin/categories/${id}`);
    }
  };

  return (
    <ControlRoomLayout active="categories">
      <div className="p-6 md:p-10 text-white">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Categories</h1>
            <p className="text-sm text-slate-400">Organise expenses and cockpit modules by category.</p>
          </div>

          <Link
            href="/admin/categories/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Add Category
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories.length ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-white">{category.name}</td>
                    <td className="px-4 py-3 text-slate-300">{category.description || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">{category.created_at}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="rounded-lg border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 transition hover:border-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    No categories created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ControlRoomLayout>
  );
}
