import { u as useForm, b as reactExports, j as jsxRuntimeExports, H as Head_default, L as Link_default } from "../ssr.js";
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
function Register({ returnTo = "/dashboard" }) {
  const { data, setData, post, processing, errors, setDefaults } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    return_to: returnTo
  });
  reactExports.useEffect(() => {
    setDefaults("return_to", returnTo);
    setData("return_to", returnTo);
  }, [returnTo, setDefaults, setData]);
  const submit = (event) => {
    event.preventDefault();
    post("/register");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-950 flex items-center justify-center px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Head_default, { title: "Register" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-white", children: "Create a Roznamcha account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-400", children: "Sign up to manage your household survival cockpit." })
      ] }),
      returnTo && returnTo.startsWith("/templates/") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl border border-blue-900/60 bg-blue-950/40 p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300", children: "Just looking to check this budget template?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: returnTo,
            className: "mt-1 inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 underline",
            children: "← Continue viewing template without signing up"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
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
              className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            }
          ),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-slate-300", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "email",
              type: "email",
              value: data.email,
              onChange: (event) => setData("email", event.target.value),
              required: true,
              className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            }
          ),
          errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-slate-300", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "password",
              type: "password",
              value: data.password,
              onChange: (event) => setData("password", event.target.value),
              required: true,
              className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            }
          ),
          errors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors.password })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password_confirmation", className: "block text-sm font-medium text-slate-300", children: "Confirm Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "password_confirmation",
              type: "password",
              value: data.password_confirmation,
              onChange: (event) => setData("password_confirmation", event.target.value),
              required: true,
              className: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            }
          ),
          errors.password_confirmation && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-red-400", children: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: processing,
            className: "w-full rounded-lg bg-yellow-500 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:bg-yellow-700",
            children: processing ? "Signing up…" : "Sign Up"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-slate-400", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link_default,
          {
            href: route("login", { return_to: data.return_to }),
            className: "font-semibold text-blue-400 hover:text-blue-300",
            children: "Log in"
          }
        )
      ] })
    ] })
  ] });
}
export {
  Register as default
};
