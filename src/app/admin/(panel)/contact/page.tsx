"use client";

import { useEffect, useState } from "react";
import { LogoUploadSection } from "@/components/admin/logo-upload-section";
import { getLogoUrl } from "@/lib/logo";

type CompanyForm = {
  name: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  logoFile: string | null;
};

const emptyForm: CompanyForm = {
  name: "",
  address: "",
  phone: "",
  email: "",
  mapEmbedUrl: "",
  logoFile: null,
};

export default function AdminContactPage() {
  const [form, setForm] = useState<CompanyForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/company")
      .then((r) => r.json())
      .then((j) => {
        if (j.data) {
          setForm({
            name: j.data.name ?? "",
            address: j.data.address ?? "",
            phone: j.data.phone ?? "",
            email: j.data.email ?? "",
            mapEmbedUrl: j.data.mapEmbedUrl ?? "",
            logoFile: j.data.logoFile ?? null,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError(false);

    const res = await fetch("/api/admin/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        mapEmbedUrl: form.mapEmbedUrl.trim() || null,
      }),
    });

    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(true);
      setMsg(json.error ?? "Fehler beim Speichern.");
      return;
    }

    setError(false);
    setMsg("Gespeichert.");
    if (json.data) {
      setForm({
        name: json.data.name ?? "",
        address: json.data.address ?? "",
        phone: json.data.phone ?? "",
        email: json.data.email ?? "",
        mapEmbedUrl: json.data.mapEmbedUrl ?? "",
        logoFile: json.data.logoFile ?? null,
      });
    }
  }

  if (loading) {
    return <p className="text-zinc-500">Wird geladen...</p>;
  }

  const logoUrl = getLogoUrl({ logoFile: form.logoFile });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Kontakt & Logo</h1>
        <p className="mt-1 text-sm text-zinc-500">Kontaktdaten und Markenlogo verwalten</p>
      </div>

      <LogoUploadSection initialLogoUrl={logoUrl} companyName={form.name || "Tunc Automobile"} />

      {msg && (
        <p className={`text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-sm border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Kontaktdaten</h2>
        <Field
          label="Firmenname"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <div>
          <label className="block text-sm text-zinc-400">Adresse</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            required
            rows={3}
            className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
          />
        </div>
        <Field
          label="Telefon"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          required
        />
        <Field
          label="E-Mail"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <div>
          <label className="block text-sm text-zinc-400">
            Karten-Embed URL (optional)
          </label>
          <input
            value={form.mapEmbedUrl}
            onChange={(e) => setForm((f) => ({ ...f, mapEmbedUrl: e.target.value }))}
            className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
            placeholder="Leer lassen für OpenStreetMap (kostenlos)"
          />
          <p className="mt-1 text-xs text-zinc-600">
            Ohne Eintrag wird automatisch eine kostenlose OpenStreetMap-Karte mit Standortmarkierung
            angezeigt. Optional kann hier eine eigene Embed-URL (z.&nbsp;B. Google Maps) hinterlegt
            werden.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-metallic px-6 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {saving ? "Wird gespeichert..." : "Speichern"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
      />
    </div>
  );
}
