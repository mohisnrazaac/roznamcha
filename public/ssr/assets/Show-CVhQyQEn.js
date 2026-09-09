import { a as usePage, u as useForm, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-nckxm3ML.js";
import { S as SeoHead, b as buildWebPageSchema } from "./SeoHead-BxTvC064.js";
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
  if (!value) return null;
  return new Intl.DateTimeFormat("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
};
function Show({ template, budget, proPreview, guestReturnTo, seo: seoProp, jsonLd: jsonLdProp }) {
  const { auth, flash } = usePage().props;
  const isAuthenticated = Boolean(auth == null ? void 0 : auth.user);
  const { post, processing } = useForm({
    slug: template.slug,
    source: "template_show"
  });
  const seo = seoProp ?? {
    title: `${template.title} | Smart Budget Templates | Roznamcha`,
    description: "Preview a Pakistan-specific survival budget template, save it to your household, and download the free PDF after login.",
    canonical: `https://roznamcha.pk${template.show_url}`,
    url: `https://roznamcha.pk${template.show_url}`,
    image: "https://roznamcha.pk/icons/appicon.png",
    type: "article",
    schemaName: template.title
  };
  const registerHref = `/register?return_to=${encodeURIComponent(guestReturnTo)}`;
  const loginHref = `/login?return_to=${encodeURIComponent(guestReturnTo)}`;
  const visibleGuestCategories = budget.categories.slice(0, 4);
  const lockedGuestCategories = budget.categories.slice(4);
  const showPremiumLock = template.is_premium && !template.has_pro_access;
  const handleSave = () => {
    post("/templates/save", {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd: jsonLdProp ?? buildWebPageSchema(seo) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-[1.1fr_0.9fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8c5a00]", children: template.category_label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-slate-600", children: [
              "Family size ",
              template.family_size
            ] }),
            template.is_premium ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-[#001a4a] px-3 py-1 text-yellow-200", children: "PRO layer available" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-50 px-3 py-1 text-emerald-700", children: "Free template" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-semibold tracking-tight text-[#001a4a]", children: template.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-base leading-7 text-slate-600", children: "This template is structured for household survival first: core groceries, controlled utilities, school fees when needed, and enough discipline to keep at least one buffer alive." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightCard, { label: "Salary Target", value: `PKR ${formatCurrency(template.base_salary_target)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightCard, { label: "Allocated", value: `PKR ${formatCurrency(budget.total_allocated)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightCard, { label: "Download", value: isAuthenticated ? "Free PDF ready" : "Login required" })
          ] }),
          (flash == null ? void 0 : flash.status) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700", children: flash.status }) : null,
          template.saved_at ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600", children: [
            "Saved on ",
            formatDate(template.saved_at),
            template.household_label ? ` for ${template.household_label}` : "",
            "."
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-3", children: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleSave,
                disabled: processing,
                className: "inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261] disabled:cursor-not-allowed disabled:opacity-70",
                children: processing ? "Saving..." : "Save for my household"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `${template.download_url}?mode=free`,
                className: "inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-[#001a4a]/5",
                children: "Download free PDF"
              }
            ),
            template.is_premium ? template.has_pro_access ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `${template.download_url}?mode=pro`,
                className: "inline-flex items-center justify-center rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-[#8c5a00] transition hover:bg-yellow-100",
                children: "Download PRO PDF"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: route("public.contact"),
                className: "inline-flex items-center justify-center rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-[#8c5a00] transition hover:bg-yellow-100",
                children: "Contact us for PRO access"
              }
            ) : null
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: registerHref,
                className: "inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012261]",
                children: "Save this for my household"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: loginHref,
                className: "inline-flex items-center justify-center rounded-full border border-[#001a4a]/15 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-[#001a4a]/5",
                children: "Login to download"
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: "Free breakdown" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl font-semibold text-[#001a4a]", children: "Category allocation" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600", children: "Cached after first generation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-3", children: (isAuthenticated ? budget.categories : visibleGuestCategories).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryRow, { item }, item.category)) }),
          !isAuthenticated && lockedGuestCategories.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 blur-sm", children: lockedGuestCategories.slice(0, 3).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryRow, { item }, item.category)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm rounded-3xl bg-[#001a4a] p-6 text-center text-white shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold", children: "Save this for my household" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-white/80", children: "Preview is open. Download and returning access start after signup." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: registerHref,
                  className: "mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a]",
                  children: "Save to continue"
                }
              )
            ] }) })
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: "Saving tips" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3", children: budget.saving_tips.map((tip, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600",
                children: tip
              },
              `${template.slug}-tip-${index + 1}`
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: "PRO projection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl font-semibold text-[#001a4a]", children: "Inflation-aware next month view" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: "PRO mode adds a 10-15% inflation shock layer, next-month projection, and Ask Roza tips for households that need a deeper monthly planning view." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-3xl bg-[#fff4cf] p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: "Projected next month" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-3xl font-semibold text-[#001a4a]", children: [
              "PKR ",
              formatCurrency(proPreview.next_month_projection)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-slate-600", children: [
              "Assumes a ",
              proPreview.inflation_rate_percent,
              "% survival buffer on the current structure."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: showPremiumLock ? "blur-sm" : "", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: proPreview.inflation_categories.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "rounded-2xl border border-white bg-white px-4 py-3",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-[#001a4a]", children: item.category }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
                        "PKR ",
                        formatCurrency(item.current_amount),
                        " now"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-[#8c5a00]", children: [
                      "PKR ",
                      formatCurrency(item.inflated_amount)
                    ] })
                  ] })
                },
                `${template.slug}-${item.category}`
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: "Ask Roza Tips" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children: proPreview.ask_roza_tips.map((tip, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-600",
                    children: tip
                  },
                  `${template.slug}-roza-${index + 1}`
                )) })
              ] })
            ] }),
            showPremiumLock ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm rounded-3xl border border-yellow-200 bg-white p-6 text-center shadow-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-[#001a4a]", children: "PRO access is available on request" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-6 text-slate-600", children: "Save the template first, then contact Roznamcha if you need the upgraded planning view and PDF for your household." }),
              isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: route("public.contact"),
                  className: "mt-4 inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white",
                  children: "Contact us for PRO access"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: registerHref,
                  className: "mt-4 inline-flex items-center justify-center rounded-full bg-[#001a4a] px-5 py-2.5 text-sm font-semibold text-white",
                  children: "Save first"
                }
              )
            ] }) }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-[#001a4a] p-8 text-white shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-yellow-200", children: "Habit formation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl font-semibold", children: "This module is built for return visits, not one-time downloads" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-white/80", children: "Save the template now. Next month, open the same template and compare the planned survival split against your real kharcha, ration pressure, and school-fee shocks." }),
          isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleSave,
              disabled: processing,
              className: "mt-5 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70",
              children: processing ? "Saving..." : "Save for my household"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: registerHref,
              className: "mt-5 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a]",
              children: "Save for my household"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function HighlightCard({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-200 bg-slate-50 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xl font-semibold text-[#001a4a]", children: value })
  ] });
}
function CategoryRow({ item }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-[#001a4a]", children: item.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
        item.percentage,
        "% of the monthly plan"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-slate-700", children: [
      "PKR ",
      formatCurrency(item.amount)
    ] })
  ] }) });
}
export {
  Show as default
};
