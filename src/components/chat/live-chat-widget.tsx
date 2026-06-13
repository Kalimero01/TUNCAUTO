"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  senderType: "ADMIN" | "CUSTOMER";
  senderName: string;
  content: string;
  createdAt: string;
};

async function readApiError(res: Response, fallback: string) {
  try {
    const json = await res.json();
    return typeof json.error === "string" ? json.error : fallback;
  } catch {
    return fallback;
  }
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  function clearChatSession() {
    sessionStorage.removeItem("tuncauto-chat-id");
    sessionStorage.removeItem("tuncauto-chat-name");
    setConversationId(null);
    setCustomerName("");
    setMessages([]);
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("tuncauto-chat-id");
    const storedName = sessionStorage.getItem("tuncauto-chat-name");
    if (stored) setConversationId(stored);
    if (storedName) setCustomerName(storedName);
  }, []);

  async function fetchMessages(id: string) {
    const res = await fetch(`/api/live-chat/${id}`);
    if (res.status === 404) {
      clearChatSession();
      setError("Chat nicht mehr verfügbar. Bitte starten Sie einen neuen Chat.");
      return;
    }
    if (res.ok) {
      const json = await res.json();
      setMessages(json.data.messages ?? []);
      const name = json.data.conversation?.customerName;
      if (name) {
        setCustomerName(name);
        sessionStorage.setItem("tuncauto-chat-name", name);
      }
    }
  }

  useEffect(() => {
    if (!conversationId || !open) return;
    void fetchMessages(conversationId);
    const interval = setInterval(() => void fetchMessages(conversationId), 4000);
    return () => clearInterval(interval);
  }, [conversationId, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startChat(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const name = nameInput.trim();
    if (name.length < 2) {
      setError("Bitte geben Sie einen Namen mit mindestens 2 Zeichen ein.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name }),
      });
      if (res.ok) {
        const json = await res.json();
        const id = json.data.id;
        setConversationId(id);
        setCustomerName(name);
        sessionStorage.setItem("tuncauto-chat-id", id);
        sessionStorage.setItem("tuncauto-chat-name", name);
      } else {
        setError(await readApiError(res, "Chat konnte nicht gestartet werden."));
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const text = content.trim();
    if (!text || !conversationId) return;

    setSending(true);
    try {
      const payload: { content: string; senderName?: string } = { content: text };
      const name = customerName.trim();
      if (name) payload.senderName = name;

      const res = await fetch(`/api/live-chat/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setContent("");
        await fetchMessages(conversationId);
      } else if (res.status === 404) {
        clearChatSession();
        setError("Chat nicht mehr verfügbar. Bitte starten Sie einen neuen Chat.");
      } else {
        setError(await readApiError(res, "Nachricht konnte nicht gesendet werden."));
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-metallic to-anthracite text-black shadow-2xl transition duration-200 ease-out motion-safe:hover:scale-[1.02] hover:shadow-[0_0_24px_rgb(168_169_173/0.25)] sm:bottom-6 sm:right-6"
        aria-label="Live Chat öffnen"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-x-4 bottom-20 z-50 flex max-h-[min(28rem,calc(100dvh-6rem))] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-96">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-anthracite px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Live-Chat</p>
              <p className="text-xs text-zinc-400">TUNC AUTO Support</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-zinc-400 transition-colors duration-200 ease-out hover:text-white"
              aria-label="Chat schließen"
            >
              ✕
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="border-b border-red-900/50 bg-red-950/80 px-4 py-2 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          {!conversationId ? (
            <form onSubmit={startChat} className="flex flex-1 flex-col justify-center p-6">
              <p className="text-sm text-zinc-400">
                Bitte geben Sie Ihren Namen ein, um den Chat zu starten.
              </p>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ihr Name"
                required
                minLength={2}
                className="mt-4 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-base text-white focus:border-metallic focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-metallic mt-4 rounded-full bg-metallic px-4 py-2.5 text-sm font-semibold text-black hover:bg-silver-light disabled:opacity-50"
              >
                {loading ? "..." : "Chat starten"}
              </button>
            </form>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <p className="text-sm text-zinc-500">Schreiben Sie uns Ihre Frage...</p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.senderType === "CUSTOMER"
                        ? "ml-auto bg-metallic/20 text-zinc-100"
                        : "bg-zinc-800 text-zinc-200"
                    }`}
                  >
                    <p className="text-xs opacity-60">{msg.senderName}</p>
                    <p className="mt-0.5">{msg.content}</p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-zinc-800 p-3">
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nachricht..."
                  disabled={sending}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-base text-white focus:border-metallic focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={sending || !content.trim()}
                  className="btn-metallic rounded-xl bg-metallic px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
                >
                  {sending ? "…" : "→"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
