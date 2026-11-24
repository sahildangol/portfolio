import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { LogoMark } from "../brand/Logo";

/**
 * Conversation with the guide. Visitors tap a suggested question or type their own; answers
 * come from the portfolio data, and some of them walk the visitor to the relevant section.
 */
export default function GuideChat({ messages, typing, suggestions, onAsk, onClose, onCta }) {
  const [text, setText] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    onAsk(q);
    setText("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="guide-chat"
      aria-label="Chat with Sahil"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <LogoMark size={30} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-sm font-bold text-ink">Sahil Dangol</p>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Guide · pre-written answers
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-mist hover:text-ink"
          aria-label="Close chat"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </header>

      <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.from === "you" ? "flex justify-end" : "flex justify-start"}
          >
            <div className={m.from === "you" ? "chat-you" : "chat-guide"}>
              <p>{m.text}</p>
              {m.cta === "contact" && (
                <button type="button" onClick={() => onCta("contact")} className="btn btn-grad mt-2.5 !px-3.5 !py-1.5 !text-[0.78rem]">
                  Message me →
                </button>
              )}
              {m.cta === "cv" && (
                <button type="button" onClick={() => onCta("cv")} className="btn btn-grad mt-2.5 !px-3.5 !py-1.5 !text-[0.78rem]">
                  Open CV ↗
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start" aria-label="Sahil is typing">
            <div className="chat-guide flex items-center gap-1 !py-3">
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
              <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => onAsk(s)} className="chat-chip">
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-line px-3 pt-3">
        <label htmlFor="guide-chat-input" className="sr-only">
          Ask Sahil a question
        </label>
        <input
          ref={inputRef}
          id="guide-chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask me anything…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full border border-line bg-mist px-4 py-2.5 text-sm text-ink outline-none transition focus:border-violet focus:bg-white"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition disabled:opacity-30"
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
      <p className="px-4 pb-2.5 pt-1.5 text-center text-[11px] text-muted">
        No AI is used while answering. Replies are pre-written from my portfolio.
      </p>
    </motion.section>
  );
}
