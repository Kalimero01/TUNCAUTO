"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SellerContactSummary } from "@/components/admin/seller-contact";
import { de, submissionLabels } from "@/lib/i18n/de";

type Submission = {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  make: string;
  model: string;
  year: number;
  status: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");

  async function load() {
    const res = await fetch("/api/submissions?admin=true");
    const json = await res.json();
    setSubmissions(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm(submissionLabels.deleteConfirm)) return;
    const res = await fetch(`/api/submissions/${id}`, { method: "DELETE" });
    if (res.ok) void load();
  }

  const filtered = submissions.filter((s) => {
    if (filter === "UNREAD") return !s.isRead;
    if (filter === "READ") return s.isRead;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{submissionLabels.offersTitle}</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "ALL" | "UNREAD" | "READ")}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
        >
          <option value="ALL">Alle</option>
          <option value="UNREAD">Ungelesen</option>
          <option value="READ">Gelesen</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-zinc-500">{de.loading}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-zinc-500">{submissionLabels.noOffers}</p>
      ) : (
        <div className="mt-8 space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 px-5 py-4 transition hover:border-zinc-700"
            >
              <Link href={`/admin/submissions/${s.id}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  {!s.isRead && (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" aria-label="Ungelesen" />
                  )}
                  <div>
                    <p className="font-medium text-white">
                      {s.make} {s.model} {s.year}
                    </p>
                    <div className="mt-1">
                      <SellerContactSummary
                        name={s.sellerName}
                        email={s.sellerEmail}
                        phone={s.sellerPhone}
                      />
                    </div>
                  </div>
                </div>
              </Link>
              <div className="ml-4 flex shrink-0 flex-col items-end gap-2">
                <ReadBadge isRead={s.isRead} />
                <p className="text-xs text-zinc-500">
                  {new Date(s.createdAt).toLocaleDateString("de-DE")}
                </p>
                <button
                  type="button"
                  onClick={() => void handleDelete(s.id)}
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

function ReadBadge({ isRead }: { isRead: boolean }) {
  return (
    <span className={`text-xs font-medium ${isRead ? "text-zinc-500" : "text-brand-400"}`}>
      {isRead ? "Gelesen" : "Ungelesen"}
    </span>
  );
}
