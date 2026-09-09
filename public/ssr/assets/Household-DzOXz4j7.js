import { u as useForm, j as jsxRuntimeExports } from "../ssr.js";
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
function Household({ householdName = "", progress = {} }) {
  const form = useForm({
    name: householdName ?? ""
  });
  const submit = (event) => {
    event.preventDefault();
    form.post(route("onboarding.household.store"));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingLayout, { title: "Name your household", progress, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-semibold text-slate-200", children: "Household name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Example: “Imran & Sara Family” or “Karachi Home”" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: form.data.name,
          onChange: (event) => form.setData("name", event.target.value),
          className: "mt-3 w-full rounded-2xl border border-slate-700 bg-slate-950/30 px-4 py-3 text-lg text-white",
          required: true
        }
      ),
      form.errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: form.errors.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: form.processing,
        className: "inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:opacity-60",
        children: form.processing ? "Saving…" : "Continue to budget"
      }
    )
  ] }) });
}
export {
  Household as default
};
