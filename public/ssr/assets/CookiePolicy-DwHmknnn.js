import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-8f9iGZFn.js";
import { b as buildWebPageSchema, s as seoContent, S as SeoHead } from "./SeoHead-DP7kLgW-.js";
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
const cookieTable = [
  {
    name: "roznamcha_session",
    provider: "Roznamcha (First-party)",
    type: "Essential / Session",
    duration: "120 minutes of inactivity",
    purpose: "Maintains authenticated user session or guest application state securely across requests."
  },
  {
    name: "XSRF-TOKEN",
    provider: "Roznamcha (First-party)",
    type: "Essential / Security",
    duration: "Session",
    purpose: "Protects visitors and form submissions against Cross-Site Request Forgery (CSRF) attacks."
  },
  {
    name: "roznamcha_cookie_consent",
    provider: "Roznamcha (First-party)",
    type: "Essential / Preference",
    duration: "180 days",
    purpose: "Stores your consent preference choice (accepted or declined) in local storage and HTTP cookie so the banner does not repeatedly reappear."
  },
  {
    name: "__gads, __gpi, IDE",
    provider: "Google AdSense (Third-party)",
    type: "Advertising (Optional)",
    duration: "Up to 13 months",
    purpose: "Used by Google and its certified ad partners to serve, personalize, and measure advertisements on eligible public pages after consent is granted."
  }
];
const sections = [
  {
    title: "What Are Cookies?",
    body: "Cookies are compact text files and data records stored on your device by your web browser when visiting online sites. They enable websites to function properly, remember user preferences, maintain session security, and provide reporting insights.",
    bullets: [
      "First-party cookies are set directly by Roznamcha to support fundamental navigation and security features.",
      "Third-party cookies and web beacons are set by certified external partners (such as Google AdSense) on supported public content pages only after visitor permission."
    ]
  },
  {
    title: "Cookies & Storage Items Actually Set",
    body: "Below is an itemized breakdown of the first-party and optional third-party cookies utilized on Roznamcha.pk:"
  },
  {
    title: "Google AdSense & Third-Party Advertising",
    body: "We partner with Google AdSense to serve advertisements on designated public content pages, allowing us to keep all our planning tools and articles accessible without charge.",
    bullets: [
      "Google and its third-party advertising partners use cookies and web beacons to serve ads based on your prior visits to Roznamcha.pk and other websites across the web.",
      "Google’s use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Learn how Google manages data on partner sites by visiting the official Google documentation at",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://policies.google.com/technologies/partner-sites",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "font-medium text-[#001a4a] underline hover:no-underline",
            children: "policies.google.com/technologies/partner-sites"
          }
        ),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "You may opt out of personalized advertising by visiting Google Ad Settings or through the digital advertising industry portal at",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://www.aboutads.info/choices",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "font-medium text-[#001a4a] underline hover:no-underline",
            children: "aboutads.info"
          }
        ),
        "."
      ] }),
      "Advertising scripts are strictly suppressed on authentication pages (login, registration), user dashboards, and legal policy pages."
    ]
  },
  {
    title: "How to Manage or Change Your Cookie Consent",
    body: "You have full autonomy over non-essential cookies and advertising identifiers on Roznamcha.pk.",
    bullets: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "You can reopen your consent choices at any time by clicking the",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("roznamcha:open-consent-modal"));
              }
            },
            className: "font-semibold text-[#001a4a] underline hover:no-underline cursor-pointer",
            children: "Cookie settings"
          }
        ),
        " ",
        "button available on every page."
      ] }),
      "You can also control or delete cookies directly through your browser settings. If you block essential cookies, certain features such as user login and form security may not function correctly.",
      "When you decline non-essential cookies, Google AdSense cookies and analytics trackers are withheld from loading on your device."
    ]
  }
];
function CookiePolicy({ seo: seoProp, jsonLd: jsonLdProp, contactEmail = "support@roznamcha.pk" }) {
  const seo = seoProp ?? seoContent.cookiePolicy;
  const jsonLd = jsonLdProp ?? buildWebPageSchema(seo);
  const openConsentModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("roznamcha:open-consent-modal"));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SeoHead,
      {
        title: seo.title,
        description: seo.description,
        canonical: seo.canonical,
        canonicalUrl: seo.canonical,
        keywords: seo.keywords,
        jsonLd
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-[#001a4a]/70", children: "Legal & Compliance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a] sm:text-4xl", children: "Cookie Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-500", children: "Last updated: November 18, 2026" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg leading-8 text-slate-600", children: "How Roznamcha.pk uses essential cookies, local browser storage, and optional third-party advertising identifiers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
        sections.map((section, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-[#001a4a]", children: section.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-7 text-slate-700", children: section.body }),
          idx === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-left text-sm text-slate-700 border border-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-xs uppercase font-semibold text-[#001a4a] border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Cookie / Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Provider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Classification" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Duration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Purpose" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-200", children: cookieTable.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs font-semibold text-[#001a4a]", children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.provider }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: row.type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.duration }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.purpose })
            ] }, row.name)) })
          ] }) }),
          section.bullets && section.bullets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-outside list-disc space-y-2 pl-5 text-base leading-7 text-slate-700", children: section.bullets.map((bullet, bIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "pl-1 marker:text-slate-400", children: bullet }, bIdx)) })
        ] }, section.title)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#fff9ef] border border-yellow-200 rounded-2xl p-6 sm:p-8 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-[#001a4a]", children: "Update Your Consent Preferences" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-7 text-slate-700", children: "You can adjust your consent settings for Roznamcha.pk at any time. Clicking the button below reopens the cookie settings modal." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: openConsentModal,
              className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#001a4a] hover:bg-[#002a7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001a4a] cursor-pointer",
              children: "Open Cookie Settings"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-2xl bg-slate-50 p-6 sm:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-[#001a4a]", children: "Still have questions?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base leading-7 text-slate-700", children: [
            "If you have any questions about our use of cookies or privacy practices, please contact our team at",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${contactEmail}`, className: "font-semibold text-[#001a4a] hover:underline", children: contactEmail }),
            " ",
            "or message our",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.contact"), className: "font-semibold text-[#001a4a] hover:underline", children: "contact page" }),
            "."
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  CookiePolicy as default
};
