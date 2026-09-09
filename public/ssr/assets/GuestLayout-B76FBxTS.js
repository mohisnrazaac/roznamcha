import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
function GuestLayout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link_default, { href: "/", className: "flex items-center gap-3 text-[#001a4a] font-semibold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/icons/appicon.png",
          alt: "Roznamcha logo",
          width: "64",
          height: "64",
          className: "h-16 w-16 rounded-2xl border border-[#001a4a]/10 bg-white object-cover shadow-md"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left leading-tight hidden sm:block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-slate-500", children: "Roznamcha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Household Control Room" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg", children })
  ] });
}
export {
  GuestLayout as G
};
