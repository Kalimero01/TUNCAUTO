"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type Submission = {
  id: string;
  sellerName: string;
  sellerEmail: string;
  make: string;
  model: string;
  year: number;
  price: string;
  status: string;
  createdAt: string;
  unreadMessages?: number;
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  async function load() {
    const res = await fetch("/api/submissions?admin=true");
    const json = await res.json();
    setSubmissions(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered =
    filter === "ALL" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Satıcı Başvuruları</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
        >
          <option value="ALL">Tümü</option>
          <option value="PENDING">Bekleyen</option>
          <option value="APPROVED">Onaylanan</option>
          <option value="REJECTED">Reddedilen</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-zinc-500">Yükleniyor...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-zinc-500">Başvuru bulunamadı.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/admin/submissions/${s.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800 px-5 py-4 transition hover:border-zinc-700"
            >
              <div>
                <p className="font-medium text-white">
                  {s.make} {s.model} {s.year}
                </p>
                <p className="text-sm text-zinc-500">
                  {s.sellerName} — {s.sellerEmail}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={s.status} />
                <p className="mt-1 text-sm text-zinc-400">{formatPrice(s.price)}</p>
                {(s.unreadMessages ?? 0) > 0 && (
                  <span className="mt-1 inline-block rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">
                    {s.unreadMessages} mesaj
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "text-amber-400",
    APPROVED: "text-emerald-400",
    REJECTED: "text-red-400",
  };
  const labels: Record<string, string> = {
    PENDING: "Bekliyor",
    APPROVED: "Onaylandı",
    REJECTED: "Reddedildi",
  };
  return <span className={`text-xs font-medium ${styles[status]}`}>{labels[status] ?? status}</span>;
}
