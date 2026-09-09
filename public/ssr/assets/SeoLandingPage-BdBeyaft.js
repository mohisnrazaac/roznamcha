import { a as usePage, j as jsxRuntimeExports, H as Head_default, R as React, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-D7ZrLYf0.js";
import { S as SeoHead } from "./SeoHead-C4Ivadry.js";
const formatDate = (value) => {
  if (!value) return "Latest available update";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Latest available update";
  }
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Karachi"
  }).format(date);
};
const isRelativeHref = (href) => typeof href === "string" && href.startsWith("/");
function SmartLink({ href, children, className }) {
  if (isRelativeHref(href)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href, className, children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, className, children });
}
function SeoLandingPage({
  title,
  h1,
  metaTitle,
  metaDescription,
  canonicalUrl,
  robots,
  lastUpdated,
  dataPoints = [],
  summaryText,
  comparisonText,
  helperContent = [],
  internalLinks = [],
  faqItems = [],
  ctaText,
  breadcrumbs = [],
  structuredData = [],
  sourceLabel,
  sourceUrl,
  sourceAssetUrl,
  noticeTitle,
  lastCheckedAt,
  theme = {}
}) {
  const { auth } = usePage().props;
  const primarySchema = structuredData[0] ?? null;
  const extraSchemas = structuredData.slice(1);
  const ctaHref = (auth == null ? void 0 : auth.user) ? route("dashboard") : "/register";
  const ctaLabel = (auth == null ? void 0 : auth.user) ? "Open Roznamcha" : "Create Free Account";
  const badgeClass = theme.badgeClass ?? "bg-amber-100 text-amber-900 border-amber-200";
  const heroClass = theme.heroClass ?? "from-white via-amber-50 to-slate-100";
  const accentClass = theme.accentClass ?? "text-amber-700";
  const panelClass = theme.panelClass ?? "bg-white border-slate-200";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeoHead,
      {
        title: metaTitle,
        description: metaDescription,
        canonical: canonicalUrl,
        url: canonicalUrl,
        robots,
        jsonLd: primarySchema
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Head_default, { children: extraSchemas.map((schema, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(schema) }
      },
      `seo-schema-${index}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-[#f7f3ea]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-wrap items-center gap-2 text-sm text-slate-500", children: breadcrumbs.map((crumb, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SmartLink, { href: crumb.href, className: "hover:text-[#001a4a]", children: crumb.label }),
        index < breadcrumbs.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }) : null
      ] }, `${crumb.label}-${index}`)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-6 rounded-[2rem] border border-slate-200 bg-gradient-to-br ${heroClass} p-8 shadow-sm`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeClass}`, children: "Living SEO Page" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold tracking-tight text-[#001a4a] sm:text-4xl", children: h1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl text-base leading-7 text-slate-700", children: summaryText }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/70 bg-white/80 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-semibold ${accentClass}`, children: "Latest change" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-lg font-medium text-slate-800", children: comparisonText })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-[1.75rem] border ${panelClass} p-6 shadow-sm`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-slate-500", children: "Freshness" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Last updated" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-[#001a4a]", children: formatDate(lastUpdated) })
              ] }),
              lastCheckedAt ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Last source check" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-slate-800", children: formatDate(lastCheckedAt) })
              ] }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Source label" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-slate-800", children: sourceLabel })
              ] }),
              noticeTitle ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Notice" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-slate-800", children: noticeTitle })
              ] }) : null,
              sourceUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Source link" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: sourceUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "text-sm font-semibold text-[#001a4a] underline decoration-dotted underline-offset-2 hover:decoration-solid",
                    children: "Open source notice"
                  }
                ),
                sourceAssetUrl && sourceAssetUrl !== sourceUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: sourceAssetUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "mt-2 block text-sm font-semibold text-[#001a4a] underline decoration-dotted underline-offset-2 hover:decoration-solid",
                    children: "Open notice image"
                  }
                ) : null
              ] }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-6 text-slate-600", children: "This page is designed to refresh over time so visitors get updated context instead of a frozen long-tail template." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: dataPoints.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-500", children: item.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-semibold text-[#001a4a]", children: item.value })
      ] }, item.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          helperContent.map((block) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: block.heading }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base leading-7 text-slate-700", children: block.body })
          ] }, block.heading)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "Frequently asked questions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-4", children: faqItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-slate-900", children: item.question }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: item.answer })
            ] }, item.question)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-[#001a4a]", children: "Related pages" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-3", children: internalLinks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SmartLink,
              {
                href: item.href,
                className: "block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#001a4a] transition hover:border-[#001a4a] hover:bg-[#001a4a] hover:text-white",
                children: item.title
              },
              `${item.title}-${item.href}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] bg-[#001a4a] p-6 text-white shadow-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200", children: "Next step" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-2xl font-semibold", children: "Use the number, then track the rest" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm leading-7 text-white/85", children: ctaText }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SmartLink,
              {
                href: ctaHref,
                className: "mt-6 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-3 text-sm font-semibold text-[#001a4a] transition hover:bg-white",
                children: ctaLabel
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  SeoLandingPage as S
};
