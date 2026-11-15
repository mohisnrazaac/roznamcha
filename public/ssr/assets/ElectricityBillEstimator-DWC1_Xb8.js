import { a as usePage, R as React, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { T as ToolLayout, S as SaveWall, F as FinancialDisclaimer, R as RelatedLinksBlock } from "./RelatedLinksBlock-Cq2MIJqG.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-DP7kLgW-.js";
import { A as APPLIANCE_PRESETS, S as SlabCliffVisualizer, a as ApplianceBreakdown } from "./ApplianceBreakdown-C-9vVLt_.js";
import { A as AuthorEditorialBlock, H as HouseholdPlanningSuite } from "./HouseholdPlanningSuite-CLjqZImt.js";
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
import "./PublicLayout-8f9iGZFn.js";
import "./ChatWidget-DFPdtWTT.js";
import "./index-h3QfXfrJ.js";
const formatCurrency = (value) => new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(Number(value ?? 0));
const clampNumber = (value, min = 0) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return min;
  return Math.max(min, parsed);
};
const defaultFaqItems = [
  {
    question: "Does this estimator use fixed slab values in code?",
    answer: "No. The progressive slab billing reads from the official NEPRA tariff schedule so rates can be updated without changing frontend logic."
  },
  {
    question: "Why is this an estimate and not my exact bill?",
    answer: "It includes configurable placeholders for FPA and surcharges and applies GST, but actual utility bills can include additional line items or timing-based adjustments."
  },
  {
    question: "Can I use this without creating an account?",
    answer: "Yes. The estimator works fully in guest mode. Signup is only for saving estimates and reminders later."
  },
  {
    question: "What is the difference between protected and unprotected consumers in Pakistan?",
    answer: "Under NEPRA tariff regulations, consumers using under 200 units per month consecutively for six months are classified as protected with subsidized rates. Exceeding 200 units reclassifies the meter as unprotected, triggering substantially higher progressive slab rates."
  },
  {
    question: "How do Fuel Price Adjustments (FPA) and taxes affect my final bill?",
    answer: "FPA accounts for monthly changes in generation fuel mix approved by NEPRA. Bills also incur electricity duty, financing cost surcharges, standard GST, and fixed meter charges that apply above the raw slab rate."
  }
];
function ElectricityBillEstimator({
  defaults,
  categories = [],
  gstPercentage = 18,
  gst_percentage,
  initialResult,
  activationPrefill,
  faqItems: faqItemsProp,
  seo: seoProp,
  jsonLd: jsonLdProp
}) {
  const seo = seoProp ?? seoContent.electricityBillEstimator;
  const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
  const activeFaqItems = faqItemsProp ?? defaultFaqItems;
  const effectiveGst = gst_percentage ?? gstPercentage;
  const { auth } = usePage().props;
  const isAuthenticated = Boolean(auth == null ? void 0 : auth.user);
  const prefilledInputs = (activationPrefill == null ? void 0 : activationPrefill.inputs) ?? {};
  const validInitialResult = Number(initialResult == null ? void 0 : initialResult.total_bill) > 0 ? initialResult : null;
  const defaultInitialResult = validInitialResult ?? (activationPrefill == null ? void 0 : activationPrefill.results) ?? {
    slab_cost: 8324,
    total_bill: 10616,
    last_year_estimate: 7850,
    difference: 2766
  };
  const [form, setForm] = React.useState({
    units_used: prefilledInputs.units_used ?? (defaults == null ? void 0 : defaults.units_used) ?? 250,
    user_category: prefilledInputs.user_category ?? (defaults == null ? void 0 : defaults.user_category) ?? "unprotected"
  });
  const defaultAppliances = React.useMemo(() => {
    const state = {};
    APPLIANCE_PRESETS.forEach((preset) => {
      state[preset.id] = {
        hours: preset.defaultHours,
        qty: preset.defaultQty
      };
    });
    return state;
  }, []);
  const [appliancesState, setAppliancesState] = React.useState(defaultAppliances);
  const handleApplianceChange = (nextState, newTotal) => {
    setAppliancesState(nextState);
    setForm((prev) => ({
      ...prev,
      units_used: newTotal,
      user_category: newTotal <= 200 ? "protected" : "unprotected"
    }));
  };
  const [result, setResult] = React.useState(defaultInitialResult);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [revealResult, setRevealResult] = React.useState(Boolean(defaultInitialResult));
  const [scrollDepth, setScrollDepth] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
      setScrollDepth(window.scrollY / maxScrollable);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const highlightResult = Boolean(result) && scrollDepth >= 0.65 && scrollDepth <= 0.75;
  const handleSubmit = async (event) => {
    var _a;
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setRevealResult(false);
    const csrfToken = (typeof window !== "undefined" && window.getCsrfToken ? await window.getCsrfToken() : null) || ((_a = document.head.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) || "";
    try {
      const response = await fetch("/tools/electricity-bill-estimator/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken ?? "",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          units_used: clampNumber(form.units_used, 1),
          user_category: form.user_category
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data == null ? void 0 : data.message) ?? "Calculation failed");
      }
      setResult(data);
      window.requestAnimationFrame(() => setRevealResult(true));
    } catch (submitError) {
      setError(submitError.message || "Unable to estimate bill right now.");
    } finally {
      setIsLoading(false);
    }
  };
  const estimatedAnnualSavings = React.useMemo(() => {
    if (!result || !form.units_used) return 0;
    const averageCostPerUnit = Number(result.total_bill || 0) / Math.max(1, Number(form.units_used));
    return Math.max(0, averageCostPerUnit * 40 * 12);
  }, [form.units_used, result]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ToolLayout,
    {
      title: "Electricity Bill Estimator",
      subtitle: "Estimate your bill with progressive slab rates, GST, and surcharge placeholders before the bill arrives.",
      description: "Guest mode electricity estimator for Pakistan households with last-year comparison and configurable slab rates.",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd: pageSchema }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 mb-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-[#001a4a]", children: "Electricity Bill Estimator: Anticipate Unit Slabs & Surcharges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-6 text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Understanding NEPRA's Progressive Slabs:" }),
            " Pakistani electricity bills are governed by a progressive slab structure. Crossing a single unit threshold (such as moving from 200 to 201 units, or 300 to 301 units) doesn't just charge the extra unit at a higher rate—it recalculates your entire bill on a significantly higher tariff bracket."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-6 text-slate-700", children: "This tool simulates your monthly bill based on current NEPRA consumer categories (Protected vs. Unprotected) and adjustable surcharges. By tracking your daily meter readings, you can adjust your household usage before you cross into a penalizing tier." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-[#001a4a] mb-2", children: "How to Use the Electricity Bill Estimator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal pl-5 text-sm text-slate-600 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Check Your Protected Status:" }),
                " If you consume under 200 units consistently for 6 months, you remain in the subsidized Protected category."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Input Estimated Monthly Units:" }),
                " Enter your expected unit consumption based on your meter readings."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Preview Taxes and FPA:" }),
                " See a breakdown of Fuel Price Adjustments (FPA), financing surcharges, and GST."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Optimize Consumption:" }),
                " Identify how many units you need to save to drop back down to the next lower billing slab."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.05fr_0.95fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: handleSubmit,
              className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-[#001a4a]", children: "Bill Inputs" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Run a quick estimate in guest mode." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200", children: "Guest Mode" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Units used" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "1",
                      value: form.units_used,
                      onChange: (e) => setForm((prev) => ({ ...prev, units_used: e.target.value })),
                      className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Category" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: form.user_category,
                      onChange: (e) => setForm((prev) => ({ ...prev, user_category: e.target.value })),
                      className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-[#001a4a] focus:outline-none",
                      children: categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: category, children: category === "protected" ? "Protected" : "Unprotected" }, category))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "GST applied in estimate: ",
                    effectiveGst,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "FPA and surcharges are configurable placeholders (not locked values)." })
                ] }),
                error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700", children: error }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isLoading,
                    className: "inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#012261] disabled:opacity-60 disabled:cursor-not-allowed",
                    children: isLoading ? "Estimating..." : "Estimate Electricity Bill"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SlabCliffVisualizer,
              {
                units: Math.max(1, Number(form.units_used) || 1),
                disco: "lesco"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "section",
              {
                className: [
                  "rounded-2xl border p-6 transition-all duration-500",
                  result ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-slate-200/80",
                  highlightResult ? "ring-2 ring-amber-300 shadow-xl motion-safe:animate-pulse" : ""
                ].join(" "),
                children: !result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Result" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold text-[#001a4a]", children: "Estimated bill will appear here" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "This estimator uses progressive slabs and a last-year comparison to make tariff changes visible before bill day." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-4 transform transition-all duration-500 ${revealResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Estimated Bill" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-3xl font-semibold text-[#001a4a] mt-2", children: [
                      "PKR ",
                      formatCurrency(result.total_bill)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-slate-700", children: [
                      "Due to tariff adjustments, your bill is PKR ",
                      formatCurrency(Math.abs(Number(result.difference) || 0)),
                      " ",
                      Number(result.difference) >= 0 ? "higher" : "lower",
                      " than last year."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
                      "Slab cost: PKR ",
                      formatCurrency(result.slab_cost),
                      " | Last year estimate: PKR ",
                      formatCurrency(result.last_year_estimate)
                    ] })
                  ] })
                ] })
              }
            ),
            result ? (
              // ROZNAMCHA-ACTIVATION: place save wall immediately below computed result.
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SaveWall,
                {
                  toolKey: "electricity_bill_estimator",
                  inputs: { ...form },
                  results: { ...result },
                  isAuthenticated,
                  saveEndpoint: "tools.snapshots.store",
                  returnUrl: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/tools/electricity-bill-estimator"
                }
              )
            ) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialDisclaimer, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-[#001a4a]/10 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-blue-700", children: "Ask Roza: Electricity Insight" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700 mt-2", children: [
                "Reducing 40 units per month could save PKR ",
                formatCurrency(estimatedAnnualSavings),
                " annually."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Manage heavy appliances during daylight hours or off-peak times to keep usage in lower slabs." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-[#001a4a] text-white rounded-2xl p-6 shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold", children: "Save this estimation for next month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/75 mt-1", children: "Get reminder before bill arrives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/register",
                  className: "mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-white",
                  children: "Save this estimation"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ApplianceBreakdown,
          {
            appliancesState,
            onChange: handleApplianceChange,
            currentUnits: Math.max(1, Number(form.units_used) || 1)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mt-12 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2 border-b border-slate-100 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-[#8c5a00] font-semibold", children: "Editorial Documentation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "NEPRA Tariff Slabs, Billing Formulas & Optimization Guide" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "A detailed breakdown of progressive tariff slabs, surcharges, protected consumer thresholds, and household conservation practices across Pakistani DISCOs." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Methodology & Calculation Mechanics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-7 text-slate-700", children: "Residential electricity billing in Pakistan follows a multi-tier progressive slab schedule specified by NEPRA. Your consumption is tiered across sequential brackets (1–100, 101–200, 201–300, 301–400, 401–500, 501–600, 601–700, and 701+ units)." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#001a4a]", children: "Total Payable Bill = (Cumulative Base Slab Cost) + (Fuel Price Adjustment / FPA × Units) + (Financing Cost Surcharge) + (Electricity Duty) + (General Sales Tax / GST at 17%) + (TV License Fee & Meter Rent)" }),
              ". The estimator calculates each bracket mathematically to reveal the exact marginal cost of incremental kilowatt-hours."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-slate-700", children: [
              "If your monthly bill is consuming a large share of your household earnings, simulate rooftop solar generation with our",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/tools/solar-net-metering-roi-calculator", className: "font-semibold text-[#001a4a] underline", children: "Solar Net Metering & ROI Calculator" }),
              " ",
              "or balance your utilities against total earnings in our",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/tools/monthly-household-budget-calculator", className: "font-semibold text-[#001a4a] underline", children: "Monthly Household Budget Calculator" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3 border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "NEPRA Uniform National Tariff & DISCO Coverage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-slate-700", children: [
              "Under Pakistan's national uniform electricity tariff notified by NEPRA (S.R.O. 279(I)/2026), the exact same base slab rates apply identically across all distribution companies, including ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "LESCO" }),
              " (Lahore), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "IESCO" }),
              " (Islamabad/Rawalpindi), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "MEPCO" }),
              " (Multan), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "FESCO" }),
              " (Faisalabad), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "GEPCO" }),
              " (Gujranwala), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "PESCO" }),
              " (Peshawar), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "HESCO" }),
              " (Hyderabad), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "SEPCO" }),
              " (Sukkur), ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "QESCO" }),
              " (Quetta), and ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "K-Electric" }),
              " (Karachi). Minor differences between your actual monthly bills across DISCOs arise solely from monthly variable Fuel Charges Adjustments (FCA/FPA), quarterly adjustments (QTA), and municipal electricity duties."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-slate-700", children: [
              "Tariff slabs distinguish strictly between ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Protected Consumers" }),
              " (using 200 or fewer units consecutively for six months, who receive subsidized tiered pricing with previous-slab benefits) and ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Unprotected Consumers" }),
              " (whose entire monthly consumption is billed non-telescopically at the highest applicable slab rate)."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-base font-bold text-[#001a4a] pt-3", children: "Worked Bill Examples by Unit Consumption (2026 NEPRA Domestic Slabs)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-slate-200 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full divide-y divide-slate-200 text-xs sm:text-sm text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-700 font-semibold", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Monthly Units" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Consumer Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Base Energy Tariff" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Base Energy Cost" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Estimated Total Bill (PKR)" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100 bg-white text-slate-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900", children: "100 Units" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 text-emerald-700 font-medium", children: "Protected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Rs 10.54 / unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Rs 1,054" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900", children: "~Rs 1,690" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900", children: "100 Units" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 text-amber-700 font-medium", children: "Unprotected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Rs 22.44 / unit (non-telescopic)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Rs 2,244" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900", children: "~Rs 4,288" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900", children: "200 Units" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 text-emerald-700 font-medium", children: "Protected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "100 @ Rs 10.54 + 100 @ Rs 13.01" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Rs 2,355" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900", children: "~Rs 3,580" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-rose-50/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-bold text-rose-900", children: "201 Units (Cliff Jump!)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 text-rose-700 font-bold", children: "Unprotected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 text-rose-800", children: "All 201 @ Rs 33.15 / unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-semibold text-rose-800", children: "Rs 6,663" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-bold text-rose-900", children: "~Rs 10,210 (+185% surge)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900", children: "300 Units" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 text-amber-700 font-medium", children: "Unprotected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "All 300 @ Rs 33.15 / unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Rs 9,945" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900", children: "~Rs 15,000" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-medium text-slate-900", children: "500 Units" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 text-amber-700 font-medium", children: "Unprotected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "All 500 @ Rs 40.17 / unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3", children: "Rs 20,085" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 sm:px-4 sm:py-3 font-semibold text-slate-900", children: "~Rs 30,500 (incl. 7.5% Adv Tax)" })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-slate-700 pt-2", children: [
              "To explore how our energy models track government notifications, inspect our",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/methodology", className: "font-semibold text-[#001a4a] underline", children: "Methodology & Data Sources" }),
              " ",
              "directory."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-amber-300 bg-amber-50/70 p-5 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-2.5 w-2.5 rounded-full bg-amber-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-slate-900 text-base", children: "Current NEPRA Tariff & Adjustment Schedule (S.R.O. 279(I)/2026)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-slate-700", children: "Effective nationwide under NEPRA notifications, all DISCO electricity bills are calculated with statutory monthly fuel charges and periodic surcharges:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200/80 bg-white p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Fuel Charge Adjustment (FCA)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-900 mt-0.5", children: "Rs 2.37 / unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500", children: "Monthly fuel price adjustment" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200/80 bg-white p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Quarterly Adjustment (QTA)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-900 mt-0.5", children: "Rs 0.52 / unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500", children: "System capacity recovery" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200/80 bg-white p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Financing Cost Surcharge" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-slate-900 mt-0.5", children: "Rs 3.23 / unit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500", children: "Rs 0.43 for protected" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200/80 bg-white p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Late Payment Surcharge" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold text-rose-700 mt-0.5", children: "+5% to +10%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500", children: "+5% within 3 days, +10% after" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Practical Application Guide: Avoiding the 201-Unit Cliff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-7 text-slate-700", children: "Household electricity bills can surge exponentially from minor usage changes. Implement these rules to protect your monthly energy budget:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 space-y-2 text-sm leading-7 text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Monitor Meter Readings on Day 20:" }),
                " Check your meter dial 10 days before the meter reader visits. If reading 180 units, restrict air cooler, iron, and washing machine usage to remain strictly below the 200-unit cliff."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Isolate Heavy Inductive Loads:" }),
                " Ironing clothes in a single batch, servicing refrigerator coils, and setting inverter AC thermostats to 26°C instead of 20°C cuts monthly energy consumption by 40 to 60 units."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Evaluate Solar Net Metering:" }),
                " If your household consistently consumes 500+ units monthly, installing rooftop solar offsets peak grid tariffs (Rs. 58+/unit) with a rapid 3-year payback."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-t border-slate-100 pt-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Frequently Asked Questions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: activeFaqItems.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50/50 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-[#001a4a]", children: faq.question }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-relaxed text-slate-600", children: faq.answer })
            ] }, faq.question)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AuthorEditorialBlock,
            {
              authorName: "Mohsin Raza",
              authorRole: "Founder & Software Architect (16+ Years Experience)",
              lastUpdated: "November 2026"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HouseholdPlanningSuite, { currentPath: "/tools/electricity-bill-estimator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RelatedLinksBlock,
          {
            relatedTools: [
              { title: "Solar Net Metering ROI Calculator", href: "/tools/solar-net-metering-roi-calculator" },
              { title: "Monthly Household Budget Calculator", href: "/tools/monthly-household-budget-calculator" }
            ],
            relatedBlogs: [
              { title: "Pakistan Electricity Tariff Increases & Household Budgeting Defense (2026)", href: "/blog/pakistan-electricity-tariff-increases-and-household-budgeting-defense-2026" },
              { title: "Inverter AC vs Non-Inverter Power Consumption Testing in Pakistan", href: "/blog/inverter-ac-vs-non-inverter-power-consumption-practical-testing-for-pakistani-summer-loads" },
              { title: "Solar Net Metering Regulations in Pakistan (2026): ROI & Payback", href: "/blog/solar-net-metering-regulations-in-pakistan-2026-payback-period-and-roi-breakdown" },
              { title: "Solar Battery Storage Economics: LiFePO4 vs Tubular Battery", href: "/blog/solar-battery-storage-economics-in-pakistan-lifepo4-vs-tubular-battery-roi-2026" }
            ]
          }
        )
      ]
    }
  );
}
export {
  ElectricityBillEstimator as default
};
