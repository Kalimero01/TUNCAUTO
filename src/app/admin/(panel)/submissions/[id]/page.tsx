"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatMileage, formatPrice } from "@/lib/utils";

type Submission = {
  id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string | null;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  status: string;
  adminNotes: string | null;
  images: Array<{ id: string; url: string }>;
  videos: Array<{ id: string; url: string }>;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Offen",
  APPROVED: "Genehmigt",
  REJECTED: "Abgelehnt",
};

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  async function load() {
    const res = await fetch(`/api/submissions/${id}`);
    const json = await res.json();
    setSubmission(json.data ?? null);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAction(action: "approve" | "reject") {
    setActionLoading(true);
    const res = await fetch(`/api/submissions/${id}?action=${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: action === "reject" ? JSON.stringify({ adminNotes: rejectNotes }) : undefined,
    });
    setActionLoading(false);
    if (res.ok) {
      load();
      if (action === "approve") router.push("/admin/vehicles");
    }
  }

  if (loading) return <p className="text-zinc-500">Wird geladen...</p>;
  if (!submission) return <p className="text-zinc-500">Angebot nicht gefunden.</p>;

  return (
    <div>
      <Link href="/admin/submissions" className="text-sm text-brand-400 hover:text-brand-300">
        ← Angebote
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {submission.make} {submission.model} {submission.year}
          </h1>
          <p className="mt-1 text-zinc-500">
            {submission.sellerName} — {submission.sellerEmail}
            {submission.sellerPhone && ` — ${submission.sellerPhone}`}
          </p>
        </div>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          {STATUS_LABELS[submission.status] ?? submission.status}
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <InfoBlock title="Preis" value={formatPrice(submission.price)} />
          <InfoBlock title="Kilometerstand" value={formatMileage(submission.mileage)} />
          <InfoBlock title="Kraftstoff" value={submission.fuelType ?? "—"} />
          <InfoBlock title="Getriebe" value={submission.transmission ?? "—"} />
          <InfoBlock title="Farbe" value={submission.color ?? "—"} />
          {submission.description && (
            <div>
              <h3 className="text-sm text-zinc-500">Beschreibung</h3>
              <p className="mt-1 whitespace-pre-wrap text-zinc-300">{submission.description}</p>
            </div>
          )}
        </div>

        <div>
          {submission.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {submission.images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl bg-zinc-800">
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}
          {submission.videos.map((vid) => (
            <video key={vid.id} src={vid.url} controls className="mt-2 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {submission.status === "PENDING" && (
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-zinc-800 p-6 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm text-zinc-400">Ablehnungsgrund (optional)</label>
            <input
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            />
          </div>
          <button
            onClick={() => handleAction("reject")}
            disabled={actionLoading}
            className="rounded-full border border-red-800 px-6 py-2.5 text-sm text-red-400 hover:bg-red-950/30 disabled:opacity-50"
          >
            Ablehnen
          </button>
          <button
            onClick={() => handleAction("approve")}
            disabled={actionLoading}
            className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            Genehmigen & Veröffentlichen
          </button>
        </div>
      )}

      <div className="mt-8">
        <Link
          href={`/admin/chat/${id}`}
          className="inline-flex rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-400"
        >
          Nachrichten
        </Link>
      </div>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="text-sm text-zinc-500">{title}</h3>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  );
}
