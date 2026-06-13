"use client";

import { useState } from "react";
import Link from "next/link";

export default function SellPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [submissionId, setSubmissionId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/submissions", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Başvuru gönderilemedi.");
        setStatus("error");
        return;
      }

      setSubmissionId(json.data.id);
      setStatus("success");
      form.reset();
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/30 p-10">
          <h1 className="text-2xl font-bold text-emerald-400">Başvurunuz Alındı!</h1>
          <p className="mt-4 text-zinc-400">
            Aracınız incelendikten sonra sizinle iletişime geçeceğiz.
          </p>
          {submissionId && (
            <Link
              href={`/sat/mesaj/${submissionId}`}
              className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400"
            >
              Mesajlaşmaya Git
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Aracını Sat</h1>
        <p className="mt-2 text-zinc-500">
          Formu doldurun, ekibimiz en kısa sürede değerlendirsin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="space-y-4 rounded-2xl border border-zinc-800 p-6">
          <legend className="px-2 text-sm font-medium text-zinc-400">İletişim Bilgileri</legend>
          <Input name="sellerName" label="Ad Soyad" required />
          <Input name="sellerEmail" label="E-posta" type="email" required />
          <Input name="sellerPhone" label="Telefon" type="tel" />
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-zinc-800 p-6">
          <legend className="px-2 text-sm font-medium text-zinc-400">Araç Bilgileri</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="make" label="Marka" required />
            <Input name="model" label="Model" required />
            <Input name="year" label="Yıl" type="number" min={1900} max={2030} required />
            <Input name="price" label="Fiyat (₺)" type="number" min={0} required />
            <Input name="mileage" label="Kilometre" type="number" min={0} />
            <Input name="fuelType" label="Yakıt Tipi" placeholder="Benzin, Dizel..." />
            <Input name="transmission" label="Vites" placeholder="Otomatik, Manuel..." />
            <Input name="color" label="Renk" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400">Açıklama</label>
            <textarea
              name="description"
              rows={4}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none"
              placeholder="Aracınız hakkında detaylar..."
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-zinc-800 p-6">
          <legend className="px-2 text-sm font-medium text-zinc-400">Görseller & Videolar</legend>
          <div>
            <label className="block text-sm text-zinc-400">
              Görseller (max 10, JPEG/PNG/WebP, 10MB)
            </label>
            <input
              type="file"
              name="images"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="mt-2 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400">
              Videolar (max 3, MP4/WebM/MOV, 100MB)
            </label>
            <input
              type="file"
              name="videos"
              accept="video/mp4,video/webm,video/quicktime"
              multiple
              className="mt-2 block w-full text-sm text-zinc-400 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-700 file:px-4 file:py-2 file:text-sm file:text-white"
            />
          </div>
        </fieldset>

        {error && (
          <p className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:opacity-50"
        >
          {status === "loading" ? "Gönderiliyor..." : "Başvuruyu Gönder"}
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}
