import { a as usePage, j as jsxRuntimeExports, L as Link_default, r as router3 } from "../ssr.js";
const baseLinks = (translations) => {
  var _a, _b, _c, _d, _e;
  return [
    { name: ((_a = translations == null ? void 0 : translations.app) == null ? void 0 : _a.brand) ?? "Dashboard", routeName: "dashboard", slug: "dashboard" },
    { name: ((_b = translations == null ? void 0 : translations.kharcha) == null ? void 0 : _b.title) ?? "Kharcha Map", routeName: "panel.kharcha.index", slug: "kharcha" },
    { name: ((_c = translations == null ? void 0 : translations.ration) == null ? void 0 : _c.title) ?? "Ration Brain", routeName: "panel.ration.index", slug: "ration" },
    { name: ((_d = translations == null ? void 0 : translations.reminders) == null ? void 0 : _d.title) ?? "Reminders", routeName: "panel.reminders.index", slug: "reminders" },
    { name: "Budget Templates", href: "/templates", slug: "templates" },
    { name: "My Categories", routeName: "panel.categories.index", slug: "panel-categories" },
    { name: ((_e = translations == null ? void 0 : translations.reports) == null ? void 0 : _e.title) ?? "Reports", routeName: "reports.index", slug: "reports" },
    { name: "Users", routeName: "admin.users.index", slug: "users", adminOnly: true },
    { name: "Categories", routeName: "admin.categories.index", slug: "categories", adminOnly: true },
    { name: "AI Logs", routeName: "admin.ai-logs.index", slug: "ai-logs", adminOnly: true },
    { name: "Blog Posts", routeName: "admin.blog.posts.index", slug: "blog-posts", adminOnly: true },
    { name: "Blog Categories", routeName: "admin.blog.categories.index", slug: "blog-categories", adminOnly: true },
    { name: "Daily Hooks", routeName: "admin.daily-return.index", slug: "daily-hooks", adminOnly: true }
  ];
};
const resolveHref = (link) => {
  if (link.routeName) {
    try {
      return route(link.routeName);
    } catch (error) {
      return link.href ?? "#";
    }
  }
  return link.href ?? "#";
};
function ControlRoomLayout({ children, active, user: providedUser }) {
  var _a, _b, _c, _d;
  const { url, props } = usePage();
  const translations = props.translations ?? {};
  const sharedAuthUser = ((_a = props == null ? void 0 : props.auth) == null ? void 0 : _a.user) ?? (props == null ? void 0 : props.authUser);
  const user = providedUser ?? sharedAuthUser;
  const links = baseLinks(translations);
  const isSuperAdmin = (user == null ? void 0 : user.role) === "admin";
  const filteredLinks = links.map((link) => ({
    ...link,
    href: resolveHref(link)
  })).filter((link) => {
    if (link.adminOnly) {
      return isSuperAdmin;
    }
    return true;
  });
  const isActive = (link) => {
    if (active) {
      return active === link.slug;
    }
    if (link.href === "/") {
      return url === "/";
    }
    return url.startsWith(link.href);
  };
  const activeLink = filteredLinks.find((link) => isActive(link));
  const mobileTitle = (activeLink == null ? void 0 : activeLink.name) ?? ((_b = translations == null ? void 0 : translations.app) == null ? void 0 : _b.brand) ?? "Roznamcha";
  const panelHomeHref = (() => {
    try {
      return route("panel.home");
    } catch (error) {
      return "/panel";
    }
  })();
  const handleBackClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }
    router3.visit(panelHomeHref, { replace: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "control-room min-h-screen bg-slate-950 text-white flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-64 flex-col border-r border-slate-800 bg-slate-900/60 p-6 shadow-2xl md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-[0.35em] text-slate-500", children: ((_c = translations == null ? void 0 : translations.app) == null ? void 0 : _c.brand) ?? "Roznamcha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold", children: ((_d = translations == null ? void 0 : translations.app) == null ? void 0 : _d.tagline) ?? "Control Room" }),
        user && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-slate-500", children: [
          user.name,
          " · ",
          user.role
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-2", children: filteredLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: link.href,
          className: `flex items-center rounded-lg px-3 py-2 text-sm transition hover:bg-slate-800 ${isActive(link) ? "bg-slate-800 text-white" : "text-slate-300"}`,
          children: link.name
        },
        link.slug
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex flex-wrap gap-2 text-xs text-slate-400", children: Object.entries(props.availableLocales ?? {}).map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `rounded-full border px-2 py-1 ${key === props.appLocale ? "border-yellow-300 text-yellow-300" : "border-slate-700"}`,
            children: label
          },
          key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: "/logout",
            method: "post",
            as: "button",
            className: "w-full rounded-lg bg-red-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400",
            children: "Logout"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-20 border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 backdrop-blur md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleBackClick,
            className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-white transition hover:bg-slate-800",
            "aria-label": "Go back",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                className: "h-5 w-5",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 18l-6-6 6-6", strokeLinecap: "round", strokeLinejoin: "round" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: mobileTitle }),
          user && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: user.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: panelHomeHref,
            className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-white transition hover:bg-slate-800",
            "aria-label": "Panel home",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "◎" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto", children })
    ] })
  ] });
}
export {
  ControlRoomLayout as C
};
