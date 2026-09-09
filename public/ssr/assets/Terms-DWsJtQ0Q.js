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
const sections = [
  {
    title: "1. Acceptable Use of the Platform",
    body: "Roznamcha is built for personal and household financial planning purposes. You agree to use the service in compliance with all applicable local laws, specifically the Prevention of Electronic Crimes Act (PECA) of Pakistan.",
    bullets: [
      "Do not input or transmit malicious code, security exploits, or spam scripts.",
      "Do not attempt to access other user workspaces or disrupt server infrastructure.",
      "The platform is intended for human household planning. Mass automated scraping of calculator rates or pages is strictly prohibited."
    ]
  },
  {
    title: "2. Calculation Tools and Estimates",
    body: "Roznamcha provides interactive calculators (e.g. Electricity Bill Estimator, Ration Cost Estimator, School Fees Planner, and Budget Calculator) for educational and planning support only.",
    bullets: [
      "All calculations are estimations based on progressive slab algorithms, average rates, and custom user variables.",
      "We do not guarantee that the results will exactly match your actual utility bills, tuition invoices, or grocery store receipts.",
      "Calculations do not constitute legal, tax, or professional financial advice."
    ]
  },
  {
    title: "3. Intellectual Property and Content Ownership",
    body: "The calculations logic, UI design, blog content, and branding elements are the exclusive intellectual property of Roznamcha.",
    bullets: [
      "You retain full ownership of the expense entries, budget numbers, and logs you enter into your workspace.",
      "You may not copy, replicate, or resell the underlying source code or tool designs of the calculators."
    ]
  },
  {
    title: "4. Limitation of Liability",
    body: 'Roznamcha is provided "as is" without warranties of any kind. We are not responsible for any financial decisions, budget errors, or planning miscalculations resulting from the use of our tools.',
    bullets: [
      "Always consult official sources (e.g. NEPRA SROs, school administrations) before making binding financial commitments.",
      "We do not assume liability for downtime, database sync errors, or data loss."
    ]
  }
];
function Terms({ seo: seoProp, jsonLd: jsonLdProp, contactEmail = "support@roznamcha.pk" }) {
  const seo = seoProp ?? seoContent.terms;
  const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-[#001a4a]/70", children: "Roznamcha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a]", children: "Terms of Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Review the rules, liability parameters, and tool boundaries governing the use of Roznamcha’s Pakistani budgeting platform." })
      ] }),
      sections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "bg-white border border-slate-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: section.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: section.body }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-5 space-y-2 text-slate-700", children: section.bullets.map((point) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: point }, point)) })
      ] }, section.title)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#fff9ef] border border-yellow-200 rounded-2xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "Have questions about our terms?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base text-slate-700", children: [
          "Email",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${contactEmail}`, className: "font-semibold text-[#001a4a] hover:underline", children: contactEmail }),
          " ",
          "or contact the",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.contact"), className: "font-semibold text-[#001a4a] hover:underline", children: "support desk" }),
          " ",
          "for help."
        ] })
      ] })
    ] })
  ] });
}
export {
  Terms as default
};
