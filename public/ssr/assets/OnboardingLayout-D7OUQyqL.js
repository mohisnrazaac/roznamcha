import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PropTypes } from "./index-h3QfXfrJ.js";
const steps = [
  { key: "household", label: "Household" },
  { key: "budget", label: "Budget" },
  { key: "expense", label: "First expense" }
];
function OnboardingLayout({ title, children, progress = {} }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-950 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Roznamcha Onboarding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: route("dashboard"),
          className: "text-sm font-semibold text-emerald-300 hover:text-emerald-200",
          children: "Skip to dashboard →"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "mb-6 flex flex-wrap gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4", children: steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 text-sm font-semibold text-slate-300",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `flex h-6 w-6 items-center justify-center rounded-full text-xs ${progress[step.key] ? "bg-emerald-400/90 text-emerald-950" : "bg-slate-800 text-slate-400"}`,
              children: progress[step.key] ? "✓" : steps.findIndex((s) => s.key === step.key) + 1
            }
          ),
          step.label
        ]
      },
      step.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl", children })
  ] }) });
}
OnboardingLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  progress: PropTypes.object
};
export {
  OnboardingLayout as O
};
