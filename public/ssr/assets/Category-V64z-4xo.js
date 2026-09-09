import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-nckxm3ML.js";
import { S as SeoHead } from "./SeoHead-BxTvC064.js";
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
function BlogCategoryPage({ category, posts, seo }) {
  const items = (posts == null ? void 0 : posts.data) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SeoHead, { ...seo }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-1 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-[#001a4a]/70", children: "Blog Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-[#001a4a]", children: category == null ? void 0 : category.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base text-slate-600", children: [
          "Articles tagged under ",
          category == null ? void 0 : category.name,
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500", children: "Nothing published in this category yet." }),
        items.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-500", children: post.published_label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold text-[#001a4a]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: post.url, className: "hover:underline", children: post.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-700", children: post.excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link_default,
            {
              href: post.url,
              className: "inline-flex items-center text-sm font-semibold text-[#001a4a] hover:underline",
              children: "Read article →"
            }
          )
        ] }, post.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { links: (posts == null ? void 0 : posts.links) ?? [] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("public.blog.index"), className: "text-sm font-semibold text-[#001a4a] hover:underline", children: "← Back to all posts" }) })
    ] })
  ] });
}
function Pagination({ links }) {
  if (!links || links.length <= 3) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-wrap gap-2", children: links.map((link) => {
    const isDisabled = !link.url;
    const className = [
      "rounded-full px-4 py-2 text-sm",
      link.active ? "bg-[#001a4a] text-white" : "border border-slate-200 text-[#001a4a]",
      isDisabled && "text-slate-400"
    ].filter(Boolean).join(" ");
    if (isDisabled) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className,
          dangerouslySetInnerHTML: { __html: link.label }
        },
        link.label
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link_default,
      {
        href: link.url,
        className,
        dangerouslySetInnerHTML: { __html: link.label }
      },
      link.label
    );
  }) });
}
export {
  BlogCategoryPage as default
};
