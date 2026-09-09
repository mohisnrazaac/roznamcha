import { u as useForm, b as reactExports, j as jsxRuntimeExports } from "../ssr.js";
import { O as OnboardingLayout } from "./OnboardingLayout-D7OUQyqL.js";
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
import "./index-h3QfXfrJ.js";
function FirstExpense({ categories = [], prefill = {}, progress = {}, defaultDate }) {
  var _a;
  const initialCategory = (prefill == null ? void 0 : prefill.category_id) ?? ((_a = categories[0]) == null ? void 0 : _a.id) ?? "";
  const form = useForm({
    category_id: initialCategory,
    amount: (prefill == null ? void 0 : prefill.amount) ?? "",
    date: defaultDate,
    note: (prefill == null ? void 0 : prefill.note) ?? ""
  });
  reactExports.useEffect(() => {
    if (prefill == null ? void 0 : prefill.category_id) {
      form.setData("category_id", prefill.category_id);
    }
    if (prefill == null ? void 0 : prefill.amount) {
      form.setData("amount", prefill.amount);
    }
    if (prefill == null ? void 0 : prefill.note) {
      form.setData("note", prefill.note);
    }
  }, [prefill, form]);
  const submit = (event) => {
    event.preventDefault();
    form.post(route("onboarding.first-expense.store"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingLayout, { title: "Add your first expense", progress, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-200", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: form.data.category_id,
            onChange: (event) => form.setData("category_id", event.target.value),
            className: "mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-white",
            required: true,
            children: categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: category.id, children: category.name }, category.id))
          }
        ),
        form.errors.category_id && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: form.errors.category_id }),
        (prefill == null ? void 0 : prefill.category_name) && !(prefill == null ? void 0 : prefill.category_id) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-yellow-400", children: [
          "Tip: add a “",
          prefill.category_name,
          "” category in Control Room later."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-200", children: "Amount (PKR)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: "0",
            value: form.data.amount,
            onChange: (event) => form.setData("amount", event.target.value),
            className: "mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-lg text-white",
            required: true
          }
        ),
        form.errors.amount && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: form.errors.amount })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-200", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "date",
            value: form.data.date,
            onChange: (event) => form.setData("date", event.target.value),
            className: "mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-white",
            required: true
          }
        ),
        form.errors.date && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: form.errors.date })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-200", children: "Note (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: form.data.note,
            onChange: (event) => form.setData("note", event.target.value),
            className: "mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-white"
          }
        ),
        form.errors.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: form.errors.note })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: form.processing,
        className: "inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-60",
        children: form.processing ? "Saving expense…" : "Finish onboarding"
      }
    )
  ] }) });
}
export {
  FirstExpense as default
};
