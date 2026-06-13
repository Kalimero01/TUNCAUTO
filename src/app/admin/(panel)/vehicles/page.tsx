"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  status: string;
  slug: string;
};

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/vehicles?admin=true");
    const json = await res.json();
    setVehicles(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu aracı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Araç Yönetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-400"
        >
          {showForm ? "İptal" : "Yeni Araç"}
        </button>
      </div>

      {showForm && <VehicleForm onSuccess={() => { setShowForm(false); load(); }} />}

      {loading ? (
        <p className="mt-8 text-zinc-500">Yükleniyor...</p>
      ) : vehicles.length === 0 ? (
        <p className="mt-8 text-zinc-500">Henüz araç yok.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-zinc-400">Araç</th>
                <th className="px-4 py-3 text-left text-zinc-400">Fiyat</th>
                <th className="px-4 py-3 text-left text-zinc-400">Durum</th>
                <th className="px-4 py-3 text-right text-zinc-400">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">
                    {v.make} {v.model} ({v.year})
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{formatPrice(v.price)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/araclar/${v.slug}`}
                      className="mr-3 text-brand-400 hover:text-brand-300"
                      target="_blank"
                    >
                      Görüntüle
                    </Link>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    AVAILABLE: "text-emerald-400",
    SOLD: "text-zinc-500",
    RESERVED: "text-amber-400",
  };
  return <span className={colors[status] ?? "text-zinc-400"}>{status}</span>;
}

function VehicleForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Kayıt başarısız.");
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-2xl border border-zinc-800 p-6 sm:grid-cols-2">
      <Field name="make" label="Marka" required />
      <Field name="model" label="Model" required />
      <Field name="year" label="Yıl" type="number" required />
      <Field name="price" label="Fiyat" type="number" required />
      <Field name="mileage" label="KM" type="number" />
      <Field name="fuelType" label="Yakıt" />
      <Field name="transmission" label="Vites" />
      <Field name="color" label="Renk" />
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Açıklama</label>
        <textarea name="description" rows={3} className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
      </div>
      {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="sm:col-span-2 rounded-full bg-brand-500 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        {...rest}
        className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
      />
    </div>
  );
}
