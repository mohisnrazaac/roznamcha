import { a as usePage, R as React, j as jsxRuntimeExports, H as Head_default, L as Link_default } from "../ssr.js";
import { T as ToolLayout, S as SaveWall, F as FinancialDisclaimer } from "./FinancialDisclaimer-Cjc1-bYY.js";
import { R as RelatedLinksBlock } from "./RelatedLinksBlock-DGsmGHba.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-C4Ivadry.js";
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
import "./PublicLayout-D7ZrLYf0.js";
import "./ChatWidget-DFPdtWTT.js";
const formatCurrency = (value) => new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(value);
const clampNumber = (value, min = 0) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return min;
  return Math.max(min, parsed);
};
const calculateTotal = (items, quantities) => (items ?? []).reduce((sum, item) => {
  const qty = clampNumber((quantities == null ? void 0 : quantities[item.key]) ?? 0);
  return sum + qty * Number(item.price ?? 0);
}, 0);
const exampleScenarios = [
  {
    key: "small-household",
    title: "Small household keeping basics simple",
    householdSize: 2,
    description: "A couple or two adults buying only staple kitchen items here and handling sabzi, doodh, and meat separately.",
    quantities: {
      atta: 12,
      rice: 5,
      oil: 3,
      sugar: 3,
      daal: 4
    }
  },
  {
    key: "default-family",
    title: "Four-person family starter basket",
    householdSize: 4,
    description: "A practical starting point for a small family before fresh produce, tea, milk, and school snacks are added.",
    quantities: {
      atta: 20,
      rice: 10,
      oil: 5,
      sugar: 6,
      daal: 6
    }
  },
  {
    key: "mid-size-family",
    title: "Six-person family under pressure",
    householdSize: 6,
    description: "A mid-size household that cooks most meals at home and needs a sturdier monthly ration line in the budget.",
    quantities: {
      atta: 28,
      rice: 14,
      oil: 7,
      sugar: 8,
      daal: 9
    }
  },
  {
    key: "joint-family",
    title: "Larger family with frequent refills",
    householdSize: 8,
    description: "Useful when a joint family or guest-heavy household needs to stress-test staples before the month starts.",
    quantities: {
      atta: 36,
      rice: 18,
      oil: 9,
      sugar: 10,
      daal: 12
    }
  }
];
const faqItems = [
  {
    question: "How does this tool estimate grocery costs?",
    answer: "The tool multiplies the quantities you input for staples (atta, rice, oil, sugar, daal) by the baseline retail prices configured in the database, allowing you to establish a basic food cost benchmark before you shop."
  },
  {
    question: "Why are fresh vegetables, meat, and milk missing from the list?",
    answer: "This tool focuses exclusively on long-shelf-life dry staples to establish your core kitchen baseline. Highly volatile fresh perishables (milk, meat, vegetables) should be budgeted separately."
  },
  {
    question: "Can I use this estimator for free without registering?",
    answer: "Yes, the calculator is fully functional in guest mode. Registration is only required if you wish to save your grocery plans and view them inside your household workspace."
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
  name: "Ration Cost Estimator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: "https://roznamcha.pk/tools/ration-cost-estimator",
  description: "Guest-mode Pakistan ration budget calculator using configurable staple prices for atta, rice, oil, sugar, and daal."
};
function RationCostEstimator({
  currency,
  currencySymbol,
  defaultHouseholdSize,
  items,
  relatedLinks,
  activationPrefill,
  seo: seoProp,
  jsonLd: jsonLdProp
}) {
  const { auth } = usePage().props;
  const isAuthenticated = Boolean(auth == null ? void 0 : auth.user);
  const seo = seoProp ?? seoContent.rationCostEstimator;
  const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
  const prefillInputs = (activationPrefill == null ? void 0 : activationPrefill.inputs) ?? {};
  const [householdSize, setHouseholdSize] = React.useState(
    clampNumber(prefillInputs.householdSize ?? defaultHouseholdSize ?? 4, 1)
  );
  const [quantities, setQuantities] = React.useState(
    () => (items ?? []).reduce((acc, item) => {
      var _a;
      const prefilled = (_a = prefillInputs == null ? void 0 : prefillInputs.quantities) == null ? void 0 : _a[item.key];
      acc[item.key] = prefilled ?? item.default_quantity ?? 0;
      return acc;
    }, {})
  );
  const lineItems = items ?? [];
  const total = React.useMemo(() => {
    return calculateTotal(lineItems, quantities);
  }, [lineItems, quantities]);
  const breakdown = React.useMemo(() => {
    const subtotal = total || 1;
    return lineItems.map((item) => {
      const quantity = clampNumber(quantities[item.key] ?? 0);
      const itemTotal = quantity * Number(item.price ?? 0);
      return {
        ...item,
        quantity,
        itemTotal,
        share: Math.round(itemTotal / subtotal * 100)
      };
    }).sort((left, right) => right.itemTotal - left.itemTotal);
  }, [lineItems, quantities, total]);
  const scenarioCards = React.useMemo(() => {
    return exampleScenarios.map((scenario) => ({
      ...scenario,
      total: calculateTotal(lineItems, scenario.quantities)
    }));
  }, [lineItems]);
  const handleQuantityChange = (key, value) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ToolLayout,
    {
      title: "Ration Cost Estimator",
      subtitle: "Estimate a realistic staple ration budget for your household before the next grocery run or monthly budget reset.",
      description: "This guest-mode tool gives Pakistani families a quick planning benchmark using configurable base prices for atta, rice, oil, sugar, and daal.",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd: pageSchema }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Head_default, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "script",
            {
              type: "application/ld+json",
              dangerouslySetInnerHTML: { __html: JSON.stringify(calculatorJsonLd) }
            },
            "ration-estimator-calculator-schema"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "script",
            {
              type: "application/ld+json",
              dangerouslySetInnerHTML: { __html: JSON.stringify(faqJsonLd) }
            },
            "ration-estimator-faq-schema"
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 mb-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-[#001a4a]", children: "Why standard budgeting templates fail in Pakistan’s markets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-6 text-slate-700", children: "Grocery budgeting in Pakistan is highly challenging due to volatile, fluctuating prices of essential commodities like cooking oil, sugar, and flour. A static checklist doesn't help when retail karyana shop prices shift weekly." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-6 text-slate-700", children: "This tool matches local market data with your household size, allowing you to establish a realistic monthly planning margin. By calculating your base requirements before you shop, you avoid reactive purchases and protect your family budget from sudden price hikes." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-[#001a4a] mb-2", children: "How to Use the Ration Cost Estimator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal pl-5 text-sm text-slate-600 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Select Your Household Size:" }),
                " The estimator uses average consumption baselines for Pakistani families to calculate daily and weekly quantities for staples."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Adjust Unit Prices:" }),
                " We pre-fill average wholesale/retail rates, but you can override them with the exact prices from your neighborhood market."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Review the Total Ration Cost:" }),
                " See an itemized breakdown of flour (atta), pulses (daal), cooking oil (ghee), and tea (chai) to identify the highest cost drivers."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Export to Your Ledger:" }),
                " Save these values directly to your Roznamcha workspace to automatically monitor actual grocery spending against your estimate."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70", children: "Who It Helps" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-lg font-semibold text-[#001a4a]", children: "Households planning before prices bite" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: "Use this page if you want a quick ration benchmark before salary day, market day, or a monthly budget review." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70", children: "What Is Included" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-lg font-semibold text-[#001a4a]", children: "Five staple items with editable quantities" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: [
              "The built-in basket covers ",
              lineItems.map((item) => item.label).join(", "),
              ". You can change every quantity before calculating."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70", children: "What It Is Not" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-lg font-semibold text-[#001a4a]", children: "A planning benchmark, not a live market survey" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: "This page does not pull live mandi or supermarket prices, and it does not include sabzi, gosht, doodh, masalay, or delivery costs." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-[#001a4a]", children: "Build your monthly staple basket" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Start with your normal monthly quantities. Adjust the basket to match how your household actually buys staples." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700", children: "Guest Mode" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-[#001a4a]", children: "Monthly quantities" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: lineItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "grid gap-2 sm:grid-cols-[1.4fr_0.8fr_0.6fr] items-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700", children: item.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
                        "Base price: ",
                        currencySymbol,
                        " ",
                        formatCurrency(item.price ?? 0),
                        " / ",
                        item.unit
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: quantities[item.key] ?? "",
                        onChange: (event) => handleQuantityChange(item.key, event.target.value),
                        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: item.unit })
                  ]
                },
                item.key
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-[#001a4a] text-white rounded-2xl p-6 space-y-6 shadow-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-yellow-200", children: "Estimate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-3xl font-semibold mt-2", children: [
                currencySymbol,
                " ",
                formatCurrency(total)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/80", children: [
                "Estimated monthly staple ration cost (",
                currency,
                ") for the basket you entered."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/10 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white", children: "How to use this result" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-2 text-sm text-white/85", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Use this number as your staple ration line, not as your full kitchen or food budget." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "If you usually buy in weekly trips, split this total across about four market visits instead of treating it as one rigid shop." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Check the highest-cost items first before cutting every item equally." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-[#08245d] p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white", children: "Current cost drivers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-3", children: breakdown.slice(0, 3).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/80", children: [
                    currencySymbol,
                    " ",
                    formatCurrency(item.itemTotal)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-2 rounded-full bg-yellow-300",
                    style: { width: `${Math.max(item.share, 6)}%` }
                  }
                ) })
              ] }, item.key)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SaveWall,
              {
                toolKey: "ration_cost_estimator",
                inputs: { householdSize, quantities, source: (activationPrefill == null ? void 0 : activationPrefill.source) ?? "direct" },
                results: { total, currency, currencySymbol },
                isAuthenticated,
                saveEndpoint: "tools.snapshots.store",
                returnUrl: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/tools/ration-cost-estimator"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialDisclaimer, {})
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "How this estimate works" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "mt-5 space-y-3 text-sm leading-6 text-slate-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Enter the monthly quantity you expect to buy for each staple item." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. The tool multiplies each quantity by the fixed base price currently configured in Roznamcha." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. It adds those line items into one monthly ration benchmark you can use in planning." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-[#001a4a]", children: "Current base basket on this page" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: lineItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "grid gap-2 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[1.2fr_0.8fr_0.8fr]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-700", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-600", children: [
                      currencySymbol,
                      " ",
                      formatCurrency(item.price ?? 0),
                      " / ",
                      item.unit
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-500", children: [
                      "Default: ",
                      item.default_quantity,
                      " ",
                      item.unit
                    ] })
                  ]
                },
                item.key
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "Assumptions and limits" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-3 text-sm leading-6 text-slate-600", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "This estimate uses fixed internal benchmark prices, not live city-by-city market feeds." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Household size is a guide for interpretation only. The tool does not auto-scale your basket." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Fresh vegetables, fruit, meat, milk, tea, spices, and brand upgrades are outside this staple-only model." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Utility Store rates, wholesale buying, and neighborhood kiryana prices can shift the real number materially." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-[#001a4a]/10 bg-[#eef4ff] p-6 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "How to use this estimate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-3 text-sm leading-6 text-slate-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Put this figure into the ration line of your monthly budget first, then add sabzi, meat, milk, and school snacks separately." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "If the total feels high, cut or swap the two most expensive staples before you touch everything else." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Leave some room in your budget if flour, oil, or daal prices in your area move quickly between shops." })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-[#0b2b6f]/70", children: "Context Only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-xl font-semibold text-[#001a4a]", children: "Add your household size for comparison, not calculation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: "This number does not change the estimate above. It is only here to help you compare your basket against the worked examples below and keep that context when you save the result." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-700", htmlFor: "household", children: "Household size for comparison only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "household",
                type: "number",
                min: "1",
                value: householdSize,
                onChange: (event) => setHouseholdSize(clampNumber(event.target.value, 1)),
                className: "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.28em] text-[#0b2b6f]/70", children: "Worked Examples" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "Worked household examples using the current built-in prices" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-6 text-slate-600 max-w-3xl", children: "These are illustrative baskets built from the same base prices used by this page. They are here to help you judge your own estimate, not to claim one national market truth for every city." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-5 lg:grid-cols-2", children: scenarioCards.map((scenario) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[#001a4a]", children: scenario.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-slate-500", children: [
                  scenario.householdSize,
                  "-person planning scenario"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-full bg-[#eef4ff] px-3 py-1 text-sm font-semibold text-[#001a4a]", children: [
                currencySymbol,
                " ",
                formatCurrency(scenario.total)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: scenario.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: lineItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600",
                children: [
                  item.label,
                  ": ",
                  scenario.quantities[item.key] ?? 0,
                  " ",
                  item.unit
                ]
              },
              `${scenario.key}-${item.key}`
            )) })
          ] }, scenario.key)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "What can change your ration bill" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-3 text-sm leading-6 text-slate-600", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "City and market choice: wholesale, Utility Store, and neighborhood kiryana rates rarely move together." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Brand habits: branded oil, premium rice, or packaged daal can raise the total quickly." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Buying rhythm: one big monthly stock-up behaves differently from weekly refills." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Family routine: guests, Ramadan cooking, school lunches, and work-from-home meals can shift staple usage." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-[#001a4a]/10 bg-[#001a4a] p-6 text-white shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "Where to go next" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-white/80", children: "After estimating ration, compare it against the rest of your household pressure instead of treating groceries in isolation." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/kharcha-map",
                  className: "inline-flex items-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-white",
                  children: "Open Kharcha Map"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/survival-report",
                  className: "inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10",
                  children: "View Survival Report"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/blog/ghar-ka-monthly-budget",
                  className: "inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10",
                  children: "Read Ghar Ka Monthly Budget"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "How Utility Store Prices Differ from Open Market" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-7 text-[#001a4a]/85", children: "In Pakistan, purchasing grocery items through the government-subsidized Utility Stores Corporation (USC) network represents a major avenue for cost reduction. However, understanding the pricing differences between these stores and the open retail market is crucial for sturdier planning." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-7 text-[#001a4a]/85", children: "Essential staples like subsidized wheat flour (atta), sugar, and ghee are offered at lower rates to targeted beneficiaries under special relief packages. While this offers significant relief, supply constraints, queuing times, and brand limitations often mean families must still purchase a portion of their monthly basket from neighborhood kiryana stores or wholesale markets at standard market rates." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Staples Planning and Grocery Inflation in Pakistan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-7 text-[#001a4a]/85", children: "Staples like wheat, rice, ghee/oil, and sugar form the baseline of every Pakistani household's nutrition. Fluctuations in international fuel costs and local transport tariffs directly push these prices upward. Because food costs represent a highly visible, recurring daily outflow, estimating your baseline staple requirements before shopping is the sturdiest way to manage grocery inflation without sacrificing quality." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "Frequently Asked Questions (FAQs)" }),
          faqItems.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-4 first:border-t-0 first:pt-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-800", children: faq.question }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 mt-1", children: faq.answer })
          ] }, faq.question))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RelatedLinksBlock,
          {
            relatedTools: (relatedLinks == null ? void 0 : relatedLinks.relatedTools) ?? [],
            relatedBlogs: (relatedLinks == null ? void 0 : relatedLinks.relatedBlogs) ?? []
          }
        )
      ]
    }
  );
}
export {
  RationCostEstimator as default
};
