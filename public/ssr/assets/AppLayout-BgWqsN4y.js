import { a as usePage, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { C as ChatWidget } from "./ChatWidget-DFPdtWTT.js";
function AppLayout({ children }) {
  const { url } = usePage();
  const safeRoute = (name, fallback) => {
    try {
      if (typeof route === "function") {
        return route(name);
      }
    } catch (error) {
    }
    return fallback;
  };
  const navItems = [
    { href: route("dashboard"), label: "Dashboard", icon: "📊" },
    { href: safeRoute("panel.kharcha.index", "/panel/kharcha"), label: "Kharcha Map", icon: "💸" },
    { href: safeRoute("panel.ration.index", "/panel/ration"), label: "Ration Brain", icon: "🥘" },
    { href: safeRoute("panel.reminders.index", "/panel/reminders"), label: "Reminders", icon: "⏰" },
    { href: safeRoute("reports.index", "/reports"), label: "Reports", icon: "📈" }
  ];
  const homeHref = safeRoute("public.home", "/");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-[#F7F8FA] text-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex md:flex-col w-60 bg-white border-r border-slate-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link_default,
        {
          href: homeHref,
          className: "px-4 py-4 flex items-center gap-3 border-b border-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003a8c]/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "/icons/appicon.png",
                alt: "Roznamcha logo",
                className: "w-10 h-10 rounded-xl border border-slate-200 object-cover"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900 text-sm", children: "Roznamcha" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-500 text-[11px] font-medium", children: "روزنامچہ" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-4 space-y-1 text-sm", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link_default,
        {
          href: item.href,
          className: "flex items-center gap-2 px-3 py-2 rounded-lg font-medium " + (url === item.href ? "bg-[#003a8c] text-white" : "text-slate-700 hover:bg-slate-100"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg leading-none", children: item.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
          ]
        },
        item.href
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-yellow-100 rounded-lg p-3 text-xs text-slate-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold mb-1", children: "📄 Survival Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] leading-snug", children: "Download Monthly PDF" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-[#003a8c] text-white px-4 py-4 flex items-center justify-between shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md bg-white/10 text-white text-lg", children: "☰" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link_default, { href: homeHref, className: "inline-flex items-center gap-2 text-white font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: "/icons/appicon.png",
                alt: "Roznamcha logo",
                className: "w-8 h-8 rounded-xl border border-white/20 object-cover"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Roznamcha" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 max-w-md mx-4 hidden sm:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white/10 text-white rounded-md px-3 py-2 text-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 opacity-70", children: "🔍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-70", children: "Search expenses, reminders…" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🔔" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold rounded-full px-1", children: "2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center border border-black/20", children: "U" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-6", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "px-4 md:px-6 py-4 text-[11px] text-slate-500", children: "© 2025 Roznamcha • Privacy • Support" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatWidget, {})
  ] });
}
export {
  AppLayout as A
};
