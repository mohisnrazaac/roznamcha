import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import ControlRoomLayout from '../../../Layouts/ControlRoomLayout';

export default function BlogPostsIndex({ posts, filters = {}, statusOptions = [] }) {
    const [form, setForm] = useState({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(route('admin.blog.posts.index'), form, { preserveScroll: true, replace: true });
    };

    const resetFilters = () => {
        setForm({ search: '', status: '' });
        router.get(route('admin.blog.posts.index'), {}, { preserveScroll: true, replace: true });
    };

    const handlePublish = (postId) => {
        router.post(route('admin.blog.posts.publish', postId), {}, { preserveScroll: true });
    };

    const handleDraft = (postId) => {
        router.post(route('admin.blog.posts.draft', postId), {}, { preserveScroll: true });
    };

    const handleDelete = (postId) => {
        if (!window.confirm('Delete this post?')) {
            return;
        }

        router.delete(route('admin.blog.posts.destroy', postId), {
            preserveScroll: true,
        });
    };

    const rows = posts?.data ?? [];

    return (
        <ControlRoomLayout active="blog-posts">
            <div className="p-6 md:p-10 space-y-6">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Admin · Blog</p>
                        <h1 className="text-3xl font-semibold text-white">Posts</h1>
                    </div>
                    <Link
                        href={route('admin.blog.posts.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-slate-900"
                    >
                        Create Post
                    </Link>
                </header>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <form onSubmit={applyFilters} className="grid gap-4 md:grid-cols-3">
                        <input
                            type="search"
                            placeholder="Search title or excerpt"
                            value={form.search}
                            onChange={(event) => setForm((prev) => ({ ...prev, search: event.target.value }))}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                        />
                        <select
                            value={form.status}
                            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                        >
                            <option value="">All statuses</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 rounded-lg bg-[#003a8c] px-3 py-2 text-sm font-semibold text-white">
                                Apply
                            </button>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-800 text-sm">
                            <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Published</th>
                                    <th className="px-4 py-3">Categories</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-200">
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                                            No posts found.
                                        </td>
                                    </tr>
                                )}
                                {rows.map((post) => (
                                    <tr key={post.id} className="hover:bg-slate-900/40">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold">{post.title}</div>
                                            <p className="text-xs text-slate-500">{post.excerpt}</p>
                                        </td>
                                        <td className="px-4 py-3 text-xs uppercase tracking-wide">{post.status}</td>
                                        <td className="px-4 py-3 text-sm text-slate-400">
                                            {post.published_at ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">
                                            {post.categories?.map((category) => category.name).join(', ')}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            <Link
                                                href={route('admin.blog.posts.edit', post.id)}
                                                className="rounded-lg border border-slate-600 px-3 py-1 text-xs"
                                            >
                                                Edit
                                            </Link>
                                            {post.status !== 'published' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handlePublish(post.id)}
                                                    className="rounded-lg border border-emerald-500/60 px-3 py-1 text-xs text-emerald-300"
                                                >
                                                    Publish
                                                </button>
                                            )}
                                            {post.status !== 'draft' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDraft(post.id)}
                                                    className="rounded-lg border border-orange-500/60 px-3 py-1 text-xs text-orange-300"
                                                >
                                                    Draft
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(post.id)}
                                                className="rounded-lg border border-red-600/60 px-3 py-1 text-xs text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-slate-800 px-4 py-4 space-y-3">
                        <Pagination links={posts?.links ?? []} />
                        <p className="text-sm text-slate-400">
                            Showing {rows.length} of {posts?.total ?? rows.length} posts
                        </p>
                    </div>
                </section>
            </div>
        </ControlRoomLayout>
    );
}

function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
                if (!link.url) {
                    return (
                        <span
                            key={link.label}
                            className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-500"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={link.label}
                        href={link.url}
                        className={`rounded-lg px-3 py-1 text-xs ${
                            link.active ? 'bg-white/10 text-white' : 'border border-slate-700 text-slate-300'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
