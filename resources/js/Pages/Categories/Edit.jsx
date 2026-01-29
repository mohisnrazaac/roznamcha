// Purpose: Panel form to edit user-owned categories. Date: 2026-02-22. Author: Codex.

import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import ControlRoomLayout from '@/Layouts/ControlRoomLayout';

export default function CategoriesEdit({ category }) {
  const { props } = usePage();
  const form = useForm({
    name: category?.name ?? '',
    description: category?.description ?? '',
  });

  const submit = (event) => {
    event.preventDefault();
    form.put(route('panel.categories.update', category.id));
  };

  return (
    <ControlRoomLayout active="panel-categories" user={props.auth?.user}>
      <div className="p-6 md:p-10 text-white space-y-6 max-w-2xl">
        <div>
          <Link href={route('panel.categories.index')} className="text-sm text-slate-400 hover:text-slate-200">
            ← Back to categories
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Edit Category</h1>
          <p className="text-sm text-slate-400">Update your custom category details.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.data.name}
              onChange={(event) => form.setData('name', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
              required
            />
            {form.errors.name && <p className="mt-1 text-sm text-red-400">{form.errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">
              Description <span className="text-slate-500">(optional)</span>
            </label>
            <textarea
              id="description"
              value={form.data.description}
              onChange={(event) => form.setData('description', event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
            />
            {form.errors.description && <p className="mt-1 text-sm text-red-400">{form.errors.description}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={form.processing}
              className="rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200 disabled:opacity-70"
            >
              {form.processing ? 'Saving…' : 'Update Category'}
            </button>
            <Link
              href={route('panel.categories.index')}
              className="rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </ControlRoomLayout>
  );
}
