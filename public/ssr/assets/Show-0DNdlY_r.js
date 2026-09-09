import { a as usePage, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
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
const safeRoute = (name, params, fallback) => {
  try {
    return route(name, params);
  } catch (error) {
    return typeof fallback === "function" ? fallback(params) : fallback ?? "#";
  }
};
function UsersShow({ managedUser, kharchas = [], rationItems = [] }) {
  var _a, _b;
  const { props } = usePage();
  const flash = props.flash ?? {};
  const currency = ((_b = (_a = props.translations) == null ? void 0 : _a.commons) == null ? void 0 : _b.currency) ?? "₨";
  const editLabel = "Edit";
  const deleteLabel = "Delete";
  const deleteExpenseConfirm = "Delete this expense?";
  const deleteRationConfirm = "Delete this ration item?";
  const deleteUser = (force = false) => {
    const message = force ? `Force delete ${managedUser.name}? This will remove all of their data.` : `Delete ${managedUser.name}?`;
    if (!window.confirm(message)) {
      return;
    }
    const endpoint = safeRoute("admin.users.destroy", managedUser.id, `/admin/users/${managedUser.id}`);
    deleteResource(endpoint, {
      data: { force },
      preserveScroll: true
    });
  };
  const deleteExpense = (expenseId) => {
    if (!window.confirm(deleteExpenseConfirm)) {
      return;
    }
    const endpoint = safeRoute(
      "admin.users.kharcha.destroy",
      { user: managedUser.id, expense: expenseId },
      `/admin/users/${managedUser.id}/kharcha/${expenseId}`
    );
    deleteResource(endpoint, { preserveScroll: true });
  };
  const deleteRation = (rationId) => {
    if (!window.confirm(deleteRationConfirm)) {
      return;
    }
    const endpoint = safeRoute(
      "admin.users.ration.destroy",
      { user: managedUser.id, ration: rationId },
      `/admin/users/${managedUser.id}/ration/${rationId}`
    );
    deleteResource(endpoint, { preserveScroll: true });
  };
  const formatAmount = (value) => `${currency} ${Number(value ?? 0).toLocaleString(void 0, { minimumFractionDigits: 2 })}`;
  const hasRelatedRecords = (managedUser.kharcha_count ?? 0) + (managedUser.ration_count ?? 0) > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "users", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("admin.users.index"), className: "text-xs uppercase tracking-wide text-slate-400 hover:text-slate-200", children: "← Back to users" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-2xl font-semibold", children: managedUser.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: managedUser.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
          "Role: ",
          managedUser.role,
          " · Joined ",
          managedUser.created_at
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => deleteUser(false),
            className: "rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500",
            children: "Delete User"
          }
        ),
        hasRelatedRecords && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => deleteUser(true),
            className: "rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10",
            children: "Force Delete"
          }
        )
      ] })
    ] }),
    flash.success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100", children: flash.success }),
    flash.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-100", children: flash.error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-1 gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Kharcha entries", value: managedUser.kharcha_count ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Ration items", value: managedUser.ration_count ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Records total",
          value: (managedUser.kharcha_count ?? 0) + (managedUser.ration_count ?? 0),
          accent: true
        }
      )
    ] }),
    hasRelatedRecords && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
      "Force deleting will purge ",
      managedUser.kharcha_count,
      " kharcha and ",
      managedUser.ration_count,
      " ration entries permanently."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b border-slate-800 px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Kharcha overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
          "Showing latest ",
          kharchas.length,
          " entries."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900/80 text-xs uppercase text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Note" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-800 text-slate-100", children: [
          kharchas.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-6 text-center text-slate-500", children: "No expenses yet." }) }),
          kharchas.map((expense) => {
            var _a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-800/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: expense.date ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: ((_a2 = expense.category) == null ? void 0 : _a2.name) ?? "Uncategorized" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: expense.note ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold", children: formatAmount(expense.amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 text-xs font-semibold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link_default,
                  {
                    href: route("panel.kharcha.edit", expense.id),
                    className: "text-yellow-300 hover:text-yellow-200",
                    children: editLabel
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => deleteExpense(expense.id),
                    className: "text-red-300 hover:text-red-200",
                    children: deleteLabel
                  }
                )
              ] }) })
            ] }, expense.id);
          })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b border-slate-800 px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Ration overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Active pantry items for this user." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900/80 text-xs uppercase text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Item" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Unit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-800 text-slate-100", children: [
          rationItems.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-6 text-center text-slate-500", children: "No ration items yet." }) }),
          rationItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-800/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: item.unit ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-300", children: item.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-slate-700/60 px-2 py-1 text-xs text-slate-400", children: "Archived" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 text-xs font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: route("panel.ration.edit", item.id),
                  className: "text-yellow-300 hover:text-yellow-200",
                  children: editLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => deleteRation(item.id),
                  className: "text-red-300 hover:text-red-200",
                  children: deleteLabel
                }
              )
            ] }) })
          ] }, item.id))
        ] })
      ] }) })
    ] })
  ] }) });
}
function StatCard({ label, value, accent = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-2xl border p-5 ${accent ? "border-yellow-400/70 bg-yellow-400/10 text-yellow-200" : "border-slate-800 bg-slate-900/60 text-slate-100"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-2xl font-semibold", children: value })
      ]
    }
  );
}
export {
  UsersShow as default
};
