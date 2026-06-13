"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export type VehicleImage = {
  id: string;
  url: string;
  sortOrder?: number;
};

export type VehicleFormValues = {
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: string;
  horsepower: string;
  fuelType: string;
  transmission: string;
  color: string;
  financingUrl: string;
  financingOffer: string;
  description: string;
  equipment: string;
  features: string;
  status: string;
  images: VehicleImage[];
};

type VehicleFormProps = {
  mode: "create" | "edit";
  vehicleId?: string;
  initial?: Partial<VehicleFormValues>;
  onSuccess: () => void;
  onCancel?: () => void;
};

export function VehicleForm({ mode, vehicleId, initial, onSuccess, onCancel }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<VehicleImage[]>(initial?.images ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    if (mode === "create") {
      const newImages = fileInputRef.current?.files;
      if (newImages) {
        for (let i = 0; i < newImages.length; i++) {
          formData.append("images", newImages[i]);
        }
      }
      const res = await fetch("/api/vehicles", { method: "POST", body: formData });
      setLoading(false);
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Fehler.");
        return;
      }
      onSuccess();
      return;
    }

    const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
      method: "PATCH",
      body: formData,
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Fehler.");
      return;
    }
    onSuccess();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!vehicleId || !e.target.files?.length) return;
    setImageLoading(true);
    setError("");

    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("images", e.target.files[i]);
    }

    const res = await fetch(`/api/admin/vehicles/${vehicleId}/images`, {
      method: "POST",
      body: formData,
    });
    setImageLoading(false);
    e.target.value = "";

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Bild-Upload fehlgeschlagen.");
      return;
    }

    const json = await res.json();
    setImages((prev) =>
      [...prev, ...json.data].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    );
  }

  async function handleImageDelete(imageId: string) {
    if (!vehicleId || !confirm("Bild löschen?")) return;
    setImageLoading(true);
    const res = await fetch(`/api/admin/vehicles/${vehicleId}/images/${imageId}`, {
      method: "DELETE",
    });
    setImageLoading(false);
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  }

  async function moveImage(imageId: string, direction: "up" | "down") {
    if (!vehicleId) return;
    const sorted = [...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const index = sorted.findIndex((img) => img.id === imageId);
    if (index < 0) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const current = sorted[index];
    const swap = sorted[swapIndex];

    setImageLoading(true);
    const [resA, resB] = await Promise.all([
      fetch(`/api/admin/vehicles/${vehicleId}/images/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: swap.sortOrder ?? swapIndex }),
      }),
      fetch(`/api/admin/vehicles/${vehicleId}/images/${swap.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder ?? index }),
      }),
    ]);
    setImageLoading(false);

    if (resA.ok && resB.ok) {
      setImages((prev) =>
        prev
          .map((img) => {
            if (img.id === current.id) return { ...img, sortOrder: swap.sortOrder ?? swapIndex };
            if (img.id === swap.id) return { ...img, sortOrder: current.sortOrder ?? index };
            return img;
          })
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      );
    }
  }

  const sortedImages = [...images].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="mt-6 grid gap-4 rounded-sm border border-zinc-800 p-6 sm:grid-cols-2"
    >
      <Field name="make" label="Marke" defaultValue={initial?.make} required />
      <Field name="model" label="Modell" defaultValue={initial?.model} required />
      <Field name="year" label="Baujahr" type="number" defaultValue={initial?.year} required />
      <Field name="price" label="Preis (€)" type="number" step="0.01" defaultValue={initial?.price} required />
      <Field name="mileage" label="KM" type="number" defaultValue={initial?.mileage} />
      <Field name="horsepower" label="PS" type="number" defaultValue={initial?.horsepower} />
      <Field name="fuelType" label="Kraftstoff" defaultValue={initial?.fuelType} />
      <Field name="transmission" label="Getriebe" defaultValue={initial?.transmission} />
      <Field name="color" label="Farbe" defaultValue={initial?.color} />
      <Field name="financingUrl" label="mobile.de Finanzierungs-URL" type="url" defaultValue={initial?.financingUrl} />
      <div>
        <label className="block text-sm text-zinc-400">Status</label>
        <select
          name="status"
          defaultValue={initial?.status ?? "AVAILABLE"}
          className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
        >
          <option value="AVAILABLE">Verfügbar (veröffentlicht)</option>
          <option value="RESERVED">Reserviert</option>
          <option value="SOLD">Verkauft</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Technische Daten (eine pro Zeile)</label>
        <textarea
          name="features"
          rows={3}
          defaultValue={initial?.features}
          placeholder="Hubraum: 2.0L&#10;Zylinder: 4"
          className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Finanzierungsangebot</label>
        <textarea
          name="financingOffer"
          rows={3}
          defaultValue={initial?.financingOffer}
          className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Beschreibung</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description}
          className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm text-zinc-400">Ausstattung (eine pro Zeile)</label>
        <textarea
          name="equipment"
          rows={4}
          defaultValue={initial?.equipment}
          placeholder="Klimaanlage&#10;Ledersitze"
          className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
        />
      </div>

      {mode === "create" ? (
        <div className="sm:col-span-2">
          <label className="block text-sm text-zinc-400">Bilder (max. 10, JPG/PNG/WEBP)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="mt-1 text-sm text-zinc-400"
          />
        </div>
      ) : (
        <div className="sm:col-span-2">
          <label className="block text-sm text-zinc-400">
            Bilder ({sortedImages.length}/10)
          </label>
          {sortedImages.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {sortedImages.map((img, i) => (
                <div key={img.id} className="relative overflow-hidden rounded-sm border border-zinc-700">
                  <div className="relative aspect-square bg-zinc-900">
                    <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex items-center justify-between gap-1 bg-zinc-900 p-1">
                    <button
                      type="button"
                      onClick={() => moveImage(img.id, "up")}
                      disabled={i === 0 || imageLoading}
                      className="px-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageDelete(img.id)}
                      disabled={imageLoading}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Löschen
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(img.id, "down")}
                      disabled={i === sortedImages.length - 1 || imageLoading}
                      className="px-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {sortedImages.length < 10 && (
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={imageLoading}
              className="mt-3 text-sm text-zinc-400"
            />
          )}
          {imageLoading && <p className="mt-2 text-xs text-zinc-500">Bilder werden verarbeitet...</p>}
        </div>
      )}

      {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={loading || imageLoading}
          className="flex-1 rounded-sm bg-metallic py-2.5 text-sm font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Speichern..." : mode === "create" ? "Fahrzeug erstellen" : "Änderungen speichern"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm border border-zinc-700 px-6 py-2.5 text-sm text-zinc-400 hover:text-white"
          >
            Abbrechen
          </button>
        )}
      </div>
    </form>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; defaultValue?: string | number }
) {
  const { label, defaultValue, ...rest } = props;
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        {...rest}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
      />
    </div>
  );
}
