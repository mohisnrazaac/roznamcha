import { a as usePage, u as useForm, j as jsxRuntimeExports, r as router3 } from "../ssr.js";
import { C as ControlRoomLayout } from "./ControlRoomLayout-BmJqwnTf.js";
import { E as ExpenseForm } from "./ExpenseForm-C1W54V5S.js";
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
function KharchaCreate({ categories }) {
  var _a, _b, _c;
  const { props } = usePage();
  const translations = props.translations ?? {};
  const form = useForm({
    amount: "",
    tx_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    category_id: "",
    note: ""
  });
  const submit = (event) => {
    event.preventDefault();
    form.post(route("panel.kharcha.store"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "kharcha", user: (_a = props.auth) == null ? void 0 : _a.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-6 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 uppercase tracking-wide", children: "Panel › Kharcha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: (_b = translations.kharcha) == null ? void 0 : _b.add_expense }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: (_c = translations.kharcha) == null ? void 0 : _c.subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExpenseForm,
      {
        form,
        categories,
        translations,
        onSubmit: submit,
        onCancel: () => router3.visit(route("panel.kharcha.index"))
      }
    ) })
  ] }) });
}
export {
  KharchaCreate as default
};
