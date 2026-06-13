"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGE_ACCEPT, IMAGE_FORMAT_LABEL } from "@/lib/upload-constants";
import { DEFAULT_LOGO_URL } from "@/lib/logo";

export function LogoUploadSection({
  initialLogoUrl,
  companyName,
}: {
  initialLogoUrl: string;
  companyName: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  async function uploadLogo(file: File) {
    setUploading(true);
    setMsg("");
    setError(false);

    const fd = new FormData();
    fd.set("logo", file);

    const res = await fetch("/api/admin/company/logo", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(true);
      setMsg(json.error ?? "Logo-Upload fehlgeschlagen.");
      return;
    }

    setError(false);
    setMsg("Logo gespeichert.");
    setLogoUrl(json.data?.logoUrl ?? logoUrl);
  }

  async function resetLogo() {
    if (!confirm("Standard-Logo wiederherstellen?")) return;
    setUploading(true);
    setMsg("");
    setError(false);

    const res = await fetch("/api/admin/company/logo", { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    setUploading(false);

    if (!res.ok) {
      setError(true);
      setMsg(json.error ?? "Fehler.");
      return;
    }

    setError(false);
    setMsg("Standard-Logo aktiv.");
    setLogoUrl(json.data?.logoUrl ?? DEFAULT_LOGO_URL);
  }

  return (
    <section className="max-w-2xl rounded-sm border border-zinc-800 p-6">
      <h2 className="font-semibold text-white">Logo</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Wird in der Kopfzeile der Website angezeigt. {IMAGE_FORMAT_LABEL} · max. 10 MB
      </p>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex min-h-[5rem] items-center justify-center rounded-sm border border-zinc-700 bg-white px-6 py-4">
          <Image
            src={logoUrl}
            alt={companyName}
            width={200}
            height={80}
            className="h-16 w-auto max-w-[200px] object-contain"
            unoptimized
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadLogo(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-sm bg-metallic px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {uploading ? "Wird hochgeladen..." : "Logo hochladen"}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => void resetLogo()}
            className="rounded-sm border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-50"
          >
            Standard-Logo
          </button>
        </div>
      </div>

      {msg && (
        <p className={`mt-4 text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>
      )}
    </section>
  );
}
