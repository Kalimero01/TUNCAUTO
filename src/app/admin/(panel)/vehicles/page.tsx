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

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Fahrzeug löschen?")) return;
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vehicles</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-sm bg-metallic px-4 py-2 text-sm font-semibold text-black"
        >
          {showForm ? "Abbrechen" : "Neues Fahrzeug"}
        </button>
      </div>

      {showForm && <VehicleForm onSuccess={() => { setShowForm(false); load(); }} />}

      {loading ? (
        <p className="mt-8 text-zinc-500">Laden...</p>
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
                  <td className="px-4 py-3 text-white">{v.make} {v.model} ({v.year})</td>
                  <td className="px-4 py-3 text-zinc-400">{formatPrice(v.price)}</td>
                  <td className="px-4 py-3 text-emerald-400">{v.status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/araclar/${v.slug}`} target="_blank" className="mr-3 text-metallic">Ansehen</Link>
                    <button onClick={() => handleDelete(v.id)} className="text-red-400">Löschen</button>
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

function VehicleForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/vehicles", { method: "POST", body: formData });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Fehler.");
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-6 grid gap-4 rounded-sm border border-zinc-800 p-6 sm:grid-cols-2">
      <Field name="make" label="Marke" required />
      <Field name="model" label="Modell" required />
      <Field name="year" label="Baujahr" type="number" required />
      <Field name="price" label="Preis" type="number" required />
      <Field name="mileage" label="KM" type="number" />
      <Field name="horsepower" label="PS" type="number" />
      <Field name="fuelType" label="Kraftstoff" />
      <Field name="transmission" label="Getriebe" />
      <Field name="color" label="Farbe" />
      <Field name="financingUrl" label="mobile.de Finanzierungs-URL" type="url" />
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Finanzierungsangebot</label>
        <textarea name="financingOffer" rows={3} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Beschreibung</label>
        <textarea name="description" rows={3} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Ausstattung (eine pro Zeile)</label>
        <textarea name="equipment" rows={4} placeholder="Klimaanlage&#10;Ledersitze" className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Bilder (max. 10)</label>
        <input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple className="mt-1 text-sm text-zinc-400" />
      </div>
      {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="sm:col-span-2 rounded-sm bg-metallic py-2.5 text-sm font-semibold text-black disabled:opacity-50">
        {loading ? "Speichern..." : "Speichern"}
      </button>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input {...rest} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
    </div>
  );
}
