// Purpose: Admin categories list with owner filters for auditing. Date: 2026-02-22. Author: Codex.

import React, { useState } from 'react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import { Link, router } from '@inertiajs/react';
import { deleteResource } from '@/lib/inertia';

export default function CategoriesIndex({ categories, filters = {}, users = [] }) {
  const [selectedUser, setSelectedUser] = useState(filters.user_id ?? '');

  const handleDelete = (id) => {
    if (confirm('Delete this category?')) {
      deleteResource(`/admin/categories/${id}`);
    }
  };

  const applyFilter = (event) => {
    event.preventDefault();
    router.get(
      route('admin.categories.index'),
      selectedUser ? { user_id: selectedUser } : {},
      { preserveState: true, preserveScroll: true },
    );
  };

  const resetFilter = () => {
    setSelectedUser('');
    router.get(route('admin.categories.index'), {}, { preserveState: true, preserveScroll: true });
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

        <section className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <form onSubmit={applyFilter} className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="text-sm font-semibold text-slate-200" htmlFor="admin-category-user">
              Filter by user
            </label>
            <select
              id="admin-category-user"
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              className="flex-1 rounded-lg border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="">All records</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                Apply
              </button>
              <button
                type="button"
                onClick={resetFilter}
                className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Owner</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories.length ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-white">
                      {category.name}
                      {category.is_default && (
                        <span className="ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-200">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{category.description || '—'}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {category.owner ? (
                        <div>
                          <p className="font-semibold text-white">{category.owner.name}</p>
                          <p className="text-xs text-slate-500">{category.owner.email}</p>
                        </div>
                      ) : (
                        <span className="text-xs uppercase tracking-wide text-slate-500">Global</span>
                      )}
                    </td>
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
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
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
