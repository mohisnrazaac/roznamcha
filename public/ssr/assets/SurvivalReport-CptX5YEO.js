import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-Cdp3p9pO.js";
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
import "./ChatWidget-DFPdtWTT.js";
const keyQuestions = [
  "Did the household stay within its real monthly limit or drift past it?",
  "Which categories created the biggest squeeze this month?",
  "Is spending rising compared with the previous month, or stabilising?"
];
const reportSignals = [
  {
    title: "Total monthly spend",
    body: "The report sums what was recorded for the selected month so the household sees one honest rupee total instead of scattered guesses."
  },
  {
    title: "Average daily spend",
    body: "It turns the month into a daily run rate, which helps families see whether the money pressure is concentrated or steadily leaking out."
  },
  {
    title: "Month-over-month change",
    body: "If the previous month has data, the report shows whether spending moved up or down and by how much."
  },
  {
    title: "Category breakdown",
    body: "It highlights the biggest cost buckets so the family can see whether rent, school, transport, utilities, or groceries are driving the squeeze."
  },
  {
    title: "Previous-month baseline",
    body: "When the previous month exists, the report shows whether spending is moving up or down instead of forcing the household to rely on memory."
  }
];
const examples = [
  {
    title: "School-fee month quietly breaks the budget",
    body: "A family sees that total spend jumped versus last month, and the category breakdown shows school costs moved ahead of groceries and utilities. That is the signal to reserve earlier next month instead of treating the fee as a surprise."
  },
  {
    title: "Daily leakage matters more than one big bill",
    body: "The total may look manageable, but the daily average shows spending never really slowed. That tells the household to review transport, snacks, delivery, and top-up habits before the next month starts."
  },
  {
    title: "The pressure is mostly in one category",
    body: "If rent and ration are taking the largest share, the report makes that visible quickly. That is more useful than arguing in general terms about why the month felt tight."
  }
];
const methodologyPoints = [
  "The report uses the selected month and the expenses already recorded in the workspace.",
  "It calculates a monthly total, an average daily spend figure, a category breakdown, and a month-over-month change when the previous month exists.",
  "It works best as a month-end review and comparison tool, not as a forward forecast."
];
const limitPoints = [
  "It cannot see cash spending or bills that were never recorded.",
  "It cannot know exact future prices, exact future utility bills, or shocks that have not happened yet.",
  "Category quality depends on how honestly the household records its own spending."
];
const planningSteps = [
  "Use Kharcha Map during the month so the report has real numbers to work with.",
  "Review the report near month-end to see the total, biggest categories, and whether spending rose or fell against the previous month.",
  "Turn the findings into action for the next month: trim one leaking category, reserve for a known fee, or test the ration and utility pressure separately."
];
const relatedLinks = [
  {
    title: "Kharcha Map",
    href: "/kharcha-map",
    body: "Start here if you need the underlying expense record that feeds a monthly survival view."
  },
  {
    title: "Ration Cost Estimator",
    href: "/tools/ration-cost-estimator",
    body: "Pressure-test the grocery side of the month before the market trip forces reactive cuts."
  },
  {
    title: "School Fees Planner",
    href: "/tools/school-fees-planner",
    body: "Reserve for tuition, annual charges, and exam fees instead of letting one school payment distort the whole month."
  }
];
const faqs = [
  {
    question: "Do I need an account to generate my own Survival Report?",
    answer: "Yes. The public page explains the report, but your own report depends on your recorded monthly data inside the logged-in workspace."
  },
  {
    question: "What does the report depend on most?",
    answer: "Recorded expenses and clean categories. If the month is only partly logged, the report will only be partly useful."
  },
  {
    question: "Does the report predict the future?",
    answer: "No. It helps the household understand what has already been recorded for the selected month and how that compares with the previous month when data exists."
  },
  {
    question: "Can the report help even if the household is already under pressure?",
    answer: "Yes. It is often most useful when the month feels unclear, because it turns vague pressure into visible totals and categories."
  }
];
function SurvivalReport({ seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? seoContent.survivalReport;
  const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "overflow-hidden rounded-[2rem] border border-[#001a4a]/10 bg-[linear-gradient(135deg,_#f6fbff_0%,_#ffffff_58%,_#fff6df_100%)] p-6 shadow-sm lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] lg:items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-[#001a4a]/70", children: "Roznamcha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold leading-tight text-[#001a4a] sm:text-4xl", children: "Survival Report shows how the month actually went, not how the household hoped it went." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-3xl text-base leading-7 text-slate-700", children: "This page explains Roznamcha’s monthly survival view for Pakistani households. It is for families who need a clearer answer to a practical question: did this month stay under control, and what should change before the next one begins?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              InfoCard,
              {
                title: "Who it helps",
                body: "Households trying to understand month-end pressure, category tradeoffs, and whether spending is improving or slipping."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              InfoCard,
              {
                title: "What it answers",
                body: "What the month cost, where the squeeze came from, and whether the next month needs a tighter plan."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              InfoCard,
              {
                title: "What it does not claim",
                body: "It is not a fortune-teller. It cannot know bills or shocks that were never recorded."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: "/kharcha-map",
                className: "inline-flex items-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#012261]",
                children: "Start with Kharcha Map"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: "/tools/ration-cost-estimator",
                className: "inline-flex items-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5",
                children: "Test ration pressure"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[1.75rem] border border-[#001a4a]/10 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Key Questions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: keyQuestions.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-6 text-slate-700", children: item }) }, item)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-emerald-900", children: "Public explainer first" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-emerald-900/80", children: "Your own report is generated inside the logged-in workspace because it depends on your recorded monthly expenses and selected month." })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "What The Report Actually Shows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold text-[#001a4a]", children: "Useful monthly signals, not vague motivation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-3xl text-base leading-7 text-slate-600", children: "The public value of this page should be clear even before sign-in: the Survival Report turns recorded monthly spending into a set of usable planning signals." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: reportSignals.map((signal) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#001a4a]", children: signal.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: signal.body })
        ] }, signal.title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Worked Examples" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: "How this helps with real month-end decisions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children: examples.map((example) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#001a4a]", children: example.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: example.body })
          ] }, example.title)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Methodology And Limits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: "What the report depends on" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[#001a4a]", children: "Core logic" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm leading-6 text-slate-600", children: methodologyPoints.map((point) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 h-2 w-2 rounded-full bg-[#8c5a00]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: point })
              ] }, point)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-rose-200 bg-rose-50 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-rose-900", children: "What it cannot know" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm leading-6 text-rose-900/80", children: limitPoints.map((point) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 h-2 w-2 rounded-full bg-rose-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: point })
              ] }, point)) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[minmax(0,0.95fr),minmax(0,1.05fr)] lg:items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "How To Use It" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: "Use the report as a planning checkpoint" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base leading-7 text-slate-600", children: "The report is most useful when it leads to one or two real next-month decisions instead of becoming another screen that people read and ignore." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: planningSteps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: [
            "Step ",
            index + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-slate-700", children: step })
        ] }, step)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-end justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Where To Go Next" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: "Use stronger adjacent pages in the same workflow" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-3", children: relatedLinks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-[#001a4a]", children: item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: item.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: item.href, className: "mt-5 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline", children: "Open page →" })
        ] }, item.href)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm", "aria-labelledby": "survival-faq-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "survival-faq-heading", className: "text-2xl font-semibold text-[#001a4a]", children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-4", children: faqs.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[#001a4a]", children: faq.question }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: faq.answer })
        ] }, faq.question)) })
      ] })
    ] })
  ] });
}
function InfoCard({ title, body }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-[#001a4a]/10 bg-white/85 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-[#8c5a00]", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-slate-700", children: body })
  ] });
}
export {
  SurvivalReport as default
};
