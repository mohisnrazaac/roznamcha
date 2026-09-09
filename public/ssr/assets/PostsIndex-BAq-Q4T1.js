import { b as reactExports, j as jsxRuntimeExports, L as Link_default, r as router3 } from "../ssr.js";
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
function BlogPostsIndex({ posts, filters = {}, statusOptions = [] }) {
  const [form, setForm] = reactExports.useState({
    search: filters.search ?? "",
    status: filters.status ?? ""
  });
  const applyFilters = (event) => {
    event.preventDefault();
    router3.get(route("admin.blog.posts.index"), form, { preserveScroll: true, replace: true });
  };
  const resetFilters = () => {
    setForm({ search: "", status: "" });
    router3.get(route("admin.blog.posts.index"), {}, { preserveScroll: true, replace: true });
  };
  const handlePublish = (postId) => {
    router3.post(route("admin.blog.posts.publish", postId), {}, { preserveScroll: true });
  };
  const handleDraft = (postId) => {
    router3.post(route("admin.blog.posts.draft", postId), {}, { preserveScroll: true });
  };
  const handleDelete = (postId) => {
    if (!window.confirm("Delete this post?")) {
      return;
    }
    router3.delete(route("admin.blog.posts.destroy", postId), {
      preserveScroll: true
    });
  };
  const rows = (posts == null ? void 0 : posts.data) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "blog-posts", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Admin · Blog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold text-white", children: "Posts" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: route("admin.blog.posts.create"),
          className: "inline-flex items-center gap-2 rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-slate-900",
          children: "Create Post"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: applyFilters, className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "search",
          placeholder: "Search title or excerpt",
          value: form.search,
          onChange: (event) => setForm((prev) => ({ ...prev, search: event.target.value })),
          className: "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: form.status,
          onChange: (event) => setForm((prev) => ({ ...prev, status: event.target.value })),
          className: "rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
            statusOptions.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status, children: status }, status))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "flex-1 rounded-lg bg-[#003a8c] px-3 py-2 text-sm font-semibold text-white", children: "Apply" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: resetFilters,
            className: "rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200",
            children: "Reset"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-slate-800 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Published" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-800 text-slate-200", children: [
          rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-6 text-center text-slate-500", children: "No posts found." }) }),
          rows.map((post) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-900/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: post.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: post.excerpt })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs uppercase tracking-wide", children: post.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-slate-400", children: post.published_at ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-slate-400", children: (_a = post.categories) == null ? void 0 : _a.map((category) => category.name).join(", ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right space-x-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link_default,
                  {
                    href: route("admin.blog.posts.edit", post.id),
                    className: "rounded-lg border border-slate-600 px-3 py-1 text-xs",
                    children: "Edit"
                  }
                ),
                post.status !== "published" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handlePublish(post.id),
                    className: "rounded-lg border border-emerald-500/60 px-3 py-1 text-xs text-emerald-300",
                    children: "Publish"
                  }
                ),
                post.status !== "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDraft(post.id),
                    className: "rounded-lg border border-orange-500/60 px-3 py-1 text-xs text-orange-300",
                    children: "Draft"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDelete(post.id),
                    className: "rounded-lg border border-red-600/60 px-3 py-1 text-xs text-red-300",
                    children: "Delete"
                  }
                )
              ] })
            ] }, post.id);
          })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-800 px-4 py-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { links: (posts == null ? void 0 : posts.links) ?? [] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
          "Showing ",
          rows.length,
          " of ",
          (posts == null ? void 0 : posts.total) ?? rows.length,
          " posts"
        ] })
      ] })
    ] })
  ] }) });
}
function Pagination({ links }) {
  if (!links || links.length <= 3) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-wrap gap-2", children: links.map((link) => {
    if (!link.url) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-500",
          dangerouslySetInnerHTML: { __html: link.label }
        },
        link.label
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link_default,
      {
        href: link.url,
        className: `rounded-lg px-3 py-1 text-xs ${link.active ? "bg-white/10 text-white" : "border border-slate-700 text-slate-300"}`,
        dangerouslySetInnerHTML: { __html: link.label }
      },
      link.label
    );
  }) });
}
export {
  BlogPostsIndex as default
};
