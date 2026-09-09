import { b as reactExports, j as jsxRuntimeExports, L as Link_default, r as router3 } from "../ssr.js";
import { A as AppLayout } from "./AppLayout-BgWqsN4y.js";
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
import "./ChatWidget-DFPdtWTT.js";
function KharchaMapList({
  expenses,
  filters = {},
  categories = [],
  flash = {}
}) {
  const [form, setForm] = reactExports.useState({
    category: filters.category ?? "",
    search: filters.search ?? "",
    month: filters.month ?? ""
  });
  const rows = (expenses == null ? void 0 : expenses.data) ?? [];
  const summary = (expenses == null ? void 0 : expenses.pagination) ?? {};
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };
  const submitFilters = (event) => {
    event.preventDefault();
    router3.get(route("kharcha.map"), form, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const resetFilters = () => {
    const cleared = { category: "", search: "", month: "" };
    setForm(cleared);
    router3.get(route("kharcha.map"), cleared, {
      preserveState: true,
      preserveScroll: true
    });
  };
  const handleDelete = (id) => {
    if (!window.confirm("Delete this expense?")) {
      return;
    }
    deleteResource(route("kharcha.destroy", id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700", children: flash.success }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Home › Kharcha Map" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Kharcha Map" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link_default,
          {
            href: route("kharcha.add"),
            className: "bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow inline-flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg leading-none", children: "＋" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add Expense" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "border border-slate-300 hover:border-slate-400 text-slate-700 bg-white text-sm font-medium px-4 py-2 rounded-md shadow-sm",
            onClick: () => router3.visit(route("kharcha.map")),
            children: "Refresh"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: submitFilters,
        className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-900 text-sm font-semibold", children: "Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "month",
                name: "month",
                value: form.month,
                onChange: handleFilterChange,
                className: "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                placeholder: "Month"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                name: "category",
                value: form.category,
                onChange: handleFilterChange,
                className: "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Categories" }),
                  categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: category.id, children: category.name }, category.id))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                name: "search",
                value: form.search,
                onChange: handleFilterChange,
                className: "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                placeholder: "Search description"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow",
                children: "Apply Filters"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: resetFilters,
                className: "border border-slate-300 hover:border-slate-400 text-slate-700 bg-white text-sm font-medium px-4 py-2 rounded-md shadow-sm",
                children: "Reset"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-left text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-medium", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-medium", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-medium", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-medium text-right", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 font-medium text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
          rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              colSpan: 5,
              className: "px-4 py-6 text-center text-xs text-slate-500",
              children: "No expenses recorded yet."
            }
          ) }),
          rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 text-xs text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: row.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block h-2 w-2 rounded-full",
                  style: { backgroundColor: row.category_color ?? "#CBD5F5" }
                }
              ),
              row.category ?? "Uncategorised"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.description ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-right font-semibold text-slate-900", children: [
              "₨ ",
              row.amount.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right space-x-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleDelete(row.id),
                className: "text-[11px] text-red-500 hover:text-red-600 px-2 py-1 border border-red-200 rounded-md shadow-sm",
                children: "Delete"
              }
            ) })
          ] }, row.id))
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-slate-200 text-[11px] text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Showing ",
          rows.length,
          " of ",
          summary.total ?? rows.length,
          " records"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-400", children: [
          "Page ",
          summary.current_page ?? 1,
          " / ",
          summary.last_page ?? 1
        ] })
      ] })
    ] })
  ] }) });
}
export {
  KharchaMapList as default
};
