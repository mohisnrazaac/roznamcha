import { u as useForm, j as jsxRuntimeExports, r as router3 } from "../ssr.js";
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
function Reminders({ reminders = [], meta = {}, flash = {} }) {
  const form = useForm({
    type: "bill",
    title: "",
    description: "",
    next_due: "",
    frequency: "monthly"
  });
  const submit = (event) => {
    event.preventDefault();
    form.post(route("reminders.store"), {
      onSuccess: () => form.reset("title", "description", "next_due")
    });
  };
  const toggleStatus = (reminder) => {
    router3.put(
      route("reminders.update", reminder.id),
      {
        type: reminder.type,
        title: reminder.title,
        description: reminder.description ?? "",
        next_due: reminder.next_due ?? "",
        frequency: reminder.frequency,
        status: reminder.status === "done" ? "pending" : "done"
      },
      { preserveScroll: true }
    );
  };
  const deleteReminder = (id) => {
    if (!window.confirm("Delete this reminder?")) {
      return;
    }
    deleteResource(route("reminders.destroy", id), { preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700", children: flash.success }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Home › Reminders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Reminders" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-3", children: [
        reminders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500", children: "No reminders yet. Add KE bill, school fee or medicine alerts." }),
        reminders.map((reminder) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm flex flex-col gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-sm", children: reminder.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
                      ((_a = meta.types) == null ? void 0 : _a[reminder.type]) ?? reminder.type,
                      " •",
                      " ",
                      reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleStatus(reminder),
                        className: `text-[11px] px-2 py-1 rounded-md border ${reminder.status === "done" ? "border-emerald-200 text-emerald-600" : "border-slate-300 text-slate-600"}`,
                        children: reminder.status === "done" ? "Mark pending" : "Mark done"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => deleteReminder(reminder.id),
                        className: "text-[11px] text-red-500 border border-red-200 px-2 py-1 rounded-md",
                        children: "Delete"
                      }
                    )
                  ] })
                ] }),
                reminder.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-600", children: reminder.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    "Next due:",
                    " ",
                    reminder.next_due ? new Date(reminder.next_due).toLocaleString() : "not set"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900", children: [
                    "Status: ",
                    reminder.status.toUpperCase()
                  ] })
                ] })
              ]
            },
            reminder.id
          );
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 mb-3", children: "Add reminder" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: form.data.type,
                onChange: (event) => form.setData("type", event.target.value),
                className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                children: Object.entries(meta.types ?? {}).map(([value, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value, children: label }, value))
              }
            ),
            form.errors.type && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.type })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: form.data.title,
                onChange: (event) => form.setData("title", event.target.value),
                className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                placeholder: "KE Bill"
              }
            ),
            form.errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                rows: 3,
                value: form.data.description,
                onChange: (event) => form.setData("description", event.target.value),
                className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                placeholder: "Short note"
              }
            ),
            form.errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Next due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "datetime-local",
                value: form.data.next_due,
                onChange: (event) => form.setData("next_due", event.target.value),
                className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
              }
            ),
            form.errors.next_due && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.next_due })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: form.data.frequency,
                onChange: (event) => form.setData("frequency", event.target.value),
                className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                children: (meta.frequencies ?? []).map((frequency) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: frequency, children: frequency.charAt(0).toUpperCase() + frequency.slice(1) }, frequency))
              }
            ),
            form.errors.frequency && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.frequency })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: form.processing,
              className: "w-full bg-[#003a8c] hover:bg-[#002a66] disabled:bg-[#003a8c]/60 text-white font-semibold text-sm px-4 py-2 rounded-md shadow",
              children: form.processing ? "Saving…" : "Add Reminder"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Reminders as default
};
