import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
function AuthorEditorialBlock({
  authorName = "Mohsin Raza",
  authorRole = "Founder & Software Architect (16+ Years Experience)",
  lastUpdated = "September 2026",
  showGovernanceLinks = true,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: `rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm lg:p-8 ${className}`,
      "aria-labelledby": "author-editorial-heading",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-[minmax(0,0.85fr),minmax(0,1.15fr)] md:items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-[#001a4a] text-base font-bold text-yellow-300 shadow-sm", children: "MR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: "Author & Lead Architect" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "author-editorial-heading", className: "text-xl font-bold text-[#001a4a]", children: authorName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-500", children: authorRole })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-slate-600", children: "Mohsin is the founder of Roznamcha.pk. With over 16 years of software architecture experience, he designs computational models and guides tailored to Pakistani household realities, currency fluctuations, and localized utility tariffs." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-emerald-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-[#001a4a]", children: "Editorial Fact-Checking & Review" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
              "Last verified & updated: ",
              lastUpdated
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-slate-600", children: "This content is audited against official Pakistani regulatory baselines, including NEPRA tariff schedules, Pakistan Bureau of Statistics (PBS) SPI/CPI indices, and SBP monetary reports. All calculators use documented mathematical formulas." }),
          showGovernanceLinks ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-[#001a4a]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/editorial-policy", className: "hover:underline", children: "Editorial Policy →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/methodology", className: "hover:underline", children: "Methodology & Sources →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.about"), className: "hover:underline", children: "About Roznamcha →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.contact"), className: "hover:underline", children: "Report Calculation Error →" })
          ] }) : null
        ] })
      ] })
    }
  );
}
const suiteTools = [
  {
    title: "Electricity Bill Calculator",
    href: "/tools/electricity-bill-estimator",
    desc: "NEPRA slabs, FPA, QTA & 18% GST calculation",
    icon: "⚡",
    badge: "NEPRA 2026"
  },
  {
    title: "Monthly Ration Cost Calculator",
    href: "/tools/ration-cost-estimator",
    desc: "Live Mandi rates for atta, ghee, rice & sugar",
    icon: "🛒",
    badge: "PBS Aligned"
  },
  {
    title: "Household Budget Calculator",
    href: "/tools/monthly-household-budget-calculator",
    desc: "50/30/20 rule calibrated for Pakistani kharcha",
    icon: "📊",
    badge: "Ghar Ka Budget"
  },
  {
    title: "Solar ROI & Net Metering",
    href: "/tools/solar-net-metering-roi-calculator",
    desc: "Payback period & net billing savings (3-15 kW)",
    icon: "☀️",
    badge: "Net Metering"
  },
  {
    title: "School Fees & Education Planner",
    href: "/tools/school-fees-planner",
    desc: "Tuition, annual charges & inflation buffer",
    icon: "🎓",
    badge: "Education"
  },
  {
    title: "Monthly Expense Tracker",
    href: "/features/monthly-expense-tracker-pakistan",
    desc: "Daily ledger, kharcha tracking & budget alerts",
    icon: "📱",
    badge: "Web App"
  }
];
function HouseholdPlanningSuite({ currentPath = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12 rounded-3xl border border-[#001a4a]/15 bg-gradient-to-br from-white via-slate-50/70 to-emerald-50/30 p-6 md:p-8 shadow-sm", "aria-label": "Roznamcha Household Planning Suite", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" }),
        "Integrated Family Finance"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-xl md:text-2xl font-bold text-[#001a4a]", children: "Roznamcha Household Planning Suite" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-600 max-w-2xl", children: "A unified set of financial calculators calibrated for Pakistani salaries, utility tariffs, and real market prices." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: suiteTools.map((tool) => {
      const isCurrent = currentPath === tool.href;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link_default,
        {
          href: tool.href,
          className: `group relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${isCurrent ? "border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md" : "border-slate-200/90 bg-white hover:border-[#001a4a]/30 hover:shadow-sm hover:-translate-y-0.5"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", role: "img", "aria-label": tool.title, children: tool.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-semibold px-2 py-0.5 rounded-full ${isCurrent ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-[#001a4a]/10 group-hover:text-[#001a4a]"}`, children: isCurrent ? "Active Tool" : tool.badge })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-base font-semibold text-[#001a4a] group-hover:text-emerald-700 transition-colors", children: tool.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-slate-500", children: tool.desc })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-center text-xs font-semibold text-emerald-700 group-hover:underline", children: isCurrent ? "Currently viewing" : "Open calculator →" })
          ]
        },
        tool.href
      );
    }) })
  ] });
}
export {
  AuthorEditorialBlock as A,
  HouseholdPlanningSuite as H
};
