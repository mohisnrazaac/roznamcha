import { b as reactExports, j as jsxRuntimeExports, a as usePage, R as React, L as Link_default } from "../ssr.js";
import { C as ChatWidget } from "./ChatWidget-DFPdtWTT.js";
const CONSENT_KEY = "roznamcha_cookie_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
const persistConsent = (value) => {
  localStorage.setItem(CONSENT_KEY, value);
  document.cookie = `${CONSENT_KEY}=${encodeURIComponent(value)}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax; Secure`;
  window.dispatchEvent(new CustomEvent("roznamcha:consent-updated", {
    detail: { consent: value }
  }));
};
function CookieConsent() {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    }
    const handleOpen = () => setIsVisible(true);
    window.addEventListener("roznamcha:open-consent-modal", handleOpen);
    return () => window.removeEventListener("roznamcha:open-consent-modal", handleOpen);
  }, []);
  const handleAccept = () => {
    persistConsent("accepted");
    setIsVisible(false);
  };
  const handleDecline = () => {
    persistConsent("declined");
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-0 left-0 right-0 z-50 bg-[#001a4a] text-white border-t border-white/10 px-4 py-4 sm:px-6 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-white/90 text-center md:text-left", children: [
      "Roznamcha uses essential cookies to keep the site working. Optional Google advertising and analytics only load after you allow them. If you stay with essential-only settings, we keep ads and non-essential measurement turned off on this device. Read our",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/cookie-policy", className: "underline text-yellow-300 hover:text-yellow-200", children: "Cookie Policy" }),
      " ",
      "for details on how we use cookies."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleDecline,
          className: "rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/10",
          children: "Essential only"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleAccept,
          className: "rounded-full bg-yellow-300 px-5 py-2 text-xs font-semibold text-[#001a4a] transition hover:bg-white",
          children: "Allow ads & analytics"
        }
      )
    ] })
  ] }) });
}
const defaultCompanyMenuLinks = [
  {
    href: "/about",
    label: "About Us",
    description: "Mission, architecture, and team"
  },
  {
    href: "/contact",
    label: "Contact Us",
    description: "Support, questions, and feedback"
  },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
    description: "Data protection and privacy standards"
  },
  {
    href: "/terms",
    label: "Terms of Service",
    description: "User agreement and service rules"
  },
  {
    href: "/editorial-policy",
    label: "Editorial Policy",
    description: "Standards and research integrity"
  },
  {
    href: "/methodology",
    label: "Methodology & Sources",
    description: "Official data sources & formulas"
  }
];
const defaultToolMenuLinks = [
  {
    href: "/features#public-tools",
    label: "All Public Tools",
    description: "Calculators and public planners"
  },
  {
    href: "/features/monthly-expense-tracker-pakistan",
    label: "Monthly Expense Tracker",
    description: "PKR income & expense tracking guide"
  },
  {
    href: "/tools/ration-cost-estimator",
    label: "Ration Cost Estimator",
    description: "Guest grocery planning tool"
  },
  {
    href: "/tools/monthly-household-budget-calculator",
    label: "Budget Calculator",
    description: "Monthly income & expense planner"
  },
  {
    href: "/tools/school-fees-planner",
    label: "School Fees Planner",
    description: "School cost planning page"
  },
  {
    href: "/tools/electricity-bill-estimator",
    label: "Electricity Bill Estimator",
    description: "Progressive slab estimator"
  },
  {
    href: "/tools/solar-net-metering-roi-calculator",
    label: "Solar ROI Calculator",
    description: "Net billing, payback & battery TCO"
  },
  {
    href: "/survival-report",
    label: "Survival Report",
    description: "Month-end pressure and budget health view"
  },
  {
    href: "/kharcha-map",
    label: "Kharcha Map",
    description: "See where the household budget is leaking"
  },
  {
    href: "/templates/50k-salary-survival-guide",
    label: "50k Salary Guide",
    description: "A stronger survival-first budget example"
  }
];
const variantLabels = {
  landing: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold text-base", children: "Roznamcha" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-300 text-xs font-medium", children: "روزنامچہ" })
  ] }),
  inner: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold text-base tracking-[0.2em] uppercase", children: "Roznamcha" })
};
function PublicHeader({
  variant = "landing",
  user: propUser,
  toolMenuLinks = defaultToolMenuLinks,
  companyMenuLinks = defaultCompanyMenuLinks
}) {
  var _a;
  const { url = "", props: pageProps } = usePage();
  const user = propUser !== void 0 ? propUser : ((_a = pageProps == null ? void 0 : pageProps.auth) == null ? void 0 : _a.user) ?? null;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = React.useState(false);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = React.useState(false);
  const [isMobileToolsMenuOpen, setIsMobileToolsMenuOpen] = React.useState(false);
  const [isMobileCompanyMenuOpen, setIsMobileCompanyMenuOpen] = React.useState(false);
  const path = (url || "").split("?")[0] ?? "";
  const isLinkActive = (hrefMatch) => path === hrefMatch || path.startsWith(`${hrefMatch}/`);
  const linkClasses = (hrefMatch) => `text-sm font-medium transition-colors ${isLinkActive(hrefMatch) ? "text-yellow-300" : "text-white/80 hover:text-yellow-200"}`;
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/templates", label: "Templates" },
    { href: "/blog", label: "Blog" }
  ];
  const isToolsMenuActive = path.startsWith("/tools") || path.startsWith("/petrol-price-") || path.startsWith("/electricity-bill-calculator-") || path.startsWith("/ration-cost-for-");
  const toolsMenuClasses = `text-sm font-medium transition-colors ${isToolsMenuActive ? "text-yellow-300" : "text-white/80 hover:text-yellow-200"}`;
  const isCompanyMenuActive = path === "/about" || path === "/contact" || path === "/privacy-policy" || path === "/terms" || path === "/editorial-policy" || path === "/methodology" || path === "/cookie-policy" || path === "/disclaimer";
  const companyMenuClasses = `text-sm font-medium transition-colors ${isCompanyMenuActive ? "text-yellow-300" : "text-white/80 hover:text-yellow-200"}`;
  const toolsSubmenuLinkClasses = "block rounded-2xl border border-white/10 px-4 py-3 transition hover:border-yellow-200/40 hover:bg-white/10";
  const isHashLink = (href) => typeof href === "string" && href.includes("#");
  const ctaClasses = {
    primary: "inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a] shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200",
    secondary: "inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
  };
  const renderActions = (actionVariant = "desktop") => {
    const extraClasses = actionVariant === "mobile" ? "w-full" : "";
    return user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("dashboard"), className: `${ctaClasses.primary} ${extraClasses}`, children: "Open App" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: route("logout"),
          method: "post",
          as: "button",
          className: `${ctaClasses.secondary} ${extraClasses}`,
          children: "Logout"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/register", className: `${ctaClasses.primary} ${extraClasses}`, children: "Sign up (Free)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/login", className: `${ctaClasses.secondary} ${extraClasses}`, children: "Login" })
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-[#001a4a] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "flex items-center gap-3", "aria-label": "Roznamcha home", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/icons/appicon.png",
            alt: "Roznamcha logo",
            width: "44",
            height: "44",
            className: "w-11 h-11 rounded-2xl border border-white/20 object-cover bg-white/10"
          }
        ),
        variantLabels[variant] ?? variantLabels.landing
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "sm:hidden inline-flex items-center rounded-full border border-white/40 px-3 py-2 text-white transition hover:bg-white/10",
          onClick: () => setIsMenuOpen((prev) => !prev),
          "aria-controls": "public-nav",
          "aria-expanded": isMenuOpen,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle navigation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: isMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex sm:items-center sm:gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-6 text-sm", "aria-label": "Primary navigation", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/", className: linkClasses("/"), children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/features", className: linkClasses("/features"), children: "Features" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative",
              onMouseEnter: () => setIsToolsMenuOpen(true),
              onMouseLeave: () => setIsToolsMenuOpen(false),
              onFocusCapture: () => setIsToolsMenuOpen(true),
              onBlurCapture: (event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsToolsMenuOpen(false);
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: `${toolsMenuClasses} inline-flex items-center gap-2`,
                    onClick: () => setIsToolsMenuOpen((prev) => !prev),
                    "aria-expanded": isToolsMenuOpen,
                    "aria-haspopup": "menu",
                    "aria-controls": "public-tools-menu",
                    children: [
                      "Tools",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
                    ]
                  }
                ),
                isToolsMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    id: "public-tools-menu",
                    className: "absolute left-1/2 top-full z-30 w-[28rem] -translate-x-1/2 pt-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[1.5rem] border border-white/10 bg-[#01265d] p-4 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: toolMenuLinks.map((item) => isHashLink(item.href) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: item.href,
                        className: toolsSubmenuLinkClasses,
                        onClick: () => setIsToolsMenuOpen(false),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-semibold text-white", children: item.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-xs text-white/65", children: item.description })
                        ]
                      },
                      item.href
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link_default,
                      {
                        href: item.href,
                        className: toolsSubmenuLinkClasses,
                        onClick: () => setIsToolsMenuOpen(false),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-semibold text-white", children: item.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-xs text-white/65", children: item.description })
                        ]
                      },
                      item.href
                    )) }) })
                  }
                ) : null
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/templates", className: linkClasses("/templates"), children: "Templates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/blog", className: linkClasses("/blog"), children: "Blog" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative",
              onMouseEnter: () => setIsCompanyMenuOpen(true),
              onMouseLeave: () => setIsCompanyMenuOpen(false),
              onFocusCapture: () => setIsCompanyMenuOpen(true),
              onBlurCapture: (event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsCompanyMenuOpen(false);
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: `${companyMenuClasses} inline-flex items-center gap-2`,
                    onClick: () => setIsCompanyMenuOpen((prev) => !prev),
                    "aria-expanded": isCompanyMenuOpen,
                    "aria-haspopup": "menu",
                    "aria-controls": "public-company-menu",
                    children: [
                      "Company",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
                    ]
                  }
                ),
                isCompanyMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    id: "public-company-menu",
                    className: "absolute left-1/2 top-full z-30 w-80 -translate-x-1/2 pt-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[1.5rem] border border-white/10 bg-[#01265d] p-3 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: companyMenuLinks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link_default,
                      {
                        href: item.href,
                        className: "block rounded-xl border border-white/10 px-3.5 py-2.5 transition hover:border-yellow-200/40 hover:bg-white/10",
                        onClick: () => setIsCompanyMenuOpen(false),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-semibold text-white", children: item.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 block text-xs text-white/65", children: item.description })
                        ]
                      },
                      item.href
                    )) }) })
                  }
                ) : null
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: renderActions() })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        id: "public-nav",
        className: `mt-4 sm:hidden ${isMenuOpen ? "flex flex-col gap-4" : "hidden"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col gap-3 text-sm", "aria-label": "Mobile navigation", children: [
            navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: link.href,
                className: linkClasses(link.href),
                onClick: () => setIsMenuOpen(false),
                children: link.label
              },
              link.href
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `${toolsMenuClasses} flex w-full items-center justify-between`,
                  onClick: () => setIsMobileToolsMenuOpen((prev) => !prev),
                  "aria-expanded": isMobileToolsMenuOpen,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tools" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `h-4 w-4 transition-transform ${isMobileToolsMenuOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
                  ]
                }
              ),
              isMobileToolsMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: toolMenuLinks.map((item) => isHashLink(item.href) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: item.href,
                  className: "block rounded-xl border border-white/10 px-3 py-3 text-sm text-white/85 transition hover:bg-white/10",
                  onClick: () => {
                    setIsMobileToolsMenuOpen(false);
                    setIsMenuOpen(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-semibold text-white", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-xs text-white/60", children: item.description })
                  ]
                },
                item.href
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link_default,
                {
                  href: item.href,
                  className: "block rounded-xl border border-white/10 px-3 py-3 text-sm text-white/85 transition hover:bg-white/10",
                  onClick: () => {
                    setIsMobileToolsMenuOpen(false);
                    setIsMenuOpen(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-semibold text-white", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-xs text-white/60", children: item.description })
                  ]
                },
                item.href
              )) }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `${companyMenuClasses} flex w-full items-center justify-between`,
                  onClick: () => setIsMobileCompanyMenuOpen((prev) => !prev),
                  "aria-expanded": isMobileCompanyMenuOpen,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Company & Legal" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: `h-4 w-4 transition-transform ${isMobileCompanyMenuOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
                  ]
                }
              ),
              isMobileCompanyMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: companyMenuLinks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link_default,
                {
                  href: item.href,
                  className: "block rounded-xl border border-white/10 px-3 py-2 text-sm text-white/85 transition hover:bg-white/10",
                  onClick: () => {
                    setIsMobileCompanyMenuOpen(false);
                    setIsMenuOpen(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-semibold text-white", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 block text-xs text-white/60", children: item.description })
                  ]
                },
                item.href
              )) }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1.5 px-1 pt-1 text-xs text-white/70", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/privacy-policy",
                  className: "font-medium hover:text-yellow-200 hover:underline",
                  onClick: () => setIsMenuOpen(false),
                  children: "Privacy Policy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/terms",
                  className: "font-medium hover:text-yellow-200 hover:underline",
                  onClick: () => setIsMenuOpen(false),
                  children: "Terms of Service"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: "/cookie-policy",
                  className: "font-medium hover:text-yellow-200 hover:underline",
                  onClick: () => setIsMenuOpen(false),
                  children: "Cookie Policy"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: renderActions("mobile") })
        ]
      }
    )
  ] }) });
}
const variantStyles = {
  landing: {
    wrapper: "min-h-screen flex flex-col bg-[#fff9ef] text-slate-900",
    label: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold text-base", children: "Roznamcha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-300 text-xs font-medium", children: "روزنامچہ" })
    ] })
  },
  inner: {
    wrapper: "min-h-screen flex flex-col bg-gray-50 text-slate-900",
    label: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold text-base tracking-[0.2em] uppercase", children: "Roznamcha" })
  }
};
function PublicLayout({ children, variant = "landing" }) {
  var _a;
  const styles = variantStyles[variant] ?? variantStyles.landing;
  const { url = "", props } = usePage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = React.useState(false);
  const [isMobileToolsMenuOpen, setIsMobileToolsMenuOpen] = React.useState(false);
  const path = (url || "").split("?")[0] ?? "";
  const user = ((_a = props == null ? void 0 : props.auth) == null ? void 0 : _a.user) ?? null;
  const featuresToolsHref = `${route("public.features")}#public-tools`;
  const toolMenuLinks = [
    {
      href: featuresToolsHref,
      label: "All Public Tools",
      description: "Calculators and public planners"
    },
    {
      href: "/features/monthly-expense-tracker-pakistan",
      label: "Monthly Expense Tracker",
      description: "PKR income & expense tracking guide"
    },
    {
      href: "/tools/ration-cost-estimator",
      label: "Ration Cost Estimator",
      description: "Guest grocery planning tool"
    },
    {
      href: "/tools/monthly-household-budget-calculator",
      label: "Budget Calculator",
      description: "Monthly income & expense planner"
    },
    {
      href: "/tools/school-fees-planner",
      label: "School Fees Planner",
      description: "School cost planning page"
    },
    {
      href: "/tools/electricity-bill-estimator",
      label: "Electricity Bill Estimator",
      description: "Progressive slab estimator"
    },
    {
      href: "/tools/solar-net-metering-roi-calculator",
      label: "Solar ROI Calculator",
      description: "Net billing, payback & battery TCO"
    },
    {
      href: "/survival-report",
      label: "Survival Report",
      description: "Month-end pressure and budget health view"
    },
    {
      href: "/kharcha-map",
      label: "Kharcha Map",
      description: "See where the household budget is leaking"
    },
    {
      href: "/templates/50k-salary-survival-guide",
      label: "50k Salary Guide",
      description: "A stronger survival-first budget example"
    }
  ];
  path.startsWith("/tools") || path.startsWith("/petrol-price-") || path.startsWith("/electricity-bill-calculator-") || path.startsWith("/ration-cost-for-");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.wrapper, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PublicHeader,
      {
        variant,
        user,
        toolMenuLinks
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 w-full", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-transparent text-center px-4 py-8 text-sm text-slate-500 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/features/monthly-expense-tracker-pakistan", className: "text-[#001a4a] hover:underline", children: "Monthly Expense Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/about", className: "text-[#001a4a] hover:underline", children: "About Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/editorial-policy", className: "text-[#001a4a] hover:underline", children: "Editorial Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/methodology", className: "text-[#001a4a] hover:underline", children: "Methodology & Sources" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/contact", className: "text-[#001a4a] hover:underline", children: "Contact Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/privacy-policy", className: "text-[#001a4a] hover:underline", children: "Privacy Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/cookie-policy", className: "text-[#001a4a] hover:underline", children: "Cookie Policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/disclaimer", className: "text-[#001a4a] hover:underline", children: "Disclaimer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/terms", className: "text-[#001a4a] hover:underline", children: "Terms of Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => window.dispatchEvent(new CustomEvent("roznamcha:open-consent-modal")),
            className: "text-[#001a4a] hover:underline cursor-pointer",
            children: "Cookie Settings"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/sitemap.xml", className: "text-[#001a4a] hover:underline", children: "Sitemap" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center items-center gap-2 text-sm text-[#001a4a]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Follow us:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://web.facebook.com/roznamcha.pk/",
            className: "text-[#001a4a] underline decoration-dotted underline-offset-2 hover:decoration-solid",
            target: "_blank",
            rel: "noopener noreferrer",
            children: "Facebook"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Developed and managed remotely out of Karachi, Pakistan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2026 Roznamcha. All rights reserved." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatWidget, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CookieConsent, {})
  ] });
}
export {
  PublicLayout as P
};
