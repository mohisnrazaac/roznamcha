// Purpose: User-facing categories list with default badges. Date: 2026-02-22. Author: Codex.

import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';
import { deleteResource } from '@/lib/inertia';

export default function CategoriesIndex({ categories = [] }) {
  const { props } = usePage();

  const handleDelete = (id) => {
    if (!window.confirm('Delete this category?')) {
      return;
    }

    deleteResource(route('panel.categories.destroy', id), {
      preserveScroll: true,
    });
  };

  return (
    <ControlRoomLayout active="panel-categories" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Panel › Categories</p>
            <h1 className="text-2xl font-semibold">My Categories</h1>
            <p className="text-sm text-slate-400">Defaults are read-only. Add your own buckets for expenses and reports.</p>
          </div>
          <Link
            href={route('panel.categories.create')}
            className="inline-flex items-center rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200"
          >
            Add Category
          </Link>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No categories yet. Create one to organise kharcha.
                  </td>
                </tr>
              )}

              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-semibold text-white">{category.name}</td>
                  <td className="px-4 py-3 text-slate-300">{category.description || '—'}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {category.is_default ? (
                      <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-200">
                        Default
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-emerald-800/40 px-3 py-1 text-[11px] uppercase tracking-wide text-emerald-200">
                        Custom
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{category.created_at ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {!category.is_default && category.can_manage ? (
                      <div className="inline-flex items-center gap-3 text-xs font-semibold">
                        <Link
                          href={route('panel.categories.edit', category.id)}
                          className="text-yellow-300 hover:text-yellow-200"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-300 hover:text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </ControlRoomLayout>
  );
}
