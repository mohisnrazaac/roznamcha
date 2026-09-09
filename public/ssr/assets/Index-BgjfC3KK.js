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
function RationIndex({ items = [], users = [], filters = {} }) {
  var _a, _b, _c, _d, _e, _f;
  const { props } = usePage();
  const translations = props.translations ?? {};
  const ration = translations.ration ?? {};
  const commons = translations.commons ?? {};
  const actions = translations.actions ?? {};
  const currency = (commons == null ? void 0 : commons.currency) ?? "₨";
  const editLabel = actions.edit ?? "Edit";
  const deleteLabel = actions.delete ?? "Delete";
  const deleteConfirm = actions.confirm_delete ?? "Delete this ration item?";
  const actionsLabel = (commons == null ? void 0 : commons.actions_label) ?? editLabel ?? "Actions";
  const role = (((_b = (_a = props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.role) ?? "").toLowerCase();
  const isAdmin = role.includes("admin");
  const [aiState, setAiState] = reactExports.useState({ loading: true, data: null, error: "" });
  const [selectedUser, setSelectedUser] = reactExports.useState(filters.user_id ?? "");
  reactExports.useEffect(() => {
    let active = true;
    const loadAi = async () => {
      var _a2;
      try {
        const response = await fetchAiInsight("ration");
        if (active) {
          setAiState({ loading: false, data: response, error: "" });
        }
      } catch (error) {
        if (active) {
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
      active = false;
    };
  }, []);
  const confirmDelete = (itemId) => {
    if (!window.confirm(deleteConfirm)) {
      return;
    }
    deleteResource(route("panel.ration.destroy", { ration: itemId }), {
      preserveScroll: true
    });
  };
  const onFilterSubmit = (event) => {
    event.preventDefault();
    router3.get(
      route("panel.ration.index"),
      selectedUser ? { user_id: selectedUser } : {},
      { preserveState: true, preserveScroll: true }
    );
  };
  const resetFilters = () => {
    setSelectedUser("");
    router3.get(route("panel.ration.index"), {}, { preserveState: true, preserveScroll: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "ration", user: (_c = props.auth) == null ? void 0 : _c.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Panel › Ration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: ration.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: ration.subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: route("panel.ration.create"),
          className: "inline-flex items-center rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200",
          children: ration.new_item
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      AiInsightCard,
      {
        title: "Ration Brain Alerts",
        description: "Price spikes and grocery items to watch next.",
        status: aiState.loading ? "Checking ration prices..." : aiState.error ? aiState.error : "",
        children: [
          (((_d = aiState.data) == null ? void 0 : _d.alerts) ?? []).length === 0 && !aiState.loading && !aiState.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-200", children: "No recent AI alerts. Keep logging ration prices for smarter trends." }),
          ((_f = (_e = aiState.data) == null ? void 0 : _e.alerts) == null ? void 0 : _f.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: aiState.data.alerts.map((alert, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg bg-slate-800/70 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: alert.item }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400", children: [
              "Trend: ",
              alert.trend,
              " • Risk: ",
              alert.risk
            ] })
          ] }, `${alert.item}-${index}`)) })
        ]
      }
    ),
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onFilterSubmit, className: "flex flex-col gap-3 text-slate-900 md:flex-row md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-200", htmlFor: "user_id", children: "Filter by user" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: "user_id",
          value: selectedUser,
          onChange: (event) => setSelectedUser(event.target.value),
          className: "rounded-lg border border-slate-400 px-3 py-2 text-sm flex-1",
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "rounded-lg bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white",
            children: "Apply"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: resetFilters,
            className: "rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200",
            children: "Reset"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-slate-800 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900/80 text-xs uppercase text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: ration.title }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: ration.latest_price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: ration.last_month_price }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: ration.delta }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: ration.last_updated }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: actionsLabel })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-800 text-slate-100", children: [
        items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: isAdmin ? 7 : 6, className: "px-4 py-6 text-center text-slate-500", children: ration.empty }) }),
        items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400", children: [
              item.unit,
              item.is_default && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase", children: "Default" })
            ] })
          ] }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-300", children: item.owner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white", children: item.owner.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: item.owner.email })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Global" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: formatCurrency(item.latest_price, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-300", children: formatCurrency(item.last_month_price, currency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.delta_percent === null ? "—" : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: item.delta_percent > 0 ? "text-red-300" : "text-emerald-300", children: [
            item.delta_percent > 0 ? "+" : "",
            item.delta_percent,
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: item.latest_at ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-4 text-xs font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: route("panel.ration.edit", item.id),
                className: `text-yellow-300 hover:text-yellow-200 ${item.can_manage ? "" : "pointer-events-none opacity-40"}`,
                "aria-disabled": !item.can_manage,
                children: editLabel
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => confirmDelete(item.id),
                className: `text-red-300 hover:text-red-200 ${item.can_manage ? "" : "pointer-events-none opacity-40"}`,
                disabled: !item.can_manage,
                children: deleteLabel
              }
            )
          ] }) })
        ] }, item.id))
      ] })
    ] }) })
  ] }) });
}
function formatCurrency(value, currency) {
  if (!value) return "—";
  return `${currency} ${Number(value).toLocaleString(void 0, { minimumFractionDigits: 2 })}`;
}
export {
  RationIndex as default
};
