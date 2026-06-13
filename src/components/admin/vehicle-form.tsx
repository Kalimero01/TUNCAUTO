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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
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
      for (const file of pendingFiles) {
        formData.append("images", file);
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

  function handleCreateFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    const incoming = Array.from(fileList).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    setPendingFiles((prev) => {
      const combined = [...prev, ...incoming];
      if (combined.length > 10) {
        setError("Maximal 10 Bilder pro Fahrzeug.");
        return combined.slice(0, 10);
      }
      setError("");
      return combined;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePendingFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
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

      <VehicleImagesSection
        mode={mode}
        sortedImages={sortedImages}
        pendingFiles={pendingFiles}
        imageLoading={imageLoading}
        fileInputRef={fileInputRef}
        onCreateFilesSelected={handleCreateFilesSelected}
        onRemovePending={removePendingFile}
        onEditUpload={handleImageUpload}
        onDelete={handleImageDelete}
        onMove={moveImage}
      />

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

function VehicleImagesSection({
  mode,
  sortedImages,
  pendingFiles,
  imageLoading,
  fileInputRef,
  onCreateFilesSelected,
  onRemovePending,
  onEditUpload,
  onDelete,
  onMove,
}: {
  mode: "create" | "edit";
  sortedImages: VehicleImage[];
  pendingFiles: File[];
  imageLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onCreateFilesSelected: (files: FileList | null) => void;
  onRemovePending: (index: number) => void;
  onEditUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}) {
  const totalCount = mode === "create" ? pendingFiles.length : sortedImages.length;
  const canAddMore = totalCount < 10;

  return (
    <section className="rounded-sm border border-zinc-700 bg-zinc-900/40 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-metallic">
        Fahrzeugbilder
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Maximal 10 Bilder · JPG, PNG oder WEBP · {totalCount}/10 hochgeladen
      </p>

      {mode === "create" && pendingFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {pendingFiles.map((file, i) => (
            <div key={`${file.name}-${i}`} className="relative overflow-hidden rounded-sm border border-zinc-700">
              <div className="relative aspect-square bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemovePending(i)}
                className="w-full bg-zinc-900 py-1.5 text-xs text-red-400 hover:text-red-300"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>
      )}

      {mode === "edit" && sortedImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {sortedImages.map((img, i) => (
            <div key={img.id} className="relative overflow-hidden rounded-sm border border-zinc-700">
              <div className="relative aspect-square bg-zinc-900">
                <Image src={img.url} alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="flex items-center justify-between gap-1 bg-zinc-900 p-1">
                <button
                  type="button"
                  onClick={() => onMove(img.id, "up")}
                  disabled={i === 0 || imageLoading}
                  className="px-1 text-xs text-zinc-400 hover:text-white disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(img.id)}
                  disabled={imageLoading}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Löschen
                </button>
                <button
                  type="button"
                  onClick={() => onMove(img.id, "down")}
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

      {canAddMore && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) =>
              mode === "create" ? onCreateFilesSelected(e.target.files) : onEditUpload(e)
            }
          />
          <button
            type="button"
            disabled={imageLoading}
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-zinc-600 bg-zinc-950/50 px-6 py-10 text-center transition hover:border-metallic hover:bg-zinc-900/80 disabled:opacity-50"
          >
            <svg
              className="h-10 w-10 text-metallic"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <span className="text-sm font-medium text-white">Bilder hochladen</span>
            <span className="text-xs text-zinc-500">Klicken oder Dateien hierher ziehen</span>
          </button>
        </>
      )}

      {imageLoading && <p className="mt-2 text-xs text-zinc-500">Bilder werden verarbeitet...</p>}
    </section>
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
