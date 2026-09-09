import { j as jsxRuntimeExports, R as React, r as router3 } from "../ssr.js";
import { P as PublicLayout } from "./PublicLayout-Cax6I6Hr.js";
function ToolLayout({ title, subtitle, description, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PublicLayout, { variant: "inner", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-gradient-to-br from-[#001a4a] via-[#0b2b6f] to-[#1c4aa6] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.4em] text-yellow-200", children: "Public Tool" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-4xl font-semibold", children: title }),
      subtitle ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-white/90 max-w-2xl", children: subtitle }) : null,
      description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 max-w-2xl", children: description }) : null
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children })
  ] });
}
const jsonToBase64Url = (value) => {
  try {
    const json = JSON.stringify(value ?? {});
    const utf8 = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    const base64 = btoa(utf8);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return "";
  }
};
const getCsrfToken = () => {
  var _a;
  return ((_a = document.head.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) ?? "";
};
const resolveEndpoint = (value) => {
  if (!value) return "";
  if (value.startsWith("/")) return value;
  try {
    return route(value);
  } catch {
    return value;
  }
};
function SaveWall({ toolKey, inputs, results, isAuthenticated, saveEndpoint, returnUrl }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState("");
  const endpoint = resolveEndpoint(saveEndpoint);
  const handleLoggedInSave = () => {
    if (!endpoint || isSaving) return;
    setIsSaving(true);
    setSaveMessage("");
    router3.post(
      endpoint,
      {
        tool_key: toolKey,
        source: "tool_save_wall",
        return_url: returnUrl,
        inputs,
        results
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => setSaveMessage("Saved. Come back next month to compare."),
        onFinish: () => setIsSaving(false)
      }
    );
  };
  const handleGuestSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveMessage("");
    const statePayload = {
      tool_key: toolKey,
      source: "tool_save_wall",
      inputs,
      results
    };
    const encodedState = jsonToBase64Url(statePayload);
    let destination = returnUrl;
    if (encodedState && encodedState.length <= 850) {
      const params = new URLSearchParams();
      params.set("tool_key", toolKey);
      params.set("source", "tool_save_wall");
      params.set("tool_state", encodedState);
      destination = `${returnUrl}${returnUrl.includes("?") ? "&" : "?"}${params.toString()}`;
    } else {
      try {
        const response = await fetch(route("guest.stash"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRF-TOKEN": getCsrfToken(),
            "X-Requested-With": "XMLHttpRequest"
          },
          credentials: "same-origin",
          body: JSON.stringify({
            tool_key: toolKey,
            state: statePayload,
            return_url: returnUrl
          })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !(data == null ? void 0 : data.stash_id)) {
          throw new Error("Unable to preserve tool state.");
        }
        const params = new URLSearchParams();
        params.set("tool_key", toolKey);
        params.set("source", "tool_save_wall");
        params.set("activation_stash", data.stash_id);
        destination = `${returnUrl}${returnUrl.includes("?") ? "&" : "?"}${params.toString()}`;
      } catch {
        setSaveMessage("Could not preserve this state. Please try again.");
        setIsSaving(false);
        return;
      }
    }
    router3.visit(route("register", { return_to: destination }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-yellow-300/50 bg-[#001a4a] p-5 text-white shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-semibold", children: "Want to see how this changes next month?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-white/85", children: "We’ll save today’s numbers so you can compare later." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: isAuthenticated ? handleLoggedInSave : handleGuestSave,
        disabled: isSaving,
        className: "mt-4 inline-flex items-center justify-center rounded-full bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#001a4a] hover:bg-white disabled:cursor-not-allowed disabled:opacity-70",
        children: isSaving ? "Saving..." : "Save this for my household."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-white/75", children: "No spam. Just your own data, remembered." }),
    saveMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-emerald-200", children: saveMessage }) : null
  ] });
}
function FinancialDisclaimer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#fff9ef] border border-yellow-200 rounded-2xl p-4 text-xs text-slate-600 leading-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-[#001a4a]", children: "Disclaimer:" }),
    " The calculations provided by Roznamcha are automated estimations for informational and educational planning purposes only. They do not constitute official financial, legal, or tax advice. Actual results will vary depending on local market rates, utility tax schedules, or individual household circumstances."
  ] });
}
export {
  FinancialDisclaimer as F,
  SaveWall as S,
  ToolLayout as T
};
