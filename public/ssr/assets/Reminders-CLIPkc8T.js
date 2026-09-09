import { j as jsxRuntimeExports } from "../ssr.js";
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
function Reminders({ user, reminders = [] }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "reminders", user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Reminders / Health Guard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Keep medicine, school fees, utilities, and vehicle reminders in one cockpit." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500",
          children: "Add Reminder"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-slate-800 px-6 py-4 text-sm text-slate-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Upcoming reminders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: "Health, school, bills, petrol" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-800", children: reminders.length ? reminders.map((reminder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "flex items-center justify-between px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white", children: reminder.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: reminder.reminder_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: reminder.notes ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-200", children: reminder.due_date ?? "No due date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: reminder.is_done ? "Completed" : "Pending" })
        ] })
      ] }, reminder.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-10 text-center text-slate-400", children: "No reminders yet. Add a BP medicine dose, school fee, or petrol refill reminder." }) })
    ] })
  ] }) });
}
export {
  Reminders as default
};
