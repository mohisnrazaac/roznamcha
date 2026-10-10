import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-8f9iGZFn.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-DcqTKW9E.js";
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
const firstClickPages = [
  {
    title: "Monthly Expense Tracker Pakistan",
    href: "/features/monthly-expense-tracker-pakistan",
    body: "Track your daily PKR household spending, income streams, and inflation leaks."
  },
  {
    title: "Ration Cost Estimator",
    href: "/tools/ration-cost-estimator",
    body: "Start with a staple-basket estimate, see what drives the total, and use it before the next market trip."
  },
  {
    title: "Monthly Household Budget Calculator",
    href: "/tools/monthly-household-budget-calculator",
    body: "Plan rent, groceries, school fees, transport, and utility bills to see your surplus or deficit in guest mode."
  },
  {
    title: "Electricity Bill Estimator",
    href: "/tools/electricity-bill-estimator",
    body: "Stress-test a 100, 200, or 300-unit month before the bill arrives and forces cuts elsewhere."
  },
  {
    title: "50k Salary Survival Guide",
    href: "/templates/50k-salary-survival-guide",
    body: "Open a survival-first budget example built for a tight salary instead of a generic lifestyle template."
  }
];
const proofCards = [
  {
    eyebrow: "Expense Tracker",
    title: "Monthly Expense Tracker Pakistan",
    href: "/features/monthly-expense-tracker-pakistan",
    description: "See how Pakistani households log daily kharcha, curb inflation leaks, and track monthly surplus."
  },
  {
    eyebrow: "Grocery Planning",
    title: "Ration Cost Estimator",
    href: "/tools/ration-cost-estimator",
    description: "Calculate monthly grocery basket expenses based on family size and market price averages."
  },
  {
    eyebrow: "Household Budget",
    title: "Monthly Household Budget Calculator",
    href: "/tools/monthly-household-budget-calculator",
    description: "Get a clear breakdown of all variable and fixed costs against your net monthly household income."
  },
  {
    eyebrow: "Utility Planning",
    title: "Electricity Bill Estimator",
    href: "/tools/electricity-bill-estimator",
    description: "Forecast residential electricity bills across tariff slabs before high-consumption months push the budget off course."
  },
  {
    eyebrow: "Budget Template",
    title: "50k Salary Survival Guide",
    href: "/templates/50k-salary-survival-guide",
    description: "Practical allocation breakdown showing how to manage essential expenses on a tighter monthly salary."
  },
  {
    eyebrow: "Expense Breakdown",
    title: "Kharcha Map",
    href: "/kharcha-map",
    description: "Visualize rent, groceries, school fees, utilities, and everyday expenses in a single monthly view."
  },
  {
    eyebrow: "Financial Health",
    title: "Survival Report",
    href: "/survival-report",
    description: "Review actual spending patterns at month-end to see whether your household maintained a surplus or deficit."
  }
];
const pressureJourneys = [
  {
    title: "Groceries keep slipping every month",
    description: "Open the ration estimator first when the market trip feels unpredictable and the basket total has become harder to trust.",
    href: "/tools/ration-cost-estimator",
    action: "Estimate ration cost"
  },
  {
    title: "The monthly salary budget feels out of control",
    description: "Use the monthly household budget planner to allocate income across rent, utilities, ration, and education.",
    href: "/tools/monthly-household-budget-calculator",
    action: "Calculate monthly budget"
  },
  {
    title: "Electricity is about to squeeze the month",
    description: "Use the bill estimator before a high-usage month so the household can plan around it instead of reacting late.",
    href: "/tools/electricity-bill-estimator",
    action: "Estimate electricity pressure"
  },
  {
    title: "The whole month feels unclear",
    description: "Start with the Survival Report or Kharcha Map when the problem is not one bill, but how everything piles up together.",
    href: "/survival-report",
    action: "See the survival view"
  }
];
const trustPoints = [
  {
    title: "Public pages first",
    body: "The strongest calculators, guides, and explainers are already open. You do not need an account to see whether Roznamcha is useful."
  },
  {
    title: "Planning aids, not fake precision",
    body: "Household totals can change by city, usage pattern, school policy, brand, and shop. The aim is a better plan, not a false promise of exactness."
  },
  {
    title: "Built for Pakistan-specific pressure",
    body: "The public surface is centered on ration cost, school fees, electricity pressure, and month-end survival instead of generic personal-finance slogans."
  }
];
const guideLabels = {
  "ghar-ka-monthly-budget": "Budget guide",
  "pakistani-family-monthly-expense-control": "Expense control guide",
  "how-to-use-digital-roznamcha-for-business-and-personal-finance-2025": "Product guide"
};
function Home({ featuredGuides = [], seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? seoContent.home;
  const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "landing", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-[#000f2d] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr),380px] lg:px-8 lg:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.45em] text-yellow-200/80", children: "Pakistan household budgeting platform" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "max-w-4xl text-3xl font-bold leading-tight sm:text-4xl", children: "Roznamcha helps Pakistani households plan ration, school fees, electricity bills, and month-end survival with practical public pages." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-3xl text-base leading-7 text-yellow-100/90 sm:text-lg", children: "Free calculators, practical budgeting templates, and local cost estimators designed specifically for Pakistani families managing rising living expenses." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "What it covers",
              body: "Ration pressure, school-fee reserves, electricity shocks, and the wider monthly budget picture."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "Who it helps",
              body: "Households that need a clearer plan before the next market trip, school payment, or utility bill."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              title: "What it does not claim",
              body: "These are planning aids, not exact market or billing guarantees. The goal is a more honest monthly plan."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/tools/ration-cost-estimator",
              className: "inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-base font-semibold text-[#001a4a] shadow-lg transition hover:bg-white",
              children: "Start with ration planning"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/survival-report",
              className: "inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-white/10",
              children: "See the survival view"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: "/templates/50k-salary-survival-guide",
              className: "inline-flex items-center justify-center rounded-full border border-yellow-200/60 px-5 py-2.5 text-base font-semibold text-yellow-100 transition hover:bg-white/10",
              children: "Open a real budget example"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-yellow-200/80", children: "Quick Start" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-2xl font-semibold text-white", children: "Popular Budgeting Tools" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-yellow-100/85", children: "Start with the calculator or guide that matches your immediate household planning need." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-3", children: firstClickPages.map((page) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link_default,
          {
            href: page.href,
            className: "block rounded-2xl border border-white/10 bg-white/10 px-4 py-4 transition hover:bg-white/15",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white", children: page.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-6 text-yellow-100/80", children: page.body })
            ]
          },
          page.href
        )) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Explore Tools & Guides" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold text-[#001a4a]", children: "Essential Resources for Household Finance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-3xl text-base leading-7 text-slate-600", children: "Explore our suite of interactive estimators, budget templates, and expense analysis tools built for everyday Pakistani living." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: proofCards.map((page) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProofCard, { page }, page.href)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-[minmax(0,1.15fr),minmax(0,0.85fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Start With The Pressure You Already Feel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: "Most households do not need everything at once" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: pressureJourneys.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#001a4a]", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: item.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link_default, { href: item.href, className: "mt-4 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline", children: [
              item.action,
              " →"
            ] })
          ] }, item.title)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Transparency & Methodology" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: "Open, Accessible, and Independent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children: trustPoints.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[#001a4a]", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: item.body })
          ] }, item.title)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-[#001a4a]/10 bg-[#001a4a] p-5 text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: "Track and save your monthly records." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-white/80", children: "All our calculators and guides are free to use without an account. Create a free account when you want to save recurring expenses, track progress month-over-month, and download custom reports." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/register",
                  className: "inline-flex items-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-white",
                  children: "Create free account"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/features",
                  className: "inline-flex items-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10",
                  children: "Review features"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      featuredGuides.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Useful Reading" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: "Open a guide when you need fuller context" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/blog/ghar-ka-monthly-budget", className: "text-sm font-semibold text-[#001a4a] hover:underline", children: "Read the main budget guide →" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 lg:grid-cols-3", children: featuredGuides.map((guide) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-slate-500", children: guideLabels[guide.slug] ?? "Guide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-xl font-semibold text-[#001a4a]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: guide.url, className: "hover:underline", children: guide.title }) }),
          guide.published_label ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-500", children: guide.published_label }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: guide.excerpt })
        ] }, guide.id)) })
      ] })
    ] })
  ] });
}
function StatCard({ title, body }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/15 bg-white/5 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-yellow-200/75", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-yellow-100/90", children: body })
  ] });
}
function ProofCard({ page }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: page.eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-xl font-semibold text-[#001a4a]", children: page.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: page.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: page.href, className: "mt-5 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline", children: "Open page →" })
  ] });
}
export {
  Home as default
};
