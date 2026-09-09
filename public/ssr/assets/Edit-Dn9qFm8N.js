import { a as usePage, u as useForm, j as jsxRuntimeExports } from "../ssr.js";
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
function RationEdit({ item, priceHistory = [] }) {
  var _a, _b, _c, _d;
  const { props } = usePage();
  const translations = props.translations ?? {};
  const ration = translations.ration ?? {};
  const commons = translations.commons ?? {};
  const form = useForm({
    name: (item == null ? void 0 : item.name) ?? "",
    unit: (item == null ? void 0 : item.unit) ?? "kg",
    is_active: (item == null ? void 0 : item.is_active) ?? true,
    initial_price: "",
    priced_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
  const priceForm = useForm({
    price: "",
    priced_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
  const isEditing = Boolean(item);
  const submit = (event) => {
    event.preventDefault();
    if (isEditing) {
      form.put(route("panel.ration.update", item.id), {
        preserveScroll: true
      });
    } else {
      form.post(route("panel.ration.store"));
    }
  };
  const addPrice = (event) => {
    event.preventDefault();
    priceForm.post(route("panel.ration.prices.store", item.id), {
      preserveScroll: true,
      onSuccess: () => priceForm.reset("price")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "ration", user: (_a = props.auth) == null ? void 0 : _a.user, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 uppercase tracking-wide", children: "Panel › Ration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: isEditing ? ration.edit_item : ration.new_item }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: ration.subtitle })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wide text-slate-400 mb-4", children: ration.edit_item }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: commons.item,
              value: form.data.name,
              onChange: (event) => form.setData("name", event.target.value),
              error: form.errors.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: commons.unit,
              value: form.data.unit,
              onChange: (event) => form.setData("unit", event.target.value),
              error: form.errors.unit
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: form.data.is_active,
                onChange: (event) => form.setData("is_active", event.target.checked),
                className: "rounded border-slate-400 text-[#003a8c] focus:ring-0"
              }
            ),
            form.data.is_active ? (_b = translations.commons) == null ? void 0 : _b.status_active : (_c = translations.commons) == null ? void 0 : _c.status_inactive
          ] }),
          !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                label: ration.latest_price,
                type: "number",
                step: "0.01",
                value: form.data.initial_price,
                onChange: (event) => form.setData("initial_price", event.target.value),
                error: form.errors.initial_price
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                label: ration.last_updated,
                type: "date",
                value: form.data.priced_at,
                onChange: (event) => form.setData("priced_at", event.target.value),
                error: form.errors.priced_at
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: form.processing,
              className: "rounded-xl bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50",
              children: form.processing ? "…" : (_d = translations.actions) == null ? void 0 : _d.save
            }
          )
        ] })
      ] }),
      isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wide text-slate-400", children: ration.add_price }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: addPrice, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: ration.latest_price,
              type: "number",
              step: "0.01",
              value: priceForm.data.price,
              onChange: (event) => priceForm.setData("price", event.target.value),
              error: priceForm.errors.price
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field,
            {
              label: ration.last_updated,
              type: "date",
              value: priceForm.data.priced_at,
              onChange: (event) => priceForm.setData("priced_at", event.target.value),
              error: priceForm.errors.priced_at
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: priceForm.processing,
              className: "w-full rounded-xl border border-yellow-300 px-4 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-300/10 disabled:opacity-50",
              children: priceForm.processing ? "…" : ration.add_price
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-200 mb-2", children: commons.history }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-slate-300 max-h-64 overflow-y-auto", children: [
            priceHistory.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-slate-500 text-xs", children: ration.history_empty }),
            priceHistory.map((price) => {
              var _a2;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: price.priced_at }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  ((_a2 = translations.commons) == null ? void 0 : _a2.currency) ?? "₨",
                  " ",
                  Number(price.price).toLocaleString()
                ] })
              ] }, price.id);
            })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function Field({ label, error, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-400 mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "w-full rounded-lg border border-slate-500 bg-slate-950/30 px-3 py-2 text-sm text-white",
        ...rest
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-400 mt-1", children: error })
  ] });
}
export {
  RationEdit as default
};
