"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { VehicleForm } from "@/components/admin/vehicle-form";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: string;
  status: string;
  slug: string;
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Verfügbar",
  RESERVED: "Reserviert",
  SOLD: "Verkauft",
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
    void load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Fahrzeug löschen?")) return;
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Fahrzeuge</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-sm bg-metallic px-4 py-2 text-sm font-semibold text-black"
        >
          {showForm ? "Abbrechen" : "Neues Fahrzeug"}
        </button>
      </div>

      {showForm && (
        <VehicleForm
          mode="create"
          onSuccess={() => {
            setShowForm(false);
            load();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <p className="mt-8 text-zinc-500">Wird geladen...</p>
      ) : vehicles.length === 0 ? (
        <p className="mt-8 text-zinc-500">Keine Fahrzeuge.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-sm border border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-zinc-400">Fahrzeug</th>
                <th className="px-4 py-3 text-left text-zinc-400">Preis</th>
                <th className="px-4 py-3 text-left text-zinc-400">Status</th>
                <th className="px-4 py-3 text-right text-zinc-400">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">
                    {v.make} {v.model} ({v.year})
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{formatPrice(v.price)}</td>
                  <td className="px-4 py-3 text-emerald-400">{STATUS_LABELS[v.status] ?? v.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/vehicles/${v.id}`}
                      className="mr-3 text-metallic hover:underline"
                    >
                      Bearbeiten
                    </Link>
                    <Link
                      href={`/araclar/${v.slug}`}
                      target="_blank"
                      className="mr-3 text-zinc-400 hover:text-white"
                    >
                      Ansehen
                    </Link>
                    <button onClick={() => handleDelete(v.id)} className="text-red-400">
                      Löschen
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
