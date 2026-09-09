import { a as usePage, b as reactExports, j as jsxRuntimeExports, L as Link_default, r as router3 } from "../ssr.js";
import { C as ControlRoomLayout } from "./ControlRoomLayout-BmJqwnTf.js";
import { d as deleteResource } from "./inertia-BZ67yCN7.js";
import { A as AiInsightCard, f as fetchAiInsight } from "./ai-DqjHlyq0.js";
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
function RemindersIndex({ reminders = [], meta = {}, filters = {}, users = [] }) {
  var _a, _b, _c, _d, _e, _f;
  const { props } = usePage();
  const translations = props.translations ?? {};
  const rem = translations.reminders ?? {};
  const actions = translations.actions ?? {};
  const role = (((_b = (_a = props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.role) ?? "").toLowerCase();
  const isAdmin = role.includes("admin");
  const [aiState, setAiState] = reactExports.useState({ loading: true, data: null, error: "" });
  const [selectedUser, setSelectedUser] = reactExports.useState(filters.user_id ?? "");
  reactExports.useEffect(() => {
    let mounted = true;
    const loadAi = async () => {
      var _a2;
      try {
        const response = await fetchAiInsight("reminder");
        if (mounted) {
          setAiState({ loading: false, data: response, error: "" });
        }
      } catch (error) {
        if (mounted) {
          setAiState({
            loading: false,
            data: (error == null ? void 0 : error.data) ?? null,
            error: ((_a2 = error == null ? void 0 : error.data) == null ? void 0 : _a2.message) ?? error.message ?? "Unable to load AI insight."
          });
        }
      }
    };
    loadAi();
    return () => {
      mounted = false;
    };
  }, []);
  const toggle = (id) => {
    router3.post(route("panel.reminders.toggle", id), {}, { preserveScroll: true });
  };
  const destroy = (id) => {
    if (confirm("Delete reminder?")) {
      deleteResource(route("panel.reminders.destroy", id), { preserveScroll: true });
    }
  };
  const applyFilter = (event) => {
    event.preventDefault();
    router3.get(
      route("panel.reminders.index"),
      selectedUser ? { user_id: selectedUser } : {},
      { preserveState: true, preserveScroll: true }
    );
  };
  const resetFilter = () => {
    setSelectedUser("");
    router3.get(route("panel.reminders.index"), {}, { preserveState: true, preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "reminders", user: (_c = props.auth) == null ? void 0 : _c.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase text-slate-400", children: "Panel › Reminders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: rem.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: rem.subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: route("panel.reminders.create"),
          className: "inline-flex items-center rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200",
          children: rem.new_reminder
        }
      )
    ] }),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: applyFilter, className: "flex flex-col gap-3 md:flex-row md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "reminder-user-filter", className: "text-sm font-semibold text-slate-200", children: "Filter by user" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "reminder-user-filter",
          value: selectedUser,
          onChange: (event) => setSelectedUser(event.target.value),
          className: "flex-1 rounded-lg border border-slate-400 px-3 py-2 text-sm text-slate-900",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All users" }),
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded-lg bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white", children: "Apply" }),
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      AiInsightCard,
      {
        title: "Reminder Coach",
        description: "Recurring kharcha the AI thinks deserves gentle nudges.",
        status: aiState.loading ? "Scanning reminders..." : aiState.error ? aiState.error : "",
        children: [
          (((_d = aiState.data) == null ? void 0 : _d.suggestions) ?? []).length === 0 && !aiState.loading && !aiState.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-200", children: "Add reminders or record more kharcha to get AI suggestions." }),
          ((_f = (_e = aiState.data) == null ? void 0 : _e.suggestions) == null ? void 0 : _f.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: aiState.data.suggestions.map((suggestion, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg bg-slate-800/70 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white", children: suggestion.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: suggestion.schedule })
          ] }, `${suggestion.title}-${index}`)) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-slate-800", children: [
      reminders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-12 text-center text-slate-500 text-sm", children: rem.empty }),
      reminders.map((reminder) => {
        var _a2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "px-6 py-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: reminder.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: [
              labelForType(reminder.type, translations),
              " • ",
              reminder.schedule_cron
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
              ((_a2 = translations.reminders) == null ? void 0 : _a2.next_email_label) ?? "Next email",
              ":",
              " ",
              reminder.next_run_display ?? "calculating…",
              " (",
              reminder.timezone,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500", children: [
              reminder.starts_on ?? "Start?",
              " → ",
              reminder.ends_on ?? "Open"
            ] }),
            isAdmin && reminder.owner && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500", children: [
              "Owner: ",
              reminder.owner.name,
              " (",
              reminder.owner.email,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggle(reminder.id),
                className: `rounded-lg px-3 py-1 font-semibold ${reminder.is_active ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-800 text-slate-300"} ${reminder.can_manage ? "" : "pointer-events-none opacity-40"}`,
                disabled: !reminder.can_manage,
                children: reminder.is_active ? actions.disable : actions.enable
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: route("panel.reminders.edit", reminder.id),
                className: `rounded-lg bg-[#003a8c] px-3 py-1 font-semibold text-white ${reminder.can_manage ? "" : "pointer-events-none opacity-40"}`,
                children: actions.edit
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => destroy(reminder.id),
                className: `rounded-lg border border-red-400 px-3 py-1 font-semibold text-red-300 ${reminder.can_manage ? "" : "pointer-events-none opacity-40"}`,
                disabled: !reminder.can_manage,
                children: actions.delete
              }
            )
          ] })
        ] }, reminder.id);
      })
    ] }) })
  ] }) });
}
function labelForType(type, translations) {
  const rem = translations.reminders ?? {};
  switch (type) {
    case "finance":
      return rem.type_finance;
    case "health":
      return rem.type_health;
    case "faith":
      return rem.type_faith;
    default:
      return rem.type_other;
  }
}
export {
  RemindersIndex as default
};
