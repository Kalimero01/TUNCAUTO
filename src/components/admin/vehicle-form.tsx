"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ALL_EQUIPMENT_FEATURES,
  CAR_BRANDS,
  EQUIPMENT_FEATURES_COL1,
  EQUIPMENT_FEATURES_COL2,
  EQUIPMENT_FEATURES_COL3,
  FUEL_TYPES,
  splitFirstRegistration,
  TRANSMISSION_TYPES,
} from "@/lib/vehicle-constants";

export type VehicleImage = {
  id: string;
  url: string;
  sortOrder?: number;
};

export type VehicleFormValues = {
  make: string;
  model: string;
  price: string;
  firstRegistrationMonth: string;
  firstRegistrationYear: string;
  mileage: string;
  horsepower: string;
  engineDisplacement: string;
  fuelType: string;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  upholstery: string;
  doors: string;
  seats: string;
  financingUrl: string;
  equipmentFeatures: string[];
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
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(
    new Set(initial?.equipmentFeatures ?? [])
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstReg = splitFirstRegistration(
    initial?.firstRegistrationMonth && initial?.firstRegistrationYear
      ? `${initial.firstRegistrationMonth}/${initial.firstRegistrationYear}`
      : initial?.firstRegistrationMonth
        ? `${initial.firstRegistrationMonth}/${initial.firstRegistrationYear ?? ""}`
        : undefined
  );

  function toggleFeature(feature: string) {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(feature)) next.delete(feature);
      else next.add(feature);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.delete("equipmentFeatures");
    for (const feature of selectedFeatures) {
      formData.append("equipmentFeatures", feature);
    }

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
      className="mt-6 space-y-8 rounded-sm border border-zinc-800 p-6"
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Grunddaten
        </h2>
        <div>
          <label className="block text-sm text-zinc-400">Marke</label>
          <select
            name="make"
            required
            defaultValue={initial?.make ?? ""}
            className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          >
            <option value="" disabled>
              Marke wählen
            </option>
            {CAR_BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
        <Field name="model" label="Modell" defaultValue={initial?.model} required />
        <Field name="price" label="Preis (€)" type="number" step="0.01" defaultValue={initial?.price} required />
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
        <Field name="financingUrl" label="mobile.de Finanzierungs-URL" type="url" defaultValue={initial?.financingUrl} className="sm:col-span-2" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Technische Daten
        </h2>
        <div>
          <label className="block text-sm text-zinc-400">Erstzulassung</label>
          <div className="mt-1 flex gap-2">
            <input
              name="firstRegistrationMonth"
              type="number"
              min={1}
              max={12}
              placeholder="MM"
              defaultValue={firstReg.month || initial?.firstRegistrationMonth}
              className="w-20 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
            />
            <span className="self-center text-zinc-500">/</span>
            <input
              name="firstRegistrationYear"
              type="number"
              min={1900}
              max={new Date().getFullYear() + 1}
              placeholder="YYYY"
              defaultValue={firstReg.year || initial?.firstRegistrationYear}
              className="w-28 rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
            />
          </div>
        </div>
        <Field name="mileage" label="Kilometerstand" type="number" defaultValue={initial?.mileage} />
        <div>
          <label className="block text-sm text-zinc-400">Kraftstoff</label>
          <select
            name="fuelType"
            defaultValue={initial?.fuelType ?? ""}
            className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          >
            <option value="">—</option>
            {FUEL_TYPES.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Getriebe</label>
          <select
            name="transmission"
            defaultValue={initial?.transmission ?? ""}
            className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          >
            <option value="">—</option>
            {TRANSMISSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <Field name="horsepower" label="Leistung (PS)" type="number" defaultValue={initial?.horsepower} />
        <Field name="engineDisplacement" label="Hubraum (ccm)" type="number" defaultValue={initial?.engineDisplacement} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <h2 className="sm:col-span-2 lg:col-span-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Farbe & Interieur
        </h2>
        <Field name="exteriorColor" label="Außen" defaultValue={initial?.exteriorColor} />
        <Field name="interiorColor" label="Innen" defaultValue={initial?.interiorColor} />
        <Field name="upholstery" label="Polsterung" defaultValue={initial?.upholstery} placeholder="z.B. Vollleder" />
        <Field name="doors" label="Türen" defaultValue={initial?.doors} placeholder="z.B. 4/5" />
        <Field name="seats" label="Sitze" type="number" defaultValue={initial?.seats} />
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Ausstattung ({selectedFeatures.size}/{ALL_EQUIPMENT_FEATURES.length})
        </h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <EquipmentColumn
            features={EQUIPMENT_FEATURES_COL1}
            selected={selectedFeatures}
            onToggle={toggleFeature}
          />
          <EquipmentColumn
            features={EQUIPMENT_FEATURES_COL2}
            selected={selectedFeatures}
            onToggle={toggleFeature}
          />
          <EquipmentColumn
            features={EQUIPMENT_FEATURES_COL3}
            selected={selectedFeatures}
            onToggle={toggleFeature}
          />
        </div>
      </section>

      {mode === "create" ? (
        <div>
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
        <div>
          <label className="block text-sm text-zinc-400">Bilder ({sortedImages.length}/10)</label>
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

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
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

function EquipmentColumn({
  features,
  selected,
  onToggle,
}: {
  features: readonly string[];
  selected: Set<string>;
  onToggle: (feature: string) => void;
}) {
  return (
    <div className="space-y-2">
      {features.map((feature) => (
        <label
          key={feature}
          className="flex cursor-pointer items-start gap-2 rounded-sm border border-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-600"
        >
          <input
            type="checkbox"
            checked={selected.has(feature)}
            onChange={() => onToggle(feature)}
            className="mt-0.5 accent-metallic"
          />
          <span>{feature}</span>
        </label>
      ))}
    </div>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    defaultValue?: string | number;
    className?: string;
  }
) {
  const { label, defaultValue, className, ...rest } = props;
  return (
    <div className={className}>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        {...rest}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
      />
    </div>
  );
}
