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
function KharchaIndex({ expenses, categories, filters = {}, totals = {}, users = [] }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const { props } = usePage();
  const translations = props.translations ?? {};
  const kharcha = translations.kharcha ?? {};
  const commons = translations.commons ?? {};
  const actions = translations.actions ?? {};
  const editLabel = actions.edit ?? "Edit";
  const deleteLabel = actions.delete ?? "Delete";
  const deleteConfirm = actions.confirm_delete ?? "Delete this expense?";
  const actionsLabel = commons.actions_label ?? editLabel ?? "Actions";
  const currency = commons.currency ?? "₨";
  const role = (((_b = (_a = props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.role) ?? "").toLowerCase();
  const isAdmin = role.includes("admin");
  const [form, setForm] = reactExports.useState({
    from: filters.from ?? "",
    to: filters.to ?? "",
    category: filters.category ?? "",
    user_id: filters.user_id ?? ""
  });
  const [aiState, setAiState] = reactExports.useState({ loading: true, data: null, error: "" });
  reactExports.useEffect(() => {
    let isMounted = true;
    const loadAi = async () => {
      var _a2;
      try {
        const response = await fetchAiInsight("kharcha");
        if (isMounted) {
          setAiState({ loading: false, data: response, error: "" });
        }
      } catch (error) {
        if (isMounted) {
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
      isMounted = false;
    };
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };
  const applyFilters = (event) => {
    event.preventDefault();
    router3.get(route("panel.kharcha.index"), form, { preserveState: true, preserveScroll: true });
  };
  const clearFilters = () => {
    setForm({ from: "", to: "", category: "", user_id: "" });
    router3.get(route("panel.kharcha.index"), {}, { preserveState: true, preserveScroll: true });
  };
  const rows = (expenses == null ? void 0 : expenses.data) ?? [];
  const confirmDelete = (expenseId) => {
    if (!window.confirm(deleteConfirm)) {
      return;
    }
    deleteResource(route("panel.kharcha.destroy", { expense: expenseId }), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "kharcha", user: (_c = props.auth) == null ? void 0 : _c.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 uppercase tracking-wide", children: "Panel › Kharcha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: kharcha.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: kharcha.subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: route("panel.kharcha.create"),
          className: "inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200",
          children: kharcha.add_expense
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: kharcha.totals_month, value: totals.month, currency }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: kharcha.totals_today, value: totals.today, currency }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: kharcha.average_daily, value: totals.average_daily, currency })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      AiInsightCard,
      {
        title: "Kharcha Advisor",
        description: "Month-to-month spikes plus bilingual savings tips.",
        status: aiState.loading ? "Generating AI summary..." : aiState.error ? aiState.error : "",
        children: [
          ((_d = aiState.data) == null ? void 0 : _d.summary) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-100", children: aiState.data.summary }),
          ((_f = (_e = aiState.data) == null ? void 0 : _e.top_risks) == null ? void 0 : _f.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Top risks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside text-slate-200 space-y-1", children: aiState.data.top_risks.map((risk, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: risk }, `${risk}-${index}`)) })
          ] }),
          ((_h = (_g = aiState.data) == null ? void 0 : _g.suggestions) == null ? void 0 : _h.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "Suggestions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 text-slate-200", children: aiState.data.suggestions.map((tip, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-lg bg-slate-800/70 px-3 py-2", children: tip }, `${tip}-${index}`)) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: applyFilters, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-200", children: commons.filters }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `grid grid-cols-1 gap-4 text-slate-900 ${isAdmin ? "md:grid-cols-5" : "md:grid-cols-4"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                name: "from",
                value: form.from,
                onChange: handleChange,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm",
                placeholder: commons.date_from
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                name: "to",
                value: form.to,
                onChange: handleChange,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm",
                placeholder: commons.date_to
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                name: "category",
                value: form.category,
                onChange: handleChange,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: commons.category }),
                  categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: category.id, children: category.name }, category.id))
                ]
              }
            ),
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                name: "user_id",
                value: form.user_id,
                onChange: handleChange,
                className: "rounded-lg border border-slate-300 px-3 py-2 text-sm",
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
                  className: "flex-1 rounded-lg bg-[#003a8c] px-3 py-2 text-sm font-semibold text-white",
                  children: actions.refresh
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: clearFilters,
                  className: "rounded-lg border border-slate-500 px-3 py-2 text-sm font-semibold text-slate-200",
                  children: actions.cancel
                }
              )
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-center justify-between border-b border-slate-800 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: kharcha.list_title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
          "(",
          commons.currency,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-slate-800 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-900/80 text-slate-400 uppercase text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: kharcha.tx_date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: commons.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: commons.note }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: commons.amount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: actionsLabel })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-800 text-slate-200", children: [
          rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: isAdmin ? 6 : 5, className: "px-4 py-6 text-center text-slate-500", children: kharcha.no_rows }) }),
          rows.map((expense) => {
            var _a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-800/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: expense.tx_date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-2", children: ((_a2 = expense.category) == null ? void 0 : _a2.name) ?? "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: expense.note ?? "—" }),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: expense.owner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold", children: expense.owner.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: expense.owner.email })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-slate-500", children: "Unknown" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-semibold", children: [
                currency,
                " ",
                Number(expense.amount ?? 0).toLocaleString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-4 text-xs font-semibold", children: [
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
                    onClick: () => confirmDelete(expense.id),
                    className: "text-red-300 hover:text-red-200",
                    children: deleteLabel
                  }
                )
              ] }) })
            ] }, expense.id);
          })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-800 px-6 py-4 text-xs text-slate-400 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Page ",
          expenses == null ? void 0 : expenses.current_page,
          " / ",
          expenses == null ? void 0 : expenses.last_page
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-x-2", children: (_i = expenses == null ? void 0 : expenses.links) == null ? void 0 : _i.map(
          (link) => link.url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `px-2 py-1 rounded ${link.active ? "bg-yellow-300 text-slate-900" : "bg-slate-800 text-slate-200"}`,
              onClick: () => router3.get(link.url, {}, { preserveState: true, preserveScroll: true }),
              dangerouslySetInnerHTML: { __html: link.label }
            },
            link.label
          ) : null
        ) })
      ] })
    ] })
  ] }) });
}
function StatCard({ label, value, currency }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-2xl font-semibold", children: [
      currency,
      " ",
      Number(value ?? 0).toLocaleString(void 0, { minimumFractionDigits: 2 })
    ] })
  ] });
}
export {
  KharchaIndex as default
};
