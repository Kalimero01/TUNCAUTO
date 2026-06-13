"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

type Props = {
  images: Array<{ id: string; url: string; alt: string }>;
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function ImageLightbox({ images, activeIndex, onClose, onNavigate }: Props) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % images.length);
      if (e.key === "ArrowLeft")
        onNavigate((activeIndex - 1 + images.length) % images.length);
    },
    [activeIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (images.length === 0) return null;
  const current = images[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Bildergalerie"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
        aria-label="Schließen"
      >
        ESC / Schließen
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 z-10 rounded-full border border-zinc-700 px-3 py-2 text-zinc-300 hover:text-white"
            aria-label="Vorheriges Bild"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex + 1) % images.length);
            }}
            className="absolute right-4 z-10 mr-16 rounded-full border border-zinc-700 px-3 py-2 text-zinc-300 hover:text-white"
            aria-label="Nächstes Bild"
          >
            ›
          </button>
        </>
      )}

      <div
        className="relative max-h-[85vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.url}
          alt={current.alt}
          width={1600}
          height={1000}
          className="mx-auto max-h-[85vh] w-auto object-contain"
          unoptimized
          priority
        />
        <p className="mt-4 text-center text-sm text-zinc-500">
          {activeIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
