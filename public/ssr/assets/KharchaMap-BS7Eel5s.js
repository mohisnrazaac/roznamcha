import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-nckxm3ML.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-Dkivr5Te.js";
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
const benefitBullets = [
  "Spot overspending on rent, fuel, or lifestyle treats before payday",
  "Explain monthly totals to family in clear Urdu charts",
  "Plan ahead for school fees, petrol hikes, and ration restocks",
  "Share data with spouses or parents without sending spreadsheets"
];
const steps = [
  "Log in and open the household workspace.",
  "Tap “Add kharcha”, enter amount, category, and short Urdu note.",
  "Repeat daily or weekly to capture groceries, bills, transport, or fees.",
  "Use filters to compare weeks and download summaries for the Survival Report."
];
const faqs = [
  {
    question: "Is Kharcha Map free?",
    answer: "Yes, Kharcha Map is included in the free Roznamcha plan so every household can track expenses without paying upfront."
  },
  {
    question: "Do I need to be good with numbers?",
    answer: "No. You just enter rupee amounts; the dashboard handles totals, charts, and comparisons."
  },
  {
    question: "Can my family members also use it?",
    answer: "Invite any trusted family member into the same household workspace so everyone can log and review kharcha together."
  },
  {
    question: "Is data secure?",
    answer: "Entries stay encrypted and private; only users you invite can see your kharcha timeline."
  },
  {
    question: "Do I need to install an app?",
    answer: "No installation needed. Open roznamcha.pk on your phone or computer browser and start tracking."
  }
];
function KharchaMap({ seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? seoContent.kharchaMap;
  const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-[#001a4a]/70", children: "Roznamcha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a]", children: "Kharcha Map – the Urdu expense tracker Pakistan trusts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Kharcha Map is the center of Roznamcha’s kharcha tracker. It records day-to-day expenses in Urdu, whether it’s milk, mobile data, rent, or school fees, so Pakistani families finally know where each rupee went." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "What Kharcha Map does" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Kharcha Map breaks every rupee into a timeline of daily, weekly, and monthly spending. Log groceries, fuel, electricity, school van fees, rent, and healthcare. See totals by category, compare current weeks with last month, and watch how close you are to your monthly plan. Categories stay flexible so you can add zakat, savings, or business reimbursements." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "How Kharcha Map helps Pakistani families" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "When families see real numbers, they make better decisions. Kharcha Map reveals spending patterns that notebooks never capture." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-5 space-y-2 text-slate-700", children: benefitBullets.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item }, item)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "How to use Kharcha Map" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Using Kharcha Map is straightforward even if you’ve never maintained a budget before." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "list-decimal pl-5 space-y-2 text-slate-700", children: steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: step }, step)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-4", itemScope: true, itemType: "https://schema.org/FAQPage", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "FAQ" }),
        faqs.map((faq) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            itemScope: true,
            itemProp: "mainEntity",
            itemType: "https://schema.org/Question",
            className: "border border-slate-200 rounded-xl p-4 space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { itemProp: "name", className: "text-lg font-semibold text-[#001a4a]", children: faq.question }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { itemScope: true, itemProp: "acceptedAnswer", itemType: "https://schema.org/Answer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { itemProp: "text", className: "text-sm text-slate-700", children: faq.answer }) })
            ]
          },
          faq.question
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-[#001a4a] font-semibold space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Explore",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.ration-brain"), className: "underline hover:no-underline", children: "Ration Brain" }),
          " ",
          "for grocery and ration tracking."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "See the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.survival-report"), className: "underline hover:no-underline", children: "Survival Report" }),
          " ",
          "for a monthly summary."
        ] })
      ] })
    ] })
  ] });
}
export {
  KharchaMap as default
};
