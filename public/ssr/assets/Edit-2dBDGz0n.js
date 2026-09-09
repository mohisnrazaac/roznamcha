import { u as useForm, b as reactExports, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
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
  const { data, setData, put, processing, errors, setDefaults } = useForm({
    name: (category == null ? void 0 : category.name) ?? "",
    description: (category == null ? void 0 : category.description) ?? ""
  });
  reactExports.useEffect(() => {
    setDefaults({
      name: (category == null ? void 0 : category.name) ?? "",
      description: (category == null ? void 0 : category.description) ?? ""
    });
  }, [category, setDefaults]);
  const submit = (event) => {
    event.preventDefault();
    put(`/admin/categories/${category.id}`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "categories", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link_default, { href: "/admin/categories", className: "text-sm text-slate-400 hover:text-slate-200", children: "← Back to categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-xl font-semibold", children: "Edit Category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Defaults apply to everyone. User-owned entries keep their owner." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "max-w-xl space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-slate-300", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "name",
            type: "text",
            value: data.name,
            onChange: (event) => setData("name", event.target.value),
            required: true,
            className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          }
        ),
        errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors.name })
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
            value: data.description || "",
            onChange: (event) => setData("description", event.target.value),
            rows: 4,
            className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          }
        ),
        errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: processing,
          className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900",
          children: processing ? "Saving…" : "Update category"
        }
      )
    ] })
  ] }) });
}
export {
  CategoriesEdit as default
};
