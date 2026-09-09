import { b as reactExports, j as jsxRuntimeExports, r as router3 } from "../ssr.js";
import { A as AppLayout } from "./AppLayout-BgWqsN4y.js";
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
import "./ChatWidget-DFPdtWTT.js";
function Reports({
  selectedMonth,
  report = {},
  history = [],
  spendingByCategory = {},
  flash = {}
}) {
  var _a;
  const [month, setMonth] = reactExports.useState(selectedMonth ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
  const [aiState, setAiState] = reactExports.useState({ loading: true, data: null, error: "" });
  reactExports.useEffect(() => {
    let mounted = true;
    const loadAi = async () => {
      var _a2;
      try {
        const response = await fetchAiInsight("report");
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
  const handleGenerate = (event) => {
    event.preventDefault();
    router3.post(route("reports.generate"), { month }, { preserveScroll: true });
  };
  const totalSpend = report.total_spend ?? 0;
  const topCategories = Object.entries(report.top_categories ?? {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-5xl", children: [
    (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700", children: flash.success }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Home › Reports" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Reports" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleGenerate,
          className: "bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-900 text-sm font-semibold", children: "Month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "month",
                value: month,
                onChange: (event) => setMonth(event.target.value),
                className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-900 text-sm font-semibold", children: "Download" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 leading-snug", children: "Regenerate the monthly snapshot to capture the latest kharcha, ration, and reminders." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                className: "bg-[#003a8c] hover:bg-[#002a66] text-white font-semibold text-sm px-4 py-2 rounded-md shadow w-full",
                children: "Refresh Report"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 leading-snug", children: "Premium: Download Survival PDF (PKR 199)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-sm mb-2", children: "Recent Reports" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-xs text-slate-600", children: [
                history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "No history yet." }),
                history.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: entry.month }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-900", children: [
                    "₨ ",
                    entry.total_spend.toLocaleString()
                  ] })
                ] }, entry.month))
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-sm space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-900 text-sm font-semibold", children: [
              month,
              " Household Summary"
            ] }),
            report.generated_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500", children: [
              "Generated ",
              new Date(report.generated_at).toLocaleString()
            ] })
          ] }),
          report.ration_days_left_snapshot !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-md", children: [
            "Ration ",
            report.ration_days_left_snapshot,
            " days"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 uppercase font-medium", children: "Total Spend" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-slate-900", children: [
            "₨ ",
            Number(totalSpend).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-sm mb-2", children: "Top Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            topCategories.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: "No spending captured." }),
            topCategories.map(([name, amount]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[11px] bg-yellow-100 text-slate-800 rounded-md px-2 py-0.5 font-medium",
                children: [
                  name,
                  " • ₨ ",
                  Number(amount).toLocaleString()
                ]
              },
              name
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-sm mb-2", children: "Spending Breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-xs text-slate-700", children: Object.entries(spendingByCategory).map(([name, amount]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-900", children: [
              "₨ ",
              Number(amount).toLocaleString()
            ] })
          ] }, name)) })
        ] }),
        report.warnings_text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700", children: report.warnings_text })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AiInsightCard,
      {
        variant: "light",
        title: "Monthly Survival Story",
        description: "AI budget advisor summarises your month in 5 Urdu + English lines.",
        status: aiState.loading ? "Asking Roznamcha AI..." : aiState.error ? aiState.error : "",
        children: ((_a = aiState.data) == null ? void 0 : _a.story) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-relaxed text-slate-700", children: aiState.data.story })
      }
    )
  ] }) });
}
export {
  Reports as default
};
