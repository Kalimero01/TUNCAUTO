"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { ALL_EQUIPMENT_FEATURES } from "@/lib/vehicle-constants";
import { formatMileage, formatPrice } from "@/lib/utils";

type VehicleData = {
  make: string;
  model: string;
  price: string;
  firstRegistration: string | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  horsepower: number | null;
  engineDisplacement: number | null;
  exteriorColor: string | null;
  interiorColor: string | null;
  upholstery: string | null;
  doors: string | null;
  seats: number | null;
  financingUrl: string | null;
  equipmentFeatures: string[];
  images: Array<{ id: string; url: string }>;
  videos: Array<{ id: string; url: string }>;
};

type VehicleDetailClientProps = {
  vehicle: VehicleData;
  companyPhone?: string | null;
};

export function VehicleDetailClient({ vehicle, companyPhone }: VehicleDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryImages = vehicle.images.slice(0, 10);

  const subtitle = [vehicle.horsepower ? `${vehicle.horsepower} PS` : null, vehicle.transmission]
    .filter(Boolean)
    .join(" • ");

  const whatsappNumber = companyPhone?.replace(/\D/g, "") ?? "";
  const whatsappText = encodeURIComponent(
    `Hallo, ich interessiere mich für ${vehicle.make} ${vehicle.model}.`
  );
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappText}`
    : undefined;

  const selectedFeatures = new Set(vehicle.equipmentFeatures);

  return (
    <div className="bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <button
              type="button"
              onClick={() => galleryImages.length > 0 && setLightboxIndex(activeImage)}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-zinc-900 ring-1 ring-zinc-800"
            >
              {galleryImages[activeImage] ? (
                <Image
                  src={galleryImages[activeImage].url}
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
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-zinc-900 ring-2 transition duration-200 ease-out ${
                      i === activeImage ? "ring-red-600" : "ring-zinc-800 hover:ring-zinc-600"
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" loading="lazy" unoptimized />
                  </button>
                ))}
              </div>
            )}

            {vehicle.videos.length > 0 && (
              <div className="mt-6 space-y-3">
                {vehicle.videos.map((vid) => (
                  <video key={vid.id} src={vid.url} controls className="w-full rounded-md bg-black" />
                ))}
              </div>
            )}

            <div className="mt-10 space-y-10 lg:hidden">
              <TechnicalDataCard vehicle={vehicle} />
              <ColorInteriorSection vehicle={vehicle} />
              <EquipmentSection selectedFeatures={selectedFeatures} />
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-6 backdrop-blur">
              <h1 className="text-2xl font-semibold uppercase tracking-wide text-white">
                {vehicle.make} {vehicle.model}
              </h1>
              {subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}
              <p className="mt-6 text-3xl font-light text-white">{formatPrice(vehicle.price)}</p>

              <div className="mt-6 grid gap-3">
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3 text-sm font-semibold text-white transition duration-200 ease-out motion-safe:hover:scale-[1.02] hover:bg-[#1fb855]"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                )}
                {companyPhone && (
                  <a
                    href={`tel:${companyPhone}`}
                    className="btn-outline flex items-center justify-center gap-2 rounded-sm border border-zinc-700 py-3 text-sm font-semibold text-white"
                  >
                    <PhoneIcon />
                    {companyPhone}
                  </a>
                )}
              </div>

              {vehicle.financingUrl && (
                <a
                  href={vehicle.financingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline mt-4 flex w-full items-center justify-center rounded-sm border border-red-700 bg-red-950/40 py-3 text-sm font-semibold text-red-400 hover:bg-red-950/70"
                >
                  Finanzierung anpassen
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 hidden space-y-10 lg:block">
          <TechnicalDataCard vehicle={vehicle} />
          <ColorInteriorSection vehicle={vehicle} />
          <EquipmentSection selectedFeatures={selectedFeatures} />
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

function TechnicalDataCard({ vehicle }: { vehicle: VehicleData }) {
  const items = [
    { label: "Erstzulassung", value: vehicle.firstRegistration },
    { label: "Kilometerstand", value: formatMileage(vehicle.mileage) },
    { label: "Kraftstoff", value: vehicle.fuelType },
    { label: "Getriebe", value: vehicle.transmission },
    { label: "Leistung", value: vehicle.horsepower ? `${vehicle.horsepower} PS` : null },
    { label: "Hubraum", value: vehicle.engineDisplacement ? `${vehicle.engineDisplacement} ccm` : null },
  ];

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
        Technische Daten
      </h2>
      <div className="mt-4 rounded-md border border-zinc-800 bg-zinc-950/50 p-6">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
          {items.map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-zinc-500">{item.label}</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-200">{item.value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ColorInteriorSection({ vehicle }: { vehicle: VehicleData }) {
  const cards = [
    { label: "Außen", value: vehicle.exteriorColor, icon: <PaletteIcon /> },
    { label: "Innen", value: vehicle.interiorColor, icon: <SeatIcon /> },
    { label: "Polsterung", value: vehicle.upholstery, icon: <FabricIcon /> },
    { label: "Türen", value: vehicle.doors, icon: <DoorIcon /> },
    { label: "Sitze", value: vehicle.seats ? String(vehicle.seats) : null, icon: <UsersIcon /> },
  ];

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
        Farbe & Interieur
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col items-center rounded-md border border-zinc-800 bg-zinc-950/50 px-4 py-5 text-center"
          >
            <div className="text-zinc-500">{card.icon}</div>
            <p className="mt-3 text-xs uppercase tracking-wider text-zinc-500">{card.label}</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">{card.value ?? "—"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EquipmentSection({ selectedFeatures }: { selectedFeatures: Set<string> }) {
  const active = ALL_EQUIPMENT_FEATURES.filter((f) => selectedFeatures.has(f));
  if (active.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Ausstattung</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
            <span className="text-red-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
    </svg>
  );
}

function SeatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function FabricIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}

function DoorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-9 0H3.375A1.125 1.125 0 012 20.625V3.375A1.125 1.125 0 013.375 2.25h17.25A1.125 1.125 0 0121.75 3.375v17.25A1.125 1.125 0 0120.625 21H16.5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}
