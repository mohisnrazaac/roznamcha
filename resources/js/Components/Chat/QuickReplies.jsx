/**
 * QuickReplies.jsx
 *
 * Shows suggested prompts for the assistant. Update the option list in
 * ChatWidget.jsx, or swap this component for a carousel/badges variant.
 */
import React from 'react';

export default function QuickReplies({ options = [], disabled, onSelect }) {
  if (!options.length) {
    return null;
  }

  return (
    <div className="px-4 py-2 border-t border-slate-100 bg-white">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">Quick replies</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            disabled={disabled}
            onClick={() => onSelect(option.value)}
            className="text-xs border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 hover:border-[#003a8c] hover:text-[#003a8c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
