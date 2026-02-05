/**
 * ChatWidget.jsx
 *
 * Floating Roznamcha activation assistant that defaults to rule-based answers
 * while optionally tapping Bytez AI via the /chat endpoint. Extend quick
 * replies or initial prompts here without touching layout code.
 */
import React, { useMemo, useState } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import QuickReplies from './QuickReplies';

const defaultMessages = [
  {
    id: 'intro',
    role: 'assistant',
    source: 'system',
    text: 'Need a tour? Ask me about Kharcha Map, Ration Brain, Reminders, or generating the Survival Report.',
  },
];

const quickReplyOptions = [
  { id: 'qr-expense', label: 'Track expenses', value: 'How do I use the Kharcha Map?' },
  { id: 'qr-ration', label: 'Ration Brain', value: 'What does the Ration Brain dashboard show?' },
  { id: 'qr-reminder', label: 'Schedule reminders', value: 'How can I automate household reminders?' },
  { id: 'qr-report', label: 'Survival PDF', value: 'How do I export the Survival Report?' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(defaultMessages);
  const [isLoading, setIsLoading] = useState(false);

  const csrfToken = useMemo(() => {
    if (typeof document === 'undefined') {
      return null;
    }

    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) {
      return metaToken;
    }

    const xsrfCookie = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('XSRF-TOKEN='));

    if (xsrfCookie) {
      return decodeURIComponent(xsrfCookie.split('=')[1]);
    }

    return null;
  }, []);

  const sendMessage = async (text) => {
    const trimmed = text.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken ?? '',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(errorText || 'Chat request failed.');
      }

      const data = await response.json();
      const replyText = data?.reply ?? 'I can help you understand Roznamcha features or guide you to the right tool.';

      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', source: data?.source ?? 'fallback', text: replyText },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          source: 'error',
          text: 'I am offline right now, but you can still open Kharcha, Ration, Reminders, or Reports from the sidebar.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (value) => {
    setIsOpen(true);
    sendMessage(value);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#003a8c] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#024198] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003a8c]"
        >
          <span role="img" aria-label="spark">✨</span>
          <span className="text-sm font-semibold">Need a guide?</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 sm:w-96">
      <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 h-96">
        <ChatHeader onClose={() => setIsOpen(false)} />
        <MessageList messages={messages} isLoading={isLoading} />
        <QuickReplies options={quickReplyOptions} disabled={isLoading} onSelect={handleQuickReply} />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
