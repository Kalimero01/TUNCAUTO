"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { formatMileage, formatPrice } from "@/lib/utils";

type VehicleData = {
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  horsepower: number | null;
  color: string | null;
  description: string | null;
  financingOffer: string | null;
  financingUrl: string | null;
  equipment: string[];
  features: string[];
  images: Array<{ id: string; url: string }>;
  videos: Array<{ id: string; url: string }>;
};

export function VehicleDetailClient({ vehicle }: { vehicle: VehicleData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryImages = vehicle.images.slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <button
            type="button"
            onClick={() => galleryImages.length > 0 && setLightboxIndex(0)}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-zinc-900"
          >
            {galleryImages[0] ? (
              <Image
                src={galleryImages[0].url}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-600">Kein Bild</div>
            )}
          </button>

          {galleryImages.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {galleryImages.slice(1).map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setLightboxIndex(i + 1)}
                  className="relative aspect-square overflow-hidden rounded-sm bg-zinc-900"
                >
                  <Image src={img.url} alt="" fill className="object-cover" loading="lazy" unoptimized />
                </button>
              ))}
            </div>
          )}

          {vehicle.videos.length > 0 && (
            <div className="mt-6 space-y-3">
              {vehicle.videos.map((vid) => (
                <video key={vid.id} src={vid.url} controls className="w-full rounded-sm bg-black" />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-metallic">{vehicle.make}</p>
          <h1 className="mt-2 text-3xl font-light text-white">
            {vehicle.model} <span className="text-zinc-500">{vehicle.year}</span>
          </h1>
          <p className="mt-6 text-3xl font-light text-metallic">{formatPrice(vehicle.price)}</p>

          <dl className="mt-10 grid grid-cols-2 gap-4 rounded-sm border border-zinc-800 p-6">
            <Spec label="Kilometerstand" value={formatMileage(vehicle.mileage)} />
            <Spec label="Kraftstoff" value={vehicle.fuelType} />
            <Spec label="Getriebe" value={vehicle.transmission} />
            <Spec label="Leistung" value={vehicle.horsepower ? `${vehicle.horsepower} PS` : null} />
            <Spec label="Farbe" value={vehicle.color} />
          </dl>

          {vehicle.equipment.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Ausstattung</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {vehicle.equipment.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="text-metallic">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {vehicle.features.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                Technische Daten
              </h2>
              <ul className="mt-4 space-y-2">
                {vehicle.features.map((item) => (
                  <li key={item} className="text-sm text-zinc-400">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {vehicle.description && (
            <div className="mt-10">
              <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Beschreibung</h2>
              <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-400">{vehicle.description}</p>
            </div>
          )}

          {(vehicle.financingOffer || vehicle.financingUrl) && (
            <div className="mt-10 rounded-sm border border-zinc-800 bg-zinc-900/30 p-6">
              <h2 className="text-sm font-medium uppercase tracking-widest text-metallic">Finanzierung</h2>
              {vehicle.financingOffer && (
                <p className="mt-4 whitespace-pre-wrap text-zinc-400">{vehicle.financingOffer}</p>
              )}
              {vehicle.financingUrl && (
                <a
                  href={vehicle.financingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-sm border border-metallic px-6 py-3 text-sm font-semibold tracking-wide text-metallic hover:bg-metallic/10"
                >
                  Finanzierung anpassen →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={galleryImages.map((img) => ({
            id: img.id,
            url: img.url,
            alt: `${vehicle.make} ${vehicle.model}`,
          }))}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-zinc-600">{label}</dt>
      <dd className="mt-1 font-medium text-zinc-200">{value ?? "—"}</dd>
    </div>
  );
}
