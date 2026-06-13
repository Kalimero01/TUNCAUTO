"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Conversation = {
  id: string;
  customerName: string;
  updatedAt: string;
  _count: { messages: number };
  messages: Array<{ content: string }>;
};

export default function AdminLiveChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  async function load() {
    const res = await fetch("/api/live-chat/admin");
    const json = await res.json();
    setConversations(json.data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Möchten Sie diesen Chat wirklich löschen?")) return;
    const res = await fetch(`/api/live-chat/admin/${id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Live-Chat</h1>
      <p className="mt-2 text-sm text-zinc-500">Kunden-Chats vom Website-Widget</p>
      {conversations.length === 0 ? (
        <p className="mt-8 text-zinc-500">Keine aktiven Chats.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {conversations.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-sm border border-zinc-800 px-4 py-4 hover:border-metallic/50"
            >
              <Link href={`/admin/live-chat/${c.id}`} className="min-w-0 flex-1">
                <p className="font-medium text-white">{c.customerName}</p>
                <p className="mt-1 truncate text-sm text-zinc-500">
                  {c.messages[0]?.content ?? "—"}
                </p>
              </Link>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                {c._count.messages > 0 && (
                  <span className="rounded-full bg-metallic px-2 py-0.5 text-xs font-bold text-black">
                    {c._count.messages}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
