import { a as usePage, b as reactExports, j as jsxRuntimeExports, r as router3 } from "../ssr.js";
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
function Reports({
  authUser,
  subjectUser,
  monthLabel,
  totalSpend,
  rationDaysLeft,
  upcomingFees = [],
  health = {},
  breakdown = [],
  recentActivity = [],
  filters = {},
  users = []
}) {
  var _a, _b, _c, _d, _e;
  const { props } = usePage();
  const translations = props.translations ?? {};
  const [month, setMonth] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const downloadUrl = ((_a = props == null ? void 0 : props.flash) == null ? void 0 : _a.report_download_url) ?? null;
  const [selectedUser, setSelectedUser] = reactExports.useState(filters.user_id ?? "");
  const role = ((authUser == null ? void 0 : authUser.role) ?? "").toLowerCase();
  const isAdmin = role.includes("admin");
  const generateReport = (event) => {
    event.preventDefault();
    setIsGenerating(true);
    router3.post(
      route("panel.reports.survival"),
      { month },
      {
        preserveScroll: true,
        onFinish: () => setIsGenerating(false)
      }
    );
  };
  const applyUserFilter = (event) => {
    event.preventDefault();
    router3.get(
      route("reports.index"),
      selectedUser ? { user_id: selectedUser } : {},
      { preserveState: true, preserveScroll: true }
    );
  };
  const resetUserFilter = () => {
    setSelectedUser("");
    router3.get(route("reports.index"), {}, { preserveState: true, preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "reports", user: authUser, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Reports & Signals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
          "Monthly survival report for ",
          monthLabel,
          ". Designed for the household CFO."
        ] }),
        isAdmin && subjectUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
          "Viewing data for ",
          subjectUser.name,
          " (",
          subjectUser.email,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: generateReport, className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "month",
            value: month,
            onChange: (event) => setMonth(event.target.value),
            className: "rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-white"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: isGenerating,
            className: "inline-flex items-center justify-center rounded-lg border border-yellow-400 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400/10 disabled:opacity-50",
            children: isGenerating ? "Generating…" : (_b = translations.reports) == null ? void 0 : _b.survival_cta
          }
        )
      ] })
    ] }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: applyUserFilter, className: "flex flex-col gap-3 md:flex-row md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reports-user-filter", className: "text-sm font-semibold text-slate-200", children: "Filter by user" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "reports-user-filter",
          value: selectedUser,
          onChange: (event) => setSelectedUser(event.target.value),
          className: "flex-1 rounded-lg border border-slate-500 bg-slate-900 px-3 py-2 text-sm text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "My account" }),
            users.map((userOption) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: userOption.id, children: [
              userOption.name,
              " (",
              userOption.email,
              ")"
            ] }, userOption.id))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white",
            children: "Apply"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: resetUserFilter,
            className: "rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200",
            children: "Reset"
          }
        )
      ] })
    ] }) }),
    downloadUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-400 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200", children: [
      (_c = translations.reports) == null ? void 0 : _c.survival_ready,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: downloadUrl, target: "_blank", rel: "noopener noreferrer", className: "underline", children: ((_d = translations.actions) == null ? void 0 : _d.download) ?? "Download" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-300", children: (_e = translations.reports) == null ? void 0 : _e.survival_empty }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Spend this month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-3xl font-semibold", children: [
          "₨ ",
          Number(totalSpend ?? 0).toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Ration days left" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-3xl font-semibold", children: rationDaysLeft ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Health Guard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold", children: health.label ?? "BP Medicine" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
          health.status ?? "Today",
          " • Next dose ",
          health.nextCheck ?? "9:00 PM"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Upcoming fees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1 text-sm text-slate-300", children: upcomingFees.map((fee, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fee.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: fee.due })
        ] }, index)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wide text-slate-500", children: "Breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: breakdown.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            item.percent,
            "%"
          ] })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wide text-slate-500", children: "Recent activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3 text-sm", children: recentActivity.map((activity, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-white", children: activity.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
              activity.date,
              " • ",
              activity.category
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-white", children: [
            "₨ ",
            Number(activity.amount ?? 0).toLocaleString()
          ] })
        ] }, index)) })
      ] })
    ] })
  ] }) });
}
export {
  Reports as default
};
