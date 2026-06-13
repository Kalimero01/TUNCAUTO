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

  useEffect(() => {
    fetch("/api/live-chat/admin").then((r) => r.json()).then((j) => setConversations(j.data ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Live Chat</h1>
      <p className="mt-2 text-sm text-zinc-500">Kunden-Chats vom Website-Widget</p>
      {conversations.length === 0 ? (
        <p className="mt-8 text-zinc-500">Keine aktiven Chats.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/admin/live-chat/${c.id}`}
              className="flex items-center justify-between rounded-sm border border-zinc-800 px-4 py-4 hover:border-metallic/50"
            >
              <div>
                <p className="font-medium text-white">{c.customerName}</p>
                <p className="mt-1 truncate text-sm text-zinc-500">
                  {c.messages[0]?.content ?? "—"}
                </p>
              </div>
              {c._count.messages > 0 && (
                <span className="rounded-full bg-metallic px-2 py-0.5 text-xs font-bold text-black">
                  {c._count.messages}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
