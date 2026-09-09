import { u as useForm, j as jsxRuntimeExports, r as router3 } from "../ssr.js";
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
function BlogCategories({ categories = [] }) {
  const createForm = useForm({
    name: "",
    slug: ""
  });
  const handleCreate = (event) => {
    event.preventDefault();
    createForm.post(route("admin.blog.categories.store"), {
      preserveScroll: true,
      onSuccess: () => createForm.reset()
    });
  };
  const handleDelete = (categoryId) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }
    router3.delete(route("admin.blog.categories.destroy", categoryId), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "blog-categories", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Admin · Blog" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold text-white", children: "Categories" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Create new" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: createForm.data.name,
              onChange: (event) => createForm.setData("name", event.target.value),
              className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            }
          ),
          createForm.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: createForm.errors.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-slate-200", children: "Slug (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: createForm.data.slug,
              onChange: (event) => createForm.setData("slug", event.target.value),
              className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            }
          ),
          createForm.errors.slug && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: createForm.errors.slug })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900",
            disabled: createForm.processing,
            children: "Add Category"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-slate-800 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Slug" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-800 text-slate-200", children: [
        categories.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-6 text-center text-slate-500", children: "No categories yet." }) }),
        categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryRow, { category, onDelete: handleDelete }, category.id))
      ] })
    ] }) }) })
  ] }) });
}
function CategoryRow({ category, onDelete }) {
  const form = useForm({
    name: category.name,
    slug: category.slug ?? ""
  });
  const handleUpdate = (event) => {
    event.preventDefault();
    form.put(route("admin.blog.categories.update", category.id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-900/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: form.data.name,
          onChange: (event) => form.setData("name", event.target.value),
          className: "w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white"
        }
      ),
      form.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: form.data.slug,
          onChange: (event) => form.setData("slug", event.target.value),
          className: "w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white"
        }
      ),
      form.errors.slug && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorText, { children: form.errors.slug })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-slate-400", children: category.created_at ?? "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleUpdate,
          className: "rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-200",
          disabled: form.processing,
          children: "Save"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onDelete(category.id),
          className: "rounded-lg border border-red-600 px-3 py-1 text-xs text-red-300",
          children: "Delete"
        }
      )
    ] })
  ] });
}
function ErrorText({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400", children });
}
export {
  BlogCategories as default
};
