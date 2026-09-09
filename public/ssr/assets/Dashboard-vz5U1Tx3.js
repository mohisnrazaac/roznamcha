import { u as useForm, j as jsxRuntimeExports, L as Link_default } from "../ssr.js";
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
const moduleCards = [
  {
    title: "Kharcha Map",
    description: "Track monthly expenses and burn",
    href: "/kharcha",
    slug: "kharcha"
  },
  {
    title: "Ration Brain",
    description: "Grocery price watch / inflation",
    href: "/ration",
    slug: "ration"
  },
  {
    title: "Reminders / Health Guard",
    description: "BP meds, school fees, petrol refill, etc.",
    href: "/reminders",
    slug: "reminders"
  }
];
const adminCards = [
  {
    title: "Users",
    description: "Create and manage users",
    href: "/admin/users",
    slug: "users"
  },
  {
    title: "Categories",
    description: "Budget / spend tags",
    href: "/admin/categories",
    slug: "categories"
  }
];
function Dashboard({ authUser }) {
  const isSuperAdmin = (authUser == null ? void 0 : authUser.role) === "admin";
  const { data, setData, post, processing, errors, reset } = useForm({
    old_password: "",
    password: "",
    password_confirmation: ""
  });
  const handlePasswordUpdate = (event) => {
    event.preventDefault();
    post("/admin/update-password", {
      preserveScroll: true,
      onSuccess: () => {
        reset("old_password", "password", "password_confirmation");
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ControlRoomLayout, { active: "dashboard", user: authUser, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-10 text-white space-y-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-semibold leading-tight", children: [
        "Welcome, ",
        authUser == null ? void 0 : authUser.name,
        " (",
        authUser == null ? void 0 : authUser.role,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Household cockpit overview — get to the modules you need in one click." })
    ] }),
    isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-yellow-300", children: "AI Insights Activated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Your users now get monthly budget advice powered by AI." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Track quota usage per module and plan when to upgrade to the paid tier." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link_default,
        {
          href: "/admin/ai-logs",
          className: "inline-flex items-center justify-center rounded-xl bg-yellow-300 px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-200",
          children: "Monitor usage →"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wide text-slate-400", children: "Household modules" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: moduleCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link_default,
        {
          href: card.href,
          className: "rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-600 hover:bg-slate-900",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold text-white", children: card.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-300", children: card.description })
          ]
        },
        card.slug
      )) })
    ] }),
    isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wide text-slate-400", children: "Admin tools" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: adminCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link_default,
        {
          href: card.href,
          className: "rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-600 hover:bg-slate-900",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold text-white", children: card.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-300", children: card.description })
          ]
        },
        card.slug
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-2xl border border-slate-900 bg-slate-900/60 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-yellow-300", children: "Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-lg font-semibold text-white", children: "Update admin password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Enter your current password and choose a new one (min 8 characters). Saving logs out other sessions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: handlePasswordUpdate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "old_password", className: "text-sm font-medium text-slate-200", children: "Old Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "old_password",
              type: "password",
              value: data.old_password,
              onChange: (event) => setData("old_password", event.target.value),
              className: "mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white focus:border-yellow-300 focus:outline-none focus:ring-0",
              autoComplete: "current-password",
              required: true
            }
          ),
          errors.old_password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: errors.old_password })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", className: "text-sm font-medium text-slate-200", children: "New Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "password",
              type: "password",
              value: data.password,
              onChange: (event) => setData("password", event.target.value),
              className: "mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white focus:border-yellow-300 focus:outline-none focus:ring-0",
              autoComplete: "new-password",
              minLength: 8,
              required: true
            }
          ),
          errors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: errors.password })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password_confirmation", className: "text-sm font-medium text-slate-200", children: "Confirm Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "password_confirmation",
              type: "password",
              value: data.password_confirmation,
              onChange: (event) => setData("password_confirmation", event.target.value),
              className: "mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white focus:border-yellow-300 focus:outline-none focus:ring-0",
              autoComplete: "new-password",
              required: true
            }
          ),
          errors.password_confirmation && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-red-400", children: errors.password_confirmation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Submitting will sign you out to confirm the change." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "inline-flex items-center rounded-xl bg-yellow-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-yellow-200 disabled:opacity-70",
              children: processing ? "Updating…" : "Update password"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  Dashboard as default
};
