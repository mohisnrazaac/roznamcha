import { a as usePage, R as React, j as jsxRuntimeExports, H as Head_default, L as Link_default } from "../ssr.js";
import { T as ToolLayout, S as SaveWall, F as FinancialDisclaimer } from "./FinancialDisclaimer-Dla2tvLc.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-1rNy1Vsq.js";
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
import "./PublicLayout-Cdp3p9pO.js";
import "./ChatWidget-DFPdtWTT.js";
const formatCurrency = (value) => new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(Number(value ?? 0));
const clampNumber = (value, min = 0) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return min;
  return Math.max(min, parsed);
};
const faqItems = [
  {
    question: "Does this estimator use fixed slab values in code?",
    answer: "No. The progressive slab billing reads from the configurable slab_rates table so rates can be updated without changing frontend logic."
  },
  {
    question: "Why is this an estimate and not my exact bill?",
    answer: "It includes configurable placeholders for FPA and surcharges and applies GST, but actual utility bills can include additional line items or timing-based adjustments."
  },
  {
    question: "Can I use this without creating an account?",
    answer: "Yes. The estimator works fully in guest mode. Signup is only for saving estimates and reminders later."
  }
];
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};
const calculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Electricity Bill Estimator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: "https://roznamcha.pk/tools/electricity-bill-estimator",
  description: "Guest-mode Pakistan electricity bill estimator using progressive slab rates, GST, and surcharge placeholders with last-year comparison."
};
function ElectricityBillEstimator({ defaults, categories = [], gstPercentage = 17, gst_percentage, activationPrefill, seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? seoContent.electricityBillEstimator;
  const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
  const effectiveGst = gst_percentage ?? gstPercentage;
  const { auth } = usePage().props;
  const isAuthenticated = Boolean(auth == null ? void 0 : auth.user);
  const prefilledInputs = (activationPrefill == null ? void 0 : activationPrefill.inputs) ?? {};
  const prefilledResults = (activationPrefill == null ? void 0 : activationPrefill.results) ?? null;
  const [form, setForm] = React.useState({
    units_used: prefilledInputs.units_used ?? (defaults == null ? void 0 : defaults.units_used) ?? 250,
    user_category: prefilledInputs.user_category ?? (defaults == null ? void 0 : defaults.user_category) ?? "unprotected"
  });
  const [result, setResult] = React.useState(prefilledResults);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [revealResult, setRevealResult] = React.useState(Boolean(prefilledResults));
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
    const csrfToken = (_a = document.head.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Head_default, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "script",
            {
              type: "application/ld+json",
              dangerouslySetInnerHTML: { __html: JSON.stringify(faqJsonLd) }
            },
            "electricity-faq-schema"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "script",
            {
              type: "application/ld+json",
              dangerouslySetInnerHTML: { __html: JSON.stringify(calculatorJsonLd) }
            },
            "electricity-calculator-schema"
          )
        ] }),
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Static placeholder tip for now. Can be replaced with personalized AI suggestions later." })
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "Understanding NEPRA Tariff Slabs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-7 text-slate-600", children: "Electricity billing in Pakistan is governed by NEPRA's progressive slab rates, which categorize residential consumers into 'Protected' and 'Unprotected' groups. Understanding how these slabs function is critical to planning your monthly energy budget." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-7 text-slate-600", children: "For 'Protected' users (who use less than 200 units consecutively for 6 months), the per-unit rates are heavily subsidized. However, once you cross the 200-unit threshold, your category shifts to 'Unprotected', where per-unit rates increase significantly for each slab (e.g., 1–100, 101–200, 201–300, and so on)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Surcharges, Fuel Price Adjustments (FPA), and Taxes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-7 text-slate-600", children: "A common source of confusion in Pakistani utility bills is the difference between the base tariff slab rate and the final payable bill. The final bill includes various surcharges, Fuel Price Adjustments (FPA), and Government Taxes (including GST at 17% or higher, Excise Duty, and TV License fees). Since FPA varies month-to-month based on generation costs, keeping a buffer in your utility budget is highly recommended." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 bg-white border border-slate-200 rounded-2xl p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "Electricity Bill Estimator FAQs" }),
          faqItems.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-4 first:border-t-0 first:pt-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-800", children: faq.question }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 mt-1", children: faq.answer })
          ] }, faq.question))
        ] })
      ]
    }
  );
}
export {
  ElectricityBillEstimator as default
};
