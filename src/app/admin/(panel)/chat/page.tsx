"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Conversation = {
  id: string;
  sellerName: string;
  sellerEmail: string;
  vehicle: string;
  status: string;
  unreadCount: number;
  lastMessage: { content: string; createdAt: string; senderType: string } | null;
};

export default function AdminChatInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/chat/admin/inbox");
    const json = await res.json();
    setConversations(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Mesaj Kutusu</h1>
      <p className="mt-1 text-zinc-500">Satıcılarla mesajlaşmalar</p>

      {loading ? (
        <p className="mt-8 text-zinc-500">Yükleniyor...</p>
      ) : conversations.length === 0 ? (
        <p className="mt-8 text-zinc-500">Henüz mesajlaşma yok.</p>
      ) : (
        <div className="mt-8 space-y-2">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/admin/chat/${c.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800 px-5 py-4 transition hover:border-zinc-700"
            >
              <div>
                <p className="font-medium text-white">{c.sellerName}</p>
                <p className="text-sm text-zinc-500">{c.vehicle}</p>
                {c.lastMessage && (
                  <p className="mt-1 truncate text-sm text-zinc-400">{c.lastMessage.content}</p>
                )}
              </div>
              {c.unreadCount > 0 && (
                <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-medium text-white">
                  {c.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
