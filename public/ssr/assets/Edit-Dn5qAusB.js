import { a as usePage, u as useForm, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { C as ControlRoomLayout } from "./ControlRoomLayout-BmJqwnTf.js";
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
function CategoriesEdit({ category }) {
  var _a;
  const { props } = usePage();
  const form = useForm({
    name: (category == null ? void 0 : category.name) ?? "",
    description: (category == null ? void 0 : category.description) ?? ""
  });
  const submit = (event) => {
    event.preventDefault();
    form.put(route("panel.categories.update", category.id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "panel-categories", user: (_a = props.auth) == null ? void 0 : _a.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-6 max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: route("panel.categories.index"), className: "text-sm text-slate-400 hover:text-slate-200", children: "← Back to categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-2xl font-semibold", children: "Edit Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Update your custom category details." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-slate-300", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: form.data.name,
            onChange: (event) => form.setData("name", event.target.value),
            className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40",
            required: true
          }
        ),
        form.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: form.errors.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "description", className: "block text-sm font-medium text-slate-300", children: [
          "Description ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "description",
            value: form.data.description,
            onChange: (event) => form.setData("description", event.target.value),
            rows: 3,
            className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          }
        ),
        form.errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: form.errors.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: form.processing,
            className: "rounded-lg bg-yellow-300 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200 disabled:opacity-70",
            children: form.processing ? "Saving…" : "Update Category"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: route("panel.categories.index"),
            className: "rounded-lg border border-slate-500 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-300",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  CategoriesEdit as default
};
