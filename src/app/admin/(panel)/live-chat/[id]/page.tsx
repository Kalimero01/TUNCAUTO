"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Message = {
  id: string;
  senderType: string;
  senderName: string;
  content: string;
};

export default function AdminLiveChatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch(`/api/live-chat/admin/${id}`);
    if (res.ok) {
      const json = await res.json();
      setMessages(json.data.messages);
      setCustomerName(json.data.conversation.customerName);
    }
  }

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await fetch(`/api/live-chat/admin/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setContent("");
    load();
  }

  return (
    <div>
      <Link href="/admin/live-chat" className="text-sm text-zinc-500 hover:text-white">← Live Chat</Link>
      <h1 className="mt-4 text-xl font-bold text-white">Chat mit {customerName}</h1>
      <div className="mt-6 flex h-[28rem] flex-col rounded-sm border border-zinc-800">
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-sm px-3 py-2 text-sm ${
                m.senderType === "ADMIN" ? "bg-metallic/20 text-zinc-100" : "ml-auto bg-zinc-800"
              }`}
            >
              <p className="text-xs opacity-60">{m.senderName}</p>
              <p>{m.content}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-zinc-800 p-3">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Antwort..."
            className="flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
          />
          <button type="submit" className="rounded-sm bg-metallic px-4 py-2 text-sm font-semibold text-black">Senden</button>
        </form>
      </div>
    </div>
  );
}
