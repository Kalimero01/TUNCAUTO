"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SellerContactCard } from "@/components/admin/seller-contact";
import { de, testDriveLabels } from "@/lib/i18n/de";

type TestDriveRequest = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  preferredDateTime: string;
  vehicleModel: string;
  isRead: boolean;
  createdAt: string;
};

export default function ProbefahrtDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<TestDriveRequest | null>(null);
  const [loading, setLoading] = useState(true);

  async function handleDelete() {
    if (!confirm("Möchten Sie diese Probefahrt-Anfrage wirklich löschen?")) return;
    const res = await fetch(`/api/probefahrt/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/probefahrt");
  }

  async function load() {
    const res = await fetch(`/api/probefahrt/${id}`);
    const json = await res.json();
    setRequest(json.data ?? null);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="text-zinc-500">{de.loading}</p>;
  if (!request) return <p className="text-zinc-500">{de.testDriveNotFound}</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link href="/admin/probefahrt" className="text-sm text-brand-400 hover:text-brand-300">
          {testDriveLabels.backToRequests}
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
        name={request.customerName}
        email={request.email}
        phone={request.phone}
      />

      <div className="mt-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-white">{request.vehicleModel}</h1>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            request.isRead
              ? "border-zinc-700 text-zinc-500"
              : "border-brand-500/50 text-brand-400"
          }`}
        >
          {request.isRead ? "Gelesen" : "Ungelesen"}
        </span>
      </div>

      <div className="mt-8 space-y-6">
        <InfoBlock title={testDriveLabels.preferredDate} value={request.preferredDateTime} />
        <InfoBlock title={testDriveLabels.model} value={request.vehicleModel} />
        <InfoBlock
          title="Eingegangen am"
          value={new Date(request.createdAt).toLocaleString("de-DE")}
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
