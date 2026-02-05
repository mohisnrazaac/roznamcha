/**
 * MessageBubble.jsx
 *
 * Presentational bubble for individual chat messages. Update color tokens
 * or badge labels here to change the chat look without touching logic.
 */
import React from 'react';

const sourceLabels = {
  ai: 'Bytez AI',
  rule: 'Guide',
  fallback: 'Guide',
  safety: 'Safety',
  error: 'Offline',
};

export default function MessageBubble({ message }) {
  const isUser = message?.role === 'user';
  const badge = !isUser && message?.source ? sourceLabels[message.source] ?? 'Guide' : null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
          isUser ? 'bg-[#003a8c] text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
        }`}
      >
        <p>{message?.text}</p>
        {badge && (
          <span className="mt-1 inline-flex text-[10px] uppercase tracking-wide text-slate-400">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
