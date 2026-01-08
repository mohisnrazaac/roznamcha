import React from 'react';
import { useForm, router } from '@inertiajs/react';
import ControlRoomLayout from '../../../Layouts/ControlRoomLayout';

export default function BlogCategories({ categories = [] }) {
    const createForm = useForm({
        name: '',
        slug: '',
    });

    const handleCreate = (event) => {
        event.preventDefault();
        createForm.post(route('admin.blog.categories.store'), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const handleDelete = (categoryId) => {
        if (!window.confirm('Delete this category?')) {
            return;
        }

        router.delete(route('admin.blog.categories.destroy', categoryId), { preserveScroll: true });
    };

    return (
        <ControlRoomLayout active="blog-categories">
            <div className="p-6 md:p-10 space-y-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Admin · Blog</p>
                        <h1 className="text-3xl font-semibold text-white">Categories</h1>
                    </div>
                </header>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Create new</h2>
                    <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-200">Name</label>
                            <input
                                value={createForm.data.name}
                                onChange={(event) => createForm.setData('name', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                            />
                            {createForm.errors.name && <ErrorText>{createForm.errors.name}</ErrorText>}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-200">Slug (optional)</label>
                            <input
                                value={createForm.data.slug}
                                onChange={(event) => createForm.setData('slug', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                            />
                            {createForm.errors.slug && <ErrorText>{createForm.errors.slug}</ErrorText>}
                        </div>
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900"
                                disabled={createForm.processing}
                            >
                                Add Category
                            </button>
                        </div>
                    </form>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                            <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Slug</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-200">
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                                            No categories yet.
                                        </td>
                                    </tr>
                                )}
                                {categories.map((category) => (
                                    <CategoryRow key={category.id} category={category} onDelete={handleDelete} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </ControlRoomLayout>
    );
}

function CategoryRow({ category, onDelete }) {
    const form = useForm({
        name: category.name,
        slug: category.slug ?? '',
    });

    const handleUpdate = (event) => {
        event.preventDefault();
        form.put(route('admin.blog.categories.update', category.id), {
            preserveScroll: true,
        });
    };

    return (
        <tr className="hover:bg-slate-900/40">
            <td className="px-4 py-3">
                <input
                    value={form.data.name}
                    onChange={(event) => form.setData('name', event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white"
                />
                {form.errors.name && <ErrorText>{form.errors.name}</ErrorText>}
            </td>
            <td className="px-4 py-3">
                <input
                    value={form.data.slug}
                    onChange={(event) => form.setData('slug', event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white"
                />
                {form.errors.slug && <ErrorText>{form.errors.slug}</ErrorText>}
            </td>
            <td className="px-4 py-3 text-xs text-slate-400">{category.created_at ?? '—'}</td>
            <td className="px-4 py-3 text-right space-x-2">
                <button
                    type="button"
                    onClick={handleUpdate}
                    className="rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-200"
                    disabled={form.processing}
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(category.id)}
                    className="rounded-lg border border-red-600 px-3 py-1 text-xs text-red-300"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

function ErrorText({ children }) {
    return <p className="text-xs text-red-400">{children}</p>;
}
