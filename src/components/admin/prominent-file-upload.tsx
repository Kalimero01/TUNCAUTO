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
  maxFiles?: number;
  required?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  currentImageUrl?: string | null;
  previewVariant?: "banner" | "square";
  onFilesChange?: (files: File[]) => void;
};

export function ProminentFileUpload({
  name,
  label,
  accept = IMAGE_ACCEPT,
  hint,
  multiple = false,
  maxFiles,
  required = false,
  disabled = false,
  buttonLabel = "Datei auswählen",
  currentImageUrl,
  previewVariant = "banner",
  onFilesChange,
}: ProminentFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const controlled = Boolean(onFilesChange && multiple);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview, previewUrls]);

  function updateControlledFiles(files: File[]) {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = files.map((f) => (f.type.startsWith("image/") ? URL.createObjectURL(f) : ""));
    setSelectedFiles(files);
    setPreviewUrls(urls);
    setFileLabel(
      files.length > 0
        ? files.map((f) => f.name).join(", ")
        : null
    );
    onFilesChange?.(files);
  }

  function handleChange(files: FileList | null) {
    if (!files?.length) {
      if (controlled) {
        updateControlledFiles([]);
      } else {
        setFileLabel(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
      }
      return;
    }

    if (controlled) {
      const incoming = Array.from(files);
      const merged = [...selectedFiles, ...incoming].slice(0, maxFiles ?? incoming.length);
      updateControlledFiles(merged);
      if (inputRef.current) inputRef.current.value = "";
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

  function removeFile(index: number) {
    if (!controlled) return;
    const next = selectedFiles.filter((_, i) => i !== index);
    updateControlledFiles(next);
  }

  const displayUrl = preview ?? (currentImageUrl && !fileLabel ? currentImageUrl : null);
  const previewClass =
    previewVariant === "banner"
      ? "relative mt-4 aspect-[21/9] w-full overflow-hidden rounded-sm border border-zinc-700 bg-zinc-900"
      : "relative mt-4 aspect-square w-full max-w-xs overflow-hidden rounded-sm border border-zinc-700 bg-zinc-900";

  const atMax = controlled && maxFiles !== undefined && selectedFiles.length >= maxFiles;

  return (
    <section className="rounded-sm border border-zinc-700 bg-zinc-900/40 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-metallic">{label}</h3>
      <p className="mt-1 text-sm text-zinc-500">{hint ?? `${IMAGE_FORMAT_LABEL} · max. 10 MB`}</p>

      {controlled && selectedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative aspect-square overflow-hidden rounded-sm border border-zinc-700 bg-zinc-900"
            >
              {previewUrls[index] ? (
                <Image src={previewUrls[index]} alt="" fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center p-2 text-center text-xs text-zinc-500">
                  {file.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-1 top-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-xs text-white hover:bg-black"
                aria-label="Datei entfernen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!controlled && displayUrl && (
        <div className={previewClass}>
          <Image src={displayUrl} alt="" fill className="object-cover" unoptimized />
        </div>
      )}

      {fileLabel && (
        <p className="mt-3 text-xs text-zinc-400">
          Ausgewählt: {fileLabel}
          {!preview && !controlled && " — wird beim Speichern hochgeladen"}
          {controlled && maxFiles !== undefined && ` (${selectedFiles.length}/${maxFiles})`}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        name={controlled ? undefined : name}
        accept={accept}
        multiple={multiple}
        required={required && (!controlled || selectedFiles.length === 0)}
        disabled={disabled || atMax}
        className="hidden"
        onChange={(e) => handleChange(e.target.files)}
      />

      <button
        type="button"
        disabled={disabled || atMax}
        onClick={() => inputRef.current?.click()}
        className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-zinc-600 bg-zinc-950/50 px-6 py-10 text-center transition hover:border-metallic hover:bg-zinc-900/80 disabled:opacity-50"
      >
        <UploadIcon />
        <span className="text-sm font-medium text-white">{buttonLabel}</span>
        <span className="text-xs text-zinc-500">
          {atMax ? "Maximale Anzahl erreicht" : "Klicken zum Auswählen"}
        </span>
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
