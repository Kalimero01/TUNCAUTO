"use client";

import { useEffect, useState } from "react";

export default function AdminImpressumPage() {
  const [msg, setMsg] = useState("");
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
    const res = await fetch("/api/admin/company");
    const existing = await res.json();
    const body = {
      ...existing.data,
      impressum: (e.currentTarget.elements.namedItem("impressum") as HTMLTextAreaElement).value,
      privacyPolicy: (e.currentTarget.elements.namedItem("privacyPolicy") as HTMLTextAreaElement).value,
    };
    const save = await fetch("/api/admin/company", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setMsg(save.ok ? "Gespeichert." : "Fehler.");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Impressum & Privacy</h1>
      {msg && <p className="mt-2 text-sm text-emerald-400">{msg}</p>}
      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6 rounded-sm border border-zinc-800 p-6">
        <div>
          <label className="block text-sm text-zinc-400">Impressum</label>
          <textarea name="impressum" value={impressum} onChange={(e) => setImpressum(e.target.value)} rows={12} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Privacy Policy / Datenschutz</label>
          <textarea name="privacyPolicy" value={privacy} onChange={(e) => setPrivacy(e.target.value)} rows={12} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-white" />
        </div>
        <button type="submit" className="rounded-sm bg-metallic px-6 py-2 text-sm font-semibold text-black">Speichern</button>
      </form>
    </div>
  );
}
