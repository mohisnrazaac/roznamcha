/**
 * ChatInput.jsx
 *
 * Lightweight controlled form for sending chat prompts. Modify the form or
 * button styling here to experiment with alternate entry modes.
 */
import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 px-3 py-2 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          rows="1"
          className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003a8c]"
          placeholder="Ask about a feature…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || value.trim() === ''}
          className="bg-[#003a8c] text-white text-sm font-semibold px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </form>
  );
}
