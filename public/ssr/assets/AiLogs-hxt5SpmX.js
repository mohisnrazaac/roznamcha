import { a as usePage, j as jsxRuntimeExports, r as router3 } from "../ssr.js";
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
function AiLogs({ logs, dailyTotals = [], dailyLimit = 20 }) {
  var _a;
  const { props } = usePage();
  const user = (_a = props.auth) == null ? void 0 : _a.user;
  const entries = (logs == null ? void 0 : logs.data) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "ai-logs", user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Admin › AI Logs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "AI Usage Monitor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400", children: [
        "Free tier allows ",
        dailyLimit,
        " calls per user per day. Watch for quota spikes before upgrading."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white mb-3", children: "Last 7 days total calls" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
        dailyTotals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400", children: "No AI activity recorded yet." }),
        dailyTotals.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-800/60 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: entry.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold text-white", children: entry.total })
        ] }, entry.date))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-slate-800 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900/80 text-slate-400 text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Module" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Requests" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-800", children: [
          entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-4 py-6 text-center text-slate-500", children: "No usage recorded yet." }) }),
          entries.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-800/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-200", children: log.used_on_date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-200", children: log.user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-white", children: log.user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: log.user.email })
            ] }) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 capitalize", children: log.module }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-white", children: log.request_count })
          ] }, log.id))
        ] })
      ] }),
      (logs == null ? void 0 : logs.links) && logs.links.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 px-4 py-4 text-xs", children: logs.links.map(
        (link) => link.url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `px-3 py-1 rounded-lg ${link.active ? "bg-yellow-300 text-slate-900" : "bg-slate-800 text-slate-200"}`,
            onClick: () => router3.get(link.url, {}, { preserveScroll: true }),
            dangerouslySetInnerHTML: { __html: link.label }
          },
          link.label
        ) : null
      ) })
    ] })
  ] }) });
}
export {
  AiLogs as default
};
