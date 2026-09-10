import { u as useForm, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-DNNm0DNE.js";
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
function Login({ canResetPassword = true, status, returnTo = "/dashboard" }) {
  const form = useForm({
    email: "",
    password: "",
    remember: false,
    return_to: returnTo
  });
  const submit = (event) => {
    event.preventDefault();
    form.post("/login", {
      onFinish: () => form.reset("password")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-sm mx-auto px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900 mb-2", children: "Sign in to Roznamcha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 text-xs leading-relaxed", children: "Your data is private. Only you see your household numbers." })
    ] }),
    returnTo && returnTo.startsWith("/templates/") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-blue-200 bg-blue-50 p-3 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-700", children: "Just looking to check this budget template?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: returnTo,
          className: "mt-1 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 underline",
          children: "← Continue viewing template without signing in"
        }
      )
    ] }),
    status && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700", children: status }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "email",
            value: form.data.email,
            onChange: (event) => form.setData("email", event.target.value),
            className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
            placeholder: "you@example.com",
            autoComplete: "username"
          }
        ),
        form.errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: form.data.password,
            onChange: (event) => form.setData("password", event.target.value),
            className: "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003a8c]/30 focus:border-[#003a8c]",
            placeholder: "••••••••",
            autoComplete: "current-password"
          }
        ),
        form.errors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-red-500", children: form.errors.password })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-slate-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 select-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: form.data.remember,
              onChange: (event) => form.setData("remember", event.target.checked),
              className: "rounded border-slate-300 text-[#003a8c] focus:ring-[#003a8c]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Remember me" })
        ] }),
        canResetPassword && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: route("password.request"),
            className: "text-[11px] text-slate-500 hover:text-slate-700",
            children: "Forgot password?"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: form.processing,
          className: "w-full bg-[#003a8c] hover:bg-[#002a66] disabled:bg-[#003a8c]/60 text-white font-semibold text-sm px-4 py-2 rounded-md shadow",
          children: form.processing ? "Signing in…" : "Login"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-slate-500 pt-2 border-t border-slate-100", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: returnTo && returnTo !== "/dashboard" ? `/register?return_to=${encodeURIComponent(returnTo)}` : "/register",
          className: "font-semibold text-[#003a8c] hover:underline",
          children: "Sign up"
        }
      )
    ] })
  ] }) }) });
}
export {
  Login as default
};
