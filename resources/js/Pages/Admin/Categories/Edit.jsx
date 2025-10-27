import React, { useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';

export default function CategoriesEdit({ category }) {
  const { data, setData, put, processing, errors, setDefaults } = useForm({
    name: category?.name ?? '',
    description: category?.description ?? '',
  });

  useEffect(() => {
    setDefaults({
      name: category?.name ?? '',
      description: category?.description ?? '',
    });
  }, [category, setDefaults]);

  const submit = (event) => {
    event.preventDefault();
    put(`/admin/categories/${category.id}`);
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 text-white">
        <div className="mb-6">
          <Link href="/admin/categories" className="text-sm text-slate-400 hover:text-slate-200">
            ← Back to categories
          </Link>
          <h1 className="mt-2 text-xl font-semibold">Edit Category</h1>
          <p className="text-sm text-slate-400">Update the name or description for this category.</p>
        </div>

        <form onSubmit={submit} className="max-w-xl space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={(event) => setData('name', event.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">
              Description <span className="text-slate-500">(optional)</span>
            </label>
            <textarea
              id="description"
              value={data.description || ''}
              onChange={(event) => setData('description', event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900"
          >
            {processing ? 'Saving…' : 'Update category'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
