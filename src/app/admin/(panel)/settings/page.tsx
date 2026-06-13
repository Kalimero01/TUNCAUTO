"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? "Şifre değiştirilemedi.");
      return;
    }

    setSuccess(true);
    e.currentTarget.reset();
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white">Ayarlar</h1>

      <section className="mt-8 rounded-2xl border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Hesap</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Kullanıcı adı</dt>
            <dd className="text-zinc-300">{session?.user?.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">E-posta</dt>
            <dd className="text-zinc-300">{session?.user?.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Güvenlik — Şifre Değiştir</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field name="currentPassword" label="Mevcut Şifre" type="password" />
          <Field name="newPassword" label="Yeni Şifre" type="password" />
          <Field name="confirmPassword" label="Yeni Şifre (Tekrar)" type="password" />
          <p className="text-xs text-zinc-500">
            En az 12 karakter, büyük/küçük harf, rakam ve özel karakter.
          </p>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">Şifre başarıyla güncellendi.</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-400 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
          </button>
        </form>
      </section>

      <p className="mt-6">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Siteye dön
        </Link>
      </p>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        name={name}
        type={type}
        required
        minLength={type === "password" ? 12 : undefined}
        className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
      />
    </div>
  );
}
