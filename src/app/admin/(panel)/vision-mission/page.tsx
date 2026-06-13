"use client";

import { useState } from "react";

export default function AdminVisionMissionPage() {
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/vision-mission", { method: "PUT", body: fd });
    setMsg(res.ok ? "Gespeichert." : "Fehler beim Speichern.");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Vision & Mission</h1>
      {msg && <p className="mt-2 text-sm text-emerald-400">{msg}</p>}
      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-4 rounded-sm border border-zinc-800 p-6">
        <Field name="title" label="Titel" defaultValue="Vision & Mission" required />
        <div>
          <label className="block text-sm text-zinc-400">Inhalt</label>
          <textarea name="content" required rows={10} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Vollbreites Bild</label>
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" className="mt-1 text-sm text-zinc-400" />
        </div>
        <button type="submit" className="rounded-sm bg-metallic px-6 py-2 text-sm font-semibold text-black">Speichern</button>
      </form>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm text-zinc-400">{label}</label>
      <input {...rest} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
    </div>
  );
}
