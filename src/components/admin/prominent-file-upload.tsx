"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IMAGE_ACCEPT, IMAGE_FORMAT_LABEL } from "@/lib/upload-constants";

type ProminentFileUploadProps = {
  name: string;
  label: string;
  accept?: string;
  hint?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  currentImageUrl?: string | null;
  previewVariant?: "banner" | "square";
};

export function ProminentFileUpload({
  name,
  label,
  accept = IMAGE_ACCEPT,
  hint,
  multiple = false,
  required = false,
  disabled = false,
  buttonLabel = "Datei auswählen",
  currentImageUrl,
  previewVariant = "banner",
}: ProminentFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(files: FileList | null) {
    if (!files?.length) {
      setFileLabel(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      return;
    }

    const names = Array.from(files)
      .map((f) => f.name)
      .join(", ");
    setFileLabel(names);

    const first = files[0];
    if (first.type.startsWith("image/")) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(first));
    } else {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }

  const displayUrl = preview ?? (currentImageUrl && !fileLabel ? currentImageUrl : null);
  const previewClass =
    previewVariant === "banner"
      ? "relative mt-4 aspect-[21/9] w-full overflow-hidden rounded-sm border border-zinc-700 bg-zinc-900"
      : "relative mt-4 aspect-square w-full max-w-xs overflow-hidden rounded-sm border border-zinc-700 bg-zinc-900";

  return (
    <section className="rounded-sm border border-zinc-700 bg-zinc-900/40 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-metallic">{label}</h3>
      <p className="mt-1 text-sm text-zinc-500">{hint ?? `${IMAGE_FORMAT_LABEL} · max. 10 MB`}</p>

      {displayUrl && (
        <div className={previewClass}>
          <Image src={displayUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      )}

      {fileLabel && (
        <p className="mt-3 text-xs text-zinc-400">
          Ausgewählt: {fileLabel}
          {!preview && " — wird beim Speichern hochgeladen"}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        required={required}
        disabled={disabled}
        className="hidden"
        onChange={(e) => handleChange(e.target.files)}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-zinc-600 bg-zinc-950/50 px-6 py-10 text-center transition hover:border-metallic hover:bg-zinc-900/80 disabled:opacity-50"
      >
        <UploadIcon />
        <span className="text-sm font-medium text-white">{buttonLabel}</span>
        <span className="text-xs text-zinc-500">Klicken zum Auswählen</span>
      </button>
    </section>
  );
}

function UploadIcon() {
  return (
    <svg
      className="h-10 w-10 text-metallic"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}
