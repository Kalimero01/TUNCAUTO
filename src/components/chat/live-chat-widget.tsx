"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  senderType: "ADMIN" | "CUSTOMER";
  senderName: string;
  content: string;
  createdAt: string;
};

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("tuncauto-chat-id");
    const storedName = sessionStorage.getItem("tuncauto-chat-name");
    if (stored) setConversationId(stored);
    if (storedName) setCustomerName(storedName);
  }, []);

  async function fetchMessages(id: string) {
    const res = await fetch(`/api/live-chat/${id}`);
    if (res.ok) {
      const json = await res.json();
      setMessages(json.data.messages ?? []);
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
    if (!nameInput.trim()) return;
    setLoading(true);
    const res = await fetch("/api/live-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName: nameInput.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      const json = await res.json();
      const id = json.data.id;
      setConversationId(id);
      setCustomerName(nameInput.trim());
      sessionStorage.setItem("tuncauto-chat-id", id);
      sessionStorage.setItem("tuncauto-chat-name", nameInput.trim());
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !conversationId) return;
    const res = await fetch(`/api/live-chat/${conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, senderName: customerName }),
    });
    if (res.ok) {
      setContent("");
      fetchMessages(conversationId);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-metallic to-anthracite text-black shadow-2xl transition hover:scale-105 hover:shadow-metallic/30"
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
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:w-96">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-anthracite px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Live Chat</p>
              <p className="text-xs text-zinc-400">TUNC AUTO Support</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white"
              aria-label="Chat schließen"
            >
              ✕
            </button>
          </div>

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
                className="mt-4 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-metallic focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 rounded-full bg-metallic px-4 py-2.5 text-sm font-semibold text-black hover:bg-silver-light disabled:opacity-50"
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
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-metallic focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-metallic px-4 py-2 text-sm font-semibold text-black"
                >
                  →
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
