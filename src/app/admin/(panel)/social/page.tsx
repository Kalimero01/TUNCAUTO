"use client";

import { useEffect, useState } from "react";

type Link = { id: string; platform: string; url: string; isActive: boolean };

export default function AdminSocialPage() {
  const [links, setLinks] = useState<Link[]>([]);

  async function load() {
    const res = await fetch("/api/admin/social");
    const json = await res.json();
    setLinks(json.data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/admin/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: fd.get("platform"),
        url: fd.get("url"),
        isActive: true,
      }),
    });
    e.currentTarget.reset();
    load();
  }

  async function toggle(id: string, isActive: boolean) {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    await fetch("/api/admin/social", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, platform: link.platform, url: link.url, isActive: !isActive }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Social Media</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-wrap gap-4 rounded-sm border border-zinc-800 p-6">
        <select name="platform" className="rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white">
          <option value="INSTAGRAM">Instagram</option>
          <option value="TIKTOK">TikTok</option>
        </select>
        <input name="url" type="url" required placeholder="https://..." className="flex-1 rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-2 text-white" />
        <button type="submit" className="rounded-sm bg-metallic px-4 py-2 text-sm font-semibold text-black">Hinzufügen</button>
      </form>
      <ul className="mt-6 space-y-2">
        {links.map((l) => (
          <li key={l.id} className="flex items-center justify-between rounded-sm border border-zinc-800 px-4 py-3 text-sm">
            <span className={l.isActive ? "text-zinc-300" : "text-zinc-600 line-through"}>
              {l.platform}: {l.url}
            </span>
            <button onClick={() => toggle(l.id, l.isActive)} className="text-metallic">
              {l.isActive ? "Deaktivieren" : "Aktivieren"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
