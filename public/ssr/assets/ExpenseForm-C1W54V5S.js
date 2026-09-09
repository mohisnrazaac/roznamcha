import { j as jsxRuntimeExports } from "../ssr.js";
function ExpenseForm({ form, categories = [], onSubmit, onCancel, translations }) {
  const t = translations ?? {};
  const commons = t.commons ?? {};
  const actions = t.actions ?? {};
  const kharcha = t.kharcha ?? {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: commons.amount }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "number",
          step: "0.01",
          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400",
          value: form.data.amount,
          onChange: (event) => form.setData("amount", event.target.value),
          placeholder: "0.00"
        }
      ),
      form.errors.amount && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: form.errors.amount })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: kharcha.tx_date }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "date",
          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
          value: form.data.tx_date,
          onChange: (event) => form.setData("tx_date", event.target.value)
        }
      ),
      form.errors.tx_date && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: form.errors.tx_date })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: commons.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: form.data.category_id,
          onChange: (event) => form.setData("category_id", event.target.value),
          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "—" }),
            categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: category.id, children: category.name }, category.id))
          ]
        }
      ),
      form.errors.category_id && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: form.errors.category_id })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-500 mb-1", children: commons.note }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400",
          value: form.data.note,
          onChange: (event) => form.setData("note", event.target.value),
          placeholder: "Utility Store, BP tablets…"
        }
      ),
      form.errors.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: form.errors.note })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: form.processing,
          className: "inline-flex items-center gap-2 rounded-lg bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#002b5b] disabled:opacity-50",
          children: form.processing ? "…" : actions.save
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "text-sm font-semibold text-slate-500 hover:text-slate-800",
          children: actions.cancel
        }
      )
    ] })
  ] });
}
export {
  ExpenseForm as E
};
