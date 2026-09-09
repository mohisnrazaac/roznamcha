import { j as jsxRuntimeExports } from "../ssr.js";
function SarkariTayariPromoCard({ className = "", style = {} }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      "aria-label": "Career & Income Upgrade",
      className: `w-full box-border rounded-xl border border-[#10b981] p-5 sm:p-6 text-white shadow-xl transition-shadow duration-300 ${className}`,
      style: {
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
        boxShadow: "0 10px 25px -5px rgba(6, 78, 59, 0.3)",
        ...style
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-[#10b981] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white", children: "Career & Income Upgrade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs sm:text-[13px] font-medium text-[#a7f3d0]", children: "Pakistan Public Sector Jobs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2.5 text-lg sm:text-xl font-extrabold leading-snug text-white", children: "Tired of Daily Inflation Eating Your Monthly Budget?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4 text-xs sm:text-sm leading-relaxed text-[#d1fae5]", children: [
          "Managing your household kharcha on ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-semibold text-white", children: "Roznamcha" }),
          " is only half the battle—increasing your stable income is the real long-term fix. Explore verified FPSC, PPSC, and provincial government vacancies, pay-scale breakdowns, and exam syllabus blueprints."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: "https://sarkaritayari.pk",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-3 text-center text-sm font-bold text-gray-900 transition-colors duration-200 hover:bg-[#fbbf24] focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#064e3b]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Find Government Jobs & Prep Guides on SarkariTayari.pk" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "→" })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  SarkariTayariPromoCard as S
};
