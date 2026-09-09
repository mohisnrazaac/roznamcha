import { a as usePage, R as React, j as jsxRuntimeExports, H as Head_default } from "../ssr.js";
import { T as ToolLayout, S as SaveWall, F as FinancialDisclaimer } from "./FinancialDisclaimer-CRzG7e_o.js";
import { R as RelatedLinksBlock } from "./RelatedLinksBlock-DGsmGHba.js";
import { S as SeoHead } from "./SeoHead-Dkivr5Te.js";
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
import "./PublicLayout-nckxm3ML.js";
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
const budgetScenarios = [
  {
    key: "survival",
    title: "Tighter Salary Survival Basket",
    description: "Designed for a household budget of Rs 50,000–60,000 under active month-end pressure.",
    inputs: {
      monthly_income: 55e3,
      rent: 15e3,
      ration: 2e4,
      utilities: 8e3,
      education: 4e3,
      transport: 4e3,
      misc: 2e3
    }
  },
  {
    key: "average-family",
    title: "Mid-Income 4-Person Family",
    description: "A sturdier model for a middle-class home with Rs 100,000–120,000 monthly income.",
    inputs: {
      monthly_income: 11e4,
      rent: 3e4,
      ration: 35e3,
      utilities: 18e3,
      education: 12e3,
      transport: 8e3,
      misc: 5e3
    }
  },
  {
    key: "joint-family",
    title: "Joint Family Setup",
    description: "Useful when a larger household with Rs 180,000+ income manages multiple students and refilling items.",
    inputs: {
      monthly_income: 2e5,
      rent: 5e4,
      ration: 6e4,
      utilities: 3e4,
      education: 25e3,
      transport: 15e3,
      misc: 1e4
    }
  }
];
const faqItems = [
  {
    question: "What is a normal savings rate for a Pakistani household?",
    answer: "Due to recent high inflation, many middle-income households in Pakistan experience a very tight budget with a savings rate below 10%. A target of 15% is ideal but requires strict allocation of variable expenses like utilities and transport."
  },
  {
    question: "How can I reduce variable household expenses in Pakistan?",
    answer: "Focus on progressive slab management for electricity (staying below 200 or 300 units), buying monthly grocery items in bulk from wholesale markets instead of neighborhood shops, and consolidating transit trips to reduce fuel costs."
  },
  {
    question: "Can I use this budget planner without signing up?",
    answer: "Yes. The Monthly Household Budget Calculator works fully in guest mode. You only need to create a free account if you wish to persist your budget snapshot, compare it against live market updates, and get automated alerts."
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
  name: "Monthly Household Budget Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  url: "https://roznamcha.pk/tools/monthly-household-budget-calculator",
  description: "Guest-mode monthly household budget calculator to estimate monthly rent, ration, utilities, education, transport, and miscellaneous costs in Pakistan."
};
function MonthlyHouseholdBudgetCalculator({ defaults, activationPrefill, seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? {
    title: "Monthly Household Budget Calculator Pakistan – Ghar ka budget planner | Roznamcha",
    description: "Calculate your monthly household budget in Pakistan by tracking rent, ration, school fees, transport, and utilities to see your surplus or deficit.",
    url: "https://roznamcha.pk/tools/monthly-household-budget-calculator",
    canonical: "https://roznamcha.pk/tools/monthly-household-budget-calculator"
  };
  const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
  const { auth } = usePage().props;
  const isAuthenticated = Boolean(auth == null ? void 0 : auth.user);
  const prefilledInputs = (activationPrefill == null ? void 0 : activationPrefill.inputs) ?? {};
  const prefilledResults = (activationPrefill == null ? void 0 : activationPrefill.results) ?? null;
  const [form, setForm] = React.useState({
    monthly_income: prefilledInputs.monthly_income ?? (defaults == null ? void 0 : defaults.monthly_income) ?? 85e3,
    rent: prefilledInputs.rent ?? (defaults == null ? void 0 : defaults.rent) ?? 2e4,
    ration: prefilledInputs.ration ?? (defaults == null ? void 0 : defaults.ration) ?? 25e3,
    utilities: prefilledInputs.utilities ?? (defaults == null ? void 0 : defaults.utilities) ?? 12e3,
    education: prefilledInputs.education ?? (defaults == null ? void 0 : defaults.education) ?? 8e3,
    transport: prefilledInputs.transport ?? (defaults == null ? void 0 : defaults.transport) ?? 6e3,
    misc: prefilledInputs.misc ?? (defaults == null ? void 0 : defaults.misc) ?? 4e3
  });
  const [result, setResult] = React.useState(prefilledResults);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [revealResult, setRevealResult] = React.useState(Boolean(prefilledResults));
  const handleScenarioSelect = (scenarioInputs) => {
    setForm({ ...scenarioInputs });
    setResult(null);
    setRevealResult(false);
  };
  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: Number(value) }));
  };
  const handleSubmit = async (event) => {
    var _a;
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setRevealResult(false);
    const csrfToken = (_a = document.head.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
    try {
      const response = await fetch("/tools/monthly-household-budget-calculator/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken ?? "",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          monthly_income: clampNumber(form.monthly_income, 0),
          rent: clampNumber(form.rent, 0),
          ration: clampNumber(form.ration, 0),
          utilities: clampNumber(form.utilities, 0),
          education: clampNumber(form.education, 0),
          transport: clampNumber(form.transport, 0),
          misc: clampNumber(form.misc, 0)
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data == null ? void 0 : data.message) ?? "Calculation failed");
      }
      setResult(data);
      window.requestAnimationFrame(() => setRevealResult(true));
    } catch (submitError) {
      setError(submitError.message || "Unable to calculate budget right now.");
    } finally {
      setIsLoading(false);
    }
  };
  const expenseBreakdown = React.useMemo(() => {
    var _a, _b, _c, _d, _e, _f;
    if (!result) return [];
    return [
      { key: "rent", label: "Rent / Housing", value: form.rent, share: ((_a = result.shares) == null ? void 0 : _a.rent) ?? 0, color: "#f59e0b" },
      { key: "ration", label: "Ration / Groceries", value: form.ration, share: ((_b = result.shares) == null ? void 0 : _b.ration) ?? 0, color: "#10b981" },
      { key: "utilities", label: "Utilities", value: form.utilities, share: ((_c = result.shares) == null ? void 0 : _c.utilities) ?? 0, color: "#3b82f6" },
      { key: "education", label: "Education / School Fees", value: form.education, share: ((_d = result.shares) == null ? void 0 : _d.education) ?? 0, color: "#8b5cf6" },
      { key: "transport", label: "Transport / Fuel", value: form.transport, share: ((_e = result.shares) == null ? void 0 : _e.transport) ?? 0, color: "#ec4899" },
      { key: "misc", label: "Miscellaneous", value: form.misc, share: ((_f = result.shares) == null ? void 0 : _f.misc) ?? 0, color: "#6b7280" }
    ].sort((a, b) => b.value - a.value);
  }, [form, result]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ToolLayout,
    {
      title: "Monthly Household Budget Calculator",
      subtitle: "Plan monthly income, rent, groceries, school fees, fuel, and utility bills to see your surplus or deficit.",
      description: "Guest mode Pakistan household budget planner with localized category splits, visual share breakdown, and budget health signals.",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd: pageSchema }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Head_default, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "script",
            {
              type: "application/ld+json",
              dangerouslySetInnerHTML: { __html: JSON.stringify(faqJsonLd) }
            },
            "budget-calculator-faq-schema"
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "script",
            {
              type: "application/ld+json",
              dangerouslySetInnerHTML: { __html: JSON.stringify(calculatorJsonLd) }
            },
            "budget-calculator-app-schema"
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 mb-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-[#001a4a]", children: "Monthly Household Budget Calculator: Map Your Income to Essential Squeezes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-6 text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "A Reality Check for Salaried Households:" }),
            " Budgeting is not about restricting your lifestyle; it is about allocating limited resources to competing needs. For salaried classes in Pakistan, the primary challenges are fixed overheads (rent, school fees) and volatile running expenses (ration, petrol, electricity)."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-6 text-slate-700", children: "This calculator helps you map your exact salary range (from Rs. 50,000 to Rs. 150,000+) against actual cost baselines. It gives you an immediate picture of where your salary stretches and where you need a planning buffer." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-[#001a4a] mb-2", children: "How to Use the Monthly Household Budget Calculator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal pl-5 text-sm text-slate-600 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Enter Your Net Take-Home Pay:" }),
                " Use your final salary after tax deductions."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Distribute Core Fixed Costs:" }),
                " Input your rent, school fees, and debt commitments."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Allocate Volatile Variable Costs:" }),
                " Set estimates for grocery, petrol, and medical budgets."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Save Your Baseline:" }),
                " Connect these settings with the ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Kharcha Map" }),
                " to measure actual vs. planned expenses in real-time."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid gap-6 md:grid-cols-3", children: budgetScenarios.map((scenario) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleScenarioSelect(scenario.inputs),
            className: "text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#001a4a] hover:bg-slate-50 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-[#001a4a]", children: scenario.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-slate-500", children: scenario.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm font-semibold text-[#001a4a]/85", children: [
                "Income: Rs ",
                formatCurrency(scenario.inputs.monthly_income)
              ] })
            ]
          },
          scenario.key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: handleSubmit,
              className: "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-[#001a4a]", children: "Budget Entries" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Enter your household income and expenses in PKR." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200", children: "Guest Mode" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Monthly Net Income (Rs)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: "0",
                      value: form.monthly_income || "",
                      onChange: (e) => handleInputChange("monthly_income", e.target.value),
                      className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-500 uppercase tracking-wider pt-2", children: "Monthly Expenses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Rent / Housing" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: form.rent || "",
                        onChange: (e) => handleInputChange("rent", e.target.value),
                        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Ration / Groceries" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: form.ration || "",
                        onChange: (e) => handleInputChange("ration", e.target.value),
                        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Electricity / Gas / Water" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: form.utilities || "",
                        onChange: (e) => handleInputChange("utilities", e.target.value),
                        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Education / School Fees" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: form.education || "",
                        onChange: (e) => handleInputChange("education", e.target.value),
                        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Transport / Fuel" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: form.transport || "",
                        onChange: (e) => handleInputChange("transport", e.target.value),
                        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: "Medical & Miscellaneous" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: "0",
                        value: form.misc || "",
                        onChange: (e) => handleInputChange("misc", e.target.value),
                        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
                      }
                    )
                  ] })
                ] }),
                error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700", children: error }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isLoading,
                    className: "w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#001a4a] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#012261] disabled:opacity-60 disabled:cursor-not-allowed",
                    children: isLoading ? "Calculating..." : "Calculate Budget Summary"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "section",
              {
                className: [
                  "rounded-2xl border p-6 transition-all duration-500",
                  result ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-slate-200/80"
                ].join(" "),
                children: !result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Result" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold text-[#001a4a]", children: "Budget calculations will appear here" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 leading-6", children: "Fill in the fields on the left and submit to view your total expense breakdown, surplus or deficit, and overall budget health." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-5 transform transition-all duration-500 ${revealResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Remaining Balance (Surplus / Deficit)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: `text-3xl font-semibold mt-2 ${result.surplus_deficit >= 0 ? "text-emerald-600" : "text-rose-600"}`, children: [
                      "Rs ",
                      formatCurrency(result.surplus_deficit)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
                      "Total Expenses: Rs ",
                      formatCurrency(result.total_expenses),
                      " | Savings Rate: ",
                      result.savings_rate,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-slate-700", children: "Expense Allocations (%)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: expenseBreakdown.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-medium text-slate-600", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "Rs ",
                          formatCurrency(item.value),
                          " (",
                          item.share,
                          "%)"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-full bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full rounded-full",
                          style: { width: `${item.share}%`, backgroundColor: item.color }
                        }
                      ) })
                    ] }, item.key)) })
                  ] })
                ] })
              }
            ),
            result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              SaveWall,
              {
                toolKey: "monthly_household_budget_calculator",
                inputs: { ...form },
                results: { ...result },
                isAuthenticated,
                saveEndpoint: "tools.snapshots.store",
                returnUrl: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/tools/monthly-household-budget-calculator"
              }
            ) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialDisclaimer, {})
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "my-10 border-slate-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "Understanding Monthly Budgeting in Pakistan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-7 text-slate-600", children: "Managing a household budget in Pakistan requires navigating a mix of fixed structural commitments and highly volatile variable expenses. Under recent economic pressures and shifting inflation trends, maintaining a strict record of where your rupee goes is no longer optional—it is the baseline for financial stability. This guide explores the core categories that drive household spending and offers practical ways to optimize them." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "How to Manage Rent and Variable Utility Cost-Fluctuations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-7 text-slate-600", children: "For renting families in urban centers like Karachi, Lahore, and Islamabad, house rent represents the largest fixed commitment, typically swallowing 25% to 40% of net monthly income." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-7 text-slate-600", children: "Utilities, however, are highly variable and present the greatest risk of budget derailment. Electricity bills in Pakistan need to be checked against the current DISCO tariff, taxes, fixed charges, and billing rules in force for the relevant month. A household should track meter readings and heavy-usage periods instead of relying on a generic threshold claim alone." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Optimizing Ration Baskets and Educational Expenses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-7 text-slate-600", children: "Grocery bills (or kitchen ration) are highly vulnerable to localized price fluctuations. Flour (atta), cooking oil/ghee, sugar, rice, and pulses are staple drivers of this expense. A family should compare wholesale, neighborhood, and supermarket pricing based on current local availability instead of assuming a subsidy or a single government-backed source is still active." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-7 text-slate-600", children: "Education represents a non-negotiable cost for most parents. However, many budgets break because parents only prepare for monthly tuition fees, ignoring seasonal costs like annual charges, registration, books, uniforms, and exam fees. Amortizing these annual charges into a monthly savings reserve prevents sudden cost pressures from breaking your budget." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Actionable Strategies for Running a Budget Surplus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-3 text-sm leading-7 text-slate-600 list-disc pl-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Track and Categorize:" }),
                " Log every single expense. Uncategorized cash withdrawals represent the single biggest source of budget leakage."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Stay Under Key Utility Slabs:" }),
                " Target consumption thresholds (e.g. keeping your electricity consumption strictly below 300 units per month) to avoid punitive tariff brackets."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Amortize Seasonal Expenses:" }),
                " Build dedicated savings vaults for yearly fees, Eid shopping, and vehicle maintenance, rather than funding them out of current salary."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Adopt the 50/30/20 Rule with Local Tweaks:" }),
                " Aim to allocate 50% for absolute needs (rent, basic ration, utilities), 30% for variable desires and education, and target a 20% savings buffer for emergency liquidity."
              ] })
            ] })
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
            relatedTools: [],
            relatedBlogs: [
              { title: "Ghar Ka Monthly Budget Guide", href: "/blog/ghar-ka-monthly-budget" },
              { title: "How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity", href: "/blog/pakistani-family-monthly-expense-control" }
            ]
          }
        )
      ]
    }
  );
}
function buildWebPageSchema(seo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${seo.url}#webpage`,
    "name": seo.schemaName ?? seo.title ?? "Monthly Household Budget Calculator",
    "url": seo.url,
    "description": seo.description ?? "",
    "inLanguage": "en"
  };
}
export {
  MonthlyHouseholdBudgetCalculator as default
};
