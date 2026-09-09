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
const benefits = [
  "Budget groceries with confidence even when prices spike",
  "Decide when to buy in bulk or switch brands",
  "Explain mehngai to family members using actual data",
  "Feed ration data into Kharcha Map and the Survival Report automatically"
];
const steps = [
  "Create your ration list with atta, dal, chawal, ghee, cheeni, tea, spices, and cleaning items.",
  "After every grocery trip, log the date, quantity, price, and store or vendor.",
  "Compare current prices with older entries to see how much each item increased.",
  "View the total ration cost and send it to the Survival Report to see the real impact on the budget."
];
const faqs = [
  {
    question: "What items can I track in Ration Brain?",
    answer: "Track any grocery item—atta, rice, lentils, spices, oil, milk, cleaning supplies, or custom categories you name yourself."
  },
  {
    question: "How often should I update prices?",
    answer: "Update whenever you shop. Weekly, fortnightly, or monthly updates still reveal trends and highlight inflation."
  },
  {
    question: "Can I use Ration Brain for both small and large families?",
    answer: "Yes. It scales from single-room rentals to big joint families; simply enter the quantities that match your kitchen."
  },
  {
    question: "Is my ration data private?",
    answer: "Yes. Only invited household members can view or edit your ration log, and Roznamcha encrypts all entries."
  },
  {
    question: "Is Ration Brain linked with Kharcha Map?",
    answer: "Ration entries sync directly with Kharcha Map so your monthly expense tracker always reflects grocery totals."
  }
];
function RationBrain({ seo: seoProp, jsonLd: jsonLdProp }) {
  const seo = seoProp ?? seoContent.rationBrain;
  const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-[#001a4a]/70", children: "Roznamcha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a]", children: "Ration Brain – grocery price tracker for Pakistani kitchens" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Ration Brain keeps a running log of what you paid for dal, atta, chawal, ghee, cheeni, sabzi, and spices. It exposes mehngai trends and keeps ration planning predictable for every Urdu-speaking household." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "Track ration prices over time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Each ration purchase becomes a data point. Record amounts, weights, and prices, then see how atta jumped before Ramzan, how tea leaves cooled, or how cooking oil responded to global rates. The timeline keeps your grocery price tracker honest." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "Why a ration price tracker matters in Pakistan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Taking inflation seriously is the only way to protect monthly budgets. Ration Brain gives you the proof to make decisions." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-5 space-y-2 text-slate-700", children: benefits.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: item }, item)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "How Ration Brain works" }),
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
          "Review overall expenses with",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.kharcha-map"), className: "underline hover:no-underline", children: "Kharcha Map" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Understand full-month impact in the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.survival-report"), className: "underline hover:no-underline", children: "Survival Report" }),
          "."
        ] })
      ] })
    ] })
  ] });
}
export {
  RationBrain as default
};
