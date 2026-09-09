import { j as jsxRuntimeExports } from "../ssr.js";
function AiInsightCard({ title, description, status, children, variant = "dark" }) {
  const wrapperClass = variant === "light" ? "rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm" : "rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4";
  const titleClass = variant === "light" ? "text-slate-900" : "text-white";
  const descriptionClass = variant === "light" ? "text-slate-500" : "text-slate-400";
  const statusClass = variant === "light" ? "text-xs text-slate-400" : "text-xs text-slate-500";
  const bodyTextClass = variant === "light" ? "text-slate-800" : "text-slate-200";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: wrapperClass, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "AI Insight" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: `text-lg font-semibold ${titleClass}`, children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${descriptionClass}`, children: description }),
      status && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: statusClass, children: status })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `space-y-2 text-sm ${bodyTextClass}`, children })
  ] });
}
const AI_ENDPOINTS = {
  kharcha: () => resolveAiRoute("ai.kharcha", "/ai/kharcha"),
  ration: () => resolveAiRoute("ai.ration", "/ai/ration"),
  reminder: () => resolveAiRoute("ai.reminder", "/ai/reminder"),
  report: () => resolveAiRoute("ai.report", "/ai/report")
};
async function fetchAiInsight(module, payload = {}) {
  var _a;
  const resolver = AI_ENDPOINTS[module];
  if (!resolver) {
    throw new Error(`Unknown AI module: ${module}`);
  }
  const url = typeof resolver === "function" ? resolver() : resolver;
  if (!url) {
    throw new Error(`AI endpoint missing for module: ${module}`);
  }
  const token = ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) ?? "";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-TOKEN": token,
      "X-Requested-With": "XMLHttpRequest"
    },
    credentials: "same-origin",
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = (data == null ? void 0 : data.message) ?? (response.status === 429 ? "AI quota reached for today." : "Unable to load AI insight. Please try again.");
    const error = new Error(message);
    error.data = data;
    error.status = response.status;
    throw error;
  }
  return data;
}
function resolveAiRoute(name, fallback) {
  if (typeof route === "function") {
    try {
      return normalizeToRelative(route(name));
    } catch (error) {
    }
  }
  return fallback;
}
function normalizeToRelative(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.pathname + parsed.search;
  } catch (error) {
    return url;
  }
}
export {
  AiInsightCard as A,
  fetchAiInsight as f
};
