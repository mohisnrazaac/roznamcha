import { u as useForm, j as jsxRuntimeExports, r as router3 } from "../ssr.js";
import { A as AppLayout } from "./AppLayout-BgWqsN4y.js";
import { d as deleteResource } from "./inertia-BZ67yCN7.js";
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
function Ration({ items = [], flash = {} }) {
  const form = useForm({
    item_name: "",
    unit: "",
    stock_quantity: "",
    daily_usage: "",
    price_per_unit: ""
  });
  const submit = (event) => {
    event.preventDefault();
    form.post(route("ration.store"), {
      onSuccess: () => form.reset("item_name", "unit", "stock_quantity", "daily_usage", "price_per_unit")
    });
  };
  const handleDelete = (id) => {
    if (!window.confirm("Remove this ration item?")) {
      return;
    }
    deleteResource(route("ration.destroy", id), { preserveScroll: true });
  };
  const handleAdjust = (item) => {
    const updatedQuantity = window.prompt(
      `Update stock quantity for ${item.item_name}`,
      item.stock_quantity
    );
    if (updatedQuantity === null) {
      return;
    }
    router3.put(
      route("ration.update", item.id),
      {
        item_name: item.item_name,
        unit: item.unit ?? "",
        stock_quantity: updatedQuantity,
        daily_usage: item.daily_usage,
        price_per_unit: item.price_per_unit ?? "",
        notes: "Adjusted via cockpit"
      },
      { preserveScroll: true }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    (flash == null ? void 0 : flash.success) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700", children: flash.success }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row md:items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Home › Ration Brain" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Ration Inventory" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500", children: "No ration items yet. Add atta, sugar, oil to track days left." }),
        items.map((item) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-900 font-semibold text-sm", children: item.item_name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
                      "Stock ",
                      item.stock_quantity,
                      " ",
                      item.unit || ""
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleAdjust(item),
                        className: "text-[11px] text-[#003a8c] border border-[#003a8c]/40 px-2 py-1 rounded-md",
                        children: "Adjust"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDelete(item.id),
                        className: "text-[11px] text-red-500 border border-red-200 px-2 py-1 rounded-md",
                        children: "Remove"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900 text-sm", children: [
                      item.daily_usage,
                      " ",
                      item.unit || ""
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500", children: "Daily usage" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-sm", children: item.days_left ?? "∞" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500", children: "Days left" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 text-sm", children: item.price_per_unit ? `₨ ${item.price_per_unit}` : "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500", children: "Price / unit" })
                  ] })
                ] }),
                ((_a = item.history) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-900", children: "Recent updates" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: item.history.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-center justify-between text-[11px]",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          entry.change_date,
                          " • ",
                          entry.change_type.replace("_", " ")
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-900", children: [
                          entry.change_type === "consume" ? "-" : "+",
                          entry.quantity_change,
                          " ",
                          item.unit || ""
                        ] })
                      ]
                    },
                    entry.id
                  )) })
                ] })
              ]
            },
            item.id
          );
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 mb-3", children: "Add Item" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Item name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: form.data.item_name,
                onChange: (event) => form.setData("item_name", event.target.value),
                className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
              }
            ),
            form.errors.item_name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.item_name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: form.data.unit,
                  onChange: (event) => form.setData("unit", event.target.value),
                  className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                  placeholder: "kg / litre"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Price per unit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: form.data.price_per_unit,
                  onChange: (event) => form.setData("price_per_unit", event.target.value),
                  className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
                  placeholder: "PKR"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Stock quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: form.data.stock_quantity,
                  onChange: (event) => form.setData("stock_quantity", event.target.value),
                  className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                }
              ),
              form.errors.stock_quantity && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.stock_quantity })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Daily usage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: form.data.daily_usage,
                  onChange: (event) => form.setData("daily_usage", event.target.value),
                  className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]"
                }
              ),
              form.errors.daily_usage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.daily_usage })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: form.processing,
              className: "w-full bg-[#003a8c] hover:bg-[#002a66] disabled:bg-[#003a8c]/60 text-white font-semibold text-sm px-4 py-2 rounded-md shadow",
              children: form.processing ? "Saving…" : "Save Item"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Ration as default
};
