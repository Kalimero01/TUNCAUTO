"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SellerContactCard } from "@/components/admin/seller-contact";
import { contactLabels, de } from "@/lib/i18n/de";

type ContactMessage = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function KontaktanfrageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  async function handleDelete() {
    if (!confirm(contactLabels.deleteConfirm)) return;
    const res = await fetch(`/api/contact-messages/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/kontaktanfragen");
  }

  async function load() {
    const res = await fetch(`/api/contact-messages/${id}`);
    const json = await res.json();
    setMessage(json.data ?? null);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="text-zinc-500">{de.loading}</p>;
  if (!message) return <p className="text-zinc-500">{de.contactMessageNotFound}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href="/admin/kontaktanfragen" className="text-sm text-brand-400 hover:text-brand-300">
          {contactLabels.backToRequests}
        </Link>
        <button
          type="button"
          onClick={() => void handleDelete()}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Löschen
        </button>
      </div>

      <SellerContactCard
        name={message.customerName}
        email={message.email}
        phone={message.phone}
      />

      <div className="mt-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-white">Kontaktanfrage</h1>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            message.isRead
              ? "border-zinc-700 text-zinc-500"
              : "border-brand-500/50 text-brand-400"
          }`}
        >
          {message.isRead ? "Gelesen" : "Ungelesen"}
        </span>
      </div>

      <div className="mt-8 space-y-6">
        <InfoBlock title="Nachricht" value={message.message} />
        <InfoBlock
          title="Eingegangen am"
          value={new Date(message.createdAt).toLocaleString("de-DE")}
        />
      </div>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm text-zinc-500">{title}</h3>
      <p className="mt-1 whitespace-pre-wrap font-medium text-white">{value}</p>
    </div>
  );
}
