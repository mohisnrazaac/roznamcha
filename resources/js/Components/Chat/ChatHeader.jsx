/**
 * ChatHeader.jsx
 *
 * Small status bar for the chat widget so contributors can customize
 * branding, status badges, or CTA links without editing ChatWidget.jsx.
 */
import React from 'react';

export default function ChatHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
      <div>
        <p className="text-sm font-semibold text-slate-900">Roznamcha Guide</p>
        <p className="text-xs text-slate-500">Feature activation assistant</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-500 hover:text-slate-700 text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003a8c]"
        aria-label="Close chat"
      >
        ×
      </button>
    </div>
  );
}
