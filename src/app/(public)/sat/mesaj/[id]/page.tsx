"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  id: string;
  senderType: "ADMIN" | "SELLER";
  senderName: string;
  content: string;
  createdAt: string;
};

export default function SellerChatPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [senderName, setSenderName] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    const res = await fetch(`/api/chat/${id}`);
    if (res.ok) {
      const json = await res.json();
      setMessages(json.data.messages);
      if (!senderName && json.data.submission?.sellerName) {
        setSenderName(json.data.submission.sellerName);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    void fetchMessages();
    const interval = setInterval(() => void fetchMessages(), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch(`/api/chat/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, senderName }),
    });

    if (res.ok) {
      setContent("");
      fetchMessages();
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 py-8 sm:px-6" style={{ minHeight: "60vh" }}>
      <h1 className="mb-6 text-xl font-bold text-white">Support-Nachrichten</h1>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        {loading && <p className="text-sm text-zinc-500">Wird geladen...</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-zinc-500">Noch keine Nachrichten. Stellen Sie gerne Ihre Fragen.</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.senderType === "SELLER"
                ? "ml-auto bg-brand-500/20 text-brand-100"
                : "bg-zinc-800 text-zinc-200"
            }`}
          >
            <p className="text-xs font-medium opacity-70">{msg.senderName}</p>
            <p className="mt-1">{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ihre Nachricht..."
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-400"
        >
          Senden
        </button>
      </form>
    </div>
  );
}
