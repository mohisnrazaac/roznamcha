import { a as usePage, R as React, j as jsxRuntimeExports, L as Link_default, r as router3 } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-BbACMio2.js";
import { S as SeoHead } from "./SeoHead-BMukc1fW.js";
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
const starterQuestions = [
  "How to cut electricity bill by 5,000 PKR?",
  "Is Utility Store cheaper for my family size?",
  "What’s a realistic school fee budget for next year?"
];
function AskRozaGuestWidget({ sourceUrl = "/" }) {
  const { flash } = usePage().props;
  const [question, setQuestion] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [response, setResponse] = React.useState((flash == null ? void 0 : flash.askRozaTip) ?? null);
  React.useEffect(() => {
    if (flash == null ? void 0 : flash.askRozaTip) {
      setResponse(flash.askRozaTip);
    }
  }, [flash == null ? void 0 : flash.askRozaTip]);
  const submitQuestion = (value) => {
    const finalQuestion = (value ?? question).trim();
    if (!finalQuestion || isSubmitting) return;
    setIsSubmitting(true);
    router3.post(
      route("guest.askRoza"),
      {
        question: finalQuestion,
        source_url: sourceUrl
      },
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => setIsSubmitting(false)
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-yellow-300/50 bg-[#001a4a] p-5 text-white shadow-xl sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-yellow-200", children: "Guest Mode" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl font-semibold", children: "Ask Roza" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: question,
          onChange: (event) => setQuestion(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitQuestion();
            }
          },
          placeholder: "Ask Roza: How can I save 5,000 PKR on my electricity bill this month?",
          className: "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 focus:border-yellow-300 focus:outline-none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => submitQuestion(),
          disabled: isSubmitting,
          className: "inline-flex w-full items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto",
          children: isSubmitting ? "Thinking..." : "Get quick tip"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: starterQuestions.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          setQuestion(chip);
          submitQuestion(chip);
        },
        className: "rounded-full border border-white/25 bg-white/5 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10",
        children: chip
      },
      chip
    )) }),
    response ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 rounded-xl border border-white/15 bg-white/10 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/95", children: response.tip_text }),
      (response.related_links ?? []).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: (response.related_links ?? []).map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: link.url,
          className: "block text-sm font-semibold text-yellow-200 hover:text-white",
          children: link.title
        },
        `${link.url}-${link.title}`
      )) }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-yellow-200/50 bg-[#001432] px-3 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-yellow-100", children: "Sign up to track this advice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-yellow-100/80", children: "Save it now. Compare your progress next month." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: route("register", { return_to: sourceUrl }),
            className: "mt-3 inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-xs font-semibold text-[#001a4a] hover:bg-white",
            children: "Sign up to track this advice"
          }
        )
      ] })
    ] }) : null
  ] });
}
function BlogIndex({ posts, categories, seo }) {
  const items = (posts == null ? void 0 : posts.data) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-[#001a4a]/70", children: "Roznamcha Blog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a]", children: "Daily survival notes for Pakistani households" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: "Practical guides on household budgeting, ration planning, and month-end pressure for Pakistani families." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: "/tools/ration-cost-estimator",
            className: "inline-flex items-center rounded-full border border-[#001a4a]/20 px-4 py-2 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5",
            children: "Try Ration Cost Estimator"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AskRozaGuestWidget, { sourceUrl: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/blog" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-[2fr,1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500", children: "No published posts yet. Check back soon." }),
          items.map((post) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: post.published_label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: post.url, className: "hover:underline", children: post.title }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: post.excerpt }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 text-xs text-[#001a4a]", children: (_a = post.categories) == null ? void 0 : _a.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: route("public.blog.category", { slug: category.slug }),
                  className: "rounded-full border border-[#001a4a]/30 px-3 py-1 font-semibold hover:bg-[#001a4a]/5",
                  children: category.name
                },
                category.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link_default,
                {
                  href: post.url,
                  className: "inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline",
                  children: "Read article →"
                }
              )
            ] }, post.id);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { links: (posts == null ? void 0 : posts.links) ?? [] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-[#001a4a] p-6 text-white space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-yellow-200", children: "Public Tool" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Ration Cost Estimator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/80", children: "Estimate your monthly ration spend in Pakistan. No login required." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: "/tools/ration-cost-estimator",
                className: "inline-flex items-center justify-center rounded-full bg-yellow-300 px-4 py-2 text-sm font-semibold text-[#001a4a]",
                children: "Open the tool"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-[#001a4a]", children: "Categories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: categories == null ? void 0 : categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link_default,
              {
                href: route("public.blog.category", { slug: category.slug }),
                className: "text-slate-700 hover:text-[#001a4a]",
                children: category.name
              }
            ) }, category.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 space-y-2 text-sm text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Subscribe for automatic updates:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: route("public.blog.rss"),
                className: "inline-flex items-center gap-2 rounded-lg border border-[#001a4a] px-3 py-2 text-[#001a4a] font-semibold",
                children: "RSS Feed"
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Pagination({ links }) {
  if (!links || links.length <= 3) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-wrap gap-2", children: links.map((link) => {
    if (!link.url) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-400",
          dangerouslySetInnerHTML: { __html: link.label }
        },
        link.label
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link_default,
      {
        href: link.url,
        className: `rounded-full px-4 py-2 text-sm ${link.active ? "bg-[#001a4a] text-white" : "border border-slate-200 text-[#001a4a] hover:bg-[#001a4a]/5"}`,
        dangerouslySetInnerHTML: { __html: link.label }
      },
      link.label
    );
  }) });
}
export {
  BlogIndex as default
};
