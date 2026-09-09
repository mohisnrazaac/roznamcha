import { a as usePage, R as React, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-nckxm3ML.js";
import { S as SeoHead, b as buildWebPageSchema, s as seoContent } from "./SeoHead-BxTvC064.js";
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
const formatCurrency = (value) => new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(Number(value ?? 0));
const formatDate = (value) => {
  if (!value) return "Not viewed yet";
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
};
function Index({ categories = [], templates = [], savedTemplates = [], seo: seoProp, jsonLd: jsonLdProp }) {
  const { auth } = usePage().props;
  const isAuthenticated = Boolean(auth == null ? void 0 : auth.user);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const seo = seoProp ?? seoContent.smartBudgetTemplates;
  const visibleTemplates = activeCategory === "all" ? templates : templates.filter((template) => template.category === activeCategory);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd: jsonLdProp ?? buildWebPageSchema(seo) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-[2rem] border border-[#001a4a]/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,224,102,0.45),_transparent_30%),linear-gradient(135deg,_#fff8ea_0%,_#ffffff_55%,_#eef4ff_100%)] p-8 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Survival-first templates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "max-w-3xl text-4xl font-semibold tracking-tight text-[#001a4a]", children: "Smart Budget Templates built for Pakistani household reality" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl text-base leading-7 text-slate-600", children: "Browse the template library and category summaries first. Saving, full template access, and downloads start after login so the household can return to the same planning structure next month." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: "/register",
                className: "inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261]",
                children: "Save for my household"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: "/login",
                className: "inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-white",
                children: "Login"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3 lg:grid-cols-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Templates live", value: templates.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Saved by you", value: savedTemplates.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Public browsing", value: "On" })
        ] })
      ] }) }),
      isAuthenticated && savedTemplates.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Return loop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-2xl font-semibold text-[#001a4a]", children: "Saved for your household" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700", children: "Returning users start here" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: savedTemplates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "article",
          {
            className: "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-[#001a4a]", children: template.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-slate-500", children: [
                "Saved on ",
                formatDate(template.saved_at)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-slate-500", children: [
                "Last viewed: ",
                formatDate(template.last_viewed_at)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-slate-500", children: [
                "Household: ",
                template.household_label ?? "Default household"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: template.show_url,
                  className: "mt-4 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline",
                  children: "Open saved template"
                }
              )
            ]
          },
          template.slug
        )) })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActiveCategory("all"),
              className: [
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeCategory === "all" ? "bg-[#001a4a] text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-[#001a4a]/30"
              ].join(" "),
              children: "All Templates"
            }
          ),
          categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveCategory(category.key),
              className: [
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeCategory === category.key ? "bg-[#001a4a] text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-[#001a4a]/30"
              ].join(" "),
              children: [
                category.label,
                " · ",
                category.count
              ]
            },
            category.key
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3", children: visibleTemplates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "article",
          {
            className: "group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: template.category_label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-2xl font-semibold text-[#001a4a]", children: template.title })
                ] }),
                template.is_premium ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-[#001a4a] px-3 py-1 text-xs font-semibold text-yellow-200", children: "PRO" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700", children: "FREE" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-3xl bg-[#fff4cf] p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: "Monthly target" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: [
                  "PKR ",
                  formatCurrency(template.base_salary_target)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-600", children: template.is_premium && template.price ? `PRO plan price: PKR ${formatCurrency(template.price)}` : "Free PDF becomes available after login." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2 text-xs font-medium", children: [
                template.saved_at ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-50 px-3 py-1 text-emerald-700", children: "Saved to household" }) : null,
                template.has_pro_access ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-yellow-100 px-3 py-1 text-[#8c5a00]", children: "PRO unlocked" }) : null,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-slate-600", children: "Login required for full access" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: template.show_url,
                  className: "mt-6 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline",
                  children: "View template details"
                }
              )
            ]
          },
          template.slug
        )) })
      ] })
    ] })
  ] });
}
function StatCard({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: value })
  ] });
}
export {
  Index as default
};
