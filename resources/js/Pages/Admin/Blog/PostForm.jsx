import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import ControlRoomLayout from '../../../Layouts/ControlRoomLayout';
import RichTextEditor from '../../../Components/RichTextEditor';

export default function BlogPostForm({ post = null, categories = [], statusOptions = [], formatOptions = [] }) {
    const isEdit = Boolean(post?.id);

    const form = useForm({
        title: post?.title ?? '',
        slug: post?.slug ?? '',
        excerpt: post?.excerpt ?? '',
        content: post?.content ?? '',
        content_format: post?.content_format ?? 'html',
        status: post?.status ?? 'draft',
        published_at: post?.published_at ?? '',
        seo_title: post?.seo_title ?? '',
        seo_description: post?.seo_description ?? '',
        seo_keywords: post?.seo_keywords ?? '',
        canonical_url: post?.canonical_url ?? '',
        language: post?.language ?? 'ur',
        categories: post?.categories ?? [],
        og_image: null,
        remove_og_image: false,
        feature_hooks: post?.feature_hooks ?? {},
    });

    const [prefillTagsInput, setPrefillTagsInput] = useState(
        (post?.feature_hooks?.prefill?.tags ?? []).join(', ')
    );

    const featureHooks = form.data.feature_hooks ?? {};

    const updateFeatureHook = (key, value) => {
        form.setData('feature_hooks', {
            ...featureHooks,
            [key]: value,
        });
    };

    const updatePrefill = (key, value) => {
        form.setData('feature_hooks', {
            ...featureHooks,
            prefill: {
                ...(featureHooks.prefill ?? {}),
                [key]: value,
            },
        });
    };

    const submitWithStatus = (status) => {
        const url = isEdit ? route('admin.blog.posts.update', { post: post.id }) : route('admin.blog.posts.store');

        form.transform((payload) => {
            const hooks = cleanFeatureHooks(payload.feature_hooks);

            return {
                ...payload,
                status,
                feature_hooks: hooks ?? null,
                ...(isEdit ? { _method: 'put' } : {}),
            };
        });

        form.post(url, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => form.transform((payload) => payload),
        });
    };

    const toggleCategory = (categoryId) => {
        const values = form.data.categories ?? [];
        if (values.includes(categoryId)) {
            form.setData('categories', values.filter((value) => value !== categoryId));
        } else {
            form.setData('categories', [...values, categoryId]);
        }
    };

    const handleTagsChange = (value) => {
        setPrefillTagsInput(value);
        const tags = value
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        updatePrefill('tags', tags);
    };

    return (
        <ControlRoomLayout active="blog-posts">
            <form
                className="space-y-6 p-6 md:p-10"
                onSubmit={(event) => {
                    event.preventDefault();
                    submitWithStatus(form.data.status ?? 'draft');
                }}
            >
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Admin · Blog</p>
                        <h1 className="text-3xl font-semibold text-white">{isEdit ? 'Edit Post' : 'Create Post'}</h1>
                    </div>
                    <Link
                        href={route('admin.blog.posts.index')}
                        className="text-sm font-semibold text-slate-300 hover:text-white"
                    >
                        ← Back to posts
                    </Link>
                </header>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                    <Field
                        label="Title"
                        value={form.data.title}
                        onChange={(event) => form.setData('title', event.target.value)}
                        error={form.errors.title}
                    />

                    <Field
                        label="Slug (optional)"
                        value={form.data.slug}
                        onChange={(event) => form.setData('slug', event.target.value)}
                        error={form.errors.slug}
                        placeholder="leave blank to auto-generate"
                    />

                    <Textarea
                        label="Excerpt"
                        value={form.data.excerpt}
                        onChange={(event) => form.setData('excerpt', event.target.value)}
                        error={form.errors.excerpt}
                        rows={3}
                    />

                    <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
                        {form.data.content_format === 'html' ? (
                            <RichTextEditor
                                label="Content"
                                value={form.data.content}
                                onChange={(html) => form.setData('content', html)}
                                error={form.errors.content}
                                placeholder="Craft your story…"
                            />
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Content</label>
                                <textarea
                                    value={form.data.content}
                                    onChange={(event) => form.setData('content', event.target.value)}
                                    rows={14}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                />
                                {form.errors.content && <ErrorText>{form.errors.content}</ErrorText>}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Format</label>
                                <select
                                    value={form.data.content_format}
                                    onChange={(event) => form.setData('content_format', event.target.value)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                >
                                    {formatOptions.map((format) => (
                                        <option key={format} value={format}>
                                            {format}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.content_format && <ErrorText>{form.errors.content_format}</ErrorText>}
                            </div>
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-2 text-xs text-slate-400">
                                <p className="font-semibold text-slate-200">Preview (raw)</p>
                                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-slate-200">
                                    {form.data.content ? (
                                        form.data.content_format === 'html' ? (
                                            <div
                                                className="prose prose-sm max-w-none prose-invert"
                                                dangerouslySetInnerHTML={{ __html: form.data.content }}
                                            />
                                        ) : (
                                            <pre className="whitespace-pre-wrap">{form.data.content}</pre>
                                        )
                                    ) : (
                                        <p>No content yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                        <h2 className="text-lg font-semibold text-white">Publishing</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-slate-200">Status</label>
                                <select
                                    value={form.data.status}
                                    onChange={(event) => form.setData('status', event.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.status && <ErrorText>{form.errors.status}</ErrorText>}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-200">Publish at</label>
                                <input
                                    type="datetime-local"
                                    value={form.data.published_at ?? ''}
                                    onChange={(event) => form.setData('published_at', event.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                />
                                {form.errors.published_at && <ErrorText>{form.errors.published_at}</ErrorText>}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-200">Language</label>
                            <input
                                value={form.data.language}
                                onChange={(event) => form.setData('language', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                            />
                            {form.errors.language && <ErrorText>{form.errors.language}</ErrorText>}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                        <h2 className="text-lg font-semibold text-white">Categories</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map((category) => (
                                <label key={category.id} className="flex items-center gap-2 text-sm text-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={form.data.categories?.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                        className="rounded border-slate-600 bg-slate-900 text-yellow-300 focus:ring-yellow-300"
                                    />
                                    {category.name}
                                </label>
                            ))}
                        </div>
                        {form.errors.categories && <ErrorText>{form.errors.categories}</ErrorText>}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">SEO & Sharing</h2>
                    <Field
                        label="SEO Title"
                        value={form.data.seo_title}
                        onChange={(event) => form.setData('seo_title', event.target.value)}
                        error={form.errors.seo_title}
                    />
                    <Textarea
                        label="SEO Description"
                        value={form.data.seo_description}
                        onChange={(event) => form.setData('seo_description', event.target.value)}
                        error={form.errors.seo_description}
                        rows={3}
                    />
                    <Field
                        label="SEO Keywords (comma separated)"
                        value={form.data.seo_keywords}
                        onChange={(event) => form.setData('seo_keywords', event.target.value)}
                        error={form.errors.seo_keywords}
                    />
                    <Field
                        label="Canonical URL (optional)"
                        value={form.data.canonical_url}
                        onChange={(event) => form.setData('canonical_url', event.target.value)}
                        error={form.errors.canonical_url}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">OG Image</label>
                        {post?.og_image_url && !form.data.remove_og_image && (
                            <div className="flex items-center gap-4">
                                <img
                                    src={post.og_image_url}
                                    alt="OG preview"
                                    className="h-24 w-24 rounded-lg border border-slate-800 object-cover"
                                />
                                <label className="flex items-center gap-2 text-xs text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remove_og_image}
                                        onChange={(event) => form.setData('remove_og_image', event.target.checked)}
                                    />
                                    Remove image
                                </label>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => form.setData('og_image', event.target.files[0] ?? null)}
                            className="w-full text-xs text-slate-300"
                        />
                        {form.errors.og_image && <ErrorText>{form.errors.og_image}</ErrorText>}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Activation Hooks</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-200">Primary category highlight</label>
                            <select
                                value={featureHooks.primaryCategory ?? ''}
                                onChange={(event) => updateFeatureHook('primaryCategory', event.target.value || null)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                            >
                                <option value="">None</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {form.errors['feature_hooks.primaryCategory'] && (
                                <ErrorText>{form.errors['feature_hooks.primaryCategory']}</ErrorText>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-200">CTA route</label>
                            <select
                                value={featureHooks.ctaRoute ?? 'register'}
                                onChange={(event) => updateFeatureHook('ctaRoute', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                            >
                                <option value="register">Register</option>
                                <option value="login">Login</option>
                            </select>
                            {form.errors['feature_hooks.ctaRoute'] && (
                                <ErrorText>{form.errors['feature_hooks.ctaRoute']}</ErrorText>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-200">Calculator</label>
                        <select
                            value={featureHooks.calculator ?? ''}
                            onChange={(event) => updateFeatureHook('calculator', event.target.value || null)}
                            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                        >
                            <option value="">None</option>
                            <option value="school_fee_increase">School fee increase</option>
                        </select>
                        {form.errors['feature_hooks.calculator'] && (
                            <ErrorText>{form.errors['feature_hooks.calculator']}</ErrorText>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-200">Prefill category</label>
                            <input
                                value={featureHooks?.prefill?.category ?? ''}
                                onChange={(event) => updatePrefill('category', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                placeholder="School"
                            />
                            {form.errors['feature_hooks.prefill.category'] && (
                                <ErrorText>{form.errors['feature_hooks.prefill.category']}</ErrorText>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-200">Prefill amount</label>
                            <input
                                type="number"
                                min="0"
                                value={featureHooks?.prefill?.amount ?? ''}
                                onChange={(event) => updatePrefill('amount', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                placeholder="15000"
                            />
                            {form.errors['feature_hooks.prefill.amount'] && (
                                <ErrorText>{form.errors['feature_hooks.prefill.amount']}</ErrorText>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-200">Prefill note</label>
                            <input
                                value={featureHooks?.prefill?.note ?? ''}
                                onChange={(event) => updatePrefill('note', event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                placeholder="School fee increase"
                            />
                            {form.errors['feature_hooks.prefill.note'] && (
                                <ErrorText>{form.errors['feature_hooks.prefill.note']}</ErrorText>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-200">Tags (comma separated)</label>
                            <input
                                value={prefillTagsInput}
                                onChange={(event) => handleTagsChange(event.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                                placeholder="fees,school"
                            />
                            {form.errors['feature_hooks.prefill.tags'] && (
                                <ErrorText>{form.errors['feature_hooks.prefill.tags']}</ErrorText>
                            )}
                        </div>
                    </div>
                </section>

                <section className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => submitWithStatus('draft')}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200"
                        disabled={form.processing}
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => submitWithStatus('published')}
                        className="rounded-lg bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-emerald-900"
                        disabled={form.processing}
                    >
                        Publish Now
                    </button>
                    <button
                        type="button"
                        onClick={() => submitWithStatus('scheduled')}
                        className="rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900"
                        disabled={form.processing}
                    >
                        Schedule
                    </button>
                </section>
            </form>
        </ControlRoomLayout>
    );
}

function Field({ label, value, onChange, error, placeholder }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">{label}</label>
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
            {error && <ErrorText>{error}</ErrorText>}
        </div>
    );
}

function Textarea({ label, value, onChange, error, rows = 4 }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                rows={rows}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
            {error && <ErrorText>{error}</ErrorText>}
        </div>
    );
}

function ErrorText({ children }) {
    return <p className="text-xs text-red-400">{children}</p>;
}

function cleanFeatureHooks(hooks) {
    if (!hooks) {
        return null;
    }

    const payload = {};

    if (hooks.primaryCategory) {
        payload.primaryCategory = hooks.primaryCategory;
    }

    if (hooks.ctaRoute) {
        payload.ctaRoute = hooks.ctaRoute;
    }

    if (hooks.calculator) {
        payload.calculator = hooks.calculator;
    }

    if (hooks.prefill) {
        const cleanPrefill = {};

        if (hooks.prefill.category) {
            cleanPrefill.category = hooks.prefill.category;
        }

        if (hooks.prefill.amount) {
            cleanPrefill.amount = hooks.prefill.amount;
        }

        if (hooks.prefill.note) {
            cleanPrefill.note = hooks.prefill.note;
        }

        if (Array.isArray(hooks.prefill.tags) && hooks.prefill.tags.length > 0) {
            cleanPrefill.tags = hooks.prefill.tags;
        }

        if (Object.keys(cleanPrefill).length > 0) {
            payload.prefill = cleanPrefill;
        }
    }

    return Object.keys(payload).length > 0 ? payload : null;
}
