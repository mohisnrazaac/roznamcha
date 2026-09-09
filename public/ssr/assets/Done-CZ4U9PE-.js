import { b as reactExports, j as jsxRuntimeExports } from "../ssr.js";
import { O as OnboardingLayout } from "./OnboardingLayout-D7OUQyqL.js";
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
import "./index-h3QfXfrJ.js";
function Done({ progress = {}, nextUrl = "/dashboard" }) {
  reactExports.useEffect(() => {
    if (!nextUrl || nextUrl === "/dashboard") {
      return void 0;
    }
    const timer = setTimeout(() => {
      window.location.href = nextUrl;
    }, 2e3);
    return () => clearTimeout(timer);
  }, [nextUrl]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingLayout, { title: "You're ready!", progress, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-slate-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-white", children: "Household created, budget set, first expense logged. Roznamcha is now personalised for you." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Head to your Control Room to keep tracking kharcha or jump back to the article you came from." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/panel/kharcha",
          className: "rounded-full bg-emerald-400/90 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300",
          children: "Go to Control Room"
        }
      ),
      nextUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: nextUrl,
          className: "rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800",
          children: "Continue reading"
        }
      )
    ] })
  ] }) });
}
export {
  Done as default
};
