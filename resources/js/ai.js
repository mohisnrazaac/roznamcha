/* global route */

// Purpose: Fetch AI insights with stable CSRF handling & routes. Date: 2026-02-22. Author: Codex.

const AI_ENDPOINTS = {
  kharcha: () => resolveAiRoute('ai.kharcha', '/ai/kharcha'),
  ration: () => resolveAiRoute('ai.ration', '/ai/ration'),
  reminder: () => resolveAiRoute('ai.reminder', '/ai/reminder'),
  report: () => resolveAiRoute('ai.report', '/ai/report'),
};

export async function fetchAiInsight(module, payload = {}) {
  const resolver = AI_ENDPOINTS[module];

  if (!resolver) {
    throw new Error(`Unknown AI module: ${module}`);
  }

  const url = typeof resolver === 'function' ? resolver() : resolver;

  if (!url) {
    throw new Error(`AI endpoint missing for module: ${module}`);
  }

  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-CSRF-TOKEN': token,
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ??
      (response.status === 429 ? 'AI quota reached for today.' : 'Unable to load AI insight. Please try again.');

    const error = new Error(message);
    error.data = data;
    error.status = response.status;
    throw error;
  }

  return data;
}

export function aiStatusLabel(state) {
  if (state.loading) {
    return 'Generating AI insight...';
  }

  if (state.error) {
    return state.error;
  }

  return '';
}

function resolveAiRoute(name, fallback) {
  if (typeof route === 'function') {
    try {
      return normalizeToRelative(route(name));
    } catch (error) {
      // route helper available but name unresolved; fall through
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
