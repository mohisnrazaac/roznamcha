import { j as jsxRuntimeExports, b as reactExports } from "../ssr.js";
function ChatHeader({ onClose }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-slate-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-900", children: "Roznamcha Guide" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Feature activation assistant" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onClose,
        className: "text-slate-500 hover:text-slate-700 text-lg leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003a8c]",
        "aria-label": "Close chat",
        children: "×"
      }
    )
  ] });
}
const sourceLabels = {
  ai: "Bytez AI",
  rule: "Guide",
  fallback: "Guide",
  safety: "Safety",
  error: "Offline"
};
function MessageBubble({ message }) {
  const isUser = (message == null ? void 0 : message.role) === "user";
  const badge = !isUser && (message == null ? void 0 : message.source) ? sourceLabels[message.source] ?? "Guide" : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${isUser ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${isUser ? "bg-[#003a8c] text-white rounded-br-sm" : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: message == null ? void 0 : message.text }),
        badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 inline-flex text-[10px] uppercase tracking-wide text-slate-400", children: badge })
      ]
    }
  ) });
}
function MessageList({ messages, isLoading }) {
  const containerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-50", children: [
    messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsx(MessageBubble, { message }, message.id)),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-500 shadow-sm", children: "Assistant is thinking…" }) })
  ] });
}
function ChatInput({ onSend, disabled }) {
  const [value, setValue] = reactExports.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }
    onSend(trimmed);
    setValue("");
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSubmit, className: "border-t border-slate-200 px-3 py-2 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        rows: "1",
        className: "flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003a8c]",
        placeholder: "Ask about a feature…",
        value,
        onChange: (event) => setValue(event.target.value),
        onKeyDown: handleKeyDown,
        disabled
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: disabled || value.trim() === "",
        className: "bg-[#003a8c] text-white text-sm font-semibold px-3 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed",
        children: "Send"
      }
    )
  ] }) });
}
function QuickReplies({ options = [], disabled, onSelect }) {
  if (!options.length) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t border-slate-100 bg-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-slate-400 mb-1", children: "Quick replies" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: options.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        disabled,
        onClick: () => onSelect(option.value),
        className: "text-xs border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 hover:border-[#003a8c] hover:text-[#003a8c] disabled:opacity-50 disabled:cursor-not-allowed",
        children: option.label
      },
      option.id
    )) })
  ] });
}
const defaultMessages = [
  {
    id: "intro",
    role: "assistant",
    source: "system",
    text: "Need a tour? Ask me about Kharcha Map, Ration Brain, Reminders, or generating the Survival Report."
  }
];
const quickReplyOptions = [
  { id: "qr-expense", label: "Track expenses", value: "How do I use the Kharcha Map?" },
  { id: "qr-ration", label: "Ration Brain", value: "What does the Ration Brain dashboard show?" },
  { id: "qr-reminder", label: "Schedule reminders", value: "How can I automate household reminders?" },
  { id: "qr-report", label: "Survival PDF", value: "How do I export the Survival Report?" }
];
function ChatWidget() {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState(defaultMessages);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const csrfToken = reactExports.useMemo(() => {
    var _a;
    if (typeof document === "undefined") {
      return null;
    }
    const metaToken = (_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content");
    if (metaToken) {
      return metaToken;
    }
    const xsrfCookie = document.cookie.split("; ").find((cookie) => cookie.startsWith("XSRF-TOKEN="));
    if (xsrfCookie) {
      return decodeURIComponent(xsrfCookie.split("=")[1]);
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
      role: "user",
      text: trimmed
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": csrfToken ?? "",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "same-origin",
        body: JSON.stringify({ message: trimmed })
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || "Chat request failed.");
      }
      const data = await response.json();
      const replyText = (data == null ? void 0 : data.reply) ?? "I can help you understand Roznamcha features or guide you to the right tool.";
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", source: (data == null ? void 0 : data.source) ?? "fallback", text: replyText }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          source: "error",
          text: "I am offline right now, but you can still open Kharcha, Ration, Reminders, or Reports from the sidebar."
        }
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-4 right-4 z-40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setIsOpen(true),
        className: "flex items-center gap-2 bg-[#003a8c] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#024198] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003a8c]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": "spark", children: "✨" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Need a guide?" })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-4 right-4 z-40 w-80 sm:w-96", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 h-96", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatHeader, { onClose: () => setIsOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageList, { messages, isLoading }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuickReplies, { options: quickReplyOptions, disabled: isLoading, onSelect: handleQuickReply }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatInput, { onSend: sendMessage, disabled: isLoading })
  ] }) });
}
export {
  ChatWidget as C
};
