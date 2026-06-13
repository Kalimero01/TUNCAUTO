"use client";

import { useEffect, useState } from "react";

export default function AdminHomepagePage() {
  const [media, setMedia] = useState<Array<{ id: string; title: string | null; type: string; filename: string }>>([]);
  const [texts, setTexts] = useState<Array<{ id: string; title: string; content: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/admin/homepage");
    const json = await res.json();
    setMedia(json.data?.media ?? []);
    setTexts(json.data?.texts ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function uploadMedia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "media");
    await fetch("/api/admin/homepage", { method: "POST", body: fd });
    e.currentTarget.reset();
    setMsg("Medien hochgeladen.");
    load();
  }

  async function addText(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "text");
    await fetch("/api/admin/homepage", { method: "POST", body: fd });
    e.currentTarget.reset();
    setMsg("Textblock gespeichert.");
    load();
  }

  async function remove(id: string, kind: string) {
    if (!confirm("Löschen?")) return;
    await fetch(`/api/admin/homepage?id=${id}&kind=${kind}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p className="text-zinc-500">Laden...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Homepage</h1>
      {msg && <p className="mt-2 text-sm text-emerald-400">{msg}</p>}

      <section className="mt-8 rounded-sm border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Hero Medien</h2>
        <form onSubmit={uploadMedia} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field name="title" label="Titel" />
          <Field name="subtitle" label="Untertitel" />
          <div>
            <label className="block text-sm text-zinc-400">Typ</label>
            <select name="mediaType" className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white">
              <option value="IMAGE">Bild</option>
              <option value="VIDEO">Video (MP4)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400">Datei</label>
            <input type="file" name="file" required accept="image/jpeg,image/png,image/webp,video/mp4" className="mt-1 text-sm text-zinc-400" />
          </div>
          <button type="submit" className="sm:col-span-2 rounded-sm bg-metallic px-4 py-2 text-sm font-semibold text-black">Hochladen</button>
        </form>
        <ul className="mt-6 space-y-2">
          {media.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-sm border border-zinc-800 px-4 py-2 text-sm">
              <span className="text-zinc-300">{m.title || m.filename} ({m.type})</span>
              <button onClick={() => remove(m.id, "media")} className="text-red-400">Löschen</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-sm border border-zinc-800 p-6">
        <h2 className="font-semibold text-white">Textblöcke</h2>
        <form onSubmit={addText} className="mt-4 space-y-4">
          <Field name="title" label="Titel" required />
          <div>
            <label className="block text-sm text-zinc-400">Inhalt</label>
            <textarea name="content" required rows={4} className="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
          </div>
          <button type="submit" className="rounded-sm bg-metallic px-4 py-2 text-sm font-semibold text-black">Speichern</button>
        </form>
        <ul className="mt-6 space-y-2">
          {texts.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-sm border border-zinc-800 px-4 py-2 text-sm">
              <span className="text-zinc-300">{t.title}</span>
              <button onClick={() => remove(t.id, "text")} className="text-red-400">Löschen</button>
            </li>
          ))}
        </ul>
      </section>
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
