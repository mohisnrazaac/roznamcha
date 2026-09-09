import { b as reactExports, j as jsxRuntimeExports, u as useForm, L as Link_default } from "../ssr.js";
import { C as ControlRoomLayout } from "./ControlRoomLayout-BmJqwnTf.js";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "assert";
import "tty";
import "zlib";
import "events";
import "process";
function RichTextEditor({
  value = "",
  onChange,
  label,
  error,
  placeholder = "Start writing your post..."
}) {
  const editorRef = reactExports.useRef(null);
  const normalizedValue = value ?? "";
  reactExports.useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    if (editorRef.current.innerHTML !== normalizedValue) {
      editorRef.current.innerHTML = normalizedValue || "";
    }
  }, [normalizedValue]);
  const handleInput = () => {
    if (!editorRef.current) {
      return;
    }
    const html = editorRef.current.innerHTML.replace(/<br\s*\/?>$/i, "").trim();
    onChange == null ? void 0 : onChange(html);
  };
  const exec = (command, valueArg = null) => {
    if (!editorRef.current) {
      return;
    }
    editorRef.current.focus();
    document.execCommand(command, false, valueArg);
    handleInput();
  };
  const addLink = () => {
    const url = window.prompt("URL");
    if (!url) {
      return;
    }
    exec("createLink", url.startsWith("http") ? url : `https://${url}`);
  };
  const controls = reactExports.useMemo(
    () => [
      { label: "B", action: () => exec("bold") },
      { label: "I", action: () => exec("italic") },
      { label: "U", action: () => exec("underline") },
      { label: "H2", action: () => exec("formatBlock", "h2") },
      { label: "Quote", action: () => exec("formatBlock", "blockquote") },
      { label: "UL", action: () => exec("insertUnorderedList") },
      { label: "OL", action: () => exec("insertOrderedList") },
      { label: "Link", action: () => addLink() },
      { label: "Code", action: () => exec("formatBlock", "pre") },
      { label: "Clear", action: () => exec("removeFormat") }
    ],
    []
  );
  const isEmpty = !normalizedValue || normalizedValue === "<p><br></p>";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-700 bg-slate-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 border-b border-slate-800 p-2", children: controls.map((control) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onMouseDown: (event) => {
            event.preventDefault();
            control.action();
          },
          className: "rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-700",
          children: control.label
        },
        control.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: editorRef,
            className: "min-h-[280px] w-full rounded-b-xl px-4 py-3 text-sm text-white focus:outline-none",
            contentEditable: true,
            suppressContentEditableWarning: true,
            onInput: handleInput,
            onBlur: handleInput
          }
        ),
        isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute left-4 top-3 text-sm text-slate-500", children: placeholder })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children: error })
  ] });
}
function BlogPostForm({ post = null, categories = [], statusOptions = [], formatOptions = [] }) {
  var _a, _b, _c, _d, _e;
  const isEdit = Boolean(post == null ? void 0 : post.id);
  const form = useForm({
    title: (post == null ? void 0 : post.title) ?? "",
    slug: (post == null ? void 0 : post.slug) ?? "",
    excerpt: (post == null ? void 0 : post.excerpt) ?? "",
    content: (post == null ? void 0 : post.content) ?? "",
    content_format: (post == null ? void 0 : post.content_format) ?? "html",
    status: (post == null ? void 0 : post.status) ?? "draft",
    published_at: (post == null ? void 0 : post.published_at) ?? "",
    seo_title: (post == null ? void 0 : post.seo_title) ?? "",
    seo_description: (post == null ? void 0 : post.seo_description) ?? "",
    seo_keywords: (post == null ? void 0 : post.seo_keywords) ?? "",
    canonical_url: (post == null ? void 0 : post.canonical_url) ?? "",
    language: (post == null ? void 0 : post.language) ?? "ur",
    categories: (post == null ? void 0 : post.categories) ?? [],
    og_image: null,
    remove_og_image: false,
    feature_hooks: (post == null ? void 0 : post.feature_hooks) ?? {}
  });
  const [prefillTagsInput, setPrefillTagsInput] = reactExports.useState(
    (((_b = (_a = post == null ? void 0 : post.feature_hooks) == null ? void 0 : _a.prefill) == null ? void 0 : _b.tags) ?? []).join(", ")
  );
  const featureHooks = form.data.feature_hooks ?? {};
  const updateFeatureHook = (key, value) => {
    form.setData("feature_hooks", {
      ...featureHooks,
      [key]: value
    });
  };
  const updatePrefill = (key, value) => {
    form.setData("feature_hooks", {
      ...featureHooks,
      prefill: {
        ...featureHooks.prefill ?? {},
        [key]: value
      }
    });
  };
  const submitWithStatus = (status) => {
    const url = isEdit ? route("admin.blog.posts.update", { post: post.id }) : route("admin.blog.posts.store");
    form.transform((payload) => {
      const hooks = cleanFeatureHooks(payload.feature_hooks);
      return {
        ...payload,
        status,
        feature_hooks: hooks ?? null,
        ...isEdit ? { _method: "put" } : {}
      };
    });
    form.post(url, {
      forceFormData: true,
      preserveScroll: true,
      onFinish: () => form.transform((payload) => payload)
    });
  };
  const toggleCategory = (categoryId) => {
    const values = form.data.categories ?? [];
    if (values.includes(categoryId)) {
      form.setData("categories", values.filter((value) => value !== categoryId));
    } else {
      form.setData("categories", [...values, categoryId]);
    }
  };
  const handleTagsChange = (value) => {
    setPrefillTagsInput(value);
    const tags = value.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0);
    updatePrefill("tags", tags);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "blog-posts", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      className: "space-y-6 p-6 md:p-10",
      onSubmit: (event) => {
        event.preventDefault();
        submitWithStatus(form.data.status ?? "draft");
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Admin · Blog" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold text-white", children: isEdit ? "Edit Post" : "Create Post" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: route("admin.blog.posts.index"),
              className: "text-sm font-semibold text-slate-300 hover:text-white",
              children: "← Back to posts"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Title",
              value: form.data.title,
              onChange: (event) => form.setData("title", event.target.value),
              error: form.errors.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Slug (optional)",
              value: form.data.slug,
              onChange: (event) => form.setData("slug", event.target.value),
              error: form.errors.slug,
              placeholder: "leave blank to auto-generate"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              label: "Excerpt",
              value: form.data.excerpt,
              onChange: (event) => form.setData("excerpt", event.target.value),
              error: form.errors.excerpt,
              rows: 3
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[2fr,1fr]", children: [
            form.data.content_format === "html" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              RichTextEditor,
              {
                label: "Content",
                value: form.data.content,
                onChange: (html) => form.setData("content", html),
                error: form.errors.content,
                placeholder: "Craft your story…"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Content" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: form.data.content,
                  onChange: (event) => form.setData("content", event.target.value),
                  rows: 14,
                  className: "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                }
              ),
              form.errors.content && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.content })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Format" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: form.data.content_format,
                    onChange: (event) => form.setData("content_format", event.target.value),
                    className: "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                    children: formatOptions.map((format) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: format, children: format }, format))
                  }
                ),
                form.errors.content_format && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.content_format })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-2 text-xs text-slate-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-slate-200", children: "Preview (raw)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-slate-200", children: form.data.content ? form.data.content_format === "html" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "prose prose-sm max-w-none prose-invert",
                    dangerouslySetInnerHTML: { __html: form.data.content }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap", children: form.data.content }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No content yet." }) })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Publishing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    value: form.data.status,
                    onChange: (event) => form.setData("status", event.target.value),
                    className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                    children: statusOptions.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status, children: status }, status))
                  }
                ),
                form.errors.status && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Publish at" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "datetime-local",
                    value: form.data.published_at ?? "",
                    onChange: (event) => form.setData("published_at", event.target.value),
                    className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                  }
                ),
                form.errors.published_at && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.published_at })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Language" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: form.data.language,
                  onChange: (event) => form.setData("language", event.target.value),
                  className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                }
              ),
              form.errors.language && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.language })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Categories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: categories.map((category) => {
              var _a2;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: (_a2 = form.data.categories) == null ? void 0 : _a2.includes(category.id),
                    onChange: () => toggleCategory(category.id),
                    className: "rounded border-slate-600 bg-slate-900 text-yellow-300 focus:ring-yellow-300"
                  }
                ),
                category.name
              ] }, category.id);
            }) }),
            form.errors.categories && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.categories })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "SEO & Sharing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "SEO Title",
              value: form.data.seo_title,
              onChange: (event) => form.setData("seo_title", event.target.value),
              error: form.errors.seo_title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              label: "SEO Description",
              value: form.data.seo_description,
              onChange: (event) => form.setData("seo_description", event.target.value),
              error: form.errors.seo_description,
              rows: 3
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "SEO Keywords (comma separated)",
              value: form.data.seo_keywords,
              onChange: (event) => form.setData("seo_keywords", event.target.value),
              error: form.errors.seo_keywords
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: "Canonical URL (optional)",
              value: form.data.canonical_url,
              onChange: (event) => form.setData("canonical_url", event.target.value),
              error: form.errors.canonical_url
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "OG Image" }),
            (post == null ? void 0 : post.og_image_url) && !form.data.remove_og_image && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: post.og_image_url,
                  alt: "OG preview",
                  className: "h-24 w-24 rounded-lg border border-slate-800 object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: form.data.remove_og_image,
                    onChange: (event) => form.setData("remove_og_image", event.target.checked)
                  }
                ),
                "Remove image"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                onChange: (event) => form.setData("og_image", event.target.files[0] ?? null),
                className: "w-full text-xs text-slate-300"
              }
            ),
            form.errors.og_image && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.og_image })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Activation Hooks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Primary category highlight" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: featureHooks.primaryCategory ?? "",
                  onChange: (event) => updateFeatureHook("primaryCategory", event.target.value || null),
                  className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "None" }),
                    categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: category.name, children: category.name }, category.id))
                  ]
                }
              ),
              form.errors["feature_hooks.primaryCategory"] && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors["feature_hooks.primaryCategory"] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "CTA route" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: featureHooks.ctaRoute ?? "register",
                  onChange: (event) => updateFeatureHook("ctaRoute", event.target.value),
                  className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "register", children: "Register" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "login", children: "Login" })
                  ]
                }
              ),
              form.errors["feature_hooks.ctaRoute"] && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors["feature_hooks.ctaRoute"] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Calculator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: featureHooks.calculator ?? "",
                onChange: (event) => updateFeatureHook("calculator", event.target.value || null),
                className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "None" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "school_fee_increase", children: "School fee increase" })
                ]
              }
            ),
            form.errors["feature_hooks.calculator"] && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors["feature_hooks.calculator"] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Prefill category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: ((_c = featureHooks == null ? void 0 : featureHooks.prefill) == null ? void 0 : _c.category) ?? "",
                  onChange: (event) => updatePrefill("category", event.target.value),
                  className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                  placeholder: "School"
                }
              ),
              form.errors["feature_hooks.prefill.category"] && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors["feature_hooks.prefill.category"] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Prefill amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  value: ((_d = featureHooks == null ? void 0 : featureHooks.prefill) == null ? void 0 : _d.amount) ?? "",
                  onChange: (event) => updatePrefill("amount", event.target.value),
                  className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                  placeholder: "15000"
                }
              ),
              form.errors["feature_hooks.prefill.amount"] && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors["feature_hooks.prefill.amount"] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Prefill note" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: ((_e = featureHooks == null ? void 0 : featureHooks.prefill) == null ? void 0 : _e.note) ?? "",
                  onChange: (event) => updatePrefill("note", event.target.value),
                  className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                  placeholder: "School fee increase"
                }
              ),
              form.errors["feature_hooks.prefill.note"] && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors["feature_hooks.prefill.note"] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Tags (comma separated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: prefillTagsInput,
                  onChange: (event) => handleTagsChange(event.target.value),
                  className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
                  placeholder: "fees,school"
                }
              ),
              form.errors["feature_hooks.prefill.tags"] && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors["feature_hooks.prefill.tags"] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => submitWithStatus("draft"),
              className: "rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200",
              disabled: form.processing,
              children: "Save Draft"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => submitWithStatus("published"),
              className: "rounded-lg bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-emerald-900",
              disabled: form.processing,
              children: "Publish Now"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => submitWithStatus("scheduled"),
              className: "rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900",
              disabled: form.processing,
              children: "Schedule"
            }
          )
        ] })
      ]
    }
  ) });
}
function Field({ label, value, onChange, error, placeholder }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value,
        onChange,
        placeholder,
        className: "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: error })
  ] });
}
function Textarea({ label, value, onChange, error, rows = 4 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        value,
        onChange,
        rows,
        className: "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: error })
  ] });
}
function ErrorText({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children });
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
export {
  BlogPostForm as default
};
