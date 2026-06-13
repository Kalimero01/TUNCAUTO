"use client";

import { useEffect, useState } from "react";
import { buildImpressum, getImpressumFields } from "@/lib/company";

type ImpressumForm = {
  name: string;
  owner: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  taxId: string;
  privacyPolicy: string;
};

const emptyForm: ImpressumForm = {
  name: "",
  owner: "",
  street: "",
  postalCode: "",
  city: "",
  phone: "",
  email: "",
  taxId: "",
  privacyPolicy: "",
};

export default function AdminImpressumPage() {
  const [form, setForm] = useState<ImpressumForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/company")
      .then((r) => r.json())
      .then((j) => {
        if (!j.data) return;

        const fields = getImpressumFields(j.data);
        setForm({
          ...fields,
          privacyPolicy: j.data.privacyPolicy ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setSaving(true);

    const impressum = buildImpressum(form);

    const res = await fetch("/api/admin/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        impressum,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setMsg(json.error ?? "Fehler.");
      setError(true);
      return;
    }

    setError(false);
    setMsg("Gespeichert.");

    if (json.data) {
      const fields = getImpressumFields(json.data);
      setForm({
        ...fields,
        privacyPolicy: json.data.privacyPolicy ?? "",
      });
    }
  }

  if (loading) {
    return <p className="text-zinc-500">Wird geladen...</p>;
  }

  const preview = buildImpressum(form);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Impressum & Datenschutz</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pflichtangaben für das öffentliche Impressum verwalten
        </p>
      </div>

      {msg && (
        <p className={`text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 rounded-sm border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Impressum</h2>

        <Field
          label="Firmenname"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <Field
          label="Inhaber"
          value={form.owner}
          onChange={(v) => setForm((f) => ({ ...f, owner: v }))}
          required
        />
        <Field
          label="Straße"
          value={form.street}
          onChange={(v) => setForm((f) => ({ ...f, street: v }))}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="PLZ"
            value={form.postalCode}
            onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))}
            required
          />
          <Field
            label="Ort"
            value={form.city}
            onChange={(v) => setForm((f) => ({ ...f, city: v }))}
            required
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
        <Field
          label="USt-IdNr."
          value={form.taxId}
          onChange={(v) => setForm((f) => ({ ...f, taxId: v }))}
          placeholder="DE123456789"
        />

        <div>
          <label className="block text-sm text-zinc-400">Vorschau</label>
          <pre className="mt-1 whitespace-pre-wrap rounded-sm border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-xs text-zinc-400">
            {preview}
          </pre>
        </div>

        <div>
          <label className="block text-sm text-zinc-400">Datenschutzerklärung</label>
          <textarea
            value={form.privacyPolicy}
            onChange={(e) => setForm((f) => ({ ...f, privacyPolicy: e.target.value }))}
            required
            rows={12}
            className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-white"
          />
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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white"
      />
    </div>
  );
}
