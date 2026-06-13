"use client";

import { useEffect, useState } from "react";

export default function AdminImpressumPage() {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [impressum, setImpressum] = useState("");
  const [privacy, setPrivacy] = useState("");

  useEffect(() => {
    fetch("/api/admin/company").then((r) => r.json()).then((j) => {
      setImpressum(j.data?.impressum ?? "");
      setPrivacy(j.data?.privacyPolicy ?? "");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setSaving(true);

    const res = await fetch("/api/admin/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        impressum,
        privacyPolicy: privacy,
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
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Impressum & Datenschutz</h1>
      {msg && (
        <p className={`mt-2 text-sm ${error ? "text-red-400" : "text-emerald-400"}`}>{msg}</p>
      )}
      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6 rounded-sm border border-zinc-800 p-6">
        <div>
          <label className="block text-sm text-zinc-400">Impressum</label>
          <textarea name="impressum" value={impressum} onChange={(e) => setImpressum(e.target.value)} rows={12} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Datenschutzerklärung</label>
          <textarea name="privacyPolicy" value={privacy} onChange={(e) => setPrivacy(e.target.value)} rows={12} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-white" />
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
