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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.editorial-policy"), className: "hover:underline", children: "Editorial Policy →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.methodology"), className: "hover:underline", children: "Methodology & Sources →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.about"), className: "hover:underline", children: "About Roznamcha →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.contact"), className: "hover:underline", children: "Report Calculation Error →" })
          ] }) : null
        ] })
      ] })
    }
  );
}
export {
  AuthorEditorialBlock as A
};
