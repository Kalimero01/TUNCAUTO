"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Message = {
  id: string;
  senderType: "ADMIN" | "SELLER";
  senderName: string;
  content: string;
  createdAt: string;
};

export default function AdminChatPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [submission, setSubmission] = useState<{ sellerName: string; make: string; model: string } | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    const res = await fetch(`/api/chat/admin/${id}`);
    if (res.ok) {
      const json = await res.json();
      setMessages(json.data.messages);
      setSubmission(json.data.submission);
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

    const res = await fetch(`/api/chat/admin/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setContent("");
      fetchMessages();
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <Link href="/admin/chat" className="text-sm text-brand-400 hover:text-brand-300">
        ← Angebots-Chat
      </Link>
      <h1 className="mt-2 text-xl font-bold text-white">
        {submission ? `${submission.sellerName} — ${submission.make} ${submission.model}` : "Unterhaltung"}
      </h1>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        {loading && <p className="text-sm text-zinc-500">Wird geladen...</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.senderType === "ADMIN"
                ? "ml-auto bg-brand-500/20 text-brand-100"
                : "bg-zinc-800 text-zinc-200"
            }`}
          >
            <p className="text-xs opacity-70">{msg.senderName}</p>
            <p className="mt-1">{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nachricht schreiben..."
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
