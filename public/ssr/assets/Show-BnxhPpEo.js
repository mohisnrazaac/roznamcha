import { b as reactExports, j as jsxRuntimeExports, a as usePage, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-Cdp3p9pO.js";
import { S as SeoHead } from "./SeoHead-1rNy1Vsq.js";
import { P as PropTypes } from "./index-h3QfXfrJ.js";
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
async function triggerBlogCta({ postId, slug, returnTo, ctaRoute = "register", prefill = null }) {
  var _a;
  const csrfToken = (_a = document.head.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
  const payload = {
    post_id: postId,
    slug,
    return_to: returnTo,
    cta_route: ctaRoute
  };
  if (prefill) {
    payload.prefill = prefill;
  }
  try {
    const response = await fetch(route("events.blog-cta-click"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken ?? "",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error("CTA request failed");
    }
    const data = await response.json();
    if (data == null ? void 0 : data.redirect) {
      window.location.href = data.redirect;
      return;
    }
  } catch (error) {
    console.error("CTA redirect failed", error);
  }
  const fallback = route(ctaRoute, { return_to: "/onboarding" });
  window.location.href = fallback;
}
let cachedPayload = null;
let inflightPromise = null;
function useDailyReturnContent() {
  const [state, setState] = reactExports.useState({
    data: cachedPayload,
    loading: !cachedPayload,
    error: null
  });
  reactExports.useEffect(() => {
    if (cachedPayload) {
      return;
    }
    let mounted = true;
    const resolveEndpoint = () => {
      if (typeof route === "function") {
        try {
          return route("daily-return.snapshot");
        } catch (error) {
        }
      }
      return "/daily-return/snapshot";
    };
    const fetchPayload = async () => {
      try {
        if (!inflightPromise) {
          inflightPromise = fetch(resolveEndpoint(), {
            method: "GET",
            headers: {
              Accept: "application/json"
            },
            credentials: "same-origin"
          }).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to load daily snapshot.");
            }
            return response.json();
          }).then((json) => json.data ?? json).finally(() => {
            inflightPromise = null;
          });
        }
        const payload = await inflightPromise;
        cachedPayload = payload;
        if (mounted) {
          setState({ data: payload, loading: false, error: null });
        }
      } catch (error) {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: error.message ?? "Unable to load daily snapshot."
          });
        }
      }
    };
    fetchPayload();
    return () => {
      mounted = false;
    };
  }, []);
  return state;
}
function BlogCTA({
  post = null,
  featureHooks = {},
  returnPath = "/blog",
  variant = "signup",
  ctaLinks = null
}) {
  const [loading, setLoading] = reactExports.useState(false);
  const { data } = useDailyReturnContent();
  const resolvedCtas = ctaLinks ?? (data == null ? void 0 : data.cta_links) ?? defaultCtaLinks();
  if (variant === "tool-links") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-[#001a4a]/15 bg-[#f4f7ff] p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-[#001a4a]/70", children: "Roznamcha Tools" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-2xl font-semibold text-[#001a4a]", children: "اپنا خرچ اب کنٹرول کریں" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-600", children: "ہر بلاگ کے آخر میں یہ دو راستے یاد دلاتے ہیں کہ بات ختم نہیں ہوتی—ابھی Kharcha Map یا Ration Brain کھولیں۔" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: resolvedCtas.map((cta) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: cta.href,
          className: "rounded-2xl border border-[#001a4a]/15 bg-white px-4 py-3 text-right text-[#001a4a] transition hover:border-[#001a4a]/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: cta.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Roznamcha tools سے فائدہ اٹھائیں" })
          ]
        },
        cta.href
      )) })
    ] });
  }
  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    const prefill = (featureHooks == null ? void 0 : featureHooks.prefill) ?? null;
    const ctaRoute = (featureHooks == null ? void 0 : featureHooks.ctaRoute) ?? "register";
    await triggerBlogCta({
      postId: post == null ? void 0 : post.id,
      slug: post == null ? void 0 : post.slug,
      returnTo: returnPath,
      ctaRoute,
      prefill
    });
    setLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-[#001a4a]/10 bg-[#f6f4ff] p-6 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-[#001a4a]", children: "Start your Roznamcha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "We will guide you through household setup, monthly budget, and your first expense." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleClick,
        type: "button",
        className: "inline-flex items-center justify-center rounded-full bg-[#001a4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#001a4a]/90 disabled:cursor-not-allowed disabled:opacity-60",
        disabled: loading,
        children: loading ? "Sending you to signup…" : "Start tracking my expenses"
      }
    )
  ] }) });
}
BlogCTA.propTypes = {
  post: PropTypes.object,
  featureHooks: PropTypes.object,
  returnPath: PropTypes.string,
  variant: PropTypes.oneOf(["signup", "tool-links"]),
  ctaLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })
  )
};
function defaultCtaLinks() {
  const kharchaUrl = safeRoute("public.kharcha-map");
  const rationUrl = safeRoute("public.ration-brain");
  const rationEstimatorUrl = safeRoute("public.tools.ration-cost-estimator");
  return [
    { label: "اپنا خرچ یہاں دیکھیں", href: kharchaUrl ?? "/kharcha-map" },
    { label: "اپنا ماہانہ بجٹ بنائیں", href: rationUrl ?? "/ration-brain" },
    { label: "راشن لاگت کا اندازہ لگائیں", href: rationEstimatorUrl ?? "/tools/ration-cost-estimator" }
  ];
}
function safeRoute(name) {
  if (typeof route === "function") {
    try {
      return route(name);
    } catch (error) {
      return null;
    }
  }
  return null;
}
function UseInRoznamchaWidget({ post, featureHooks = {}, returnPath }) {
  var _a, _b;
  const { props } = usePage();
  const isAuthenticated = Boolean((_a = props == null ? void 0 : props.auth) == null ? void 0 : _a.user);
  const prefill = (featureHooks == null ? void 0 : featureHooks.prefill) ?? {};
  const categoryLabel = prefill == null ? void 0 : prefill.category;
  const goToOnboarding = (amount = null) => {
    const params = new URLSearchParams();
    if (categoryLabel) {
      params.set("prefillCategory", categoryLabel);
    }
    if (amount) {
      params.set("prefillAmount", amount);
    }
    if (prefill == null ? void 0 : prefill.note) {
      params.set("prefillNote", prefill.note);
    }
    window.location.href = `${route("onboarding.first-expense")}?${params.toString()}`;
  };
  const handleClick = async () => {
    if (isAuthenticated) {
      goToOnboarding(prefill == null ? void 0 : prefill.amount);
      return;
    }
    await triggerBlogCta({
      postId: post == null ? void 0 : post.id,
      slug: post == null ? void 0 : post.slug,
      returnTo: returnPath,
      prefill: {
        category: categoryLabel,
        amount: (prefill == null ? void 0 : prefill.amount) ?? null,
        note: (prefill == null ? void 0 : prefill.note) ?? "Blog expense idea",
        tags: (prefill == null ? void 0 : prefill.tags) ?? []
      }
    });
  };
  if (!categoryLabel) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-[#001a4a]/10 bg-white/80 p-5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-[#001a4a]", children: "Use this insight inside Roznamcha" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-slate-600", children: [
      "We will pre-select the ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-[#001a4a]", children: categoryLabel }),
      " category for your next tracked expense."
    ] }),
    ((_b = prefill == null ? void 0 : prefill.tags) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: prefill.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600",
        children: [
          "#",
          tag
        ]
      },
      tag
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleClick,
        className: "mt-4 inline-flex items-center rounded-full bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400",
        children: isAuthenticated ? "Add expense now" : "Save in Roznamcha"
      }
    )
  ] });
}
UseInRoznamchaWidget.propTypes = {
  post: PropTypes.object.isRequired,
  featureHooks: PropTypes.object,
  returnPath: PropTypes.string.isRequired
};
function SchoolFeeIncreaseCalculator({ post, returnPath }) {
  var _a;
  const { props } = usePage();
  const isAuthenticated = Boolean((_a = props == null ? void 0 : props.auth) == null ? void 0 : _a.user);
  const [currentFee, setCurrentFee] = reactExports.useState("");
  const [increasePercent, setIncreasePercent] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const results = reactExports.useMemo(() => {
    const fee = parseFloat(currentFee);
    const percent = parseFloat(increasePercent);
    if (Number.isNaN(fee) || Number.isNaN(percent)) {
      return null;
    }
    const difference = fee * (percent / 100);
    const newMonthly = fee + difference;
    return {
      newMonthly,
      difference,
      yearly: difference * 12
    };
  }, [currentFee, increasePercent]);
  const handleSave = async () => {
    if (!results) {
      setError("Add current fee and increase % first.");
      return;
    }
    setError(null);
    const note = "School fee increase";
    if (isAuthenticated) {
      const params = new URLSearchParams({
        prefillCategory: "School",
        prefillAmount: results.difference.toFixed(2),
        prefillNote: note
      });
      window.location.href = `${route("onboarding.first-expense")}?${params.toString()}`;
      return;
    }
    await triggerBlogCta({
      postId: post == null ? void 0 : post.id,
      slug: post == null ? void 0 : post.slug,
      returnTo: returnPath,
      prefill: {
        category: "School",
        amount: results.difference.toFixed(2),
        note,
        tags: ["fees"]
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-[#001a4a]/10 bg-white p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-[#001a4a]", children: "Current monthly school fee (PKR)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: "0",
            value: currentFee,
            onChange: (event) => setCurrentFee(event.target.value),
            className: "mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-lg font-semibold text-[#001a4a]",
            placeholder: "15000"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold uppercase tracking-wide text-[#001a4a]", children: "Increase percentage (%)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: "0",
            value: increasePercent,
            onChange: (event) => setIncreasePercent(event.target.value),
            className: "mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-lg font-semibold text-[#001a4a]",
            placeholder: "18"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSave,
          className: "rounded-2xl bg-[#001a4a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#001a4a]/90",
          children: "Save in Roznamcha"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-red-500", children: error }),
    results && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 rounded-xl bg-[#f6f4ff] p-4 text-sm text-[#001a4a] sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultBlock, { label: "New monthly fee", value: results.newMonthly }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultBlock, { label: "Monthly increase", value: results.difference }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultBlock, { label: "Yearly impact", value: results.yearly })
    ] })
  ] });
}
function ResultBlock({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-[#001a4a]/60", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xl font-semibold", children: [
      "PKR ",
      Number(value || 0).toLocaleString(void 0, { maximumFractionDigits: 0 })
    ] })
  ] });
}
ResultBlock.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number
};
SchoolFeeIncreaseCalculator.propTypes = {
  post: PropTypes.object.isRequired,
  returnPath: PropTypes.string.isRequired
};
function LinkCard({ item, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-[#8c5a00]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-xl font-semibold text-[#001a4a]", children: item.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: item.description ?? "Open the next practical page in the same household planning flow." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: item.href, className: "mt-5 inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline", children: "Open page →" })
  ] });
}
function ArticleNextSteps({ relatedTools = [], relatedBlogs = [] }) {
  const hasTools = relatedTools.length > 0;
  const hasBlogs = relatedBlogs.length > 0;
  if (!hasTools && !hasBlogs) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8", "aria-labelledby": "article-next-steps-heading", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "What To Do Next" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "article-next-steps-heading", className: "text-3xl font-semibold text-[#001a4a]", children: "Use this article, then move into a stronger practical page" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-3xl text-base leading-7 text-slate-600", children: "Articles help with context. The strongest follow-through usually comes from a working tool or a tighter adjacent guide." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: [
      relatedTools.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { item, label: "Tool" }, `tool-${item.href}`)),
      relatedBlogs.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { item, label: "Guide" }, `blog-${item.href}`))
    ] })
  ] });
}
const getReturnPath = (url, slug) => {
  if (!url && slug) {
    return `/blog/${slug}`;
  }
  try {
    const parsed = new URL(url);
    return parsed.pathname || `/blog/${slug}`;
  } catch {
    if (typeof url === "string" && url.startsWith("/")) {
      return url;
    }
    return `/blog/${slug}`;
  }
};
const articleUseCards = [
  {
    title: "Planning aid, not a fixed rule",
    body: "Use the article to clarify tradeoffs and next steps. Do not treat one guide as a universal price list or a one-size-fits-all answer."
  },
  {
    title: "Adjust for your own household",
    body: "City, rent, school timing, transport needs, and family size can change the real monthly picture quickly."
  },
  {
    title: "Turn it into a real action",
    body: "The best next move is usually to track the cost, pressure-test the category, or compare it against a stronger Roznamcha tool."
  }
];
function BlogShow({ post, seo, jsonLd, relatedLinks = {} }) {
  var _a, _b, _c, _d, _e, _f;
  const featureHooks = (post == null ? void 0 : post.feature_hooks) ?? {};
  const returnPath = getReturnPath(post == null ? void 0 : post.url, post == null ? void 0 : post.slug);
  const showCalculator = (featureHooks == null ? void 0 : featureHooks.calculator) === "school_fee_increase";
  const hasActivationWidget = showCalculator || Boolean((_a = featureHooks == null ? void 0 : featureHooks.prefill) == null ? void 0 : _a.category);
  const metaItems = [
    { label: "Published", value: post == null ? void 0 : post.published_label },
    (post == null ? void 0 : post.updated_label) ? { label: "Updated", value: post.updated_label } : null,
    (post == null ? void 0 : post.reading_time_label) ? { label: "Reading time", value: post.reading_time_label } : null
  ].filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo, jsonLd }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "overflow-hidden rounded-[2rem] border border-[#001a4a]/10 bg-[linear-gradient(135deg,_#f6fbff_0%,_#ffffff_58%,_#fff6df_100%)] p-6 shadow-sm lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-[#001a4a]/70", children: "Roznamcha Blog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 text-xs text-[#001a4a]", children: (_b = post == null ? void 0 : post.categories) == null ? void 0 : _b.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: route("public.blog.category", { slug: category.slug }),
            className: "rounded-full border border-[#001a4a]/20 bg-white/80 px-3 py-1 font-semibold hover:bg-[#001a4a]/5",
            children: category.name
          },
          category.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "max-w-3xl text-3xl font-bold leading-tight text-[#001a4a] sm:text-4xl", children: post == null ? void 0 : post.title }),
        (post == null ? void 0 : post.excerpt) ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-3xl text-base leading-7 text-slate-700", children: post.excerpt }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: metaItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white/85 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm font-semibold text-[#001a4a]", children: item.value })
        ] }, item.label)) })
      ] }) }),
      (post == null ? void 0 : post.og_image_url) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: post.og_image_url,
          alt: post.title || "Blog post cover image",
          className: "w-full rounded-[2rem] border border-slate-200 object-cover shadow-sm",
          loading: "lazy"
        }
      ) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "How To Use This Guide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold text-[#001a4a]", children: "A stronger shared baseline for every article" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-4 md:grid-cols-3", children: articleUseCards.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-[#001a4a]", children: item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-6 text-slate-600", children: item.body })
        ] }, item.title)) })
      ] }),
      hasActivationWidget ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-[2rem] border border-[#001a4a]/12 bg-white p-6 shadow-sm lg:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Use This Inside Roznamcha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: "Turn this article into a tracked household action" })
        ] }),
        showCalculator ? /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolFeeIncreaseCalculator, { post, returnPath }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(UseInRoznamchaWidget, { post, featureHooks, returnPath }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BlogCTA, { post, featureHooks, returnPath })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "section",
        {
          className: "post-content rounded-[2rem] border border-slate-200 bg-white p-6 text-[1.05rem] leading-8 text-slate-800 shadow-sm lg:p-8 [&_a]:font-medium [&_a]:text-[#001a4a] [&_a]:underline-offset-2 [&_a:hover]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#8c5a00]/35 [&_blockquote]:bg-amber-50/70 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:hidden [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-[#001a4a] [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:text-[#001a4a] [&_h4]:mt-6 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:text-[#001a4a] [&_hr]:my-8 [&_hr]:border-slate-200 [&_img]:my-8 [&_img]:w-full [&_img]:rounded-2xl [&_img]:border [&_img]:border-slate-200 [&_li]:marker:text-[#001a4a] [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-5 [&_strong]:font-semibold [&_strong]:text-[#001a4a] [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-[#001a4a] [&_ul]:my-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
          dangerouslySetInnerHTML: { __html: (post == null ? void 0 : post.content) ?? "" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 md:grid-cols-[minmax(0,0.8fr),minmax(0,1.2fr)] md:items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-[#8c5a00]", children: "Author And Editorial Note" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl font-semibold text-[#001a4a]", children: (_c = post == null ? void 0 : post.author) == null ? void 0 : _c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-semibold text-slate-600", children: (_d = post == null ? void 0 : post.author) == null ? void 0 : _d.role })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm leading-7 text-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: ((_e = post == null ? void 0 : post.author) == null ? void 0 : _e.url) ?? route("public.about"), className: "font-semibold text-[#001a4a] hover:underline", children: ((_f = post == null ? void 0 : post.author) == null ? void 0 : _f.name) ?? "Mohsin" }),
            " ",
            "writes practical guides to help Pakistani households think more clearly about monthly spending, ration pressure, and everyday financial tradeoffs."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "These articles are planning aids. They are meant to help readers compare, question, and act on costs more carefully, not replace their own local prices or family circumstances." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArticleNextSteps, { relatedTools: (relatedLinks == null ? void 0 : relatedLinks.tools) ?? [], relatedBlogs: (relatedLinks == null ? void 0 : relatedLinks.blogs) ?? [] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-2 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.blog.index"), className: "font-semibold text-[#001a4a] hover:underline", children: "← Back to blog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: route("public.blog.rss"), className: "inline-flex items-center gap-2 font-semibold text-[#001a4a]", children: "Subscribe via RSS →" })
      ] })
    ] })
  ] });
}
export {
  BlogShow as default
};
