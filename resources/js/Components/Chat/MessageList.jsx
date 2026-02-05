/**
 * MessageList.jsx
 *
 * Scroll container for assistant and user messages. Extend to add typing
 * indicators or timestamps without touching child components.
 */
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function MessageList({ messages, isLoading }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-50">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-500 shadow-sm">
            Assistant is thinking…
          </div>
        </div>
      )}
    </div>
  );
}
