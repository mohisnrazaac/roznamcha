import { b as reactExports, j as jsxRuntimeExports, L as Link_default, r as router3 } from "../ssr.js";
import { C as ControlRoomLayout } from "./ControlRoomLayout-BmJqwnTf.js";
import { d as deleteResource } from "./inertia-BZ67yCN7.js";
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
function CategoriesIndex({ categories, filters = {}, users = [] }) {
  const [selectedUser, setSelectedUser] = reactExports.useState(filters.user_id ?? "");
  const handleDelete = (id) => {
    if (confirm("Delete this category?")) {
      deleteResource(`/admin/categories/${id}`);
    }
  };
  const applyFilter = (event) => {
    event.preventDefault();
    router3.get(
      route("admin.categories.index"),
      selectedUser ? { user_id: selectedUser } : {},
      { preserveState: true, preserveScroll: true }
    );
  };
  const resetFilter = () => {
    setSelectedUser("");
    router3.get(route("admin.categories.index"), {}, { preserveState: true, preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "categories", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Categories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Organise expenses and cockpit modules by category." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: "/admin/categories/create",
          className: "inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500",
          children: "Add Category"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: applyFilter, className: "flex flex-col gap-3 md:flex-row md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-200", htmlFor: "admin-category-user", children: "Filter by user" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "admin-category-user",
          value: selectedUser,
          onChange: (event) => setSelectedUser(event.target.value),
          className: "flex-1 rounded-lg border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All records" }),
            users.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: user.id, children: [
              user.name,
              " (",
              user.email,
              ")"
            ] }, user.id))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white", children: "Apply" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: resetFilter,
            className: "rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200",
            children: "Reset"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-800/80 text-slate-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Owner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-medium", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-800", children: categories.length ? categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-800/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-medium text-white", children: [
          category.name,
          category.is_default && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-200", children: "Default" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-300", children: category.description || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: category.owner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white", children: category.owner.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: category.owner.email })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Global" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: category.created_at }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: `/admin/categories/${category.id}/edit`,
              className: "rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white",
              children: "Edit"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleDelete(category.id),
              className: "rounded-lg border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 transition hover:border-red-400 hover:text-red-300",
              children: "Delete"
            }
          )
        ] }) })
      ] }, category.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-6 text-center text-slate-400", children: "No categories created yet." }) }) })
    ] }) })
  ] }) });
}
export {
  CategoriesIndex as default
};
