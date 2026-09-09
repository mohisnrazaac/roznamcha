import { j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
const sectionStyle = "rounded-2xl border border-[#001a4a]/15 bg-white p-5 shadow-sm space-y-3";
function LinksList({ links }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: links.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link_default,
    {
      href: item.href,
      className: "inline-flex items-center rounded-full border border-[#001a4a]/20 px-3 py-1.5 text-sm font-semibold text-[#001a4a] hover:bg-[#001a4a]/5",
      children: item.title
    },
    `${item.href}-${item.title}`
  )) });
}
function RelatedLinksBlock({ relatedTools = [], relatedBlogs = [] }) {
  const hasTools = relatedTools.length > 0;
  const hasBlogs = relatedBlogs.length > 0;
  if (!hasTools && !hasBlogs) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 space-y-4", "aria-label": "Related links", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-[#001a4a]", children: "Related links" }),
    hasTools && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: sectionStyle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm uppercase tracking-[0.2em] text-[#001a4a]/70", children: "Related tools" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinksList, { links: relatedTools })
    ] }),
    hasBlogs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: sectionStyle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm uppercase tracking-[0.2em] text-[#001a4a]/70", children: "Related blog posts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LinksList, { links: relatedBlogs })
    ] })
  ] });
}
export {
  RelatedLinksBlock as R
};
