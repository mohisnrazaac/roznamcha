import { a as usePage, R as React, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { T as ToolLayout, S as SaveWall, F as FinancialDisclaimer } from "./FinancialDisclaimer-DfDbbZDT.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-BNXvUeLt.js";
import { A as AuthorEditorialBlock } from "./AuthorEditorialBlock-n5Tdmvpm.js";
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
    question: "Why does the real monthly school cost look higher than tuition?",
    answer: "Because annual charges and recurring exam fees are spread across 12 months. This avoids budget shocks during fee-heavy months."
  },
  {
    question: "Does this planner store my school fee data?",
    answer: "No. Guests can calculate instantly. Sign up only if you want to save the estimate inside your household ledger later."
  },
  {
    question: "What is the planning margin used for?",
    answer: "It projects a safer monthly reserve for the next academic year by applying a configurable percentage to your current real monthly cost."
  },
  {
    question: "How should Pakistani families budget for annual private school fee hikes?",
    answer: "Private school tuition across major cities typically increases by 10% to 15% each academic year. Setting aside an inflation buffer in a monthly education sinking fund prevents mid-year fee notices from breaking the family budget."
  }
];
function SchoolFeesPlanner({ defaults, activationPrefill, faqItems: faqItemsProp, seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? seoContent.schoolFeesPlanner;
  const pageSchema = jsonLdProp ?? buildWebPageSchema(seo);
  const activeFaqItems = faqItemsProp ?? defaultFaqItems;
  const { auth } = usePage().props;
  const isAuthenticated = Boolean(auth == null ? void 0 : auth.user);
  const prefilledInputs = (activationPrefill == null ? void 0 : activationPrefill.inputs) ?? {};
  const prefilledResults = (activationPrefill == null ? void 0 : activationPrefill.results) ?? null;
  const [form, setForm] = React.useState({
    children_count: prefilledInputs.children_count ?? (defaults == null ? void 0 : defaults.children_count) ?? 2,
    monthly_tuition_per_child: prefilledInputs.monthly_tuition_per_child ?? (defaults == null ? void 0 : defaults.monthly_tuition_per_child) ?? 18e3,
    annual_charges: prefilledInputs.annual_charges ?? (defaults == null ? void 0 : defaults.annual_charges) ?? 5e4,
    exam_fee: prefilledInputs.exam_fee ?? (defaults == null ? void 0 : defaults.exam_fee) ?? 6e3,
    exam_frequency: prefilledInputs.exam_frequency ?? (defaults == null ? void 0 : defaults.exam_frequency) ?? 2,
    inflation_buffer_percentage: prefilledInputs.inflation_buffer_percentage ?? (defaults == null ? void 0 : defaults.inflation_buffer_percentage) ?? 12
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
  const shouldShowPreview = Boolean(result) && scrollDepth >= 0.65;
  const highlightResult = Boolean(result) && scrollDepth >= 0.65 && scrollDepth <= 0.75;
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const handleSubmit = async (event) => {
    var _a;
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setRevealResult(false);
    const csrfToken = (typeof window !== "undefined" && window.getCsrfToken ? await window.getCsrfToken() : null) || ((_a = document.head.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) || "";
    try {
      const response = await fetch("/tools/school-fees-planner/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken ?? "",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          children_count: clampNumber(form.children_count, 1),
          monthly_tuition_per_child: clampNumber(form.monthly_tuition_per_child, 0),
          annual_charges: clampNumber(form.annual_charges, 0),
          exam_fee: clampNumber(form.exam_fee, 0),
          exam_frequency: clampNumber(form.exam_frequency, 0),
          inflation_buffer_percentage: clampNumber(form.inflation_buffer_percentage, 0)
        })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data == null ? void 0 : data.message) ?? "Calculation failed");
      }
      setResult(data);
      window.requestAnimationFrame(() => setRevealResult(true));
    } catch (submitError) {
      setError(submitError.message || "Unable to calculate right now.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    ToolLayout,
    {
      title: "School Fees Planner",
      subtitle: "Calculate the real monthly school cost before annual charges and exam months catch your household off guard.",
      description: "Guest mode tool for Pakistan households: tuition + annual charges + exam fees + planning margin projection.",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd: pageSchema }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-2xl p-6 mb-8 space-y-4 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-[#001a4a]", children: "School Fees Planner: Spread the Tuition Squeeze Evenly" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-6 text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "The School Fee Shock Factor:" }),
            " Most families do not fail their monthly budget because of daily milk or bread. They experience budget collapses during months when quarterly school fees, admission charges, exam fees, or uniform costs arrive all at once."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-6 text-slate-700", children: "The School Fees Planner helps you amortize these bulk expenses. By converting irregular, heavy bills into a smooth monthly saving target, you ensure that education costs remain a predictable line item rather than a periodic crisis." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-[#001a4a] mb-2", children: "How to Use the School Fees Planner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "list-decimal pl-5 text-sm text-slate-600 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "List Each Student:" }),
                " Enter the monthly tuition fee for each child to build a central educational ledger."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Add Seasonal & Annual Costs:" }),
                " Input anticipated non-tuition costs, such as uniforms, book sets, exam fees, and transport charges."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Calculate the Monthly Planning Number:" }),
                " The tool aggregates all annual fees and divides them by 12, giving you a steady monthly saving target."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Set Up Reminders:" }),
                " Sync this target with Roznamcha's reminder dashboard to save this money systematically throughout the year."
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-[#001a4a]", children: "School Fee Details" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Calculate first. Decide about signup later." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200", children: "Guest Mode" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Children count",
                    type: "number",
                    min: "1",
                    value: form.children_count,
                    onChange: (e) => handleChange("children_count", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Monthly tuition per child (PKR)",
                    type: "number",
                    min: "0",
                    value: form.monthly_tuition_per_child,
                    onChange: (e) => handleChange("monthly_tuition_per_child", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Annual charges (PKR)",
                    type: "number",
                    min: "0",
                    value: form.annual_charges,
                    onChange: (e) => handleChange("annual_charges", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Exam fee (per exam cycle, PKR)",
                    type: "number",
                    min: "0",
                    value: form.exam_fee,
                    onChange: (e) => handleChange("exam_fee", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Exam frequency (per year)",
                    type: "number",
                    min: "0",
                    value: form.exam_frequency,
                    onChange: (e) => handleChange("exam_frequency", e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    label: "Planning margin (%)",
                    type: "number",
                    min: "0",
                    value: form.inflation_buffer_percentage,
                    onChange: (e) => handleChange("inflation_buffer_percentage", e.target.value)
                  }
                ),
                error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700", children: error }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: isLoading,
                    className: "inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#012261] disabled:opacity-60 disabled:cursor-not-allowed",
                    children: isLoading ? "Calculating..." : "Calculate School Fees Plan"
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
                  revealResult ? "opacity-100 translate-y-0" : "opacity-100",
                  highlightResult ? "ring-2 ring-amber-300 shadow-xl motion-safe:animate-pulse" : ""
                ].join(" "),
                children: !result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "Result" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-semibold text-[#001a4a]", children: "Your real monthly school cost will appear here" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Tuition-only thinking hides annual charges and exam spikes. This planner converts those into a monthly reserve target." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `space-y-4 transform transition-all duration-500 ${revealResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-slate-500", children: "School Cost Breakdown" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-3xl font-semibold text-[#001a4a] mt-2", children: [
                      "PKR ",
                      formatCurrency(result.real_monthly_cost)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Real monthly school cost (including amortized annual + exam fees)." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MetricCard,
                      {
                        label: "Tuition outflow",
                        value: `PKR ${formatCurrency(result.monthly_outflow)}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MetricCard,
                      {
                        label: "Amortized annual charges",
                        value: `PKR ${formatCurrency(result.amortized_monthly)}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MetricCard,
                      {
                        label: "Real monthly cost",
                        value: `PKR ${formatCurrency(result.real_monthly_cost)}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MetricCard,
                      {
                        label: "Projected next year",
                        value: `PKR ${formatCurrency(result.projected_next_year)}`
                      }
                    )
                  ] })
                ] })
              }
            ),
            result ? (
              // ROZNAMCHA-ACTIVATION: place save wall immediately below computed result.
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SaveWall,
                {
                  toolKey: "school_fees_planner",
                  inputs: { ...form },
                  results: { ...result },
                  isAuthenticated,
                  saveEndpoint: "tools.snapshots.store",
                  returnUrl: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/tools/school-fees-planner"
                }
              )
            ) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialDisclaimer, {}),
            result && shouldShowPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm transition-all duration-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-amber-700", children: "Output Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-semibold text-[#001a4a] mt-2", children: [
                "You are not paying PKR ",
                formatCurrency(result.monthly_outflow),
                " per month. You are effectively paying PKR ",
                formatCurrency(result.real_monthly_cost),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-700 mt-2", children: [
                "To avoid panic months, you should reserve PKR ",
                formatCurrency(result.real_monthly_cost),
                " monthly."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-xl border border-white/80 bg-white p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-[#001a4a]", children: "Save this for my household" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Track this inside your household ledger" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link_default,
                  {
                    href: "/register",
                    className: "mt-4 inline-flex items-center justify-center rounded-full bg-[#001a4a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#012261]",
                    children: "Save this estimate"
                  }
                )
              ] })
            ] }) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-[#001a4a] text-white rounded-2xl p-6 shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-yellow-200", children: "Continuity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/80 mt-2", children: "Signup is only for memory. All calculations remain visible in guest mode." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/register",
                  className: "mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-white",
                  children: "Save this for my household"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mt-12 bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2 border-b border-slate-100 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-[#8c5a00] font-semibold", children: "Editorial Documentation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: "School Fee Amortization Methodology & Educational Cost Baseline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "A practical framework for converting quarterly admission charges, examination levies, and tuition escalation into predictable monthly budget allocations." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Methodology & Calculation Mechanics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-7 text-slate-700", children: "Most parental budgeting breakdowns occur because families plan solely around monthly tuition vouchers, ignoring large periodic charges. The School Fees Planner calculates your effective financial commitment through:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 rounded-xl bg-slate-50 p-4 text-xs font-mono text-[#001a4a]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Real Monthly Education Cost = (Children Count × Monthly Tuition) + [(Annual Registration & Facility Charges + Exam Fees × Frequency) / 12]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Projected Next Year Cost = Real Monthly Education Cost × (1 + Inflation Buffer Percentage / 100)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-slate-700", children: [
              "Connect this amortized education figure into your household balance sheet via our",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/tools/monthly-household-budget-calculator", className: "font-semibold text-[#001a4a] underline", children: "Monthly Household Budget Calculator" }),
              " ",
              "or track real voucher disbursements with our",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/features/monthly-expense-tracker-pakistan", className: "font-semibold text-[#001a4a] underline", children: "Monthly Expense Tracker for Pakistan" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3 border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Underlying Data Baseline & Economic Assumptions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-7 text-slate-700", children: "Private school fee structures across Punjab, Sindh, Khyber Pakhtunkhwa, and ICT escalate by an average of 10% to 15% annually to absorb private campus electricity tariffs, facility rents, and staff payroll adjustments. Examination fees across Cambridge Assessment (O/A Levels), Federal Board (FBISE), and Provincial Boards (BISE) arrive on fixed bi-annual cycles, producing severe cash flow shocks if unamortized." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-7 text-slate-700", children: [
              "For complete details on our baseline data sources and research standards, review our",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/methodology", className: "font-semibold text-[#001a4a] underline", children: "Methodology & Data Sources" }),
              " ",
              "directory."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3 border-t border-slate-100 pt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-[#001a4a]", children: "Practical Application Guide: Creating an Education Sinking Fund" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-7 text-slate-700", children: "Implement these steps to keep school costs predictable throughout the academic calendar:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 space-y-2 text-sm leading-7 text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Establish a Dedicated Amortization Account:" }),
                " Deposit the monthly amortized non-tuition amount into a separate bank account or mutual fund on salary day so funds are ready when annual admission charges arrive."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Inquire About Sibling Discounts:" }),
                " Most tier-1 and tier-2 private school chains offer a 10% to 20% sibling tuition concession for second and third children. Confirm this discount is active on your vouchers."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Amortize Uniforms and Book Bundles:" }),
                " School textbook syllabus packs and uniforms cost between Rs. 15,000 and Rs. 35,000 per student every April/August; include these in your annual non-tuition line item."
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
              lastUpdated: "September 2026"
            }
          )
        ] })
      ]
    }
  );
}
function Field({ label, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ...props,
        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#001a4a] focus:outline-none"
      }
    )
  ] });
}
function MetricCard({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-[#001a4a] mt-1", children: value })
  ] });
}
export {
  SchoolFeesPlanner as default
};
